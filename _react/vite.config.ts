import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'
import fs from 'fs'

const outDir = path.resolve(__dirname, '../assets')

const currentPage = process.env.PAGE

const cleanOldChunksPlugin = () => {
  return {
    name: 'clean-old-chunks',
    buildStart() {
      if (fs.existsSync(outDir)) {
        const files = fs.readdirSync(outDir)
        files.forEach((file) => {
          const isOldChunk = file.startsWith('react-chunk-')
          const isOldStyle = file.startsWith('react-style-')
          const isOldAsset = file.startsWith('react-') && /-[a-zA-Z0-9]{8,}\.[a-zA-Z0-9]+$/.test(file)
          if (isOldChunk || isOldStyle || isOldAsset) {
            const filePath = path.join(outDir, file)
            try {
              fs.unlinkSync(filePath)
            } catch (err) {
              console.error(`Can not delete old asset ${file}:`, err)
            }
          }
        })
      }
    }
  }
}

const getEntryPoints = (): Record<string, string> => {
  const pagesDir = path.resolve(__dirname, 'src/pages')
  const entries: Record<string, string> = {}

  if (fs.existsSync(pagesDir)) {
    fs.readdirSync(pagesDir).forEach((file) => {
      if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        const name = path.parse(file).name
        entries[name] = path.resolve(pagesDir, file)
      }
    })
  }
  
  return entries
}

const entryPoints = getEntryPoints()

const inputEntry = currentPage && entryPoints[currentPage] 
  ? { [currentPage]: entryPoints[currentPage] }
  : entryPoints

const manualChunksMap = {
  "react-dom": "react-dom",
  "react": "react",
  "@reduxjs": "redux",
  "react-redux": "redux",
  "animejs": "anime",
  "react-slick": "slick",
  "slick-carousel": "slick",
  "macy": "macy",
  "yup": "yup",
  "react-intersection-observer": "observer",
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    cleanOldChunksPlugin(),
    react(),
    babel({ 
      presets: [reactCompilerPreset()],
      exclude: 'node_modules/**'
    }),
    visualizer({
      filename: 'stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  resolve: {
    alias: {
      '@': import.meta.dirname + '/src'
    },
  },
  base: '',
  build: {
    outDir, 
    emptyOutDir: false,
    sourcemap: false,
    // target: 'esnext',
    target: ['ios15', 'chrome89', 'edge89', 'firefox89', 'safari15'],
    rollupOptions: {
      input: inputEntry,
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'react-chunk-[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo?.name?.endsWith('.css')) {
            // const isPageCss = Object.keys(entryPoints).includes(assetInfo.name.replace('.css', ''))
            // return `react-style-[name]${!isPageCss ? '-[hash]' : ''}.css`
            return `react-style-[name]-[hash].css`
          }
          return 'react-[name]-[hash].[ext]'
        },
        format: 'esm',
        // inlineDynamicImports: !!currentPage
        inlineDynamicImports: false,
        manualChunks(id) {
          // if (id.includes('node_modules')) {
          //   return 'vendor' 
          // }
          if (!id.includes('node_modules')) return

          for (const [slug, chunk] of Object.entries(manualChunksMap)) {
            if (id.includes(slug)) return chunk
          }

          return 'vendor'
        }
      },
      preserveEntrySignatures: 'exports-only'
    }
  }
})


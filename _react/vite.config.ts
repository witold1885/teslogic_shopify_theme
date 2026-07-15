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
          if (file.startsWith('react-chunk-')) {
            const filePath = path.join(outDir, file)
            try {
              fs.unlinkSync(filePath)
            } catch (err) {
              console.error(`Can not delete old chunk ${file}:`, err)
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

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    cleanOldChunksPlugin(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
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
    rollupOptions: {
      input: inputEntry,
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'react-chunk-[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo?.name?.endsWith('.css')) return '[name].css'
          return 'react-[name].[ext]'
        },
        format: 'esm',
        // inlineDynamicImports: !!currentPage
        inlineDynamicImports: false,
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor' 
          }
        }
      }
    }
  }
})

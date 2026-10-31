import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import combineMediaQuery from 'postcss-combine-media-query'
import { visualizer } from 'rollup-plugin-visualizer'

const outDir = path.resolve(__dirname, '../assets')

const currentPage = process.env.PAGE

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

const isCriticalCss = (name: string): boolean => {
  return name === `${currentPage}.css` || name === 'Common.css'
}

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
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
  css: {
    postcss: {
      plugins: [combineMediaQuery()]
    }
  },
  resolve: {
    alias: {
      '@': import.meta.dirname + '/src'
    },
  },
  base: '',
  build: {
    outDir, 
    emptyOutDir: false,
    sourcemap: true,
    target: ['ios15', 'chrome89', 'edge89', 'firefox89', 'safari15'],
    cssCodeSplit: !isSsrBuild,
    assetsInlineLimit: 0,
    modulePreload: {
      polyfill: false,
      resolveDependencies: (filename, deps, _) => [],
    },
    rollupOptions: {
      input: inputEntry,
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'react-chunk-[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo?.name?.endsWith('.css')) {
            return `react-style-${
              isCriticalCss(assetInfo.name) ? currentPage : 'chunk-[name]'
            }-[hash].css`
          }
          return 'react-[name]-[hash].[ext]'
        },
        format: 'esm',
        inlineDynamicImports: isSsrBuild
      },
      preserveEntrySignatures: 'exports-only'
    }
  }
}))

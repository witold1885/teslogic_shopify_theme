import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import path from 'path'
import fs from 'fs'

const getEntryPoints = (): Record<string, string> => {
  const pagesDir = path.resolve(__dirname, 'src/pages')
  const entries: Record<string, string> = {}

  if (fs.existsSync(pagesDir)) {
    fs.readdirSync(pagesDir).forEach((file) => {
      if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        const name = path.parse(file).name
        
        entries[`${name}-react`] = path.resolve(pagesDir, file)
      }
    })
  }
  
  return entries
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve: {
    alias: {
      '@': import.meta.dirname + '/src'
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../assets'), 
    emptyOutDir: false,
    sourcemap: false,
    rollupOptions: {
      input: getEntryPoints(),
      output: {
        entryFileNames: '[name].js',
        assetFileNames: (assetInfo) => (
          assetInfo.name && assetInfo.name.endsWith('.css') ? '[name].css' : '[name].[ext]'
        ),
        manualChunks: undefined
      }
    }
  }
})

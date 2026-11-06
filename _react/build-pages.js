import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { createElement} from 'react'
import { renderToString } from 'react-dom/server'
import Builder from './src/_builder/builder.class.js'
import { processDirs, generateFontsSnippet } from './src/_builder/utils.js'

if (typeof globalThis.Element === 'undefined') {
  globalThis.Element = class Element {}
}

const __dirname = import.meta.dirname

const pagesDir = path.resolve(__dirname, 'src/pages')
const tempSsrDir = path.resolve(__dirname, 'dist-ssr')

if (!fs.existsSync(pagesDir)) {
  console.error('`src/pages` directory not found')
  process.exit(1)
}

processDirs()
generateFontsSnippet()

const pages = fs.readdirSync(pagesDir)
  .filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'))
  .map(file => path.parse(file).name)

for (const page of pages) {
  console.log(`\n--- Building page: ${page} ---`)
  try {
    console.log(`[1/2] Building Client bundle...`)
    execSync(`PAGE=${page} npx vite build`, { stdio: 'inherit' })

    console.log(`[2/2] Generating SSR HTML snippet...`)
    execSync(`npx vite build --ssr src/pages/${page}.tsx --outDir dist-ssr/${page}`, { stdio: 'inherit' })
    execSync(`npx vite build --ssr src/AppProviders.tsx --outDir dist-ssr/providers`, { stdio: 'inherit' })

    const ssrBundlePath = path.resolve(tempSsrDir, page, `${page}.js`)
    const pageModule = await import(`file://${ssrBundlePath}`)
    const PageComponent = pageModule.default || pageModule[page]

    const providersBundlePath = path.resolve(tempSsrDir, 'providers', 'AppProviders.js')
    const providersModule = await import(`file://${providersBundlePath}`)
    const AppProviders = providersModule.AppProviders || providersModule.default

    const builder = new Builder(page)
    
    builder.generateLCP()

    builder.generateSeo(renderToString(
      createElement(
        AppProviders,
        null,
        createElement(PageComponent)
      )
    ))

    builder.updateLiquid()
  } catch (err) {
    console.error(` Error building page ${page}:`, err)
    process.exit(1)
  }
}

if (fs.existsSync(tempSsrDir)) {
  fs.rmSync(tempSsrDir, { recursive: true, force: true })
}

console.log('\n All pages were built and SEO snippets generated successfully!')

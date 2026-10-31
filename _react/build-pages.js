import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { createElement} from 'react'
import { renderToString } from 'react-dom/server'

if (typeof globalThis.Element === 'undefined') {
  globalThis.Element = class Element {}
}

const __dirname = import.meta.dirname

const pagesDir = path.resolve(__dirname, 'src/pages')
const snippetsDir = path.resolve(__dirname, '../snippets')
const tempSsrDir = path.resolve(__dirname, 'dist-ssr')
const assetsDir = path.resolve(__dirname, '../assets')

const themeAssets = fs.readdirSync(assetsDir)

function findHashedFile(fileName) {
  const ext = path.extname(fileName)
  const baseName = path.basename(fileName, ext)

  const matched = themeAssets.find(
    (file) => file.includes(baseName) && file.endsWith(ext)
  )

  return matched || fileName
}

function processAssetUrls(html) {
  return html.replace(
    /(src|href)="([^"]*?\/)?([a-zA-Z0-9_\-]+\.(?:png|jpg|jpeg|svg|webp|gif|ico|woff2?))"/g,
    '$1="{{ \'$3\' | asset_url }}"'
  ).replace(
    /url\((['"]?)(?:[^'"]*?\/)?([a-zA-Z0-9_\-]+\.(?:png|jpg|jpeg|svg|webp|gif|ico|woff2?))\1\)/g,
    (match, quote, fileName) => `url({{ '${findHashedFile(fileName)}' | asset_url }})`
  )
}

const pagesMap = {
  ScreenmateOne: { slug: 'screenmate-one', bannerComponent: 'ScreenmateOneBanner' },
  ScreenmateDash: {
    slug: 'screenmate-dash',
    bannerComponent: 'ScreenmateDashBanner',
    bannerDesktopBackground: 'screenmate_dash_banner_desktop.png',
    bannerMobileBackground: 'screenmate_dash_banner_mobile.png'
  },
  Powermate: {
    slug: 'powermate',
    bannerComponent: 'PowermateBanner',
    bannerDesktopBackground: 'powermate_banner_desktop.png',
    bannerMobileBackground: 'powermate_banner_mobile.png'
  },
}

if (fs.existsSync(assetsDir)) {
  console.log('Cleaning old assets...')
  const files = fs.readdirSync(assetsDir)
  files.forEach((file) => {
    const isOldChunk = file.startsWith('react-chunk-')
    const isOldStyle = file.startsWith('react-style-')
    const isOldAsset = file.startsWith('react-') && /-[a-zA-Z0-9]{8,}\.[a-zA-Z0-9]+$/.test(file)
    if (isOldChunk || isOldStyle || isOldAsset) {
      try {
        fs.unlinkSync(path.join(assetsDir, file))
      } catch (err) {
        console.error(`Can not delete old asset ${file}:`, err)
      }
    }
  })
}

if (!fs.existsSync(pagesDir)) {
  console.error('`src/pages` directory not found')
  process.exit(1)
}

if (!fs.existsSync(snippetsDir)) {
  fs.mkdirSync(snippetsDir, { recursive: true })
}

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

    const pageConfig = pagesMap[page] || { slug: page.toLowerCase() }
    const BannerComponent = pageModule.Banner || pageModule[pageConfig.bannerComponent]
    const { slug, bannerDesktopBackground, bannerMobileBackground } = pageConfig
    
    if (BannerComponent) {
      const bannerHtml = `
  <div class="banner-wrap">
    <img class="banner-image banner-image-desktop object-cover" src="${findHashedFile(bannerDesktopBackground)}" width="1440" height="810" alt="" fetchpriority="high" />
    <img class="banner-image banner-image-mobile object-cover" src="${findHashedFile(bannerMobileBackground)}" width="390" height="844.48" alt="" fetchpriority="high" />
  </div>
`.trim()
      
      const bannerSnippetName = `banner-${slug}`
      const bannerSnippetPath = path.resolve(snippetsDir, `${bannerSnippetName}.liquid`)

      const bannerLiquidContent = `{% comment %}
  AUTO-GENERATED LCP BANNER. DO NOT EDIT DIRECTLY.
  Page: ${page}
  Generated at: ${new Date().toISOString()}
{% endcomment %}
<style>
.lcp-wrap { position: relative; width: 100%; height: 100vh; background: #000 !important; overflow: hidden; }
.lcp-wrap .banner-wrap { width: 100%; height: 75%; min-height: 75vh !important; overflow: hidden; }
.lcp-wrap .banner-wrap::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent 35%, rgba(0, 0, 0, 0.35) 55%, rgba(0, 0, 0, 0.75) 75%, #000 100%);
}
.lcp-wrap img { width: 100%; height: 133.333333%; object-fit: cover; object-position: center; }
.lcp-wrap img.banner-image-mobile { display: none; }
@media screen and (max-width:576px) {
  .lcp-wrap img.banner-image-desktop { display: none; }
  .lcp-wrap img.banner-image-mobile { display: block; }
}
</style>
<div class="${slug} lcp-wrap">
  ${processAssetUrls(bannerHtml)}
</div>
`
      fs.writeFileSync(bannerSnippetPath, bannerLiquidContent, 'utf-8')
      console.log(` Saved LCP Banner snippet: snippets/${bannerSnippetName}.liquid`)
    }

    const fullHtml = renderToString(
      createElement(
        AppProviders,
        null,
        createElement(PageComponent)
      )
    )

    const seoSnippetName = `seo-${slug}`
    const seoSnippetPath = path.resolve(snippetsDir, `${seoSnippetName}.liquid`)

    const liquidSnippetContent = `{% comment %}
  AUTO-GENERATED BY BUILD SCRIPT. DO NOT EDIT DIRECTLY.
  Page: ${page}
  Generated at: ${new Date().toISOString()}
{% endcomment %}
<div style="position: absolute !important; width: 1px !important; height: 1px !important; padding: 0 !important; margin: -1px !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; border: 0 !important;">
  ${processAssetUrls(fullHtml)}
</div>
`

    fs.writeFileSync(seoSnippetPath, liquidSnippetContent, 'utf-8')
    console.log(` Saved SEO snippet: snippets/${seoSnippetName}.liquid`)

  } catch (err) {
    console.error(` Error building page ${page}:`, err)
    process.exit(1)
  }
}

if (fs.existsSync(tempSsrDir)) {
  fs.rmSync(tempSsrDir, { recursive: true, force: true })
}

console.log('\n All pages were built and SEO snippets generated successfully!')

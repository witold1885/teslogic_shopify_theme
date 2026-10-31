import fs from 'fs'
import path from 'path'

const __dirname = import.meta.dirname

const assetsDir = path.join(__dirname, '../../assets')

const fontSourceDir = path.resolve(__dirname, '../src/assets/fonts/Manrope')

const fontFiles = [
    'Manrope-Regular.woff2',
    'Manrope-Medium.woff2',
    'Manrope-SemiBold.woff2',
    'Manrope-Bold.woff2',
]

fontFiles.forEach(file => {
    fs.copyFileSync(
        path.join(fontSourceDir, file),
        path.join(assetsDir, `react-${file}`)
    )
})
 
const files = fs.readdirSync(assetsDir)

const fontWeightsMap = {
    Regular: 400,
    Medium: 500,
    SemiBold: 600,
    Bold: 700,
}
const fonts = files.filter(f => f.startsWith('react-Manrope-') && f.endsWith('.woff2')).map(file => ({
    url: file,
    weight: fontWeightsMap[file.match(/(?<=react-[A-Za-z]+-)[A-Za-z]+/)[0]] || null
}))
let preloadFontTags = '', fontStyles = ''
fonts.forEach(({ url, weight }) => {
    preloadFontTags += `<link rel="preload" href="{{ '${url}' | asset_url }}" as="font" type="font/woff2" crossorigin>\n`
    fontStyles += `
@font-face {
    font-family: 'Manrope';
    src: url({{ '${url}' | asset_url }}) format('woff2');
    font-weight: ${weight};
    font-style: normal;
    font-display: swap;
}`
})
if (preloadFontTags) {
    fs.writeFileSync(
        path.join(__dirname, `../../snippets/preload-fonts.liquid`),
        `${preloadFontTags}\n<style>${fontStyles}\n</style>\n`
    )
}

const pagesMap = {
    ScreenmateOne: 'screenmate_one',
    ScreenmateDash: 'screenmate_dash',
    Powermate: 'powermate',
    Installers: 'installers',
    Partners: 'partners',
}

const mediaDesktop = '(min-width: 577px)'
const mediaMobile = '(max-width: 576px)'

for (const [pageName, fileName] of Object.entries(pagesMap)) {
    const cssFileName = `react-style-${pageName}`
    const cssFile = files.find(f => f.startsWith(cssFileName) && f.endsWith('.css'))
    
    const liquidFileName = `${fileName}_react.liquid`
    const liquidPath = path.join(__dirname, `../../sections/${liquidFileName}`)
    let liquidContent = fs.readFileSync(liquidPath, 'utf8')

    if (cssFile) {
        const regex = new RegExp(`\\{\\{\\s*['"]${cssFileName}[^'"]*\\.css['"]`, 'g')

        if (regex.test(liquidContent)) {
            liquidContent = liquidContent.replace(regex, `{{ '${cssFile}'`)

            fs.writeFileSync(liquidPath, liquidContent)
            console.log(`Updated liquid with CSS file: ${cssFile}`)
        } else {
            console.warn(`Could not find matching CSS tag for ${cssFileName} in ${liquidFileName}`)
        }
    }

    const desktopBg = files.find(f => f.startsWith(`react-${fileName}_banner_desktop`) && (f.endsWith('.png') || f.endsWith('.webp')))
    const mobileBg = files.find(f => f.startsWith(`react-${fileName}_banner_mobile`) && (f.endsWith('.png') || f.endsWith('.webp')))

    const snippetFileName = `preload-${fileName.replace('_', '-')}.liquid`
    const snippetPath = path.join(__dirname, `../../snippets/${snippetFileName}`)
    let snippetContent = fs.existsSync(snippetPath) ? fs.readFileSync(snippetPath, 'utf8') : ''

    if (desktopBg && mobileBg) {
        const preloadTags = `<!-- PRELOAD_START -->
<link rel="preload" as="image" href="{{ '${desktopBg}' | asset_url }}" fetchpriority="high" media="${mediaDesktop}">
<link rel="preload" as="image" href="{{ '${mobileBg}' | asset_url }}" fetchpriority="high" media="${mediaMobile}">
<!-- PRELOAD_END -->`.trim()
        const markerRegex = /<!-- PRELOAD_START -->[\s\S]*?<!-- PRELOAD_END -->/

        if (markerRegex.test(snippetContent)) {
            snippetContent = snippetContent.replace(markerRegex, preloadTags)
        } else {
            snippetContent = preloadTags + '\n' + snippetContent
        }
    
        fs.writeFileSync(snippetPath, snippetContent)
        console.log(`Updated liquid for ${snippetFileName} with clean preloads`)
    }
}

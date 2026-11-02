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
    ScreenmateOne: { slug: 'screenmate_one' },
    ScreenmateDash: { slug: 'screenmate_dash', lcp: { desktop: 'screenmate_dash_banner_desktop', mobile: 'screenmate_dash_banner_mobile' } },
    Powermate: { slug: 'powermate', lcp: { desktop: 'powermate_banner_desktop', mobile: 'powermate_banner_mobile' } },
    Installers: { slug: 'installers', lcp: { desktop: 'installers_sketch' } },
    Partners: { slug: 'partners' },
}

const media = { desktop: '(min-width: 577px)', mobile: '(max-width: 576px)' }

for (const [pageName, { slug, lcp }] of Object.entries(pagesMap)) {
    const cssFileName = `react-style-${pageName}`
    const cssFile = files.find(f => f.startsWith(cssFileName) && f.endsWith('.css'))
    
    const liquidFileName = `${slug}_react.liquid`
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

    if (lcp) {
        const lcpMap = Object.entries(lcp).reduce((acc, [mode, fileName]) => ({
            ...acc,
            [mode]: {
                file: files.find(f => f.startsWith(`react-${fileName}`) && (f.endsWith('.png') || f.endsWith('.webp'))),
                media: media[mode]
            }
        }), {})

        const snippetFileName = `preload-${slug.replace('_', '-')}.liquid`
        const snippetPath = path.join(__dirname, `../../snippets/${snippetFileName}`)

        if (Object.keys(lcpMap).length !== 0) {
            const preloadTags = Object.values(lcpMap).map(({ file, media }) => (
                `<link rel="preload" as="image" href="{{ '${file}' | asset_url }}" fetchpriority="high" media="${media}">`
            )).join('\n')
        
            fs.writeFileSync(snippetPath, preloadTags)
            console.log(`Updated liquid for ${snippetFileName} with clean preloads`)
        }
    }
}

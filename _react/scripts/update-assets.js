import fs from 'fs'
import path from 'path'

const __dirname = import.meta.dirname

const assetsDir = path.join(__dirname, '../../assets')
const files = fs.readdirSync(assetsDir)

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

    console.log({ desktopBg, mobileBg })

    if (desktopBg && mobileBg) {
        const preloadBlock = `<!-- PRELOAD_START -->
<link rel="preload" as="image" href="{{ '${desktopBg}' | asset_url }}" fetchpriority="high" media="${mediaDesktop}">
<link rel="preload" as="image" href="{{ '${mobileBg}' | asset_url }}" fetchpriority="high" media="${mediaMobile}">
<!-- PRELOAD_END -->`.trim()
        const markerRegex = /<!-- PRELOAD_START -->[\s\S]*?<!-- PRELOAD_END -->/

        if (markerRegex.test(liquidContent)) {
            liquidContent = liquidContent.replace(markerRegex, preloadBlock)
        } else {
            liquidContent = preloadBlock + '\n' + liquidContent
        }
    
        fs.writeFileSync(liquidPath, liquidContent)
        console.log(`Updated liquid for ${liquidFileName} with clean preloads`)
    }
}

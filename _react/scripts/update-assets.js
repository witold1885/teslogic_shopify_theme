import fs from 'fs'
import path from 'path'

const __dirname = import.meta.dirname

const assetsDir = path.join(__dirname, '../../assets')
const files = fs.readdirSync(assetsDir)

const cssMap = {
    ScreenmateOne: 'screenmate_one_react',
    Installers: 'installers_react',
    Partners: 'partners_react',
}

for (const [pageName, liquidFileName] of Object.entries(cssMap)) {
    const cssFileName = `react-style-${pageName}`
    const cssFile = files.find(f => f.startsWith(cssFileName) && f.endsWith('.css'))

    if (cssFile) {
        const liquidPath = path.join(__dirname, `../../sections/${liquidFileName}.liquid`)
        let liquidContent = fs.readFileSync(liquidPath, 'utf8')

        const regex = new RegExp(`\\{\\{\\s*['"]${cssFileName}[^'"]*\\.css['"]`, 'g')

        if (regex.test(liquidContent)) {
            liquidContent = liquidContent.replace(regex, `{{ '${cssFile}'`)

            fs.writeFileSync(liquidPath, liquidContent)
            console.log(`Updated liquid with CSS file: ${cssFile}`)
        } else {
            console.warn(`Could not find matching CSS tag for ${cssFileName} in ${liquidFileName}.liquid`)
        }
    }
}

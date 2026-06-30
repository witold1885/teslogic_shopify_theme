import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const __dirname = import.meta.dirname

const pagesDir = path.resolve(__dirname, 'src/pages')

if (!fs.existsSync(pagesDir)) {
  console.error('`src/pages` directory not found')
  process.exit(1)
}

const pages = fs.readdirSync(pagesDir)
  .filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'))
  .map(file => path.parse(file).name)

pages.forEach((page) => {
  console.log(`\nBuilding page: ${page}`)
  try {
    execSync(`PAGE=${page} npx vite build`, { stdio: 'inherit' })
  } catch (err) {
    console.error(`Error building page ${page}`)
    process.exit(1)
  }
})

console.log('\nAll pages were built separately!')

import { chromium } from './node_modules/playwright/index.mjs'

const BASE = process.env.BASE || 'http://127.0.0.1:3002'
const OUT = process.env.OUT || 'pw-screenshots/redesign'
const route = process.env.ROUTE || '/'
const theme = process.env.THEME || 'dark'
const width = Number(process.env.W || 1440)
const height = Number(process.env.H || 1000)
const full = process.env.FULL === '1'
const name = process.env.NAME || 'shot'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 })

if (theme === 'light') {
  await page.addInitScript(() => localStorage.setItem('ccc-theme', 'light'))
} else {
  await page.addInitScript(() => localStorage.setItem('ccc-theme', 'dark'))
}
if (process.env.LANG_) {
  await page.addInitScript((l) => localStorage.setItem('ccc-lang', l), process.env.LANG_)
}

await page.goto(BASE + route, { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
if (process.env.SEL) {
  const el = page.locator(process.env.SEL).nth(Number(process.env.NTH || 0))
  await el.scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  await el.screenshot({ path: `${OUT}/${name}.png` })
} else {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full })
}
console.log('saved', `${OUT}/${name}.png`)
await browser.close()

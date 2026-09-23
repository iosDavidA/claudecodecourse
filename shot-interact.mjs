import { chromium } from './node_modules/playwright/index.mjs'
const BASE = 'http://127.0.0.1:3002'
const OUT = 'pw-screenshots/redesign'
const browser = await chromium.launch()

// Desktop dropdown
const p1 = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await p1.addInitScript(() => localStorage.setItem('ccc-theme', 'dark'))
await p1.goto(BASE + '/', { waitUntil: 'networkidle' })
await p1.waitForTimeout(700)
await p1.getByText('Mai mult', { exact: false }).first().click()
await p1.waitForTimeout(500)
await p1.screenshot({ path: `${OUT}/nav-dropdown.png`, clip: { x: 700, y: 0, width: 740, height: 560 } })
console.log('dropdown ok')

// Mobile menu open
const p2 = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
await p2.addInitScript(() => localStorage.setItem('ccc-theme', 'dark'))
await p2.goto(BASE + '/', { waitUntil: 'networkidle' })
await p2.waitForTimeout(700)
await p2.locator('button[aria-label]').last().click()
await p2.waitForTimeout(500)
await p2.screenshot({ path: `${OUT}/nav-mobile-menu.png` })
console.log('mobile menu ok')

await browser.close()

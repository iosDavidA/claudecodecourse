import { chromium } from '@playwright/test'
import { writeFileSync } from 'fs'

const BASE = 'http://localhost:3006'
const OUT = 'pw-screenshots'

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setViewportSize({ width: 1280, height: 900 })

// Ensure output dir exists
import { mkdirSync } from 'fs'
try { mkdirSync(OUT) } catch {}

const issues = []

// ── 1. Check the page loads ────────────────────────────────────────────────
await page.goto(`${BASE}/tokenuri`, { waitUntil: 'networkidle' })
await page.screenshot({ path: `${OUT}/01-load.png`, fullPage: false })

const h1 = await page.textContent('h1')
if (!h1?.includes('Tokenilor')) issues.push('H1 missing or wrong text: ' + h1)
console.log('H1:', h1)

// ── 2. Check nav contains Tokenuri link ───────────────────────────────────
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
const navText = await page.textContent('nav')
if (!navText?.includes('Tokenuri')) issues.push('Tokenuri missing from navbar')
console.log('Nav has Tokenuri:', navText?.includes('Tokenuri'))
await page.screenshot({ path: `${OUT}/02-nav.png`, fullPage: false })

// ── 3. Screenshot all 5 tabs ──────────────────────────────────────────────
await page.goto(`${BASE}/tokenuri`, { waitUntil: 'networkidle' })
const tabs = ['Bazele', 'Context Window', 'Economii', 'Prompt Caching', 'Monitorizare']

for (let i = 0; i < tabs.length; i++) {
  const tabLabel = tabs[i]
  await page.getByRole('button', { name: tabLabel }).click()
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${OUT}/tab-${i + 1}-${tabLabel.replace(/\s/g, '-').toLowerCase()}.png`, fullPage: true })
  console.log(`Screenshotted tab: ${tabLabel}`)
}

// ── 4. Check prev/next navigation ─────────────────────────────────────────
await page.goto(`${BASE}/tokenuri`, { waitUntil: 'networkidle' })
const prevBtn = await page.locator('text=Modele').first()
const nextBtn = await page.locator('text=Automatizare').first()
if (!(await prevBtn.isVisible())) issues.push('Prev (Modele) nav button not visible')
if (!(await nextBtn.isVisible())) issues.push('Next (Automatizare) nav button not visible')
console.log('Prev visible:', await prevBtn.isVisible())
console.log('Next visible:', await nextBtn.isVisible())

// ── 5. Click through prev/next ────────────────────────────────────────────
await page.locator('a:has-text("Automatizare")').last().click()
await page.waitForURL('**/automatizare')
console.log('Navigation to Automatizare: OK')

await page.goto(`${BASE}/tokenuri`, { waitUntil: 'networkidle' })
await page.locator('a:has-text("Modele")').last().click()
await page.waitForURL('**/modele')
console.log('Navigation to Modele: OK')

// ── 6. Check CodeBlock copy buttons ──────────────────────────────────────
await page.goto(`${BASE}/tokenuri`, { waitUntil: 'networkidle' })
const copyBtn = page.locator('button[title="Copiază codul"]').first()
await copyBtn.hover()
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}/06-codebock-hover.png`, fullPage: false })
console.log('CodeBlock copy button visible on hover: OK')

// ── 7. Mobile viewport ────────────────────────────────────────────────────
await page.setViewportSize({ width: 390, height: 844 })
await page.goto(`${BASE}/tokenuri`, { waitUntil: 'networkidle' })
await page.screenshot({ path: `${OUT}/07-mobile.png`, fullPage: true })
const tabsVisible = await page.locator('button:has-text("Bazele")').isVisible()
console.log('Tabs visible on mobile:', tabsVisible)
if (!tabsVisible) issues.push('Tab buttons not visible on mobile (390px)')

// ── 8. Check progress dots include /tokenuri ─────────────────────────────
await page.setViewportSize({ width: 1280, height: 900 })
await page.goto(`${BASE}/tokenuri`, { waitUntil: 'networkidle' })
// Count dots (links in the dot nav area)
const dots = await page.locator('.hidden.sm\\:flex a').count()
console.log('Progress dots count:', dots)
if (dots < 12) issues.push(`Expected 12+ progress dots (one per page), got ${dots}`)

// ── Summary ───────────────────────────────────────────────────────────────
console.log('\n=== ISSUES FOUND ===')
if (issues.length === 0) {
  console.log('None — all checks passed!')
} else {
  issues.forEach((i) => console.log(' ✗', i))
}

writeFileSync(`${OUT}/issues.json`, JSON.stringify(issues, null, 2))
await browser.close()

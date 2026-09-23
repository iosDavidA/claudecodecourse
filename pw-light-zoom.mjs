/**
 * Targeted zoom-in audit for light mode problem areas.
 * Run: node pw-light-zoom.mjs
 */
import { chromium } from './node_modules/playwright/index.mjs'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3001'
const OUT  = 'pw-screenshots/light-zoom'
try { mkdirSync(OUT, { recursive: true }) } catch {}

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  storageState: {
    cookies: [],
    origins: [{ origin: BASE, localStorage: [{ name: 'ccc-theme', value: 'light' }] }],
  },
})
const page = await ctx.newPage()

const light = () => page.evaluate(() => {
  document.documentElement.classList.remove('dark')
  document.documentElement.classList.add('light')
})

// helper: go, activate light, wait, clip-screenshot
const shot = async (name, url, clip, extra) => {
  await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle' })
  await light()
  if (extra) await extra()
  await page.waitForTimeout(400)
  const opts = { path: `${OUT}/${name}.png` }
  if (clip) opts.clip = clip; else opts.fullPage = true
  await page.screenshot(opts)
  console.log('✓', name)
}

// ── Home ──────────────────────────────────────────────────────────────────────
// Full bottom CTA section
await shot('home-cta', '/', null, async () => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(300)
})

// Hero section above fold
await shot('home-hero', '/', { x: 0, y: 0, width: 1280, height: 700 })

// Stats strip + course grid
await shot('home-grid', '/', null, async () => {
  await page.evaluate(() => window.scrollTo(0, 700))
})

// ── Navbar ────────────────────────────────────────────────────────────────────
await shot('navbar-light', '/', { x: 0, y: 0, width: 1280, height: 60 })

// ── Tools page tabs ───────────────────────────────────────────────────────────
await page.goto(`${BASE}/tools`, { waitUntil: 'networkidle' })
await light()
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}/tools-prezentare.png`, clip: { x: 0, y: 80, width: 1280, height: 820 } })
console.log('✓ tools-prezentare')

// Shell & Web tab
await page.getByRole('button', { name: 'Shell & Web' }).first().click()
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/tools-shell-web-full.png`, fullPage: true })
console.log('✓ tools-shell-web')

// Permisiuni tab - bottom (run modes)
await page.getByRole('button', { name: 'Permisiuni' }).first().click()
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/tools-permisiuni-full.png`, fullPage: true })
console.log('✓ tools-permisiuni')

// ── Automation ────────────────────────────────────────────────────────────────
await page.goto(`${BASE}/automatizare`, { waitUntil: 'networkidle' })
await light()
await page.waitForTimeout(300)
// Tab bar area
await page.screenshot({ path: `${OUT}/auto-tabs.png`, clip: { x: 0, y: 220, width: 1280, height: 120 } })
console.log('✓ auto-tabs')

// ── Skills - Exemple tab ──────────────────────────────────────────────────────
await page.goto(`${BASE}/skills`, { waitUntil: 'networkidle' })
await light()
await page.waitForTimeout(300)
await page.getByRole('button', { name: 'Exemple' }).first().click()
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/skills-exemple-full.png`, fullPage: true })
console.log('✓ skills-exemple')

// ── Proiect Complet tabs ──────────────────────────────────────────────────────
await page.goto(`${BASE}/proiect-complet`, { waitUntil: 'networkidle' })
await light()
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}/proiect-fold.png`, clip: { x: 0, y: 0, width: 1280, height: 900 } })
console.log('✓ proiect-fold')

// ── Rationament - API tab (code heavy) ───────────────────────────────────────
await page.goto(`${BASE}/rationament`, { waitUntil: 'networkidle' })
await light()
await page.getByRole('button', { name: 'API' }).first().click()
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/rationament-api-full.png`, fullPage: true })
console.log('✓ rationament-api')

// ── Referință ─────────────────────────────────────────────────────────────────
await page.goto(`${BASE}/referinta`, { waitUntil: 'networkidle' })
await light()
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}/referinta-full.png`, fullPage: true })
console.log('✓ referinta-full')

// ── Comenzi ───────────────────────────────────────────────────────────────────
await page.goto(`${BASE}/comenzi`, { waitUntil: 'networkidle' })
await light()
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}/comenzi-full.png`, fullPage: true })
console.log('✓ comenzi-full')

await browser.close()
console.log(`\nZoom screenshots saved to ${OUT}/`)

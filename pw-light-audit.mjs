/**
 * Light mode visual audit — screenshots every page in light mode.
 * Run: node pw-light-audit.mjs
 */
import { chromium } from './node_modules/playwright/index.mjs'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3001'
const OUT  = 'pw-screenshots/light'

try { mkdirSync(OUT, { recursive: true }) } catch {}

const PAGES = [
  { path: '/',              name: '00-home' },
  { path: '/instalare',     name: '01-instalare' },
  { path: '/rationament',   name: '02-rationament' },
  { path: '/tools',         name: '03-tools' },
  { path: '/comenzi',       name: '04-comenzi' },
  { path: '/prompting',     name: '05-prompting' },
  { path: '/modele',        name: '06-modele' },
  { path: '/tokenuri',      name: '07-tokenuri' },
  { path: '/automatizare',  name: '08-automatizare' },
  { path: '/avansat',       name: '09-avansat' },
  { path: '/skills',        name: '10-skills' },
  { path: '/workflows',     name: '11-workflows' },
  { path: '/proiect-complet','name': '12-proiect' },
  { path: '/referinta',     name: '13-referinta' },
]

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  // pre-set light mode in localStorage
  storageState: {
    cookies: [],
    origins: [{
      origin: BASE,
      localStorage: [{ name: 'ccc-theme', value: 'light' }],
    }],
  },
})
const page = await ctx.newPage()

// Force light class on html immediately after every navigation
page.on('load', () =>
  page.evaluate(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  }).catch(() => {})
)

const issues = []

for (const { path, name } of PAGES) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)

  // ensure light class is set
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  })
  await page.waitForTimeout(200)

  // above-the-fold screenshot
  await page.screenshot({ path: `${OUT}/${name}-fold.png`, fullPage: false })

  // full-page screenshot
  await page.screenshot({ path: `${OUT}/${name}-full.png`, fullPage: true })

  // — checks —
  const bodyBg = await page.evaluate(() =>
    window.getComputedStyle(document.body).backgroundColor
  )
  // white or very light gray expected — any color with all channels ≥ 235
  const channels = (bodyBg.match(/\d+/g) || []).slice(0, 3).map(Number)
  const isLightBg = channels.length === 3 && channels.every((v) => v >= 235)
  if (!isLightBg) issues.push(`${path}: body bg looks dark — ${bodyBg}`)

  // check for near-invisible text (white text on white bg)
  const badText = await page.evaluate(() => {
    const els = document.querySelectorAll('p, h1, h2, h3, span, li, td')
    const bad = []
    for (const el of els) {
      const s = window.getComputedStyle(el)
      if (s.color === 'rgb(255, 255, 255)' && s.backgroundColor === 'rgb(255, 255, 255)') {
        bad.push(el.tagName + ': ' + el.textContent?.slice(0, 40))
      }
    }
    return bad.slice(0, 3)
  })
  if (badText.length) issues.push(`${path}: white-on-white text — ${badText.join(' | ')}`)

  console.log(`✓ ${name}  bg=${bodyBg}`)
}

// ── Tab screenshots for pages with tabs ──────────────────────────────────────

const TAB_PAGES = [
  { path: '/tools',       tabs: ['Prezentare', 'Fișiere', 'Căutare', 'Shell & Web', 'Permisiuni'] },
  { path: '/prompting',   tabs: ['Anatomie', 'Interacțiune CC', 'Patternuri'] },
  { path: '/tokenuri',    tabs: ['Bazele', 'Context Window', 'Economii'] },
  { path: '/skills',      tabs: ['Ce sunt Skills', 'Exemple'] },
]

for (const { path, tabs } of TAB_PAGES) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  })
  await page.waitForTimeout(300)

  const slug = path.replace('/', '') || 'home'
  for (const tabLabel of tabs) {
    try {
      await page.getByRole('button', { name: tabLabel, exact: false }).first().click()
      await page.waitForTimeout(300)
      await page.screenshot({
        path: `${OUT}/tab-${slug}-${tabLabel.replace(/[\s\/&]/g, '-').toLowerCase()}.png`,
        fullPage: true,
      })
      console.log(`  tab: ${path} → ${tabLabel}`)
    } catch {
      console.log(`  (skipped tab: ${tabLabel})`)
    }
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────

console.log('\n=== LIGHT MODE ISSUES ===')
if (issues.length === 0) {
  console.log('None found — all checks passed!')
} else {
  issues.forEach(i => console.log(' ✗', i))
}

await browser.close()
console.log(`\nScreenshots saved to ${OUT}/`)

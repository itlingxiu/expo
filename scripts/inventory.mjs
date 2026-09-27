/**
 * 全站清单对比：
 *  1. 抓取官方 sitemap.xml → 官方全部页面清单（排除 /ja/ 日语版）
 *  2. 列出本地已翻译页面
 *  3. 输出：缺失清单、nav 中缺失条目、本地多余页面
 * 运行：node scripts/inventory.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readdirSync, statSync } from 'node:fs'

const root = fileURLToPath(new URL('..', import.meta.url))
const scratch = join(root, '.scratch')
mkdirSync(scratch, { recursive: true })

// ---- 1. 官方清单（sitemap.xml 需先手动下载到 .scratch/）----
const sitemapFile = join(scratch, 'sitemap.xml')
if (!existsSync(sitemapFile)) {
  console.error('缺少 .scratch/sitemap.xml，请先运行：')
  console.error('  curl -s https://docs.expo.dev/sitemap.xml -o .scratch/sitemap.xml')
  process.exit(1)
}
const xml = readFileSync(sitemapFile, 'utf8')
const official = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(/^https:\/\/docs\.expo\.dev/, '').replace(/\/$/, ''))
  .filter((p) => p && !p.startsWith('/ja/'))
  .sort()
const officialNoHistory = official.filter((p) => !/^\/versions\/v\d/.test(p))

// ---- 2. 本地清单 ----
const pagesDir = join(root, 'src/content/pages')
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.md')) out.push('/' + p.slice(pagesDir.length + 1).replace(/\\/g, '/').replace(/\.md$/, ''))
  }
  return out
}
const local = walk(pagesDir).sort()

// ---- 3. nav 清单 ----
const navSrc = readFileSync(join(root, 'src/content/nav.js'), 'utf8')
const navSlugs = [...navSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => (m[1] ? '/' + m[1] : '/')).sort()

// ---- 4. 对比 ----
const set = (arr) => new Set(arr)
const officialSet = set(officialNoHistory)
const localSet = set(local)

const missing = officialNoHistory.filter((p) => !localSet.has(p))
const localExtra = local.filter((p) => !officialSet.has(p))
const navNotOfficial = navSlugs.filter((p) => !officialSet.has(p))
const officialNotNav = officialNoHistory.filter((p) => !set(navSlugs).has(p))
const historyCount = official.length - officialNoHistory.length

writeFileSync(join(scratch, 'official-all.txt'), official.join('\n') + '\n')
writeFileSync(join(scratch, 'official-current.txt'), officialNoHistory.join('\n') + '\n')
writeFileSync(join(scratch, 'local.txt'), local.join('\n') + '\n')
writeFileSync(join(scratch, 'missing.txt'), missing.join('\n') + '\n')

console.log('官方全部页面（含历史 SDK 版本）:', official.length)
console.log('  其中历史 SDK 版本页面:', historyCount)
console.log('当前文档页面（latest + 非版本化）:', officialNoHistory.length)
console.log('本地已翻译:', local.length)
console.log('缺失（当前文档）:', missing.length)
console.log('本地多余（不在官方清单）:', localExtra.length)
console.log('nav 中有但官方 sitemap 无:', navNotOfficial.length)
console.log('官方有但 nav 无（当前文档）:', officialNotNav.length)
console.log('')
console.log('=== 缺失分布 ===')
const dist = {}
for (const p of missing) {
  const seg = p.split('/')[1]
  dist[seg] = (dist[seg] || 0) + 1
}
for (const [k, v] of Object.entries(dist).sort((a, b) => b[1] - a[1])) console.log(`  ${k}: ${v}`)
console.log('')
if (officialNotNav.length) {
  console.log('=== 官方有但 nav 无 ===')
  for (const p of officialNotNav) console.log('  ' + p)
}
if (navNotOfficial.length) {
  console.log('=== nav 有但官方无 ===')
  for (const p of navNotOfficial) console.log('  ' + p)
}

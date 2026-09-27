/**
 * 生成翻译任务清单：按官方 sitemap 与本地已翻译页面的差集分组，
 * 每组写入 .scratch/tasks/<id>.txt（每行一个 slug，不带前导 /）。
 * 运行：node scripts/gen-tasks.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const scratch = join(root, '.scratch')
const tasksDir = join(scratch, 'tasks')
mkdirSync(tasksDir, { recursive: true })

// ---- 本地已翻译清单（index.md 归一化为目录 slug）----
const pagesDir = join(root, 'src/content/pages')
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.md')) {
      let rel = '/' + p.slice(pagesDir.length + 1).replace(/\\/g, '/').replace(/\.md$/, '')
      if (rel.endsWith('/index')) rel = rel.slice(0, -'/index'.length)
      out.push(rel)
    }
  }
  return out
}
const localSet = new Set(walk(pagesDir))

// ---- 官方清单（含历史版本）----
const official = readFileSync(join(scratch, 'official-all.txt'), 'utf8').trim().split('\n').filter(Boolean)

const missing = official.filter((p) => !localSet.has(p))

// ---- 分组定义 ----
const inAny = (p, prefixes) => prefixes.some((x) => p.startsWith(x))

function splitHalf(arr) {
  const mid = Math.ceil(arr.length / 2)
  return [arr.slice(0, mid), arr.slice(mid)]
}
function splitN(arr, n) {
  const size = Math.ceil(arr.length / n)
  const out = []
  for (let i = 0; i < n; i++) out.push(arr.slice(i * size, (i + 1) * size))
  return out
}

const exact = new Set(['/skills', '/mcp', '/llms', '/faq', '/core-concepts', '/additional-resources'])
const groups = []
const add = (id, slugs) => groups.push({ id, slugs: slugs.sort() })

// 当前文档
add('c01', missing.filter((p) => inAny(p, ['/get-started/', '/develop/', '/review/', '/deploy/', '/debugging/']) || p === '/config-plugins/patch-project'))
{
  const g = missing.filter((p) => p.startsWith('/guides/'))
  const [a, b] = splitHalf(g)
  add('c02', a)
  add('c03', b)
}
add('c04', missing.filter((p) => inAny(p, ['/linking/', '/push-notifications/', '/regulatory-compliance/', '/troubleshooting/'])))
add('c05', missing.filter((p) => inAny(p, ['/modules/', '/technical-specs/'])))
{
  // latest SDK 顶层包页面（排除 ui/ 与 router/ 子目录）
  const pkgs = missing.filter(
    (p) => p.startsWith('/versions/latest/sdk/') && !p.startsWith('/versions/latest/sdk/ui/') && !p.startsWith('/versions/latest/sdk/router/')
  )
  const routerSdk = missing.filter((p) => p.startsWith('/versions/latest/sdk/router/'))
  const [p1, p2, p3] = splitN(pkgs, 3)
  add('c06', p1)
  add('c07', p2)
  add('c08', [...p3, ...routerSdk, ...missing.filter((p) => p === '/versions/latest')])
}
add('c09', missing.filter((p) => p.startsWith('/versions/latest/sdk/ui/jetpack-compose/') || p === '/versions/latest/sdk/ui/jetpack-compose'))
add('c10', missing.filter((p) => p.startsWith('/versions/latest/sdk/ui/swift-ui/') || p === '/versions/latest/sdk/ui/swift-ui'))
add('c11', missing.filter((p) => {
  if (p === '/versions/latest/sdk/ui' || p === '/versions/latest/sdk/ui/drop-in-replacements' || p === '/versions/latest/sdk/ui/universal') return true
  return p.startsWith('/versions/latest/sdk/ui/drop-in-replacements/') || p.startsWith('/versions/latest/sdk/ui/universal/')
}))
add('c12', missing.filter((p) => p.startsWith('/router/')))
add('c13', missing.filter((p) => p.startsWith('/eas/') || p === '/eas'))
add('c14', missing.filter((p) => inAny(p, ['/build/', '/build-reference/', '/submit/', '/app-signing/', '/distribution/', '/custom-builds/'])))
add('c15', missing.filter((p) => inAny(p, ['/eas-update/', '/eas-insights/', '/billing/', '/accounts/'])))
add('c16', missing.filter((p) => p.startsWith('/tutorial/')))
add('c17', missing.filter((p) => inAny(p, ['/workflow/', '/bare/', '/brownfield/', '/monitoring/', '/agents/', '/more/']) || exact.has(p) || p === '/agents'))

// 历史版本
for (const v of ['v54.0.0', 'v55.0.0', 'v56.0.0', 'v57.0.0', 'v58.0.0']) {
  const indexPage = missing.filter((p) => p === `/versions/${v}`)
  const pages = missing.filter((p) => p.startsWith(`/versions/${v}/`))
  // v54 每组较小，2 个 agent；v55+ 每组较大，4 个 agent
  const n = v === 'v54.0.0' ? 2 : 4
  const parts = splitN(pages, n)
  const letters = 'abcdef'
  parts.forEach((part, i) => add(`h${v.replace('.0.0', '')}${letters[i]}`, i === 0 ? [...indexPage, ...part] : part))
}

// ---- 写入任务文件 ----
const assigned = new Set()
let total = 0
let dup = 0
for (const g of groups) {
  const uniq = g.slugs.filter((s) => {
    if (assigned.has(s)) {
      dup++
      return false
    }
    assigned.add(s)
    return true
  })
  const file = join(tasksDir, `${g.id}.txt`)
  writeFileSync(file, uniq.map((s) => s.slice(1)).join('\n') + (uniq.length ? '\n' : ''))
  total += uniq.length
  console.log(`${g.id}: ${uniq.length}`)
}
if (dup) console.log(`重复分配已剔除: ${dup}`)
const unassigned = missing.filter((p) => !assigned.has(p))
if (unassigned.length) {
  writeFileSync(join(tasksDir, '_unassigned.txt'), unassigned.map((s) => s.slice(1)).join('\n') + '\n')
  console.log('_unassigned: ' + unassigned.length)
}
console.log(`\n缺失总数 ${missing.length}，已分组 ${total}，未分组 ${unassigned.length}`)

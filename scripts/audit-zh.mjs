/**
 * 找出：
 *  1. 官方当前文档中本地缺失的页面（.scratch/missing.txt）
 *  2. 已有 Markdown 正文里仍是英文的段落
 */
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const pagesDir = join(root, 'src/content/pages')
const scratch = join(root, '.scratch')

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

function prose(raw) {
  const body = raw.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '')
  return body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`\n]+`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
}

const englishPages = []
for (const file of walk(pagesDir)) {
  const text = prose(readFileSync(file, 'utf8'))
  const cjk = (text.match(/[\u4e00-\u9fff]/g) || []).length
  const latin = (text.match(/[A-Za-z]/g) || []).length
  const rel = relative(pagesDir, file).replace(/\\/g, '/').replace(/\.md$/, '')
  if (cjk < 40 || (latin > 200 && cjk / (cjk + latin) < 0.35)) {
    englishPages.push({ rel, cjk, latin, ratio: cjk / (cjk + latin || 1) })
  }
}
englishPages.sort((a, b) => a.ratio - b.ratio)

const missing = readFileSync(join(scratch, 'missing.txt'), 'utf8')
  .split(/\r?\n/)
  .map((s) => s.trim().replace(/^\//, ''))
  .filter(Boolean)

const groups = {}
for (const slug of missing) {
  const key = slug.split('/')[0]
  ;(groups[key] ||= []).push(slug)
}

mkdirSync(join(scratch, 'batches'), { recursive: true })
const batchIndex = []
let n = 0
for (const [key, slugs] of Object.entries(groups).sort((a, b) => b[1].length - a[1].length)) {
  const size = key === 'versions' ? 20 : 18
  for (let i = 0; i < slugs.length; i += size) {
    n++
    const id = String(n).padStart(2, '0')
    const chunk = slugs.slice(i, i + size)
    const file = join(scratch, 'batches', `b${id}-${key}.txt`)
    writeFileSync(file, chunk.join('\n') + '\n')
    batchIndex.push({ id, key, count: chunk.length, file: `.scratch/batches/b${id}-${key}.txt` })
  }
}

const report = []
report.push(`缺失页面: ${missing.length}`)
report.push(`疑似未译完的已有页面: ${englishPages.length}`)
report.push('')
report.push('=== 疑似英文残留 ===')
for (const p of englishPages) {
  report.push(`  ${p.rel}  中文${p.cjk} 英文${p.latin} 占比${p.ratio.toFixed(2)}`)
}
report.push('')
report.push('=== 翻译批次 ===')
for (const b of batchIndex) report.push(`  ${b.file}  ${b.count}`)
writeFileSync(join(scratch, 'audit-zh.txt'), report.join('\n') + '\n', 'utf8')
console.log(report.join('\n'))

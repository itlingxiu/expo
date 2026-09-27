/**
 * 生成客户端搜索索引：扫描 src/content/pages/**\/*.md，
 * 提取标题/描述/正文摘要，输出 src/content/search-index.json。
 * 运行：npm run index
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { nav } from '../src/content/nav.js'

const root = fileURLToPath(new URL('..', import.meta.url))
const pagesDir = join(root, 'src/content/pages')
const outFile = join(root, 'src/content/search-index.json')

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

/** slug → 顶层分组名 */
function buildSectionMap() {
  const map = new Map()
  const walkNode = (node, section) => {
    if (node.section) {
      for (const c of node.items || []) walkNode(c, node.section)
      return
    }
    if (node.slug) map.set(node.slug, section)
    for (const c of node.items || []) walkNode(c, section)
  }
  for (const top of nav) walkNode(top, top.section)
  return map
}

function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, ' ') // 代码块
    .replace(/`[^`]*`/g, ' ') // 行内代码
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接保留文字
    .replace(/^#{1,6}\s+/gm, '') // 标题符号
    .replace(/^:::[\s\S]*?(?=^:::|$)/gm, ' ') // 容器
    .replace(/[>*_~|-]/g, ' ') // 其余符号
    .replace(/\s+/g, ' ')
    .trim()
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/)
  if (!m) return { attrs: {}, body: raw }
  const attrs = {}
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/)
    if (kv) attrs[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim()
  }
  return { attrs, body: raw.slice(m[0].length) }
}

const sectionMap = buildSectionMap()
const index = []

for (const file of walk(pagesDir).sort()) {
  const slug = relative(pagesDir, file).replace(/\\/g, '/').replace(/\.md$/, '').replace(/\/index$/, '')
  const raw = readFileSync(file, 'utf8')
  const { attrs, body } = parseFrontmatter(raw)
  index.push({
    slug,
    title: attrs.title || slug.split('/').pop(),
    description: attrs.description || '',
    section: sectionMap.get(slug) || '',
    text: stripMarkdown(body).slice(0, 320),
  })
}

writeFileSync(outFile, JSON.stringify(index))
console.log(`✓ 搜索索引已生成：${index.length} 个页面 → ${relative(root, outFile)}`)

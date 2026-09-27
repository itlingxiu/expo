import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = 'E:/个人/个人项目/expo/src/content/pages'
const slugs = [
  'modules/third-party-library',
  'modules/type-generation-tutorial',
  'modules/config-plugin-and-native-module-tutorial',
  'modules/native-view-tutorial',
  'modules/inline-modules-tutorial',
  'modules/module-api',
]

function fenceCount(s) {
  const lines = s.split(/\r?\n/)
  let n = 0
  for (const line of lines) {
    if (/^(`{3,}|~{3,})/.test(line)) n++
  }
  return n
}

function colonBalance(s) {
  const lines = s.split(/\r?\n/)
  let depth = 0
  const problems = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.startsWith(':::')) continue
    const rest = line.slice(3).trim()
    if (rest === '') {
      depth--
      if (depth < 0) problems.push(`extra close at ${i + 1}`)
    } else {
      depth++
    }
  }
  if (depth !== 0) problems.push(`unclosed depth ${depth}`)
  return problems
}

for (const slug of slugs) {
  const p = join(root, slug + '.md')
  const raw = readFileSync(p, 'utf8')
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  const body = fm ? raw.slice(fm[0].length) : raw
  const title = fm?.[1].match(/^title:\s*(.+)$/m)?.[1]
  const desc = fm?.[1].match(/^description:\s*(.+)$/m)?.[1]
  const zh = (raw.match(/[\u4e00-\u9fff]/g) || []).length
  const fences = fenceCount(raw)
  const colons = colonBalance(raw)
  const starts = /^\s*#\s+\S/m.test(body)
  const issues = []
  if (!title) issues.push('no title')
  if (!desc) issues.push('no description')
  if (!starts) issues.push('body does not start with #')
  if (fences % 2) issues.push('odd fences ' + fences)
  if (colons.length) issues.push('colons ' + colons.join('; '))
  if (zh < 80) issues.push('zh ' + zh)
  if (/^import /m.test(raw) || /^export default/m.test(raw)) issues.push('mdx import/export')
  console.log((issues.length ? 'FAIL' : 'OK') + ' ' + slug + ' zh=' + zh + ' fences=' + fences + (issues.length ? ' ' + issues.join(' | ') : ''))
}

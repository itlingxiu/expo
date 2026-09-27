/**
 * 内容文件质量校验：
 *  1. frontmatter 含 title / description
 *  2. 正文以 # 一级标题开头
 *  3. ::: 容器开闭配对
 *  4. 代码围栏配对
 *  5. 无 AI 说明块残留
 * 运行：node scripts/validate-pages.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const pagesDir = join(root, 'src/content/pages')

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

const problems = []
let checked = 0

for (const file of walk(pagesDir).sort()) {
  checked++
  const rel = relative(pagesDir, file).replace(/\\/g, '/')
  const raw = readFileSync(file, 'utf8')
  const fail = (msg) => problems.push(`${rel}: ${msg}`)

  // 1. frontmatter
  const fm = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/)
  if (!fm) fail('缺少 frontmatter')
  else {
    if (!/^title:\s*\S/m.test(fm[1])) fail('frontmatter 缺 title')
    if (!/^description:\s*\S/m.test(fm[1])) fail('frontmatter 缺 description')
  }

  // 2. h1
  const body = fm ? raw.slice(fm[0].length) : raw
  if (!/^#\s+\S/m.test(body)) fail('正文不以 # 一级标题开头')

  // 3. 容器配对（粗粒度：::: 开（非 ::: 单独行）与 ::: 闭数量一致）
  let inFence = false
  let opens = 0
  let closes = 0
  for (const line of body.split('\n')) {
    if (/^\s*```/.test(line)) inFence = !inFence
    if (inFence) continue
    const t = line.trim()
    if (t === ':::') closes++
    else if (/^:::[^:]+/.test(t)) opens++
  }
  if (opens !== closes) fail(`::: 容器不配对（开 ${opens} / 闭 ${closes}）`)

  // 4. 代码围栏配对
  const fences = (body.match(/^\s*```/gm) || []).length
  if (fences % 2 !== 0) fail(`代码围栏数量为奇数（${fences}）`)

  // 5. AI 说明块残留
  if (/AgentInstructions|agent feedback|submit-expo-feedback/i.test(raw)) {
    fail('疑似残留 AI 说明块')
  }

  // 6. 长度
  if (raw.length < 400) fail(`内容过短（${raw.length} 字符）`)
}

console.log(`已检查 ${checked} 个文件\n`)
if (problems.length) {
  for (const p of problems) console.log('  ✗ ' + p)
  console.log(`\n共 ${problems.length} 个问题`)
} else {
  console.log('✓ 全部通过')
}

import fs from 'fs'

const files = process.argv.slice(2)
const bad = [
  'import ',
  'export default',
  '<Tabs>',
  '<Tab ',
  '<Terminal',
  '<Collapsible',
  '<Step ',
  '<APIInstallSection',
  '<APISection',
  '<SnackInline',
  '<ContentSpotlight',
  '<EASFunction',
  '<FileTree',
  '<YesIcon',
  '<NoIcon',
  '<BoxLink',
  '<Prerequisites',
  '<Requirement',
  '<FAQ',
  '{/*',
  '-->',
]

for (const path of files) {
  const raw = fs.readFileSync(path, 'utf8')
  const lines = raw.split('\n')
  let fence = false
  let fenceLine = 0
  const fenceProblems = []
  lines.forEach((l, i) => {
    const s = l.replace(/\r$/, '')
    if (s.startsWith('```')) {
      if (!fence) {
        fence = true
        fenceLine = i + 1
      } else if (s === '```') {
        fence = false
      } else {
        fenceProblems.push(`nested or unclosed fence before ${i + 1} (opened ${fenceLine}): ${s.slice(0, 40)}`)
        fence = true
        fenceLine = i + 1
      }
    }
  })
  if (fence) fenceProblems.push(`unclosed fence from ${fenceLine}`)

  let depth = 0
  const detailsProblems = []
  lines.forEach((l, i) => {
    const s = l.replace(/\r$/, '')
    if (/^<details[\s>]/.test(s)) depth++
    if (s === '</details>') {
      depth--
      if (depth < 0) detailsProblems.push(`extra close ${i + 1}`)
    }
  })
  if (depth !== 0) detailsProblems.push(`details depth ${depth}`)

  const callouts = []
  let inFence = false
  const stack = []
  lines.forEach((l, i) => {
    const s = l.replace(/\r$/, '')
    if (s.startsWith('```')) {
      inFence = !inFence
      return
    }
    if (inFence) return
    if (/^:::(note|tip|warning|danger|tabs)\b/.test(s)) stack.push(`${i + 1} ${s}`)
    else if (s === ':::') {
      if (!stack.length) callouts.push(`extra ::: ${i + 1}`)
      else stack.pop()
    } else if (/^:::tab\b/.test(s)) {
      /* tab is not a closer */
    }
  })
  if (stack.length) callouts.push('unclosed ' + stack.join(' | '))

  const hits = bad.filter((x) => raw.includes(x))
  const fm = raw.match(/^---\n([\s\S]*?)\n---/)
  const title = fm && /title:\s*(.+)/.exec(fm[1])
  const desc = fm && /description:\s*(.+)/.exec(fm[1])
  const h1 = raw.split('\n').find((l) => l.startsWith('# '))
  const zh = (raw.match(/[\u4e00-\u9fff]/g) || []).length
  console.log(
    JSON.stringify({
      file: path.split('/').slice(-3).join('/'),
      bytes: raw.length,
      zh,
      title: title && title[1],
      descOk: !!(desc && /[\u4e00-\u9fff]/.test(desc[1])),
      h1,
      fenceProblems,
      detailsProblems,
      callouts,
      hits,
    })
  )
}

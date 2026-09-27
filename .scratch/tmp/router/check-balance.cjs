const fs = require('fs')
const path = require('path')
const slugs = process.argv.slice(2)
for (const s of slugs) {
  const p = path.join('src/content/pages', s + '.md')
  const body = fs.readFileSync(p, 'utf8').replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '')
  const lines = body.split('\n')
  let inFence = false
  let opens = 0
  let closes = 0
  const fenceLines = []
  const colonEvents = []
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      fenceLines.push(`${i + 1} ${inFence ? 'OPEN' : 'CLOSE'} ${line.trim().slice(0, 40)}`)
    }
    if (inFence) return
    const t = line.trim()
    if (t === ':::') {
      closes++
      colonEvents.push(`${i + 1} CLOSE bal=${opens - closes}`)
    } else if (/^:::[^:]+/.test(t)) {
      opens++
      colonEvents.push(`${i + 1} OPEN ${t.slice(0, 40)} bal=${opens - closes}`)
    }
  })
  console.log('\n==', s, 'fences', fenceLines.length, inFence ? 'UNCLOSED' : 'even', '::: ', opens, closes)
  if (fenceLines.length % 2 || inFence) {
    fenceLines.forEach((x) => console.log('  F', x))
  }
  if (opens !== closes) {
    colonEvents.forEach((x) => console.log('  C', x))
  }
}

import fs from 'fs'
import path from 'path'

const root = 'E:/个人/个人项目/expo/src/content/pages'
const slugs = `build-reference/android-builds
build-reference/apk
build-reference/app-extensions
build-reference/app-versions
build-reference/build-configuration
build-reference/build-with-monorepos
build-reference/caching
build-reference/easignore
build-reference/git-submodules
build-reference/infrastructure
build-reference/ios-builds
build-reference/ios-capabilities
build-reference/limitations
build-reference/local-builds
build-reference/npm-cache-with-yarn
build-reference/npm-hooks
build-reference/npx-testflight
build-reference/private-npm-packages
build-reference/repack
build-reference/simulators
build-reference/troubleshooting
build-reference/variants
build/automate-submissions
build/building-from-github
build/building-on-ci
build/eas-json
build/internal-distribution
build/introduction
build/orbit
build/setup
build/updates
submit/android
submit/android-manual
submit/eas-json
submit/ios
submit/ios-manual
submit/testflight
distribution/app-size
distribution/app-stores
distribution/app-transfers
distribution/introduction`.trim().split(/\n/)

const forbidden = [
  /^import /m,
  /export default/,
  /<Tabs>/,
  /<Tab /,
  /<TerminalBlock/,
  /<Collapsible/,
  /<Step /,
  /<APIInstallSection/,
  /<APISection/,
  /<SnackInline/,
  /<ContentSpotlight/,
  /\{\/\*/,
]

function dedentMarkers(text) {
  const lines = text.split('\n')
  let fence = false
  return lines.map((l) => {
    if (/^\s*```/.test(l)) fence = !fence
    if (!fence && /^\s+:::/.test(l)) return l.trimStart()
    return l
  }).join('\n')
}

const problems = []
for (const slug of slugs) {
  const p = path.join(root, slug + '.md')
  if (!fs.existsSync(p)) {
    problems.push('MISSING ' + slug)
    continue
  }
  let text = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n')
  const next = dedentMarkers(text)
  if (next !== text) {
    fs.writeFileSync(p, next)
    text = next
  }
  const zh = (text.match(/[\u4e00-\u9fff]/g) || []).length
  if (zh <= 80) problems.push('LOW_ZH ' + zh + ' ' + slug)
  if (text.length < 400) problems.push('SHORT ' + text.length + ' ' + slug)
  if (!/^---\n/.test(text)) problems.push('NO_FM ' + slug)
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/)
  if (!fm) problems.push('BAD_FM ' + slug)
  else {
    if (!/title:\s*\S/.test(fm[1])) problems.push('NO_TITLE ' + slug)
    if (!/description:\s*\S/.test(fm[1])) problems.push('NO_DESC ' + slug)
  }
  const body = text.replace(/^---\n[\s\S]*?\n---\n/, '')
  if (!body.trimStart().startsWith('# ')) problems.push('NO_H1 ' + slug)
  const fences = (text.match(/```/g) || []).length
  if (fences % 2 !== 0) problems.push('FENCE ' + fences + ' ' + slug)
  // ::: balance outside fences
  let inF = false
  let depth = 0
  for (const line of text.split('\n')) {
    if (/^\s*```/.test(line)) { inF = !inF; continue }
    if (inF) continue
    const t = line.trim()
    if (t === ':::') depth--
    else if (/^:::/.test(t)) depth++
    if (depth < 0) { problems.push('COLON_NEG ' + slug); break }
  }
  if (depth !== 0) problems.push('COLON ' + depth + ' ' + slug)
  const stripped = text.replace(/```[\s\S]*?```/g, '')
  for (const re of forbidden) {
    if (re.test(stripped)) problems.push('FORBIDDEN ' + re + ' ' + slug)
  }
}
console.log(problems.length ? problems.join('\n') : 'ALL_OK ' + slugs.length)

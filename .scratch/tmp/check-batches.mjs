import fs from 'fs'

const root = 'E:/个人/个人项目/expo'
const batches = [
  '.scratch/batches/b12-eas.txt',
  '.scratch/batches/b13-eas.txt',
  '.scratch/batches/b14-eas.txt',
]
let ok = 0
let skip = 0
const missing = []
const thin = []
for (const b of batches) {
  const text = fs.readFileSync(`${root}/${b}`, 'utf8')
  const slugs = text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
  for (const slug of slugs) {
    const p = `${root}/src/content/pages/${slug}.md`
    if (!fs.existsSync(p)) {
      missing.push(slug)
      continue
    }
    const body = fs.readFileSync(p, 'utf8')
    const zh = (body.match(/[\u4e00-\u9fff]/g) || []).length
    if (zh > 80) ok++
    else thin.push(`${slug} zh=${zh}`)
  }
  console.log(b, slugs.length)
}
console.log(JSON.stringify({ ok, missing, thin }, null, 2))

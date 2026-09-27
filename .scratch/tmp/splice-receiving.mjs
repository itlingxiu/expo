import fs from 'fs'

const s = fs.readFileSync(
  '.scratch/tmp/fetched/push-notifications__receiving-notifications.mdx',
  'utf8'
)
let blocks = [...s.matchAll(/```json\n([\s\S]*?)```/g)].map(m => m[1])
const map = {
  '// console.log(notification);': '// 打印 notification',
  '// console.log(notification.request.content.data);':
    '// 打印 notification.request.content.data',
}
blocks = blocks.map(b =>
  b
    .split('\n')
    .map(l => map[l] || l)
    .join('\n')
)
let out = fs.readFileSync('.scratch/tmp/receiving-skeleton.md', 'utf8')
blocks.forEach((b, i) => {
  out = out.replace('@@JSON' + (i + 1) + '@@', '```json\n' + b + '```')
})
if (out.includes('@@JSON')) throw new Error('placeholder left')
fs.writeFileSync(
  'src/content/pages/push-notifications/receiving-notifications.md',
  out.replace(/\r\n/g, '\n')
)
console.log('written', out.length)

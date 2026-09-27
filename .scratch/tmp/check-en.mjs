import fs from 'fs';
const files = [
  'versions/latest/sdk/ui/jetpack-compose/bottomsheet.md',
  'versions/latest/sdk/ui/jetpack-compose/textfield.md',
  'versions/latest/sdk/ui/jetpack-compose/modifiers.md',
  'versions/latest/sdk/ui/jetpack-compose/extending.md',
  'versions/latest/sdk/ui/swift-ui/bottomsheet.md',
  'versions/latest/sdk/ui/swift-ui/contextmenu.md',
  'versions/latest/sdk/ui/swift-ui/list.md',
  'versions/latest/sdk/ui/swift-ui/tabview.md',
  'versions/latest/sdk/ui/swift-ui/menu.md',
  'versions/latest/sdk/ui/swift-ui/text.md',
  'versions/latest/sdk/ui/swift-ui/textfield.md',
  'versions/latest/sdk/ui/swift-ui/extending.md',
  'versions/latest/sdk/ui/universal/bottomsheet.md',
  'versions/latest/sdk/ui/universal/host.md',
  'versions/latest/sdk/updates.md',
  'versions/latest/sdk/video.md',
  'versions/latest/sdk/widgets.md',
];
const root = 'E:/个人/个人项目/expo/src/content/pages/';
for (const f of files) {
  const lines = fs.readFileSync(root + f, 'utf8').split('\n');
  let fence = 0;
  const stack = [];
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const t = raw.trim();
    if (t.startsWith('```')) { fence = fence ? 0 : 1; continue; }
    if (fence) continue;
    if (t === ':::') {
      if (!stack.length) hits.push('extra close :::' + (i+1));
      else stack.pop();
    } else if (t.startsWith(':::')) stack.push(t + '@' + (i+1));
    const cn = (raw.match(/[\u4e00-\u9fff]/g) || []).length;
    const lat = (raw.match(/[A-Za-z]/g) || []).length;
    if (cn === 0 && lat > 40 && !t.startsWith('|') && !t.startsWith('- [') && !t.startsWith('[') && !t.startsWith('http') && !t.startsWith('**Android') && !t.startsWith('**iOS')) {
      hits.push((i+1) + ': ' + t.slice(0, 140));
    }
  }
  if (stack.length) hits.push('unclosed ' + stack.join(' | '));
  if (hits.length) console.log('\n' + f + '\n' + hits.join('\n'));
  else console.log('clean', f);
}

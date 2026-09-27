import fs from 'fs';

const slugs = [
  'versions/latest/sdk/ui/jetpack-compose/bottomsheet',
  'versions/latest/sdk/ui/jetpack-compose/textfield',
  'versions/latest/sdk/ui/jetpack-compose/modifiers',
  'versions/latest/sdk/ui/jetpack-compose/extending',
  'versions/latest/sdk/ui/swift-ui/bottomsheet',
  'versions/latest/sdk/ui/swift-ui/contextmenu',
  'versions/latest/sdk/ui/swift-ui/list',
  'versions/latest/sdk/ui/swift-ui/menu',
  'versions/latest/sdk/ui/swift-ui/tabview',
  'versions/latest/sdk/ui/swift-ui/text',
  'versions/latest/sdk/ui/swift-ui/textfield',
  'versions/latest/sdk/ui/swift-ui/extending',
  'versions/latest/sdk/ui/universal/bottomsheet',
  'versions/latest/sdk/ui/universal/host',
  'versions/latest/sdk/updates',
  'versions/latest/sdk/video',
  'versions/latest/sdk/widgets',
];

const root = 'E:/个人/个人项目/expo/src/content/pages/';
const failed = [];
for (const slug of slugs) {
  const p = root + slug + '.md';
  if (!fs.existsSync(p)) {
    failed.push(slug + ' MISSING');
    continue;
  }
  const text = fs.readFileSync(p, 'utf8');
  const cn = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const lines = text.split(/\n/);
  let fence = 0;
  let colons = 0;
  const english = [];
  let importLeak = false;
  let apiSection = false;
  for (const line of lines) {
    const t = line.trimStart();
    if (t.startsWith('```')) {
      fence = fence ? 0 : 1;
      continue;
    }
    if (fence) continue;
    if (t.startsWith(':::')) colons++;
    if (/^import\s/.test(t) || /^export\s/.test(t)) importLeak = true;
    if (t.includes('APISection') || t.includes('<Tabs') || t.includes('SnackInline') || t.includes('<Step')) apiSection = true;
    if (/^(The |This |You |Use |When |If |A |An |To |On |For |Set |Pass |Each |Here |Most |Built |Creates |Widgets |Live |Send |Remote )/.test(t) && !t.startsWith('> 支持')) {
      english.push(t.slice(0, 120));
    }
  }
  const issues = [];
  if (cn <= 80) issues.push('cn=' + cn);
  if (fence) issues.push('unclosed-fence');
  if (colons % 2) issues.push('odd-:::=' + colons);
  if (!text.startsWith('---\n')) issues.push('no-fm');
  if (!/^title: .+\ndescription: .+\n---\n\n# /s.test(text) && !/^---\r?\ntitle:/.test(text)) {
    /* checked below */
  }
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (fm) {
    const keys = fm[1].split('\n').map(l => l.split(':')[0]);
    if (keys.some(k => k !== 'title' && k !== 'description')) issues.push('extra-fm:' + keys.join(','));
  }
  if (importLeak) issues.push('import');
  if (apiSection) issues.push('mdx');
  if (english.length) issues.push('en:' + english.length);
  if (issues.length) failed.push(slug + ' | ' + issues.join(' | ') + (english.length ? '\n  ' + english.slice(0, 8).join('\n  ') : '') + ' cn=' + cn);
  else console.log('OK', slug, cn);
}
console.log('---FAILED---');
console.log(failed.join('\n') || 'none');

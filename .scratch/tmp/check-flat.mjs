import fs from 'fs';
import path from 'path';

const root = 'E:/个人/个人项目/expo';
const dir = path.join(root, '.scratch/tmp/flat');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
const bad = [];
const tagRe = /<(APISection|APIInstallSection|ComponentExample|ContentSpotlight|PlatformSpotlight|PlatformTabsGroup|Collapsible|Terminal|SnackInline|Tabs>|Tab |Step |ConfigPlugin|Prerequisites|Requirement|BoxLink|VideoBoxLink|YesIcon|NoIcon|PlatformTags|CODE)\b/;
for (const f of files) {
  const t = fs.readFileSync(path.join(dir, f), 'utf8');
  const fences = (t.match(/```/g) || []).length;
  const issues = [];
  if (fences % 2) issues.push('fences=' + fences);
  if (tagRe.test(t)) issues.push('tag');
  if (t.includes('import ')) issues.push('import');
  if (t.includes('{/*')) issues.push('mdx-comment');
  if (t.includes('__INSTALL__')) issues.push('install');
  const tabs = (t.match(/^:::tabs/gm) || []).length;
  const tabClose = (t.match(/^:::$/gm) || []).length;
  if (t.includes(':::') && tabs * 2 > tabClose) issues.push('tabs ' + tabs + '/' + tabClose);
  if (issues.length) bad.push(f + ' ' + issues.join(','));
}
console.log('files', files.length, 'bad', bad.length);
for (const b of bad) console.log(b);

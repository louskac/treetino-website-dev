import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const unlocalized = [];

walkDir('/Users/jakub/Projects/treetino-website-dev/resources/js', (filePath) => {
  if (!filePath.endsWith('.vue')) return;
  const content = fs.readFileSync(filePath, 'utf8');

  // Regex to look for template text that might not be wrapped in $t
  // Check for common hardcoded English/Czech strings in tags like <h1-6>, <p>, <span>, <button>, <a/Link>, <label>
  const tagRegex = /<(h[1-6]|p|span|button|Link|FooterLink|a|label|div)[^>]*>([^<{}]+)<\/\1>/g;
  let match;
  while ((match = tagRegex.exec(content)) !== null) {
    const text = match[2].trim();
    if (text && text.length > 2 && !/^\d+$/.test(text) && !/^(&copy;|€|\$|%|\+|-|\/|&mdash;|•)+$/.test(text)) {
      unlocalized.push({
        file: path.relative('/Users/jakub/Projects/treetino-website-dev/resources/js', filePath),
        text
      });
    }
  }
});

console.log(`Found ${unlocalized.length} potential hardcoded text instances:`);
unlocalized.slice(0, 50).forEach(item => {
  console.log(`[${item.file}]: "${item.text}"`);
});

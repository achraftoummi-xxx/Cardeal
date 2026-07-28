const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'apps', 'client', 'data', 'carBrands.ts');
const backupPath = filePath + '.bak';

const src = fs.readFileSync(filePath, 'utf8');
fs.writeFileSync(backupPath, src);

const lines = src.split(/\r?\n/);
const keyRegex = /^\s*"([^"]+)":\s*\[/;
const seen = new Set();
const out = [];
let i = 0;
while (i < lines.length) {
  const line = lines[i];
  const m = line.match(keyRegex);
  if (m) {
    const key = m[1];
    if (seen.has(key)) {
      // skip this block until closing '],' at same nesting
      let depth = 0;
      // consume lines starting from this
      while (i < lines.length) {
        const l = lines[i];
        for (const ch of l) {
          if (ch === '[') depth++;
          if (ch === ']') depth--;
        }
        i++;
        if (depth <= 0 && l.trim().endsWith('],')) break;
      }
      // continue without adding
      continue;
    } else {
      seen.add(key);
      out.push(line);
      i++;
      continue;
    }
  }
  out.push(line);
  i++;
}

fs.writeFileSync(filePath, out.join('\n'));
console.log('Rewrote', filePath, '- kept', seen.size, 'unique brands. Backup at', backupPath);

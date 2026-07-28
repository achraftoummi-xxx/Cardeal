const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'apps', 'client', 'data', 'carBrands.ts');
const backupPath = filePath + '.models.bak';
const src = fs.readFileSync(filePath, 'utf8');
fs.writeFileSync(backupPath, src);

const brandBlockRegex = /"([^"]+)":\s*\[((?:.|\n)*?)\],/g;
let out = src;
let m;
const changes = [];
while ((m = brandBlockRegex.exec(src)) !== null) {
  const brand = m[1];
  const content = m[2];
  const modelRegex = /"([^"]+)"/g;
  const seen = new Set();
  const uniqueModels = [];
  let mm;
  while ((mm = modelRegex.exec(content)) !== null) {
    const model = mm[1];
    if (!seen.has(model)) {
      seen.add(model);
      uniqueModels.push(`    "${model}",`);
    }
  }
  // remove trailing comma on last
  if (uniqueModels.length) {
    uniqueModels[uniqueModels.length - 1] = uniqueModels[uniqueModels.length - 1].replace(/,$/, '');
  }
  const replacement = `"${brand}": [\n${uniqueModels.join('\n')}\n  ],`;
  if (replacement !== m[0]) {
    out = out.replace(m[0], replacement);
    changes.push(brand);
  }
}

fs.writeFileSync(filePath, out);
console.log('Deduped models for', changes.length, 'brands. Backup at', backupPath);

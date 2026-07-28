const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'apps', 'client', 'data', 'carBrands.ts');
const src = fs.readFileSync(filePath, 'utf8');
const lines = src.split(/\r?\n/);

const keyRegex = /^\s*"([^"]+)":/;
const brandMap = new Map();
const duplicates = [];

lines.forEach((line, idx) => {
  const m = line.match(keyRegex);
  if (m) {
    const key = m[1];
    if (brandMap.has(key)) {
      duplicates.push({ key, first: brandMap.get(key), second: idx + 1 });
    } else {
      brandMap.set(key, idx + 1);
    }
  }
});

console.log('Found', brandMap.size, 'unique brand keys');
if (duplicates.length) {
  console.log('Duplicate brand keys:');
  duplicates.forEach(d => console.log(`  ${d.key}: first at line ${d.first}, duplicate at line ${d.second}`));
} else {
  console.log('No duplicate brand keys found.');
}

// Now check duplicate model names within each brand
const brandBlockRegex = /"([^"]+)":\s*\[((?:.|\n)*?)\],/g;
const modelDuplicates = [];
let m;
while ((m = brandBlockRegex.exec(src)) !== null) {
  const brand = m[1];
  const content = m[2];
  // find strings in content
  const modelRegex = /"([^"]+)"/g;
  const seen = new Map();
  let mm;
  while ((mm = modelRegex.exec(content)) !== null) {
    const model = mm[1];
    const pos = mm.index + m.index; // approximate position
    if (seen.has(model)) {
      modelDuplicates.push({ brand, model });
    } else {
      seen.set(model, true);
    }
  }
}

if (modelDuplicates.length) {
  console.log('\nDuplicate model entries found across brands:');
  modelDuplicates.forEach(d => console.log(`  Brand: ${d.brand} - Model: ${d.model}`));
} else {
  console.log('No duplicate model entries within brands.');
}

// Exit with non-zero code if duplicates found
if (duplicates.length || modelDuplicates.length) process.exitCode = 2;

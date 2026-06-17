// scripts/merge-reports.js
const fs = require('fs');
const path = require('path');

const out = path.resolve('reports', 'cucumber.json');
const aPath = path.resolve('reports', 'cucumber-login.json');
const bPath = path.resolve('reports', 'cucumber-rest.json');

function readJson(p) {
  if (!fs.existsSync(p)) return [];
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return []; }
}

const a = readJson(aPath);
const b = readJson(bPath);
const merged = Array.isArray(a) && Array.isArray(b) ? a.concat(b) : (a || b || []);

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(merged, null, 2), 'utf8');
console.log('Merged reports to', out);
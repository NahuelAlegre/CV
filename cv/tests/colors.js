import fs from 'fs';
import path from 'path';

const banned = ['purple', '#8a2be2', '#800080'];
let ok = true;
function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry);
    const stat = fs.statSync(p);
    if (stat.isDirectory() && !['node_modules','dist','tests'].includes(entry)) {
      walk(p);
    } else if (stat.isFile()) {
      const content = fs.readFileSync(p, 'utf8').toLowerCase();
      for (const b of banned) {
        if (content.includes(b)) {
          console.error(`Color prohibido ${b} en ${p}`);
          ok = false;
        }
      }
      const hslMatches = content.match(/hsl\((\d+)/gi) || [];
      hslMatches.forEach(m => {
        const hue = parseInt(m.match(/\d+/)[0], 10);
        if (hue >= 260 && hue <= 300) {
          console.error(`Hue prohibido ${hue} en ${p}`);
          ok = false;
        }
      });
    }
  }
}
walk('.');
if (!ok) {
  process.exit(1);
} else {
  console.log('Sin colores prohibidos');
}

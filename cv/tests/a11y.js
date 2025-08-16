import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;
let ok = true;
if (!doc.documentElement.getAttribute('lang')) {
  console.error('Falta atributo lang en <html>');
  ok = false;
}
['header','main','footer'].forEach(tag => {
  if (!doc.querySelector(tag)) {
    console.error(`Falta elemento <${tag}>`);
    ok = false;
  }
});
if (ok) {
  console.log('Checklist de accesibilidad pasada');
} else {
  process.exit(1);
}

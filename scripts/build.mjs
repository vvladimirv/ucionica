// Sastavi stranicu artefakta iz src/ u dist/index.html.
// Stranica je fragment bez <html>/<head>/<body>: servis je pri objavi sam omota.
// Moduli iz src/js se spajaju po abecedi imena fajla, pa broj na početku imena određuje redoslijed:
//   0x izvršavanje i prikaz koda · 1x lekcije Python · 2x JavaScript · 3x SQL · 40 teme
//   5x napredak, koraci, tutor, prikaz tema · 59 start (zadnji)
// Lekcije (LEKCIJE_*) moraju biti prije 50-napredak-navigacija.js, koji iz njih pravi meni.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const SRC = join(ROOT, 'src');
export const DIST = join(ROOT, 'dist');

export const moduli = () => readdirSync(join(SRC, 'js')).filter(f => f.endsWith('.js')).sort();

const procitaj = p => readFileSync(join(SRC, p), 'utf8');

export function sastavi() {
  return procitaj('head.html')
    + '<style>\n' + procitaj('stil.css') + '</style>\n'
    + procitaj('tijelo.html')
    + '<script>\n' + moduli().map(m => `// ---- ${m} ----\n` + procitaj(join('js', m))).join('') + '</script>\n';
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const html = sastavi();
  mkdirSync(DIST, { recursive: true });
  writeFileSync(join(DIST, 'index.html'), html);
  console.log(`dist/index.html · ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB · ${moduli().length} modula`);
}

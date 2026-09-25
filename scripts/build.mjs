// Sastavi stranicu artefakta iz src/ u dist/index.html.
// Stranica je fragment bez <html>/<head>/<body>: servis je pri objavi sam omota.
// Redoslijed modula je bitan: lekcije (LEKCIJE_*) moraju biti prije 03-napredak-navigacija.js,
// koji iz njih pravi meni, a 07-start.js mora biti zadnji.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const SRC = join(ROOT, 'src');
export const DIST = join(ROOT, 'dist');

export const MODULI = [
  '01-izvrsavanje.js',
  '02-kod-prikaz.js',
  '10-lekcije-py-a.js',
  '11-lekcije-py-b.js',
  '12-lekcije-py-c.js',
  '13-lekcije-py-d.js',
  'teme.js',
  '03-napredak-navigacija.js',
  '04-koraci.js',
  '05-tutor.js',
  '06-teme-prikaz.js',
  '07-start.js',
];

const procitaj = p => readFileSync(join(SRC, p), 'utf8');

export function sastavi() {
  return procitaj('head.html')
    + '<style>\n' + procitaj('stil.css') + '</style>\n'
    + procitaj('tijelo.html')
    + '<script>\n' + MODULI.map(m => `// ---- ${m} ----\n` + procitaj(join('js', m))).join('') + '</script>\n';
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const html = sastavi();
  mkdirSync(DIST, { recursive: true });
  writeFileSync(join(DIST, 'index.html'), html);
  console.log(`dist/index.html · ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB · ${MODULI.length} modula`);
}

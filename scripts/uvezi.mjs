// Rastavi objavljeni index.html artefakta na izvorne fajlove u src/ (obrnuto od build.mjs).
// Koristi se kad je stranica mijenjana van repozitorija:
//   1) Artifact tool: action "read" → snimi HTML u fajl
//   2) node scripts/uvezi.mjs <snimljeni.html>
//   3) git diff — pregledaj šta je stiglo
// Skripta na kraju sastavi stranicu iz src/ i provjeri da je identična ulazu.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { sastavi, MODULI, SRC } from './build.mjs';

const ulaz = process.argv[2];
if (!ulaz) { console.error('Upotreba: node scripts/uvezi.mjs <snimljeni-artefakt.html>'); process.exit(2); }

// Servis pri objavi omota stranicu u <!doctype html>…<body> (prva linija) i \n</body></html> na kraju.
function skiniOmotac(t) {
  if (t.startsWith('<!doctype html>')) t = t.slice(t.indexOf('\n') + 1);
  if (t.endsWith('\n</body></html>')) t = t.slice(0, -'\n</body></html>'.length);
  return t;
}

function izmedju(t, od, do_, poc = 0) {
  const a = t.indexOf(od, poc); if (a < 0) throw new Error(`Nema oznake ${JSON.stringify(od)}`);
  const b = t.indexOf(do_, a + od.length); if (b < 0) throw new Error(`Nema oznake ${JSON.stringify(do_)}`);
  return { tekst: t.slice(a + od.length, b), kraj: b + do_.length, pocetak: a };
}

const html = skiniOmotac(readFileSync(ulaz, 'utf8'));
const stil = izmedju(html, '<style>\n', '</style>\n');
const head = html.slice(0, stil.pocetak);
const skripta = izmedju(html, '<script>\n', '</script>\n', stil.kraj);
const tijelo = html.slice(stil.kraj, skripta.pocetak);
if (html.slice(skripta.kraj) !== '') throw new Error('Neočekivan sadržaj poslije </script>');

// JS je niz modula; svaki počinje linijom "// ---- ime.js ----".
const dijelovi = skripta.tekst.split(/^\/\/ ---- (\S+) ----\n/m);
if (dijelovi[0] !== '') throw new Error('Skripta ne počinje oznakom modula');
const moduli = [];
for (let i = 1; i < dijelovi.length; i += 2) moduli.push({ ime: dijelovi[i], tekst: dijelovi[i + 1] });

const imena = moduli.map(m => m.ime);
const nepoznati = imena.filter(n => !MODULI.includes(n));
const nedostaju = MODULI.filter(n => !imena.includes(n));
if (nepoznati.length || nedostaju.length || imena.join() !== MODULI.join()) {
  console.error('Redoslijed ili spisak modula se razlikuje od MODULI u build.mjs:');
  console.error('  u stranici:', imena.join(', '));
  console.error('  u build.mjs:', MODULI.join(', '));
  console.error('Uskladi MODULI pa pokreni ponovo.');
  process.exit(1);
}

mkdirSync(join(SRC, 'js'), { recursive: true });
writeFileSync(join(SRC, 'head.html'), head);
writeFileSync(join(SRC, 'stil.css'), stil.tekst);
writeFileSync(join(SRC, 'tijelo.html'), tijelo);
for (const m of moduli) writeFileSync(join(SRC, 'js', m.ime), m.tekst);

const ponovo = sastavi();
if (ponovo !== html) { console.error('GREŠKA: stranica sastavljena iz src/ nije identična ulazu.'); process.exit(1); }
console.log(`Uvezeno: head, stil, tijelo i ${moduli.length} modula. Build iz src/ je identičan ulazu (${html.length} znakova).`);

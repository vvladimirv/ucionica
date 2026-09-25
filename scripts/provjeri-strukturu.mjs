// Brza provjera podataka lekcija (bez preglednika): obavezna polja po vrsti koraka, opsezi indeksa,
// broj praznina, jedinstveni id-jevi i uparene HTML oznake u poljima koja idu kroz innerHTML.
// Upotreba: node scripts/provjeri-strukturu.mjs   (izlaz 1 ako ima grešaka)
import { fileURLToPath } from 'node:url';
import { ucitajLekcije, jezikKoraka } from './lib/lekcije.mjs';

// Polja po vrsti koraka; ista šema je opisana na vrhu src/js/04-koraci.js.
const ZAJEDNICKA = ['naslov', 'jezik', 'setup'];
export const SHEMA = {
  tekst: { obavezno: ['html'], moguce: [] },
  primjer: { obavezno: ['kod'], moguce: ['uvod', 'obj', 'poslije', 'bezPokretanja'] },
  predvidi: { obavezno: ['kod', 'opcije', 't', 'obj'], moguce: ['pitanje'] },
  popuni: { obavezno: ['kod', 'odg', 'obj'], moguce: ['pitanje', 'pokreni'] },
  poredaj: { obavezno: ['linije', 'obj'], moguce: ['pitanje', 'pokreni'] },
  greska: { obavezno: ['kod', 'linija', 'obj'], moguce: ['pitanje', 'ispravno'] },
  zadatak: { obavezno: ['opis', 'pocetak', 'testovi', 'rjesenje'], moguce: ['nagovjestaji', 'objRj', 'poslije'] },
  kviz: { obavezno: ['p', 'o', 't', 'e'], moguce: [] },
};
// Polja koja se ubacuju kao HTML (moraju imati uparene oznake) i polja koja se escape-uju (ne smiju imati oznake).
const HTML_POLJA = ['html', 'uvod', 'poslije', 'pitanje', 'obj', 'opis', 'objRj'];
const TEKST_POLJA = ['p', 'e', 'naslov'];
const JEZICI = ['python', 'js', 'dom', 'sql'];
const PRAZNE = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'wbr', 'source']);

export function provjeriHtml(html) {
  const greske = [];
  const stek = [];
  for (const m of String(html).matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g)) {
    const [, zatv, tag0, samoZatv] = m; const tag = tag0.toLowerCase();
    if (PRAZNE.has(tag) || samoZatv) continue;
    if (!zatv) stek.push(tag);
    else if (stek.at(-1) === tag) stek.pop();
    else { greske.push(`</${tag}> bez otvorene oznake (otvoreno: ${stek.join(' > ') || 'ništa'})`); break; }
  }
  if (stek.length) greske.push(`neuparene oznake: <${stek.join('>, <')}>`);
  return greske;
}

export function provjeriStrukturu() {
  const { dijelovi, teme } = ucitajLekcije();
  const greske = [], upozorenja = [], ids = new Set();
  let brojKoraka = 0;
  for (const d of dijelovi) for (const [li, lek] of d.lekcije.entries()) {
    const gdje0 = `${d.id}/${lek.id || '?'}`;
    for (const p of ['id', 'naslov', 'cilj', 'koraci']) if (!lek[p]) greske.push(`${gdje0}: lekcija nema polje ${p}`);
    if (ids.has(lek.id)) greske.push(`${gdje0}: id lekcije se ponavlja`); ids.add(lek.id);
    if (lek.id && !lek.id.startsWith(d.id)) upozorenja.push(`${gdje0}: id lekcije ne počinje sa "${d.id}"`);
    for (const [k, s] of (lek.koraci || []).entries()) {
      brojKoraka++;
      const gdje = `${gdje0} korak ${k + 1} (${s.tip})`;
      const sh = SHEMA[s.tip];
      if (!sh) { greske.push(`${gdje}: nepoznata vrsta koraka`); continue; }
      for (const p of sh.obavezno) if (s[p] === undefined || s[p] === '') greske.push(`${gdje}: nedostaje ${p}`);
      for (const p of Object.keys(s)) if (p !== 'tip' && !sh.obavezno.includes(p) && !sh.moguce.includes(p) && !ZAJEDNICKA.includes(p)) greske.push(`${gdje}: nepoznato polje ${p}`);
      const jezik = jezikKoraka(s);
      if (!JEZICI.includes(jezik)) greske.push(`${gdje}: nepoznat jezik ${jezik}`);
      if (s.setup && jezik !== 'sql' && jezik !== 'dom') greske.push(`${gdje}: setup ima smisla samo za sql i dom`);
      const linija = s.kod ? s.kod.split('\n').length : 0;
      if ((s.tip === 'predvidi' || s.tip === 'kviz')) {
        const opc = s.opcije || s.o || [];
        if (!Array.isArray(opc) || opc.length < 2) greske.push(`${gdje}: treba bar 2 opcije`);
        if (!Number.isInteger(s.t) || s.t < 0 || s.t >= opc.length) greske.push(`${gdje}: t=${s.t} nije indeks opcije (0–${opc.length - 1})`);
        if (new Set(opc).size !== opc.length) greske.push(`${gdje}: opcije se ponavljaju`);
      }
      if (s.tip === 'primjer' && s.obj) for (const n of Object.keys(s.obj)) if (!(Number(n) >= 1 && Number(n) <= linija)) greske.push(`${gdje}: objašnjenje za liniju ${n}, a kod ima ${linija} linija`);
      if (s.tip === 'greska' && !(Number.isInteger(s.linija) && s.linija >= 1 && s.linija <= linija)) greske.push(`${gdje}: linija ${s.linija} nije u kodu (1–${linija})`);
      if (s.tip === 'popuni') {
        const praznina = (s.kod.match(/___/g) || []).length;
        if (praznina !== (s.odg || []).length) greske.push(`${gdje}: ${praznina} praznina, a ${(s.odg || []).length} grupa odgovora`);
        for (const [i, g] of (s.odg || []).entries()) if (!Array.isArray(g) || !g.length || g.some(x => typeof x !== 'string' || !x.trim())) greske.push(`${gdje}: odg[${i}] mora biti neprazan niz tekstova`);
      }
      if (s.tip === 'poredaj' && (!Array.isArray(s.linije) || s.linije.length < 3)) greske.push(`${gdje}: poredaj treba bar 3 linije`);
      if (s.tip === 'poredaj' && new Set(s.linije).size !== s.linije.length) upozorenja.push(`${gdje}: iste linije se ponavljaju (više tačnih redoslijeda, a prihvata se samo jedan)`);
      if (s.tip === 'zadatak') {
        if (!Array.isArray(s.testovi) || !s.testovi.length) greske.push(`${gdje}: zadatak nema testove`);
        for (const [i, t] of (s.testovi || []).entries()) if (!t.opis || !(t.kod || t.upit !== undefined || t.ocekivano)) greske.push(`${gdje}: test ${i + 1} nema opis ili provjeru`);
      }
      // HTML u poljima koja idu kroz innerHTML
      for (const p of HTML_POLJA) {
        const vr = s[p]; if (vr === undefined) continue;
        const vrijednosti = p === 'obj' && typeof vr === 'object' ? Object.values(vr) : [vr];
        for (const v of vrijednosti) for (const g of provjeriHtml(v)) greske.push(`${gdje}: ${p}: ${g}`);
      }
      for (const v of s.nagovjestaji || []) for (const g of provjeriHtml(v)) greske.push(`${gdje}: nagovještaj: ${g}`);
      for (const p of TEKST_POLJA) if (typeof s[p] === 'string' && /<\/?[a-z][^>]*>/i.test(s[p])) greske.push(`${gdje}: ${p} se prikazuje kao običan tekst, a sadrži HTML oznaku`);
      if (s.tip === 'kviz') for (const o of s.o || []) if (/<\/?[a-z][^>]*>/i.test(o)) greske.push(`${gdje}: opcija kviza sadrži HTML oznaku (prikazuje se kao tekst)`);
    }
  }
  for (const m of teme) for (const p of ['id', 'naslov', 'ideja', 'kod', 'greske', 'kviz', 'vjezba', 'agent']) if (!m[p]) greske.push(`tema ${m.id}: nema ${p}`);
  return { greske, upozorenja, brojKoraka, brojLekcija: dijelovi.reduce((a, d) => a + d.lekcije.length, 0), brojTema: teme.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = provjeriStrukturu();
  for (const u of r.upozorenja) console.log('upozorenje · ' + u);
  for (const g of r.greske) console.log('GREŠKA · ' + g);
  console.log(`${r.brojLekcija} lekcija · ${r.brojKoraka} koraka · ${r.brojTema} tema · ${r.greske.length} grešaka · ${r.upozorenja.length} upozorenja`);
  process.exit(r.greske.length ? 1 : 0);
}

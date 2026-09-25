// Sve provjere redom: struktura (bez preglednika) → izvršavanje → UI → telefon.
// Upotreba: npm test            (sve)
//           npm test -- js3     (samo lekcija js3: struktura + izvršavanje + UI)
import { provjeriStrukturu } from './provjeri-strukturu.mjs';
import { provjeriIzvrsavanje } from './provjeri-izvrsavanje.mjs';
import { provjeriUi, provjeriTelefon } from './provjeri-ui.mjs';
import { otvoriUcionicu } from './lib/preglednik.mjs';

const filter = process.argv.slice(2);
const t0 = Date.now();
const ispisi = (naslov, greske, upozorenja = []) => {
  for (const x of upozorenja) console.log(`  upozorenje · ${x}`);
  for (const x of greske) console.log(`  GREŠKA · ${x}`);
  console.log(`${greske.length ? '✗' : '✓'} ${naslov}`);
};

const s = provjeriStrukturu();
ispisi(`struktura: ${s.brojLekcija} lekcija, ${s.brojKoraka} koraka, ${s.brojTema} tema`, s.greske, s.upozorenja);
if (s.greske.length) process.exit(1);

const u = await otvoriUcionicu();
let greske = 0;
try {
  const iz = await provjeriIzvrsavanje(u, filter);
  ispisi(`izvršavanje: ${iz.provjereno} provjera`, iz.greske, iz.upozorenja);
  const ui = await provjeriUi(u, filter);
  ispisi('UI: svi koraci kao učenik' + (filter.length ? '' : ', teme, rječnik'), ui.greske);
  const stranica = u.greskeStranice;
  if (stranica.length) ispisi('greške stranice (konzola)', stranica);
  greske = iz.greske.length + ui.greske.length + stranica.length;
} finally { await u.zatvori(); }
if (!filter.length) { const t = await provjeriTelefon(); ispisi('telefon (390 px): bez vodoravnog pomjeranja', t.greske); greske += t.greske.length; }
console.log(`${greske ? 'PALO' : 'SVE PROŠLO'} · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
process.exit(greske ? 1 : 0);

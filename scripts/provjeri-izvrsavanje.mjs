// Izvršna provjera sadržaja u pravom pregledniku (Chromium), kroz iste runnere koje koristi učenik:
//   primjer  → kod se izvrši bez greške (osim bezPokretanja)
//   predvidi → izlaz koda odgovara tačnoj opciji (" · " u opciji = novi red)
//   popuni   → kod sa prvim prihvaćenim odgovorima radi;   poredaj → tačan redoslijed radi
//   greska   → kod zaista pada (i, ako se zna, na označenoj liniji); ispravno → radi
//   zadatak  → rješenje prolazi sve testove, a početni kod ne
// Upotreba: node scripts/provjeri-izvrsavanje.mjs [id-lekcije …]
import { fileURLToPath } from 'node:url';
import { ucitajLekcije, jezikKoraka } from './lib/lekcije.mjs';
import { otvoriUcionicu } from './lib/preglednik.mjs';

export const normIzlaz = out => String(out || '').replace(/\n+$/, '').split('\n').map(l => l.replace(/\s+$/, '')).join(' · ');

async function pokreni(page, jezik, kod, testovi, setup) {
  const posao = page.evaluate(async ([jezik, kod, testovi, setup]) => {
    const r = await RUN[jezik](kod, testovi || [], setup);
    return r && { ok: r.ok, out: r.out, err: r.err, errType: r.errType, errLine: r.errLine ?? null, tests: r.tests, tabele: r.tabele };
  }, [jezik, kod, testovi, setup]);
  const rok = new Promise((_, rej) => setTimeout(() => rej(new Error('isteklo 30 s')), 30000));
  return Promise.race([posao, rok]);
}

export async function provjeriIzvrsavanje(u, filter = []) {
  const { dijelovi } = ucitajLekcije();
  const greske = [], upozorenja = [];
  let provjereno = 0;
  const { page } = u;
  await page.evaluate(() => loadPy());
  for (const d of dijelovi) for (const lek of d.lekcije) {
    if (filter.length && !filter.includes(lek.id)) continue;
    for (const [k, s] of lek.koraci.entries()) {
      const gdje = `${lek.id} korak ${k + 1} (${s.tip})`;
      const jezik = jezikKoraka(s);
      const run = (kod, testovi) => pokreni(page, jezik, kod, testovi, s.setup);
      const opisGreske = r => r ? (r.err || 'nema greške') : 'runner nije dostupan';
      try {
        if (s.tip === 'primjer' && !s.bezPokretanja) {
          const r = await run(s.kod); provjereno++;
          if (!r || !r.ok) greske.push(`${gdje}: primjer pada — ${opisGreske(r)}`);
        } else if (s.tip === 'predvidi') {
          const r = await run(s.kod); provjereno++;
          const tacna = s.opcije[s.t];
          if (!r) greske.push(`${gdje}: runner nije dostupan`);
          else if (!r.ok) { if (!/greš/i.test(tacna)) greske.push(`${gdje}: kod pada (${r.err}), a tačna opcija je "${tacna}"`); }
          else if (s.opcijeSu !== 'opis') {
            const izlaz = jezik === 'sql' ? (r.tabele || []).map(t => t.rows.map(row => row.join(', ')).join(' · ')).join(' · ') : normIzlaz(r.out);
            const ok = izlaz === tacna.trim() || (izlaz === '' && /^ništa/i.test(tacna));
            if (!ok) greske.push(`${gdje}: izlaz "${izlaz}" ≠ tačna opcija "${tacna}"`);
            const iste = s.opcije.filter((o, i) => i !== s.t && o.trim() === izlaz);
            if (iste.length) greske.push(`${gdje}: i netačna opcija odgovara izlazu: "${iste[0]}"`);
          }
        } else if (s.tip === 'popuni' && s.pokreni !== false) {
          let i = 0; const kod = s.kod.replace(/___/g, () => s.odg[i++][0]);
          const r = await run(kod); provjereno++;
          if (!r || !r.ok) greske.push(`${gdje}: kod sa rješenjima praznina pada — ${opisGreske(r)}`);
        } else if (s.tip === 'poredaj' && s.pokreni !== false) {
          const r = await run(s.linije.join('\n')); provjereno++;
          if (!r || !r.ok) greske.push(`${gdje}: tačan redoslijed pada — ${opisGreske(r)}`);
        } else if (s.tip === 'greska') {
          const r = await run(s.kod); provjereno++;
          if (!r) greske.push(`${gdje}: runner nije dostupan`);
          else if (r.ok) greske.push(`${gdje}: kod "sa greškom" se izvršava bez greške`);
          else if (r.errLine != null && r.errLine !== s.linija) upozorenja.push(`${gdje}: greška se prijavljuje na liniji ${r.errLine}, tačan odgovor je ${s.linija} (${r.err})`);
          if (s.ispravno) { const r2 = await run(s.ispravno); if (!r2 || !r2.ok) greske.push(`${gdje}: ispravljeni kod pada — ${opisGreske(r2)}`); }
        } else if (s.tip === 'zadatak') {
          const r = await run(s.rjesenje, s.testovi); provjereno++;
          if (!r) greske.push(`${gdje}: runner nije dostupan`);
          else if (!r.ok) greske.push(`${gdje}: rješenje pada — ${r.err}`);
          else r.tests.forEach((t, i) => { if (!t.ok) greske.push(`${gdje}: rješenje ne prolazi test "${s.testovi[i].opis}" — ${t.m}`); });
          const p = await run(s.pocetak, s.testovi);
          if (p && p.ok && p.tests.length && p.tests.every(t => t.ok)) upozorenja.push(`${gdje}: početni kod već prolazi sve testove`);
        }
      } catch (e) { greske.push(`${gdje}: provjera nije uspjela — ${e.message}`); }
    }
  }
  return { greske, upozorenja, provjereno };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const u = await otvoriUcionicu();
  const t0 = Date.now();
  const r = await provjeriIzvrsavanje(u, process.argv.slice(2));
  for (const x of r.upozorenja) console.log('upozorenje · ' + x);
  for (const x of r.greske) console.log('GREŠKA · ' + x);
  for (const x of u.greskeStranice) console.log('GREŠKA STRANICE · ' + x);
  console.log(`izvršeno ${r.provjereno} provjera za ${((Date.now() - t0) / 1000).toFixed(1)} s · ${r.greske.length} grešaka · ${r.upozorenja.length} upozorenja`);
  await u.zatvori();
  process.exit(r.greske.length || u.greskeStranice.length ? 1 : 0);
}

// UI provjera: prođi svaki korak svake lekcije kao učenik (klikni tačan odgovor, upiši rješenje,
// pokreni), pa teme, rječnik i prikaz na telefonu. Pada na svaku grešku stranice ili koraka.
// Upotreba: node scripts/provjeri-ui.mjs [id-lekcije …]
import { fileURLToPath } from 'node:url';
import { ucitajLekcije } from './lib/lekcije.mjs';
import { otvoriUcionicu } from './lib/preglednik.mjs';

const ROK = { timeout: 30000 };

async function korak(page, lek, k, s) {
  await page.evaluate(([id, k]) => go(`lek:${id}:${k}`), [lek.id, k]);
  await page.waitForSelector('#step');
  const ceka = sel => page.waitForSelector(sel, ROK);
  // Pokretanje je gotovo kad korak zapamti rezultat (stepState.last postavlja pokreni()).
  const izlazGotov = () => page.waitForFunction(() => !!stepState.last, null, ROK);
  switch (s.tip) {
    case 'predvidi': case 'kviz':
      await page.click(`#step [data-o="${s.t}"]`); await ceka('#step .fb.ok'); break;
    case 'popuni': case 'poredaj':
      await page.click('#step #show'); await ceka('#step .fb.ok');
      if (s.pokreni !== false) await izlazGotov();
      break;
    case 'greska':
      await page.click(`#step .ln[data-ln="${s.linija}"]`); await ceka('#step .fb.ok'); break;
    case 'primjer':
      await page.click('#step .ln[data-ln="1"]');
      if (!s.bezPokretanja) {
        await page.click('#step #run'); await izlazGotov();
        const err = await page.$eval('#res', el => el.querySelector('.err')?.textContent || '');
        if (err) throw new Error('primjer ispisuje grešku: ' + err);
      }
      break;
    case 'zadatak': {
      await page.fill('#step #ed2', s.rjesenje);
      await page.click('#step #run');
      await page.waitForFunction(n => document.querySelectorAll('#tests .test.ok').length === n || document.querySelector('#tests .test.no'), s.testovi.length, ROK);
      const pali = await page.$$eval('#tests .test.no', els => els.map(e => e.textContent));
      if (pali.length) throw new Error('rješenje ne prolazi u UI-ju: ' + pali.join(' | '));
      break;
    }
  }
}

export async function provjeriUi(u, filter = []) {
  const { dijelovi, teme } = ucitajLekcije();
  const greske = [];
  const { page } = u;
  await page.evaluate(() => { try { localStorage.clear(); } catch (_) {} P.data = { lekcije: {}, teme: {}, zadnje: null }; });
  for (const d of dijelovi) for (const lek of d.lekcije) {
    if (filter.length && !filter.includes(lek.id)) continue;
    for (const [k, s] of lek.koraci.entries()) {
      const prije = u.greskeStranice.length;
      try { await korak(page, lek, k, s); } catch (e) { greske.push(`${lek.id} korak ${k + 1} (${s.tip}): ${e.message.split('\n')[0]}`); }
      if (u.greskeStranice.length > prije) greske.push(`${lek.id} korak ${k + 1}: greška stranice — ${u.greskeStranice.slice(prije).join(' | ')}`);
    }
    const gotovo = await page.evaluate(id => !!P.data.lekcije[id]?.gotovo, lek.id);
    if (!gotovo) greske.push(`${lek.id}: poslije svih koraka lekcija nije označena kao završena`);
  }
  if (!filter.length) {
    for (const m of teme) {
      await page.evaluate(id => go('tema:' + id), m.id);
      for (const [qi, q] of m.kviz.entries()) await page.click(`[data-q="${qi}"] [data-topt="${q.t}"]`);
      const score = await page.textContent('[data-score]');
      if (score.trim() !== `Rezultat: ${m.kviz.length}/${m.kviz.length}`) greske.push(`tema ${m.id}: kviz rezultat "${score}"`);
      if (m.dia === 'put') for (let i = 0; i < 9; i++) await page.click('[data-putnav="1"]');
    }
    await page.evaluate(() => go('rjecnik'));
    await page.fill('#glq', 'transakc');
    const n = await page.$$eval('.gl .card', els => els.length);
    if (n < 1) greske.push('rječnik: pretraga "transakc" ne nalazi ništa');
  }
  return { greske };
}

export async function provjeriTelefon() {
  const u = await otvoriUcionicu({ sirina: 390, visina: 844 });
  const greske = [];
  const { dijelovi } = ucitajLekcije();
  const mete = [...dijelovi.flatMap(d => d.lekcije.flatMap(l => l.koraci.map((s, k) => [`lek:${l.id}:${k}`, s.tip]))), ['tema:m0'], ['tema:m4'], ['rjecnik']];
  for (const [cilj] of mete) {
    await u.page.evaluate(c => go(c), cilj);
    const siroko = await u.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (siroko > 1) greske.push(`telefon (390px) ${cilj}: stranica se pomjera vodoravno za ${siroko}px`);
  }
  // Sklopljen meni: naslov lekcije mora biti u prvom ekranu; klik na „Sadržaj“ otvori meni, izbor lekcije ga zatvori.
  await u.page.evaluate(() => go('lek:js7:0'));
  const vrh = await u.page.evaluate(() => document.querySelector('#main h2').getBoundingClientRect().top);
  if (vrh > 400) greske.push(`telefon: naslov lekcije je ${Math.round(vrh)}px od vrha (meni nije sklopljen?)`);
  await u.page.click('#menuDet > summary');
  const otvoren = await u.page.evaluate(() => document.querySelector('#menuDet').open);
  await u.page.click('#menuDet [data-go="lek:js3"]');
  const poslije = await u.page.evaluate(() => ({ open: document.querySelector('#menuDet').open, id: cur.id }));
  if (!otvoren || poslije.open || poslije.id !== 'js3') greske.push(`telefon: meni se ne otvara ili ne zatvara kako treba (${JSON.stringify({ otvoren, ...poslije })})`);
  greske.push(...u.greskeStranice.map(g => 'telefon: ' + g));
  await u.zatvori();
  return { greske };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const filter = process.argv.slice(2);
  const t0 = Date.now();
  const u = await otvoriUcionicu();
  await u.page.evaluate(() => loadPy());
  const r = await provjeriUi(u, filter);
  await u.zatvori();
  const t = filter.length ? { greske: [] } : await provjeriTelefon();
  const sve = [...r.greske, ...t.greske];
  for (const g of sve) console.log('GREŠKA · ' + g);
  console.log(`UI provjera za ${((Date.now() - t0) / 1000).toFixed(1)} s · ${sve.length} grešaka`);
  process.exit(sve.length ? 1 : 0);
}

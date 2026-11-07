// UI provjera: prođi svaki korak svake lekcije kao učenik (klikni tačan odgovor, upiši rješenje,
// pokreni), pa teme, rječnik i prikaz na telefonu. Pada na svaku grešku stranice ili koraka.
// Upotreba: node scripts/provjeri-ui.mjs [id-lekcije …]
import { fileURLToPath } from 'node:url';
import { ucitajLekcije, nizoviKoraka } from './lib/lekcije.mjs';
import { otvoriUcionicu } from './lib/preglednik.mjs';

const ROK = { timeout: 30000 };

async function korak(page, cilj, s) {
  await page.evaluate(c => go(c), cilj);
  await page.waitForSelector('#step');
  const ceka = sel => page.waitForSelector(sel, ROK);
  // Pokretanje je gotovo kad korak zapamti rezultat (stepState.last postavlja pokreni()).
  const izlazGotov = () => page.waitForFunction(() => !!stepState.last, null, ROK);
  switch (s.tip) {
    case 'predvidi': case 'kviz':
      await page.click(`#step [data-o="${s.t}"]`); await ceka('#step .fb.ok'); break;
    case 'popuni': case 'poredaj': case 'poredajPopuni':
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
  const sve = ucitajLekcije(); const { teme } = sve;
  const greske = [];
  const { page } = u;
  await page.evaluate(() => { try { localStorage.clear(); } catch (_) {} P.data = { lekcije: {}, teme: {}, zadnje: null }; });
  for (const lek of nizoviKoraka(sve)) {
    if (filter.length && !filter.includes(lek.id)) continue;
    for (const [k, s] of lek.koraci.entries()) {
      const prije = u.greskeStranice.length;
      try { await korak(page, lek.cilj(k), s); } catch (e) { greske.push(`${lek.id} korak ${k + 1} (${s.tip}): ${e.message.split('\n')[0]}`); }
      if (u.greskeStranice.length > prije) greske.push(`${lek.id} korak ${k + 1}: greška stranice — ${u.greskeStranice.slice(prije).join(' | ')}`);
    }
    const gotovo = lek.tema
      ? await page.evaluate(([id, n]) => Object.keys(P.data.teme[id]?.vj || {}).length === n, [lek.tema, lek.koraci.length])
      : await page.evaluate(id => !!P.data.lekcije[id]?.gotovo, lek.id);
    if (!gotovo) greske.push(`${lek.id}: poslije svih koraka ${lek.tema ? 'vježbe teme nisu sve zabilježene' : 'lekcija nije označena kao završena'}`);
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
    greske.push(...await provjeriNoveStranice(u));
  }
  return { greske };
}

// Početna, ponavljanje, ulazni test, potvrda, pretraga i bilješke (poslije prolaza kroz sve korake, pa ima napretka).
async function provjeriNoveStranice(u) {
  const { page } = u; const g = [];
  const prije = u.greskeStranice.length;
  const pokusaj = async (ime, fn) => { try { await fn(); } catch (e) { g.push(`${ime}: ${e.message.split('\n')[0]}`); } };
  await pokusaj('početna', async () => {
    await page.evaluate(() => go('pocetna'));
    await page.waitForSelector('.pocetna [data-go="ponovi"]', ROK);
    const potvrde = await page.$$eval('[data-go^="potvrda:"]', els => els.length);
    if (potvrde < 4) throw new Error(`poslije svih lekcija treba 4 dugmeta za potvrdu, ima ${potvrde}`);
    await page.selectOption('#ciljSel', '50');
    if (await page.evaluate(() => P.data.cilj) !== 50) throw new Error('sedmični cilj se ne pamti');
    if (!(await page.evaluate(() => (P.data.dani || {})[danas()] > 300))) throw new Error('koraci danas nisu zabilježeni u P.data.dani');
  });
  await pokusaj('ponavljanje', async () => {
    // Svi koraci su planirani za sutra; pomjeri tri na danas i odgovori: dva tačno, jedno netačno.
    const kljucevi = await page.evaluate(() => {
      const pl = P.data.ponavljanje; const k = Object.keys(pl).filter(x => ['kviz', 'predvidi', 'greska'].includes(korakIzKljuca(x).s.tip)).slice(0, 3);
      for (const x of Object.keys(pl)) pl[x].rok = danas(1);
      for (const x of k) pl[x] = { n: 0, rok: danas() };
      return k;
    });
    if (kljucevi.length !== 3) throw new Error('nema planiranih koraka poslije prolaza kroz lekcije');
    await page.evaluate(() => go('ponovi'));
    for (let i = 0; i < 3; i++) {
      await page.waitForSelector('#step', ROK);
      const s = await page.evaluate(() => korakIzKljuca(ponoviRed[cur.k]).s);
      const tacno = i < 2;
      if (s.tip === 'greska') await page.click(`#step .ln[data-ln="${tacno ? s.linija : (s.linija === 1 ? 2 : 1)}"]`);
      if (s.tip === 'greska' && !tacno) await page.click(`#step .ln[data-ln="${s.linija}"]`);
      if (s.tip !== 'greska') await page.click(`#step [data-o="${tacno ? s.t : (s.t + 1) % (s.opcije || s.o).length}"]`);
      await page.click(`[data-go="ponovi:${i + 1}"]`);
    }
    await page.waitForSelector('text=Gotovo za danas', ROK);
    const pl = await page.evaluate(k => k.map(x => P.data.ponavljanje[x]), kljucevi);
    const d = await page.evaluate(() => [danas(1), danas(3)]);
    if (pl[0].n !== 1 || pl[0].rok !== d[1] || pl[1].n !== 1 || pl[2].n !== 0 || pl[2].rok !== d[0]) throw new Error('plan poslije odgovora nije dobar: ' + JSON.stringify(pl));
    const ostalo = await page.evaluate(() => Ponovi.zaDanas().length);
    if (ostalo) throw new Error(`poslije ponavljanja još ${ostalo} za danas`);
  });
  await pokusaj('ulazni test', async () => {
    const n = await page.evaluate(() => ulazPitanja('sql').length);
    await page.evaluate(() => go('ulaz:sql:0'));
    for (let i = 0; i < n; i++) {
      await page.waitForSelector('#step', ROK);
      const s = await page.evaluate(() => trenutniKorak().s);
      if (i > 0) { if (s.tip === 'greska') await page.click(`#step .ln[data-ln="${s.linija}"]`); else await page.click(`#step [data-o="${s.t}"]`); }
      await page.click(`[data-go="ulaz:sql:${i + 1}"]`);
    }
    await page.waitForSelector('.ulaz-rez', ROK);
    const r = await page.evaluate(() => P.data.ulaz.sql);
    if (r.tacno !== n - 1 || r.preporuka !== 'sql1') throw new Error('rezultat ulaznog testa: ' + JSON.stringify(r));
  });
  await pokusaj('potvrda', async () => {
    await page.evaluate(() => go('potvrda:py'));
    await page.fill('#imePotvrda', 'Vlado');
    const ime = await page.textContent('#potIme');
    if (ime !== 'Vlado' || await page.evaluate(() => P.data.ime) !== 'Vlado') throw new Error('ime na potvrdi se ne mijenja');
    if (!/Dio 1/.test(await page.textContent('.potvrda'))) throw new Error('potvrda ne navodi dio');
  });
  await pokusaj('pretraga', async () => {
    await page.evaluate(() => go('pretraga'));
    await page.fill('#trazi', 'transakcija');
    const n = await page.$$eval('.pretraga .pr', els => els.length);
    if (n < 3) throw new Error(`"transakcija" daje ${n} rezultata`);
    await page.fill('#trazi', 'namjestaj');
    if (!(await page.$$eval('.pretraga .pr', els => els.length))) throw new Error('pretraga bez kvačica (namjestaj) ne nalazi „namještaj“');
    await page.click('.pretraga .pr');
    if (await page.evaluate(() => cur.tip) === 'pretraga') throw new Error('klik na rezultat ne otvara korak');
  });
  await pokusaj('bilješke', async () => {
    await page.evaluate(() => go('lek:py2:1'));
    await page.click('.biljeska summary');
    await page.fill('[data-bilj="py2:1"]', 'Varijabla je kutija sa imenom.');
    await page.evaluate(() => go('biljeske'));
    if (!/kutija sa imenom/.test(await page.textContent('#main'))) throw new Error('bilješka se ne vidi na stranici bilješki');
  });
  if (u.greskeStranice.length > prije) g.push('nove stranice: greška stranice — ' + u.greskeStranice.slice(prije).join(' | '));
  return g;
}

export async function provjeriTelefon() {
  const u = await otvoriUcionicu({ sirina: 390, visina: 844 });
  const greske = [];
  const { dijelovi, teme } = ucitajLekcije();
  const mete = [...dijelovi.flatMap(d => d.lekcije.flatMap(l => l.koraci.map((s, k) => [`lek:${l.id}:${k}`, s.tip]))), ['tema:m0'], ['tema:m4'], ['tema:m12'], ['rjecnik'], ['pocetna'], ['ponovi'], ['pretraga'], ['biljeske'], ['ulaz:py:0'], ['potvrda:py'],
    ...teme.filter(t => t.koraci).flatMap(t => t.koraci.map((_, k) => [`vj:${t.id}:${k}`]))];
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

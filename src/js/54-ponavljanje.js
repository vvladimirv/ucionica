// ============================================================================
// Nizovi koraka van lekcija: „Ponovi danas“ (ponavljanje kroz vrijeme), vježbe tema (Dio 4) i ulazni test.
// Ključ koraka: 'py3:5' (lekcija py3, korak 5) ili 'm4:2' (tema m4, vježba 2). Id-jevi lekcija ne počinju sa „m“.
// Ponavljanje: P.data.ponavljanje = { kljuc: { n: stepen 0…, rok: 'YYYY-MM-DD' } }.
//   Tačno → sljedeći stepen (razmak 1, 3, 7, 21, 60 dana); netačno ili uz pomoć → ispočetka (sutra).
// ============================================================================
const RAZMACI = [1, 3, 7, 21, 60];
const PONOVI_NA_DAN = 10;
const ZA_PONAVLJANJE = new Set(['kviz', 'predvidi', 'greska', 'popuni', 'poredaj', 'poredajPopuni']);

const danas = (pomak = 0) => { const d = new Date(); d.setDate(d.getDate() + pomak); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const temaPoId = id => (typeof TEME !== 'undefined' ? TEME : []).find(t => t.id === id);
function korakIzKljuca(kljuc) {
  const [id, k] = String(kljuc).split(':'); const i = Number(k);
  const lek = findLek(id); if (lek) return lek.koraci[i] ? { s: lek.koraci[i], naslov: lek.naslov, cilj: `lek:${id}:${i}` } : null;
  const t = temaPoId(id); return t?.koraci?.[i] ? { s: t.koraci[i], naslov: `Tema ${t.n}: ${t.naslov}`, cilj: `vj:${id}:${i}` } : null;
}

// Korak koji je sada na ekranu (za tutora): {s, gdje, k, n} ili null.
function trenutniKorak() {
  if (cur.tip === 'lek') { const l = findLek(cur.id); return l && { s: l.koraci[cur.k], gdje: `Lekcija: ${l.naslov}`, k: cur.k, n: l.koraci.length }; }
  if (cur.tip === 'vj') { const t = temaPoId(cur.id); return t && { s: t.koraci[cur.k], gdje: `Vježbe uz temu: ${t.naslov}`, k: cur.k, n: t.koraci.length }; }
  if (cur.tip === 'ponovi' && ponoviRed[cur.k]) { const r = korakIzKljuca(ponoviRed[cur.k]); return r && { s: r.s, gdje: `Ponavljanje, pitanje iz: ${r.naslov}`, k: cur.k, n: ponoviRed.length }; }
  if (cur.tip === 'ulaz') { const p = ulazPitanja(cur.id)[cur.k]; return p && { s: p.lek.koraci[p.k], gdje: `Ulazni test, pitanje iz lekcije: ${p.lek.naslov}`, k: cur.k, n: ulazPitanja(cur.id).length }; }
  return null;
}

const Ponovi = {
  plan() { return P.data.ponavljanje || (P.data.ponavljanje = {}); },
  // Prvi odgovor u lekciji ili vježbi teme stavlja korak u plan (rok sutra). Već planirani korak se ne dira.
  zabiljezi(kljuc, stanje) {
    const r = korakIzKljuca(kljuc);
    if (!r || !ZA_PONAVLJANJE.has(r.s.tip) || this.plan()[kljuc] || (stanje !== 'ok' && stanje !== 'pomoc')) return;
    this.plan()[kljuc] = { n: 0, rok: danas(1) };
  },
  // Koraci urađeni prije nego je ponavljanje postojalo: rasporedi ih po 10 na dan, da prvi dan ne bude 300 pitanja.
  dopuni() {
    const plan = this.plan(); let i = 0;
    const dodaj = (kljuc, s, st) => { if (!plan[kljuc] && ZA_PONAVLJANJE.has(s.tip) && (st === 'ok' || st === 'pomoc')) plan[kljuc] = { n: 0, rok: danas(Math.floor(i++ / PONOVI_NA_DAN)) }; };
    for (const d of DIJELOVI) for (const l of d.lekcije) { const L = P.data.lekcije[l.id]; if (L) l.koraci.forEach((s, k) => dodaj(`${l.id}:${k}`, s, L.koraci[k])); }
    for (const t of (typeof TEME !== 'undefined' ? TEME : [])) { const V = P.data.teme[t.id]?.vj; if (V && t.koraci) t.koraci.forEach((s, k) => dodaj(`${t.id}:${k}`, s, V[k])); }
  },
  zaDanas() {
    const d = danas();
    return Object.entries(this.plan()).filter(([k, v]) => v.rok <= d && korakIzKljuca(k))
      .sort((a, b) => a[1].rok.localeCompare(b[1].rok) || a[1].n - b[1].n).map(([k]) => k);
  },
  odgovori(kljuc, tacno) {
    const v = this.plan()[kljuc] || { n: 0 };
    const n = tacno ? Math.min((v.rok ? v.n + 1 : 0), RAZMACI.length - 1) : 0;
    this.plan()[kljuc] = { n, rok: danas(RAZMACI[n]) };
    P.save();
  },
};

// ---------------------------------------------------------------------------
// Igrač niza: jedan korak na ekranu, isti renderi koraka (STEP) kao u lekciji.
// ---------------------------------------------------------------------------
let ponoviRed = [], ponoviRez = [];
const ulazRed = {};

function renderNizKorak({ eyebrow, naslov, opis, s, poz, ukupno, nazad, dalje, kljucBiljeske }) {
  zaustaviDom();
  stepState = { s };
  $('#main').innerHTML = `
    <div class="lhead"><div class="eyebrow">${eyebrow}</div><h2>${esc(naslov)}</h2>${opis ? `<p class="muted">${opis}</p>` : ''}${ukupno ? `<div class="napr"><span style="width:${Math.round(100 * poz / ukupno)}%"></span></div>` : ''}</div>
    <section class="card"><div class="steptype">${ukupno ? `Korak ${poz + 1}/${ukupno} · ` : ''}${TIPNAZIV[s.tip]}</div>${s.naslov ? `<h3>${esc(s.naslov)}</h3>` : ''}<div class="stepbody" id="step"></div></section>
    ${kljucBiljeske ? biljeskaHtml(kljucBiljeske) : ''}
    <div class="navbtns">${nazad || '<span></span>'}<button class="btn" data-tutor-explain>🤔 Ne razumijem ovaj korak</button>${dalje}</div>`;
  STEP[s.tip]($('#step'), s);
  const lang = s.jezik || 'python';
  if (lang === 'sql' && s.setup) popuniBazu($('#step'), s);
  if (lang === 'python' && s.tip !== 'tekst' && s.tip !== 'kviz') loadPy();
  if (lang === 'sql') loadSql();
}

// Odgovor u nizu (poziva ga markStep kad cur nije lekcija).
function nizOdgovor(stanje) {
  if (stepState.odgovoreno || (stanje !== 'ok' && stanje !== 'pomoc')) return;
  stepState.odgovoreno = true;
  const tacno = stanje === 'ok';
  if (cur.tip === 'ponovi') {
    const kljuc = ponoviRed[cur.k]; Ponovi.odgovori(kljuc, tacno); ponoviRez[cur.k] = tacno;
    const v = P.data.ponavljanje[kljuc];
    $('#step').insertAdjacentHTML('beforeend', `<p class="small muted">${tacno ? `Sljedeće ponavljanje za ${RAZMACI[v.n]} ${RAZMACI[v.n] === 1 ? 'dan' : 'dana'}.` : 'Ovo pitanje se vraća sutra.'}</p>`);
  } else if (cur.tip === 'ulaz') {
    const r = P.data.ulazOdg || (P.data.ulazOdg = {}); (r[cur.id] || (r[cur.id] = {}))[cur.k] = tacno;
  }
}

function renderPonovi() {
  if (!ponoviRed.length) { ponoviRed = Ponovi.zaDanas().slice(0, PONOVI_NA_DAN); ponoviRez = []; cur.k = 0; }
  if (!ponoviRed.length) {
    const sljedeci = Object.values(Ponovi.plan()).map(v => v.rok).sort()[0];
    $('#main').innerHTML = `<div class="lhead"><div class="eyebrow">Ponavljanje</div><h2>Ponovi danas</h2></div>
      <section class="card"><p>Danas nema pitanja za ponavljanje. ${sljedeci ? `Sljedeća stižu <b>${esc(sljedeci)}</b>.` : 'Pitanja iz lekcija koje prođeš vraćaju se ovdje poslije 1, 3, 7, 21 i 60 dana.'}</p>
      <p class="small muted">Zašto: ono što se ponovi baš kad počinje da se zaboravlja, pamti se mnogo duže nego ponovno čitanje.</p>
      <div class="row"><button class="btn primary" data-go="pocetna">Početna</button></div></section>`;
    return;
  }
  if (cur.k >= ponoviRed.length) {
    const ok = ponoviRez.filter(Boolean).length;
    $('#main').innerHTML = `<div class="lhead"><div class="eyebrow">Ponavljanje</div><h2>Gotovo za danas ✓</h2></div>
      <section class="card"><p>Tačno: <b>${ok} od ${ponoviRed.length}</b>. Netačna pitanja se vraćaju sutra, tačna kasnije.</p>
      <div class="row"><button class="btn primary" data-go="pocetna">Početna</button>${P.data.zadnje ? `<button class="btn" data-go="${esc(P.data.zadnje)}">Nastavi lekciju</button>` : ''}</div></section>`;
    ponoviRed = []; ponoviRez = [];
    return;
  }
  const kljuc = ponoviRed[cur.k]; const r = korakIzKljuca(kljuc);
  renderNizKorak({ eyebrow: 'Ponovi danas', naslov: r.naslov, opis: 'Odgovori iz glave. Rezultat ne mijenja napredak lekcije, samo kad će se pitanje vratiti.', s: r.s, poz: cur.k, ukupno: ponoviRed.length,
    nazad: `<button class="btn" data-go="${r.cilj}">Otvori u lekciji</button>`,
    dalje: `<button class="btn primary" data-go="ponovi:${cur.k + 1}">${cur.k + 1 < ponoviRed.length ? 'Sljedeće pitanje →' : 'Završi'}</button>` });
}

// Vježbe teme: koraci u TEME[i].koraci, napredak u P.data.teme[id].vj = {k: 'ok'|'pomoc'|'vidjeno'}.
function temaVjMark(id, k, stanje) {
  const t = P.data.teme[id] || (P.data.teme[id] = {}); const V = t.vj || (t.vj = {});
  const rank = { ok: 3, pomoc: 2, vidjeno: 1 };
  if (V[k] && rank[V[k]] >= rank[stanje]) return;
  V[k] = stanje; zabiljeziDan(); P.save(); renderMenu();
}
function renderTemaVj() {
  const m = temaPoId(cur.id); const n = m.koraci.length; const s = m.koraci[cur.k];
  const zadnji = cur.k === n - 1; const i = TEME.indexOf(m);
  renderNizKorak({ eyebrow: `Dio 4 · Tema ${m.n} · vježbe`, naslov: m.naslov, opis: 'Vježbe uz temu: pokreni, predvidi, nađi grešku.', s, poz: cur.k, ukupno: n, kljucBiljeske: `${m.id}:${cur.k}`,
    nazad: `<button class="btn" data-go="${cur.k ? `vj:${m.id}:${cur.k - 1}` : `tema:${m.id}`}">← ${cur.k ? 'Nazad' : 'Tekst teme'}</button>`,
    dalje: !zadnji ? `<button class="btn primary" data-go="vj:${m.id}:${cur.k + 1}">Dalje →</button>`
      : `<span class="muted small">Kraj vježbi ✓</span><button class="btn primary" data-go="${TEME[i + 1] ? `tema:${TEME[i + 1].id}` : 'pocetna'}">${TEME[i + 1] ? esc(TEME[i + 1].naslov) + ' →' : 'Početna'}</button>` });
  if (s.tip === 'tekst' || s.tip === 'primjer') markStep('vidjeno');
}

// Ulazni test: po jedno pitanje iz svake lekcije dijela (zadnje predvidi/kviz/greška u lekciji, bez projekata).
function ulazPitanja(dioId) {
  if (ulazRed[dioId]) return ulazRed[dioId];
  const dio = DIJELOVI.find(d => d.id === dioId);
  return (ulazRed[dioId] = dio.lekcije.filter(l => !l.projekat).map(l => {
    const k = l.koraci.map((s, i) => i).reverse().find(i => ['predvidi', 'kviz', 'greska'].includes(l.koraci[i].tip));
    return k === undefined ? null : { lek: l, k };
  }).filter(Boolean));
}
function renderUlaz() {
  const dio = DIJELOVI.find(d => d.id === cur.id); const pit = ulazPitanja(cur.id);
  if (cur.k === 0) P.data.ulazOdg = { ...(P.data.ulazOdg || {}), [cur.id]: {} };
  if (cur.k >= pit.length) {
    const odg = P.data.ulazOdg?.[cur.id] || {};
    const prvi = pit.findIndex((_, i) => !odg[i]);
    const ok = pit.filter((_, i) => odg[i]).length;
    P.data.ulaz = { ...(P.data.ulaz || {}), [cur.id]: { tacno: ok, od: pit.length, preporuka: prvi < 0 ? null : pit[prvi].lek.id, datum: danas() } }; P.save();
    const cilj = prvi < 0 ? dio.lekcije[dio.lekcije.length - 1] : pit[prvi].lek;
    $('#main').innerHTML = `<div class="lhead"><div class="eyebrow">${esc(dio.naslov)} · ulazni test</div><h2>Rezultat: ${ok} od ${pit.length}</h2></div>
      <section class="card"><ul class="ulaz-rez">${pit.map((p, i) => `<li class="${odg[i] ? 'ok' : 'no'}">${odg[i] ? '✓' : '✗'} ${dio.lekcije.indexOf(p.lek) + 1}. ${esc(p.lek.naslov)}</li>`).join('')}</ul>
      <p>${prvi < 0 ? 'Znaš osnove svih lekcija. Preporuka: idi na zadnju lekciju ili projekat, a ostalo pregledaj po potrebi.' : prvi === 0 ? 'Preporuka: kreni od prve lekcije.' : `Preporuka: kreni od lekcije <b>${dio.lekcije.indexOf(cilj) + 1}. ${esc(cilj.naslov)}</b>. Ranije lekcije možeš preskočiti ili samo preletjeti.`}</p>
      <p class="small muted">Ulazni test ne mijenja napredak i ne označava lekcije kao završene. Jedno pitanje po lekciji je gruba procjena, ne ocjena.</p>
      <div class="row"><button class="btn primary" data-go="lek:${cilj.id}:0">${esc(cilj.naslov)} →</button><button class="btn" data-go="pocetna">Početna</button></div></section>`;
    return;
  }
  const p = pit[cur.k];
  renderNizKorak({ eyebrow: `${esc(dio.naslov)} · ulazni test`, naslov: `Pitanje iz lekcije ${dio.lekcije.indexOf(p.lek) + 1}: ${p.lek.naslov}`, opis: 'Po jedno pitanje iz svake lekcije. Ako ne znaš, preskoči: to je dobar znak gdje da počneš.', s: p.lek.koraci[p.k], poz: cur.k, ukupno: pit.length,
    dalje: `<button class="btn primary" data-go="ulaz:${cur.id}:${cur.k + 1}">${cur.k + 1 < pit.length ? 'Sljedeće →' : 'Rezultat'}</button>` });
}

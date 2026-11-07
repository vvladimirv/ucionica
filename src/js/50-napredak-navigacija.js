// ============================================================================
// Napredak (tvoj nalog preko db capability-ja; rezerva: localStorage) i navigacija (meni, rute).
// Oblik: { lekcije: { py1: { koraci: {0:'vidjeno'|'ok'|'pomoc'}, korak, gotovo } }, teme: { m0: {done, kviz, vj} }, zadnje,
//         ponavljanje, biljeske, dani, cilj, zavrseno, ime, ulaz }  (opis novih polja: 54-ponavljanje.js, 55-pregled.js)
// ============================================================================
const DIJELOVI = [
  { id: 'py', naslov: 'Dio 1 · Python od nule', lekcije: typeof LEKCIJE_PY !== 'undefined' ? LEKCIJE_PY : [] },
  { id: 'js', naslov: 'Dio 2 · JavaScript', lekcije: typeof LEKCIJE_JS !== 'undefined' ? LEKCIJE_JS : [], uskoro: 'Sljedeća faza: varijable, funkcije, nizovi i objekti, DOM, događaji, fetch.' },
  { id: 'sql', naslov: 'Dio 3 · SQL i baze', lekcije: typeof LEKCIJE_SQL !== 'undefined' ? LEKCIJE_SQL : [], uskoro: 'Sljedeća faza: SELECT, WHERE, JOIN, GROUP BY, INSERT/UPDATE, transakcije.' },
  // poslijeTema: u meniju i redoslijedu dolazi poslije Dijela 4 (teme)
  { id: 'ag', naslov: 'Dio 5 · Rad sa AI agentima', lekcije: typeof LEKCIJE_AG !== 'undefined' ? LEKCIJE_AG : [], poslijeTema: true },
];
const findLek = id => DIJELOVI.flatMap(d => d.lekcije).find(l => l.id === id);
let cur = { tip: 'lek', id: null, k: 0 };

const P = {
  data: { lekcije: {}, teme: {}, zadnje: null }, ref: null, timer: null, saving: Promise.resolve(),
  load() { try { const s = JSON.parse(localStorage.getItem('ucionica-app') || 'null'); if (s) this.data = { ...this.data, ...s }; } catch (_) {} },
  async cloud() {
    const [db, user] = await Promise.all([claudeUse('db'), claudeUse('user')]);
    const uid = user ? await user.id() : null;
    if (!db || !uid) return;
    try {
      this.ref = db.doc(`data/users/${uid}/napredak`);
      const snap = await this.ref.get();
      if (snap.exists) this.merge(snap.data());
      Ponovi.dopuni(); ENV.save = 'cloud'; renderStatus(); render(); this.save(true);
    } catch (e) { this.ref = null; console.warn('Napredak na nalogu nije dostupan:', e); }
  },
  // Spoji napredak sa naloga i iz preglednika: ništa urađeno se ne gubi.
  merge(o) {
    const rank = { ok: 3, pomoc: 2, vidjeno: 1 };
    for (const [k, v] of Object.entries(o.lekcije || {})) {
      const a = this.data.lekcije[k] || { koraci: {} }; const koraci = { ...(v.koraci || {}) };
      for (const [i, st] of Object.entries(a.koraci || {})) if (!koraci[i] || rank[st] > rank[koraci[i]]) koraci[i] = st;
      this.data.lekcije[k] = { koraci, gotovo: !!(a.gotovo || v.gotovo), korak: Math.max(a.korak || 0, v.korak || 0) };
    }
    for (const [k, v] of Object.entries(o.teme || {})) this.data.teme[k] = { ...v, ...(this.data.teme[k] || {}) };
    this.data.zadnje = this.data.zadnje || o.zadnje || null;
    // Ponavljanje: zadrži zapis sa kasnijim rokom (taj je noviji odgovor). Bilješke: lokalna, ako postoji.
    const pl = this.data.ponavljanje || (this.data.ponavljanje = {});
    for (const [k, v] of Object.entries(o.ponavljanje || {})) if (!pl[k] || v.rok > pl[k].rok) pl[k] = v;
    this.data.biljeske = { ...(o.biljeske || {}), ...(this.data.biljeske || {}) };
    const dani = this.data.dani || (this.data.dani = {});
    for (const [d, n] of Object.entries(o.dani || {})) dani[d] = Math.max(dani[d] || 0, n);
    const zav = this.data.zavrseno || (this.data.zavrseno = {});
    for (const [d, v] of Object.entries(o.zavrseno || {})) if (!zav[d] || v < zav[d]) zav[d] = v;
    for (const p of ['ime', 'cilj', 'ulaz']) if (this.data[p] === undefined && o[p] !== undefined) this.data[p] = o[p];
    for (const [k, v] of Object.entries(o.teme || {})) if (v.vj) { const t = this.data.teme[k]; t.vj = { ...v.vj, ...(t.vj || {}) }; }
  },
  save(now = false) {
    try { localStorage.setItem('ucionica-app', JSON.stringify(this.data)); } catch (_) {}
    if (!this.ref) return;
    clearTimeout(this.timer);
    const go = () => { this.saving = this.saving.then(() => this.ref.set(JSON.parse(JSON.stringify(this.data)))).catch(e => console.warn('Spremanje napretka:', e)); };
    if (now) go(); else this.timer = setTimeout(go, 1500);
  },
  lek(id) { return this.data.lekcije[id] || (this.data.lekcije[id] = { koraci: {}, korak: 0, gotovo: false }); },
  mark(lid, k, stanje) {
    const L = this.lek(lid); const prev = L.koraci[k];
    if (prev === 'ok' || (prev === 'pomoc' && stanje === 'vidjeno')) return;
    L.koraci[k] = stanje; zabiljeziDan();
    const lek = findLek(lid);
    if (lek && lek.koraci.every((_, i) => L.koraci[i])) L.gotovo = true;
    this.save(); renderMenu(); renderDots();
  },
};

function renderMenu() {
  const lekBtn = (l, i) => {
    const L = P.data.lekcije[l.id] || { koraci: {} }; const n = Object.keys(L.koraci).length;
    const s = L.gotovo ? '<span class="s done">✓</span>' : n ? `<span class="s">${n}/${l.koraci.length}</span>` : '<span class="s"></span>';
    return `<button data-go="lek:${l.id}" aria-current="${cur.tip === 'lek' && cur.id === l.id}"><span class="n">${i + 1}</span><span>${l.projekat ? '🛠 ' : ''}${esc(l.naslov)}</span>${s}</button>`;
  };
  const temaBtn = t => { const p = P.data.teme[t.id] || {}; return `<button data-go="tema:${t.id}" aria-current="${cur.tip === 'tema' && cur.id === t.id}"><span class="n">${t.n}</span><span>${esc(t.naslov)}</span><span class="s ${p.done ? 'done' : ''}">${p.done ? '✓' : p.kviz || ''}</span></button>`; };
  const dioHtml = d => `<div class="dio"><div class="dio-t">${esc(d.naslov)}</div>${d.lekcije.map(lekBtn).join('')}${!d.lekcije.length && d.uskoro ? `<div class="soon">${esc(d.uskoro)}</div>` : ''}</div>`;
  const nPon = Math.min(Ponovi.zaDanas().length, PONOVI_NA_DAN);
  const vrh = `<div class="dio dio-vrh"><button data-go="pocetna" aria-current="${cur.tip === 'pocetna'}"><span class="n">⌂</span><span>Početna</span><span></span></button><button data-go="ponovi" aria-current="${cur.tip === 'ponovi'}"><span class="n">🔁</span><span>Ponovi danas</span><span class="s">${nPon || ''}</span></button><button data-go="pretraga" aria-current="${cur.tip === 'pretraga'}"><span class="n">🔎</span><span>Pretraga</span><span></span></button></div>`;
  const sadrzaj = vrh + DIJELOVI.filter(d => !d.poslijeTema).map(dioHtml).join('')
    + (typeof TEME !== 'undefined' ? `<div class="dio"><div class="dio-t">Dio 4 · Teme (web, baze, arhitektura…)</div>${TEME.map(temaBtn).join('')}<button data-go="rjecnik" aria-current="${cur.tip === 'rjecnik'}"><span class="n">A–Ž</span><span>Rječnik pojmova</span><span></span></button></div>` : '')
    + DIJELOVI.filter(d => d.poslijeTema && d.lekcije.length).map(dioHtml).join('');
  // Na telefonu je meni sklopljen (inače bi 30+ stavki stajalo iznad lekcije); na širem ekranu je uvijek otvoren.
  const lek = cur.tip === 'lek' && findLek(cur.id);
  const dio = lek && DIJELOVI.find(d => d.lekcije.includes(lek));
  const gdje = lek ? `${dio.naslov.split(' · ')[0]} · ${dio.lekcije.indexOf(lek) + 1}. ${lek.naslov}`
    : cur.tip === 'tema' || cur.tip === 'vj' ? `Tema ${TEME.find(t => t.id === cur.id)?.n}: ${TEME.find(t => t.id === cur.id)?.naslov}`
    : { pocetna: 'Početna', ponovi: 'Ponovi danas', pretraga: 'Pretraga', biljeske: 'Moje bilješke', potvrda: 'Potvrda o završetku', ulaz: 'Ulazni test', rjecnik: 'Rječnik pojmova' }[cur.tip] || '';
  const otvoren = !uzakMeni() || menuOtvoren;
  $('#menu').innerHTML = `<details id="menuDet"${otvoren ? ' open' : ''}><summary><span class="mt">Sadržaj</span><span class="mc">${esc(gdje)}</span><span class="mz" aria-hidden="true">▾</span></summary><div class="menu-sadrzaj">${sadrzaj}</div></details>`;
  $('#menuDet').addEventListener('toggle', e => { if (uzakMeni()) menuOtvoren = e.target.open; });
}
let menuOtvoren = false;
const uzakMeni = () => window.matchMedia('(max-width: 860px)').matches;

function go(target, focus = true) {
  const [tip, id, k] = String(target).split(':');
  if (tip === 'lek' && findLek(id)) {
    const n = findLek(id).koraci.length;
    const kk = k === undefined || k === '' ? (P.data.lekcije[id]?.korak || 0) : Number(k);
    cur = { tip, id, k: Math.max(0, Math.min(kk, n - 1)) };
  } else if (tip === 'tema' && typeof TEME !== 'undefined' && TEME.some(t => t.id === id)) cur = { tip, id };
  else if (tip === 'vj' && temaPoId(id)?.koraci) cur = { tip, id, k: Math.max(0, Math.min(Number(k) || 0, temaPoId(id).koraci.length - 1)) };
  else if (tip === 'rjecnik' && typeof RJECNIK !== 'undefined') cur = { tip };
  else if (tip === 'ponovi') { if (id === undefined) { ponoviRed = []; ponoviRez = []; } cur = { tip, k: Number(id) || 0 }; }
  else if (tip === 'ulaz' && DIJELOVI.some(d => d.id === id && d.lekcije.length)) cur = { tip, id, k: Number(k) || 0 };
  else if (tip === 'potvrda' && DIJELOVI.some(d => d.id === id)) cur = { tip, id };
  else if (['pocetna', 'pretraga', 'biljeske'].includes(tip)) cur = { tip };
  else cur = { tip: 'pocetna' };
  menuOtvoren = false;   // na telefonu: poslije izbora lekcije meni se sklopi, da se vidi sadržaj
  // „Nastavi gdje si stao“ pamti samo lekcije, teme i vježbe tema.
  if (cur.tip === 'lek' || cur.tip === 'vj') P.data.zadnje = `${cur.tip}:${cur.id}:${cur.k}`;
  else if (cur.tip === 'tema') P.data.zadnje = `tema:${cur.id}`;
  const adresa = cur.tip === 'lek' || cur.tip === 'vj' || cur.tip === 'ulaz' ? `${cur.tip}:${cur.id}:${cur.k}` : cur.id ? `${cur.tip}:${cur.id}` : cur.tip === 'ponovi' ? 'ponovi' : cur.tip;
  if (cur.tip === 'lek') P.lek(cur.id).korak = cur.k;
  P.save();
  render();
  try { history.replaceState(null, '', '#' + adresa.replace(/:/g, '-')); } catch (_) {}
  if (focus) { $('#main').focus({ preventScroll: true }); window.scrollTo({ top: 0 }); }
}

function render() {
  renderMenu();
  const v = { lek: renderLek, tema: renderTemaView, vj: renderTemaVj, rjecnik: () => renderRjecnikView(), ponovi: renderPonovi, ulaz: renderUlaz,
    pocetna: renderPocetna, potvrda: renderPotvrda, pretraga: () => renderPretraga(), biljeske: renderBiljeske }[cur.tip];
  (v || renderPocetna)();
  renderTutorQuick();
}


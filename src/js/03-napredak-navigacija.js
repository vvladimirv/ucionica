// ============================================================================
// Napredak (tvoj nalog preko db capability-ja; rezerva: localStorage) i navigacija (meni, rute).
// Oblik: { lekcije: { py1: { koraci: {0:'vidjeno'|'ok'|'pomoc'}, korak, gotovo } }, teme: { m0: {done, kviz} }, zadnje }
// ============================================================================
const DIJELOVI = [
  { id: 'py', naslov: 'Dio 1 · Python od nule', lekcije: typeof LEKCIJE_PY !== 'undefined' ? LEKCIJE_PY : [] },
  { id: 'js', naslov: 'Dio 2 · JavaScript', lekcije: typeof LEKCIJE_JS !== 'undefined' ? LEKCIJE_JS : [], uskoro: 'Sljedeća faza: varijable, funkcije, nizovi i objekti, DOM, događaji, fetch.' },
  { id: 'sql', naslov: 'Dio 3 · SQL i baze', lekcije: typeof LEKCIJE_SQL !== 'undefined' ? LEKCIJE_SQL : [], uskoro: 'Sljedeća faza: SELECT, WHERE, JOIN, GROUP BY, INSERT/UPDATE, transakcije.' },
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
      ENV.save = 'cloud'; renderStatus(); renderMenu(); renderDots(); this.save(true);
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
    L.koraci[k] = stanje;
    const lek = findLek(lid);
    if (lek && lek.koraci.every((_, i) => L.koraci[i])) L.gotovo = true;
    this.save(); renderMenu(); renderDots();
  },
};

function renderMenu() {
  const lekBtn = (l, i) => {
    const L = P.data.lekcije[l.id] || { koraci: {} }; const n = Object.keys(L.koraci).length;
    const s = L.gotovo ? '<span class="s done">✓</span>' : n ? `<span class="s">${n}/${l.koraci.length}</span>` : '<span class="s"></span>';
    return `<button data-go="lek:${l.id}" aria-current="${cur.tip === 'lek' && cur.id === l.id}"><span class="n">${i + 1}</span><span>${esc(l.naslov)}</span>${s}</button>`;
  };
  const temaBtn = t => { const p = P.data.teme[t.id] || {}; return `<button data-go="tema:${t.id}" aria-current="${cur.tip === 'tema' && cur.id === t.id}"><span class="n">${t.n}</span><span>${esc(t.naslov)}</span><span class="s ${p.done ? 'done' : ''}">${p.done ? '✓' : p.kviz || ''}</span></button>`; };
  $('#menu').innerHTML = DIJELOVI.map(d => `<div class="dio"><div class="dio-t">${esc(d.naslov)}</div>${d.lekcije.map(lekBtn).join('')}${!d.lekcije.length && d.uskoro ? `<div class="soon">${esc(d.uskoro)}</div>` : ''}</div>`).join('')
    + (typeof TEME !== 'undefined' ? `<div class="dio"><div class="dio-t">Dio 4 · Teme (web, baze, arhitektura…)</div>${TEME.map(temaBtn).join('')}<button data-go="rjecnik" aria-current="${cur.tip === 'rjecnik'}"><span class="n">A–Ž</span><span>Rječnik pojmova</span><span></span></button></div>` : '');
}

function go(target, focus = true) {
  const [tip, id, k] = String(target).split(':');
  if (tip === 'lek' && findLek(id)) {
    const n = findLek(id).koraci.length;
    const kk = k === undefined || k === '' ? (P.data.lekcije[id]?.korak || 0) : Number(k);
    cur = { tip, id, k: Math.max(0, Math.min(kk, n - 1)) };
  } else if (tip === 'tema' && typeof TEME !== 'undefined' && TEME.some(t => t.id === id)) cur = { tip, id };
  else if (tip === 'rjecnik' && typeof RJECNIK !== 'undefined') cur = { tip };
  else cur = { tip: 'lek', id: DIJELOVI[0].lekcije[0]?.id, k: 0 };
  P.data.zadnje = cur.tip === 'lek' ? `lek:${cur.id}:${cur.k}` : cur.tip === 'tema' ? `tema:${cur.id}` : 'rjecnik';
  if (cur.tip === 'lek') P.lek(cur.id).korak = cur.k;
  P.save();
  render();
  try { history.replaceState(null, '', '#' + P.data.zadnje.replace(/:/g, '-')); } catch (_) {}
  if (focus) { $('#main').focus({ preventScroll: true }); window.scrollTo({ top: 0 }); }
}

function render() {
  renderMenu();
  if (cur.tip === 'lek') renderLek();
  else if (cur.tip === 'tema') renderTemaView();
  else renderRjecnikView();
  renderTutorQuick();
}


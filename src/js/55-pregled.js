// ============================================================================
// Početna (pregled napretka), potvrda o završetku dijela, pretraga kroz kurs i bilješke uz korake.
// Podaci u P.data: dani {'YYYY-MM-DD': broj koraka}, cilj (koraka sedmično, 0 = bez cilja),
// zavrseno {dio: datum}, ime (za potvrdu), biljeske {kljuc koraka: tekst}, ulaz {dio: rezultat}.
// ============================================================================
function zabiljeziDan() { const d = P.data.dani || (P.data.dani = {}); const k = danas(); d[k] = (d[k] || 0) + 1; }
const dioKoraci = d => d.lekcije.reduce((a, l) => a + l.koraci.length, 0);
const dioUradjeno = d => d.lekcije.reduce((a, l) => a + Object.keys(P.data.lekcije[l.id]?.koraci || {}).length, 0);
const dioGotov = d => d.lekcije.length > 0 && d.lekcije.every(l => P.data.lekcije[l.id]?.gotovo);
function provjeriZavrsene() {
  const z = P.data.zavrseno || (P.data.zavrseno = {}); let novo = false;
  for (const d of DIJELOVI) if (dioGotov(d) && !z[d.id]) { z[d.id] = danas(); novo = true; }
  return novo;
}
function sedmica() {
  const d = P.data.dani || {}; let ukupno = 0;
  for (let i = 0; i < 7; i++) ukupno += d[danas(-i)] || 0;
  let niz = 0; for (let i = d[danas()] ? 0 : 1; d[danas(-i)]; i++) niz++;
  return { ukupno, niz };
}
const datumBs = iso => { const [g, m, d] = String(iso).split('-'); return `${Number(d)}. ${Number(m)}. ${g}.`; };

function renderPocetna() {
  if (provjeriZavrsene()) P.save();
  const zaDanas = Math.min(Ponovi.zaDanas().length, PONOVI_NA_DAN);
  const zadnje = P.data.zadnje; const nastavi = zadnje ? zadnje : `lek:${DIJELOVI[0].lekcije[0].id}:0`;
  const gdje = (() => {
    const [tip, id, k] = String(nastavi).split(':');
    if (tip === 'lek' && findLek(id)) return `${findLek(id).naslov} · korak ${Number(k || 0) + 1}`;
    if ((tip === 'tema' || tip === 'vj') && temaPoId(id)) return `Tema ${temaPoId(id).n}: ${temaPoId(id).naslov}`;
    return 'Rječnik pojmova';
  })();
  const { ukupno, niz } = sedmica(); const cilj = Number(P.data.cilj || 0);
  const dioKartica = d => {
    const n = dioKoraci(d), u = dioUradjeno(d), pr = n ? Math.round(100 * u / n) : 0; const ul = P.data.ulaz?.[d.id];
    return `<div class="card dio-k"><div class="row" style="justify-content:space-between"><b>${esc(d.naslov)}</b><span class="small muted">${u}/${n} koraka</span></div>
      <div class="napr"><span style="width:${pr}%"></span></div>
      <div class="row">${dioGotov(d) ? `<button class="btn good small" data-go="potvrda:${d.id}">🎓 Potvrda o završetku</button>` : `<button class="btn small" data-go="lek:${(d.lekcije.find(l => !P.data.lekcije[l.id]?.gotovo) || d.lekcije[0]).id}">${u ? 'Nastavi dio' : 'Počni'}</button>`}
      ${u === 0 ? `<button class="btn small" data-go="ulaz:${d.id}:0">Ulazni test${ul ? ` (zadnji: ${ul.tacno}/${ul.od})` : ''}</button>` : ''}</div></div>`;
  };
  const teme = typeof TEME !== 'undefined' ? TEME : [];
  const procitano = teme.filter(t => P.data.teme[t.id]?.done).length;
  $('#main').innerHTML = `<div class="lhead"><div class="eyebrow">Početna</div><h2>Učionica programiranja</h2><p class="muted">Python, JavaScript, SQL, teme i rad sa AI agentima — korak po korak, na primjerima iz posla.</p></div>
    <div class="pocetna">
      <section class="card"><div class="sec-t">Nastavi gdje si stao</div><p>${esc(gdje)}</p><div class="row"><button class="btn primary" data-go="${esc(nastavi)}">Nastavi →</button></div></section>
      <section class="card"><div class="sec-t">🔁 Ponovi danas</div><p>${zaDanas ? `<b>${zaDanas}</b> ${zaDanas === 1 ? 'pitanje' : 'pitanja'} iz lekcija koje si prošao (oko ${Math.max(1, Math.round(zaDanas * 0.5))} min).` : 'Danas nema pitanja za ponavljanje.'}</p><div class="row"><button class="btn ${zaDanas ? 'primary' : ''}" data-go="ponovi">${zaDanas ? 'Ponovi' : 'Kako radi ponavljanje'}</button></div></section>
      <section class="card"><div class="sec-t">Ova sedmica</div><p><b>${ukupno}</b> koraka u zadnjih 7 dana${niz > 1 ? ` · ${niz} dana zaredom` : ''}${cilj ? ` · cilj ${cilj}` : ''}.</p>
        ${cilj ? `<div class="napr"><span style="width:${Math.min(100, Math.round(100 * ukupno / cilj))}%"></span></div>` : ''}
        <label class="small">Sedmični cilj: <select id="ciljSel">${[0, 20, 50, 100].map(c => `<option value="${c}" ${c === cilj ? 'selected' : ''}>${c ? c + ' koraka' : 'bez cilja'}</option>`).join('')}</select></label></section>
    </div>
    <h3 class="pocetna-t">Dijelovi kursa</h3>
    <div class="pocetna">${DIJELOVI.filter(d => d.lekcije.length && !d.poslijeTema).map(dioKartica).join('')}
      ${teme.length ? `<div class="card dio-k"><div class="row" style="justify-content:space-between"><b>Dio 4 · Teme</b><span class="small muted">${procitano}/${teme.length} pročitano</span></div><div class="napr"><span style="width:${Math.round(100 * procitano / teme.length)}%"></span></div><div class="row"><button class="btn small" data-go="tema:${(teme.find(t => !P.data.teme[t.id]?.done) || teme[0]).id}">Otvori teme</button><button class="btn small" data-go="rjecnik">Rječnik</button></div></div>` : ''}
      ${DIJELOVI.filter(d => d.lekcije.length && d.poslijeTema).map(dioKartica).join('')}</div>
    <div class="row" style="margin-top:14px"><button class="btn" data-go="pretraga">🔎 Pretraga kroz kurs</button><button class="btn" data-go="biljeske">📝 Moje bilješke (${Object.values(P.data.biljeske || {}).filter(x => x.trim()).length})</button></div>`;
}

function renderPotvrda() {
  const d = DIJELOVI.find(x => x.id === cur.id);
  provjeriZavrsene();
  if (!d || !dioGotov(d)) {
    $('#main').innerHTML = `<div class="lhead"><div class="eyebrow">Potvrda</div><h2>Dio još nije završen</h2></div><section class="card"><p>Potvrda se otvara kad su sve lekcije dijela završene.</p><div class="row"><button class="btn primary" data-go="pocetna">Početna</button></div></section>`;
    return;
  }
  const n = dioKoraci(d), ok = d.lekcije.reduce((a, l) => a + Object.values(P.data.lekcije[l.id]?.koraci || {}).filter(x => x === 'ok').length, 0);
  $('#main').innerHTML = `<div class="no-print row" style="margin-bottom:12px"><label class="small">Ime na potvrdi: <input id="imePotvrda" value="${esc(P.data.ime || '')}" placeholder="Tvoje ime" autocomplete="name"></label><button class="btn primary" id="stampaj">🖨 Štampaj / sačuvaj PDF</button><button class="btn" data-go="pocetna">Početna</button></div>
    <section class="potvrda"><div class="eyebrow">Učionica programiranja</div><h2>Potvrda o završetku</h2>
      <p class="pot-ime" id="potIme">${esc(P.data.ime || 'Tvoje ime')}</p>
      <p>Završen dio kursa: <b>${esc(d.naslov)}</b> — ${d.lekcije.length} lekcija, ${n} koraka, od toga ${ok} tačno bez pomoći.</p>
      <ul class="pot-lek">${d.lekcije.map(l => `<li>${esc(l.naslov)}</li>`).join('')}</ul>
      <p class="small muted">Završeno: ${datumBs(P.data.zavrseno[d.id])}. Ovo je lična potvrda iz kursa za samostalno učenje, nije zvanični certifikat.</p></section>`;
  $('#stampaj').onclick = () => { try { window.print(); } catch (_) { alert('Preglednik ne dozvoljava štampu odavde. Napravi snimak ekrana.'); } };
}

// Pretraga: naslovi i tekst lekcija i koraka, teme i rječnik. Bez razlike č/c, š/s, ž/z, đ/dj.
const norm = t => String(t || '').replace(/<[^>]+>/g, ' ').toLowerCase().replace(/đ/g, 'dj').normalize('NFD').replace(/[̀-ͯ]/g, '');
let indeks = null;
function napraviIndeks() {
  const r = [];
  for (const d of DIJELOVI) for (const l of d.lekcije) {
    r.push({ cilj: `lek:${l.id}:0`, gdje: d.naslov.split(' · ')[0], naslov: l.naslov, tekst: l.cilj || '' });
    l.koraci.forEach((s, k) => r.push({ cilj: `lek:${l.id}:${k}`, gdje: `${l.naslov} · korak ${k + 1}`, naslov: s.naslov || TIPNAZIV[s.tip], tekst: [s.html, s.opis, s.p, s.pitanje, s.uvod, s.kod, s.e].filter(Boolean).join(' ') }));
  }
  for (const t of (typeof TEME !== 'undefined' ? TEME : [])) {
    r.push({ cilj: `tema:${t.id}`, gdje: `Dio 4 · Tema ${t.n}`, naslov: t.naslov, tekst: [t.pod, ...(t.ideja || []), ...(t.sekcije || []).flatMap(x => [x.n, ...x.t]), ...(t.greske || [])].join(' ') });
    (t.koraci || []).forEach((s, k) => r.push({ cilj: `vj:${t.id}:${k}`, gdje: `Tema ${t.n} · vježba ${k + 1}`, naslov: s.naslov || TIPNAZIV[s.tip], tekst: [s.html, s.opis, s.p, s.pitanje, s.kod].filter(Boolean).join(' ') }));
  }
  for (const [t, d, m] of (typeof RJECNIK !== 'undefined' ? RJECNIK : [])) r.push({ cilj: m ? (m.startsWith('lek:') ? m + ':0' : 'tema:' + m) : 'rjecnik', gdje: 'Rječnik', naslov: t, tekst: d });
  for (const x of r) { x.n = norm(x.naslov); x.t = norm(x.tekst); }
  return r;
}
function isjecak(tekst, q) {
  const cist = String(tekst || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); const i = norm(cist).indexOf(q);
  if (i < 0) return esc(cist.slice(0, 140));
  const a = Math.max(0, i - 60); return (a ? '…' : '') + esc(cist.slice(a, i)) + '<mark>' + esc(cist.slice(i, i + q.length)) + '</mark>' + esc(cist.slice(i + q.length, i + q.length + 80)) + '…';
}
function renderPretraga(q = '') {
  const f = norm(q.trim());
  let rez = [];
  if (f.length >= 2) { indeks = indeks || napraviIndeks(); rez = indeks.filter(x => x.n.includes(f) || x.t.includes(f)).sort((a, b) => b.n.includes(f) - a.n.includes(f)).slice(0, 40); }
  $('#main').innerHTML = `<div class="lhead"><div class="eyebrow">Pretraga</div><h2>Traži kroz cijeli kurs</h2><p class="muted">Lekcije, koraci, teme i rječnik.</p></div>
    <input class="gl-search" id="trazi" type="search" placeholder="npr. transakcija, fetch, CLAUDE.md…" value="${esc(q)}" aria-label="Pretraga kroz kurs">
    <div class="pretraga">${f.length < 2 ? '<p class="muted small">Upiši bar dva slova.</p>' : rez.length ? rez.map(x => `<button class="card pr" data-go="${esc(x.cilj)}"><span class="eyebrow">${esc(x.gdje)}</span><b>${esc(x.naslov)}</b><span class="small">${isjecak(x.tekst, f)}</span></button>`).join('') : '<p class="muted">Nema rezultata.</p>'}</div>`;
}

// Bilješke uz korak: kljuc kao u ponavljanju ('py3:5', 'm4:2').
function biljeskaHtml(kljuc) {
  const t = P.data.biljeske?.[kljuc] || '';
  return `<details class="biljeska"${t.trim() ? ' open' : ''}><summary>📝 Moja bilješka uz ovaj korak</summary><textarea data-bilj="${esc(kljuc)}" rows="3" placeholder="Svojim riječima: šta je ovdje važno, šta želim zapamtiti…" aria-label="Bilješka uz korak">${esc(t)}</textarea><div class="small muted">Čuva se sama, uz tvoj napredak.</div></details>`;
}
function renderBiljeske() {
  const sve = Object.entries(P.data.biljeske || {}).filter(([, t]) => t.trim());
  $('#main').innerHTML = `<div class="lhead"><div class="eyebrow">Bilješke</div><h2>Moje bilješke</h2><p class="muted">${sve.length ? `${sve.length} bilješki.` : 'Još nema bilješki. Ispod svakog koraka je polje „📝 Moja bilješka“.'}</p></div>
    <div class="pretraga">${sve.map(([k, t]) => { const r = korakIzKljuca(k); return r ? `<div class="card"><span class="eyebrow">${esc(r.naslov)} · korak ${Number(k.split(':')[1]) + 1}</span><p style="white-space:pre-wrap">${esc(t)}</p><div class="row"><button class="btn small" data-go="${r.cilj}">Otvori korak</button></div></div>` : ''; }).join('')}</div>`;
}

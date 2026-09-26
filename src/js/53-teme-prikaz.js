// ============================================================================
// Dio 4: teme iz Učionice v3 (TEME, DIA, PUT, LAYER, RJECNIK iz 40-teme.js) — čitanje + kviz.
// ============================================================================
let putI = 0;
function renderPut() {
  const [l, t, d, f] = PUT[putI]; const [ln, lc] = LAYER[l]; const num = $('#putNum'); if (!num) return;
  num.textContent = putI + 1;
  $('#putBody').innerHTML = `<span class="layerpill" style="background:${lc}">${ln}</span><h3>${esc(t)}</h3><p>${esc(d)}</p><p class="small muted"><code>${esc(f)}</code></p>`;
  document.querySelectorAll('[data-put]').forEach((b, i) => b.classList.toggle('on', i <= putI));
}
const tagTxt = { dobar: '✓ dobar primjer', los: '⚠ problematično', mjes: '◐ i dobro i loše' };

function renderTemaView() {
  const m = TEME.find(t => t.id === cur.id); const i = TEME.indexOf(m); const p = P.data.teme[m.id] || {};
  $('#main').innerHTML = `
  <div class="lhead"><div class="eyebrow">Dio 4 · Tema ${m.n} od ${TEME.length - 1}</div><h2>${esc(m.naslov)}</h2><p class="muted">${esc(m.pod)}</p>
  <div class="note warn small">Ova tema još nije pretvorena u interaktivne korake. Najbolje je prvo proći dijelove 1–3 (Python, JavaScript, SQL); za sve nejasno pitaj tutora.</div></div>
  <section class="card"><div class="sec-t">Ideja</div>${m.ideja.map(t => `<p>${t}</p>`).join('')}${m.analogija ? `<div class="analogy"><b>Analogija:</b> ${esc(m.analogija)}</div>` : ''}</section>
  ${m.dia ? `<section class="card"><div class="sec-t">Dijagram</div><div class="dia">${DIA[m.dia]()}</div></section>` : ''}
  <section class="card"><div class="sec-t">Tvoj kod</div>${m.kod.map(k => `<div class="snip"><div class="snip-h"><span class="tag ${k.t}">${tagTxt[k.t]}</span><span>${esc(k.p)}</span></div><pre>${esc(k.k)}</pre><div class="snip-o">${esc(k.o)}</div></div>`).join('')}</section>
  <section class="card"><div class="sec-t">Česte greške</div><ul class="greske">${m.greske.map(g => `<li>${esc(g)}</li>`).join('')}</ul></section>
  <section class="card" data-kviz="${m.id}"><div class="sec-t">Kviz</div>${m.kviz.map((q, qi) => `<div class="q" data-q="${qi}"><div class="q-p">${qi + 1}. ${esc(q.p)}</div><div class="opts">${q.o.map((o, oi) => `<button data-topt="${oi}">${esc(o)}</button>`).join('')}</div><div class="q-obj" hidden></div></div>`).join('')}<div class="score" data-score>${p.kviz ? 'Zadnji rezultat: ' + p.kviz : ''}</div></section>
  <section class="card"><div class="sec-t">Vježba</div><p style="white-space:pre-wrap">${esc(m.vjezba.z)}</p><details class="ex"><summary>Nagovještaj</summary><div><p>${esc(m.vjezba.h)}</p></div></details><details class="ex"><summary>Rješenje</summary><div><pre>${esc(m.vjezba.r)}</pre><p class="small">${esc(m.vjezba.obj)}</p></div></details></section>
  <section class="card"><div class="sec-t">Kako ovo reći agentu</div>${m.agent.map(a => `<div class="prompt">${esc(a)}</div>`).join('')}</section>
  <div class="navbtns">${i > 0 ? `<button class="btn" data-go="tema:${TEME[i - 1].id}">← ${esc(TEME[i - 1].naslov)}</button>` : '<span></span>'}<button class="btn" data-tdone="${m.id}">${p.done ? '✓ Pročitano (poništi)' : 'Označi kao pročitano'}</button>${i < TEME.length - 1 ? `<button class="btn primary" data-go="tema:${TEME[i + 1].id}">${esc(TEME[i + 1].naslov)} →</button>` : '<button class="btn primary" data-go="rjecnik">Rječnik →</button>'}</div>`;
  if (m.dia === 'put') renderPut();
}

function renderRjecnikView(q = '') {
  const f = q.trim().toLowerCase();
  const rows = RJECNIK.filter(([t, d]) => !f || (t + ' ' + d).toLowerCase().includes(f)).sort((a, b) => a[0].localeCompare(b[0], 'bs'));
  $('#main').innerHTML = `<div class="lhead"><div class="eyebrow">Rječnik</div><h2>Pojmovi od A do Ž</h2><p class="muted">${RJECNIK.length} pojmova.</p></div>
    <input class="gl-search" id="glq" type="search" placeholder="Traži pojam…" value="${esc(q)}" aria-label="Pretraga rječnika">
    <div class="gl">${rows.map(([t, d, m]) => `<div class="card"><b>${esc(t)}</b><span class="small">${esc(d)}</span>${m ? `<button data-go="tema:${m}">→ tema ${esc(m.slice(1))}</button>` : ''}</div>`).join('') || '<p class="muted">Nema rezultata.</p>'}</div>`;
}

function temaKviz(to) {
  const qEl = to.closest('[data-q]'), card = to.closest('[data-kviz]'), m = TEME.find(x => x.id === card.dataset.kviz), q = m.kviz[+qEl.dataset.q], ch = +to.dataset.topt;
  qEl.querySelectorAll('[data-topt]').forEach(b => { b.disabled = true; const k = +b.dataset.topt; if (k === q.t) b.classList.add('ok'); else if (k === ch) b.classList.add('no'); });
  qEl.dataset.ans = ch === q.t ? '1' : '0';
  const ob = qEl.querySelector('.q-obj'); ob.hidden = false; ob.textContent = (ch === q.t ? '✓ Tačno. ' : '✗ Nije tačno. ') + q.e;
  const ans = card.querySelectorAll('[data-q][data-ans]');
  if (ans.length === m.kviz.length) {
    const ok = [...ans].filter(x => x.dataset.ans === '1').length;
    P.data.teme[m.id] = { ...(P.data.teme[m.id] || {}), kviz: `${ok}/${m.kviz.length}` }; P.save(); renderMenu();
    card.querySelector('[data-score]').textContent = `Rezultat: ${ok}/${m.kviz.length}`;
  }
}


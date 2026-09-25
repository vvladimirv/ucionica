// ============================================================================
// Lekcija i vrste koraka. Svaki korak je objekat sa `tip` i poljima za tu vrstu:
//   tekst    {html}
//   primjer  {kod, jezik?, obj:{brojLinije: 'objašnjenje'}, uvod?, poslije?}
//   predvidi {kod, opcije:[], t, obj, pitanje?}
//   popuni   {kod sa ___, odg:[[prihvatljivi odgovori]…], obj, pitanje?}
//   poredaj  {linije:[tačan redoslijed], obj, pitanje?}
//   greska   {kod, linija, obj, ispravno?, pitanje?}
//   zadatak  {opis(html), pocetak, testovi:[{opis, kod}], nagovjestaji:[], rjesenje, objRj?, poslije?}
//   kviz     {p, o:[], t, e}
// jezik: 'python' (podrazumijevano) | 'js' (konzola, Worker) | 'dom' (stranica u okviru) | 'sql'
// setup: za sql SQL koji pripremi bazu, za dom HTML stranice u okviru prije pokretanja koda.
// Testovi: python assert (IZLAZ, KOD, _sa_vrijednostima); js/dom ocekuj(stvarno, ocekivano, poruka),
// js još IZLAZ, KOD, saVrijednostima({ime: vrijednost}); dom T.klikni/upisi/posalji/tekst/broj/stranica/IZLAZ.
// ============================================================================
const TIPNAZIV = { tekst: 'Objašnjenje', primjer: 'Primjer — klikni na liniju', predvidi: 'Predvidi rezultat', popuni: 'Popuni prazninu', poredaj: 'Poredaj linije', greska: 'Nađi grešku', zadatak: 'Napiši kod', kviz: 'Provjeri razumijevanje' };
let stepState = {};
const markStep = st => P.mark(cur.id, cur.k, st);

function renderDots() {
  const lek = findLek(cur.id); const el = $('#dots'); if (!lek || !el) return;
  const L = P.data.lekcije[cur.id] || { koraci: {} };
  el.innerHTML = lek.koraci.map((s, i) => `<button data-go="lek:${cur.id}:${i}" class="${L.koraci[i] === 'ok' ? 'ok' : L.koraci[i] ? 'seen' : ''} ${i === cur.k ? 'cur' : ''}" aria-label="Korak ${i + 1}: ${TIPNAZIV[s.tip]}"></button>`).join('');
}

function renderLek() {
  zaustaviDom();
  const lek = findLek(cur.id); const s = lek.koraci[cur.k]; stepState = { s };
  const dio = DIJELOVI.find(d => d.lekcije.includes(lek)); const li = dio.lekcije.indexOf(lek);
  const zadnji = cur.k === lek.koraci.length - 1; const sljedeca = dio.lekcije[li + 1];
  const sljedeciDio = DIJELOVI.slice(DIJELOVI.indexOf(dio) + 1).find(d => d.lekcije.length);
  const dalje = !zadnji ? `<button class="btn primary" data-go="lek:${lek.id}:${cur.k + 1}">Dalje →</button>`
    : sljedeca ? `<button class="btn primary" data-go="lek:${sljedeca.id}:0">Sljedeća lekcija: ${esc(sljedeca.naslov)} →</button>`
    : sljedeciDio ? `<span class="muted small">Kraj ovog dijela ✓</span><button class="btn primary" data-go="lek:${sljedeciDio.lekcije[0].id}:0">${esc(sljedeciDio.naslov)} →</button>`
    : `<span class="muted small">Kraj ovog dijela ✓</span>`;
  $('#main').innerHTML = `
    <div class="lhead"><div class="eyebrow">${esc(dio.naslov)} · lekcija ${li + 1}</div><h2>${esc(lek.naslov)}</h2>${lek.cilj ? `<p class="muted">${esc(lek.cilj)}</p>` : ''}<div class="dots" id="dots"></div></div>
    <section class="card"><div class="steptype">Korak ${cur.k + 1}/${lek.koraci.length} · ${TIPNAZIV[s.tip]}</div>${s.naslov ? `<h3>${esc(s.naslov)}</h3>` : ''}<div class="stepbody" id="step"></div></section>
    <div class="navbtns"><button class="btn" data-go="lek:${lek.id}:${cur.k - 1}" ${cur.k === 0 ? 'disabled' : ''}>← Nazad</button><button class="btn" data-tutor-explain ${sample ? '' : 'hidden'}>🤔 Ne razumijem ovaj korak</button>${dalje}</div>`;
  renderDots();
  STEP[s.tip]($('#step'), s);
  if (s.tip === 'tekst' || s.tip === 'primjer') markStep('vidjeno');
  const lang = s.jezik || 'python';
  if (lang === 'python' && s.tip !== 'tekst' && s.tip !== 'kviz') loadPy();
  if (lang === 'sql') loadSql();
}

async function pokreni(lang, code, tests, setup, box) {
  if (lang === 'dom') { const r = await runDom(code, tests, setup, box); stepState.last = r; return r; }
  box.innerHTML = '<div class="out">Pokrećem…' + (lang === 'python' && ENV.py === 'wait' ? ' (prvi put se Python učitava 10–30 s)' : '') + '</div>';
  const r = await RUN[lang](code, tests, setup);
  stepState.last = r;
  box.innerHTML = outHtml(r, lang);
  return r;
}

const STEP = {
  tekst(el, s) { el.innerHTML = s.html; },

  primjer(el, s) {
    const lang = s.jezik || 'python'; const imaObj = s.obj && Object.keys(s.obj).length;
    el.innerHTML = `${s.uvod ? `<p>${s.uvod}</p>` : ''}${kodHtml(s.kod, lang, { obj: s.obj || {}, klik: true })}
      <div class="objbox" id="obj">${imaObj ? '👆 Klikni na liniju (one sa tačkicom imaju objašnjenje).' : '👆 Klikni na liniju da je označiš, pa pitaj tutora ako nije jasna.'}</div>
      <div class="row" ${s.bezPokretanja ? 'hidden' : ''}><button class="btn primary" id="run">▶ Pokreni</button><button class="btn" id="edit">✏️ Promijeni i probaj</button></div>
      <div id="edbox"></div><div id="res"></div>${s.poslije ? `<div class="note">${s.poslije}</div>` : ''}`;
    el.querySelectorAll('.ln').forEach(ln => {
      const show = () => {
        el.querySelectorAll('.ln').forEach(x => x.classList.remove('sel')); ln.classList.add('sel');
        const n = ln.dataset.ln; stepState.linija = n;
        $('#obj').innerHTML = s.obj?.[n] ? `<b class="lnref">linija ${n}</b> · ${s.obj[n]}` : `<b class="lnref">linija ${n}</b> · <span class="muted">Nema posebnog objašnjenja — pitaj tutora ako nije jasna.</span>`;
      };
      ln.addEventListener('click', show);
      ln.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); } });
    });
    $('#edit').onclick = () => { $('#edbox').innerHTML = editorHtml('ed1', s.kod); stepState.ta = wireEditor('ed1', lang); $('#edit').hidden = true; };
    $('#run').onclick = () => pokreni(lang, stepState.ta ? stepState.ta.value : s.kod, [], s.setup, $('#res'));
  },

  predvidi(el, s) {
    const lang = s.jezik || 'python';
    el.innerHTML = `<p>${s.pitanje || 'Šta će ovaj kod ispisati? Razmisli prije nego izabereš.'}</p>${kodHtml(s.kod, lang)}
      <div class="opts">${s.opcije.map((o, i) => `<button data-o="${i}"><code>${esc(o)}</code></button>`).join('')}</div><div id="fb"></div><div id="res"></div>`;
    el.querySelectorAll('[data-o]').forEach(b => b.onclick = () => {
      const i = Number(b.dataset.o);
      el.querySelectorAll('[data-o]').forEach(x => { x.disabled = true; const k = Number(x.dataset.o); if (k === s.t) x.classList.add('ok'); else if (k === i) x.classList.add('no'); });
      $('#fb').innerHTML = `<div class="fb ${i === s.t ? 'ok' : 'no'}">${i === s.t ? '✓ Tačno! ' : '✗ Nije. '}${s.obj}</div><div class="row"><button class="btn" id="runp">▶ Pokreni i uvjeri se</button></div>`;
      markStep(i === s.t ? 'ok' : 'pomoc');
      $('#runp').onclick = () => pokreni(lang, s.kod, [], s.setup, $('#res'));
    });
  },

  popuni(el, s) {
    const lang = s.jezik || 'python'; let gi = 0;
    const gapInput = () => { const idx = gi++; const w = Math.max(3, ...s.odg[idx].map(x => x.length)) + 1; return `<input class="gap" data-g="${idx}" size="${w}" aria-label="praznina ${idx + 1}" autocapitalize="off" autocomplete="off" spellcheck="false">`; };
    const lines = s.kod.split('\n').map((l, li) => `<div class="ln"><span class="no">${li + 1}</span><span class="tx">${l.split('___').map((part, j, arr) => hl(part, lang) + (j < arr.length - 1 ? gapInput() : '')).join('')}</span></div>`).join('');
    el.innerHTML = `<p>${s.pitanje || 'Upiši ono što nedostaje u prazna polja.'}</p><div class="kod">${lines}</div>
      <div class="row"><button class="btn primary" id="chk">Provjeri</button><button class="btn" id="show">Pokaži rješenje</button></div><div id="fb"></div><div id="res"></div>`;
    const inputs = [...el.querySelectorAll('.gap')];
    const filled = () => { let k = 0; return s.kod.replace(/___/g, () => inputs[k++].value); };
    const check = async reveal => {
      let all = true;
      inputs.forEach((inp, i) => {
        if (reveal) inp.value = s.odg[i][0];
        const ok = s.odg[i].some(a => a.replace(/\s+/g, '') === inp.value.replace(/\s+/g, ''));
        inp.classList.toggle('ok', ok); inp.classList.toggle('no', !ok); all = all && ok;
      });
      $('#fb').innerHTML = `<div class="fb ${all ? 'ok' : 'no'}">${all ? (reveal ? 'Ovo je rješenje. ' : '✓ Tačno! ') + s.obj : '✗ Neka polja nisu tačna (crveni okvir). Pokušaj ponovo ili pokreni kod da vidiš šta se desi.'}</div>`;
      if (all) markStep(reveal ? 'pomoc' : 'ok');
      if (s.pokreni !== false) pokreni(lang, filled(), [], s.setup, $('#res'));
    };
    $('#chk').onclick = () => check(false);
    $('#show').onclick = () => check(true);
  },

  poredaj(el, s) {
    const lang = s.jezik || 'python';
    let order = s.linije.map((_, i) => i);
    for (let r = 1; r < 30 && order.every((v, i) => v === i); r++) order = order.map(v => [Math.sin(v * 12.9898 + r * 78.233) * 43758.5453 % 1, v]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
    const draw = mark => {
      $('#pl').innerHTML = order.map((li, pos) => `<div class="pline ${mark ? (li === pos ? 'ok' : 'no') : ''}"><span class="no" style="color:var(--term-dim);font-size:.75rem">${pos + 1}</span><pre>${hl(s.linije[li], lang) || ' '}</pre><span class="mv"><button data-up="${pos}" aria-label="Pomjeri gore" ${pos === 0 ? 'disabled' : ''}>↑</button><button data-dn="${pos}" aria-label="Pomjeri dolje" ${pos === order.length - 1 ? 'disabled' : ''}>↓</button></span></div>`).join('');
    };
    el.innerHTML = `<p>${s.pitanje || 'Linije su izmiješane. Poredaj ih strelicama tako da program radi ispravno.'}</p><div class="parsons" id="pl"></div>
      <div class="row"><button class="btn primary" id="chk">Provjeri redoslijed</button><button class="btn" id="show">Pokaži rješenje</button></div><div id="fb"></div><div id="res"></div>`;
    draw();
    $('#pl').addEventListener('click', e => {
      const u = e.target.closest('[data-up]'), d = e.target.closest('[data-dn]');
      if (u) { const p = +u.dataset.up; [order[p - 1], order[p]] = [order[p], order[p - 1]]; draw(); }
      if (d) { const p = +d.dataset.dn; [order[p + 1], order[p]] = [order[p], order[p + 1]]; draw(); }
    });
    const fin = reveal => {
      if (reveal) order = s.linije.map((_, i) => i);
      const ok = order.every((v, i) => v === i); draw(true);
      $('#fb').innerHTML = `<div class="fb ${ok ? 'ok' : 'no'}">${ok ? (reveal ? 'Ovo je ispravan redoslijed. ' : '✓ Tačno! ') + s.obj : '✗ Još nije. Zelene linije su na pravom mjestu, crvene nisu. Pitaj se: šta mora postojati PRIJE nego se koristi?'}</div>`;
      if (ok) { markStep(reveal ? 'pomoc' : 'ok'); if (s.pokreni !== false) pokreni(lang, s.linije.join('\n'), [], s.setup, $('#res')); }
    };
    $('#chk').onclick = () => fin(false);
    $('#show').onclick = () => fin(true);
  },

  greska(el, s) {
    const lang = s.jezik || 'python'; let done = false;
    el.innerHTML = `<p>${s.pitanje || 'Ovaj kod ima grešku. Klikni na liniju u kojoj je greška.'}</p>${kodHtml(s.kod, lang, { klik: true })}<div class="row"><button class="btn" id="runb">▶ Pokreni (pogledaj poruku greške)</button></div><div id="fb"></div><div id="res"></div>`;
    el.querySelectorAll('.ln').forEach(ln => ln.onclick = () => {
      if (done) return;
      const n = Number(ln.dataset.ln); const ok = n === s.linija;
      ln.classList.add(ok ? 'ok' : 'no-ok');
      if (ok) { done = true; markStep('ok'); $('#fb').innerHTML = `<div class="fb ok">✓ Tačno, linija ${n}. ${s.obj}</div>${s.ispravno ? `<p class="small">Ispravno:</p>${kodHtml(s.ispravno, lang)}` : ''}`; }
      else $('#fb').innerHTML = `<div class="fb no">✗ Linija ${n} je u redu. Pokreni kod i pročitaj poruku greške — ona obično kaže broj linije.</div>`;
    });
    $('#runb').onclick = () => pokreni(lang, s.kod, [], s.setup, $('#res'));
  },

  zadatak(el, s) {
    const lang = s.jezik || 'python'; let hi = 0;
    el.innerHTML = `<div class="stepbody">${s.opis}</div>${editorHtml('ed2', s.pocetak || '')}
      <div class="row"><button class="btn primary" id="run">▶ Pokreni i provjeri</button><button class="btn" id="hint" ${(s.nagovjestaji || []).length ? '' : 'hidden'}>💡 Nagovještaj</button><button class="btn" id="aicheck" hidden>🤖 Provjeri sa tutorom</button><button class="btn" id="sol">Pokaži rješenje</button></div>
      <div id="hints"></div><div id="res"></div><div class="tests" id="tests">${testsHtml(s.testovi)}</div><div id="solbox"></div>`;
    const ta = wireEditor('ed2', lang); stepState.ta = ta;
    $('#run').onclick = async () => {
      const r = await pokreni(lang, ta.value, s.testovi, s.setup, $('#res'));
      if (!r) { if (sample) $('#aicheck').hidden = false; return; }
      $('#tests').innerHTML = testsHtml(s.testovi, r.tests);
      if (r.tests.length && r.tests.every(t => t.ok)) { markStep(stepState.pomoc ? 'pomoc' : 'ok'); $('#res').insertAdjacentHTML('beforeend', `<div class="fb ok">🎉 Svi testovi prolaze!${s.poslije ? ' ' + s.poslije : ''}</div>`); }
    };
    $('#hint').onclick = () => { const h = s.nagovjestaji || []; if (hi < h.length) $('#hints').insertAdjacentHTML('beforeend', `<div class="hint">💡 ${h[hi++]}</div>`); if (hi >= h.length) $('#hint').disabled = true; };
    $('#sol').onclick = () => { stepState.pomoc = true; $('#solbox').innerHTML = `<p class="small muted">Rješenje — pročitaj ga liniju po liniju, pa ga napiši sam i pokreni:</p>${kodHtml(s.rjesenje, lang)}${s.objRj ? `<div class="note">${s.objRj}</div>` : ''}`; };
    $('#aicheck').onclick = () => aiCheck(s, ta.value);
    if (lang === 'python') loadPy().then(py => { if (!py && sample) $('#aicheck').hidden = false; });
  },

  kviz(el, s) {
    el.innerHTML = `<p class="q-p">${esc(s.p)}</p><div class="opts">${s.o.map((o, i) => `<button data-o="${i}">${esc(o)}</button>`).join('')}</div><div id="fb"></div>`;
    el.querySelectorAll('[data-o]').forEach(b => b.onclick = () => {
      const i = Number(b.dataset.o);
      el.querySelectorAll('[data-o]').forEach(x => { x.disabled = true; const k = Number(x.dataset.o); if (k === s.t) x.classList.add('ok'); else if (k === i) x.classList.add('no'); });
      $('#fb').innerHTML = `<div class="fb ${i === s.t ? 'ok' : 'no'}">${i === s.t ? '✓ Tačno. ' : '✗ Nije tačno. '}${esc(s.e)}</div>`;
      markStep(i === s.t ? 'ok' : 'pomoc');
    });
  },
};


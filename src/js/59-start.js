// ============================================================================
// Događaji (jedan slušač na dokumentu — event delegation) i pokretanje aplikacije.
// ============================================================================
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]'); if (g && !g.disabled) { go(g.dataset.go); return; }
  if (e.target.closest('[data-tutor-explain]')) { ask('Ne razumijem ovaj korak. Objasni mi ga jednostavnije, korak po korak.'); return; }
  const tq = e.target.closest('[data-tq]'); if (tq) { ask(tq.dataset.tq); return; }
  const pn = e.target.closest('[data-putnav]'); if (pn) { putI = Math.max(0, Math.min(PUT.length - 1, putI + Number(pn.dataset.putnav))); renderPut(); return; }
  const pb = e.target.closest('[data-put]'); if (pb) { putI = Number(pb.dataset.put); renderPut(); return; }
  const td = e.target.closest('[data-tdone]'); if (td) { const id = td.dataset.tdone; P.data.teme[id] = { ...(P.data.teme[id] || {}), done: !(P.data.teme[id] || {}).done }; P.save(); render(); return; }
  const to = e.target.closest('[data-topt]'); if (to) temaKviz(to);
});
document.addEventListener('change', e => {
  if (e.target.id === 'ciljSel') { P.data.cilj = Number(e.target.value); P.save(); renderPocetna(); }
});
document.addEventListener('input', e => {
  const bj = e.target.closest?.('[data-bilj]');
  if (bj) { (P.data.biljeske || (P.data.biljeske = {}))[bj.dataset.bilj] = bj.value; P.save(); return; }
  if (e.target.id === 'trazi') { const v = e.target.value; renderPretraga(v); const i = $('#trazi'); i.focus(); i.setSelectionRange(v.length, v.length); return; }
  if (e.target.id === 'imePotvrda') { P.data.ime = e.target.value; $('#potIme').textContent = e.target.value || 'Tvoje ime'; P.save(); return; }
  if (e.target.id === 'glq') { const v = e.target.value; renderRjecnikView(v); const i = $('#glq'); i.focus(); i.setSelectionRange(v.length, v.length); }
});
$('#tSend').onclick = () => { const v = $('#tIn').value; $('#tIn').value = ''; ask(v); };
$('#tIn').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#tSend').click(); } });
$('#tStop').onclick = () => tCtl?.abort();
$('#tClose').onclick = closeTutor;
$('#tOpen').onclick = openTutor;
$('#tDrugi').onclick = () => { const v = $('#tIn').value; $('#tIn').value = ''; if (v.trim()) tMsg('user', v); drugiAi(v); };

P.load();
renderStatus();
Ponovi.dopuni();
go((location.hash || '').slice(1).replace(/-/g, ':') || 'pocetna', false);
P.cloud();
loadSql();
claudeUse('sample').then(s => {
  // bez Claude-a tutor i dalje radi: pripremi pitanje za besplatni AI (drugiAi u 52-tutor.js)
  sample = s; ENV.tutor = s ? 'claude' : 'drugi'; renderStatus();
});


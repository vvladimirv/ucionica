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
document.addEventListener('input', e => {
  if (e.target.id === 'glq') { const v = e.target.value; renderRjecnikView(v); const i = $('#glq'); i.focus(); i.setSelectionRange(v.length, v.length); }
});
$('#tSend').onclick = () => { const v = $('#tIn').value; $('#tIn').value = ''; ask(v); };
$('#tIn').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#tSend').click(); } });
$('#tStop').onclick = () => tCtl?.abort();
$('#tClose').onclick = closeTutor;
$('#tOpen').onclick = openTutor;

P.load();
renderStatus();
go((location.hash || '').slice(1).replace(/-/g, ':') || P.data.zadnje || '', false);
P.cloud();
loadSql();
claudeUse('sample').then(s => {
  sample = s; ENV.tutor = s ? 'ok' : 'bad'; renderStatus();
  $('#tOpen').hidden = !s; renderTutorQuick();
  document.querySelectorAll('[data-tutor-explain]').forEach(b => { b.hidden = !s; });
});


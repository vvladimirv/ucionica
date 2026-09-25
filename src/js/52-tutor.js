// ============================================================================
// Tutor: Claude preko `sample` capability-ja (troši tvoj Claude plan; prvi poziv traži dozvolu).
// Kontekst (lekcija, korak, tvoj kod, zadnji rezultat) šalje se uz svako pitanje.
// ============================================================================
let sample = null, tCtl = null;
const tTurns = [];
const TUTOR_RULES = `Ti si strpljiv nastavnik programiranja u aplikaciji „Učionica programiranja“. Učenik je odrasla osoba koja je sa AI agentima pravila web aplikacije (Flask/Python backend, vanilla JavaScript frontend, SQLite/PostgreSQL) za svoju firmu (namještaj po mjeri, klijenti, ponude, fakture), ali NE zna čitati ni pisati kod — uči od nule.
Pravila:
- Odgovaraj na bosanskom (ijekavica), jednostavnim riječima i kratko (do ~150 riječi, osim ako traži više).
- Svaki stručni pojam objasni čim ga uvedeš; koristi analogije iz svakodnevnog života ili iz njegove firme.
- Kod objašnjavaj liniju po liniju: šta računar radi i kojim redom.
- Kod zadataka NE daj gotovo rješenje odmah: prvo nagovještaj ili pitanje koje ga vodi. Cijelo rješenje samo ako izričito traži.
- Kad vidiš grešku u njegovom kodu, reci na kojoj liniji i zašto, pa ga pusti da sam popravi.
- Kod piši u trostrukim backtickovima.`;

function stepContext() {
  if (cur.tip === 'tema') return `Učenik čita temu: ${TEME.find(t => t.id === cur.id)?.naslov}.`;
  if (cur.tip !== 'lek') return 'Učenik je u rječniku pojmova.';
  const lek = findLek(cur.id), s = lek.koraci[cur.k];
  const strip = h => String(h || '').replace(/<[^>]+>/g, '').slice(0, 2500);
  let c = `Lekcija: ${lek.naslov}. Korak ${cur.k + 1}/${lek.koraci.length} (${TIPNAZIV[s.tip]}).`;
  if (s.html) c += `\nTekst koraka: ${strip(s.html)}`;
  if (s.opis) c += `\nZadatak: ${strip(s.opis)}`;
  if (s.p) c += `\nPitanje: ${s.p}`;
  if (s.pitanje) c += `\nPitanje: ${strip(s.pitanje)}`;
  if (s.kod) c += `\nKod iz koraka (${s.jezik || 'python'}):\n${s.kod}`;
  if (s.setup) c += `\n${s.jezik === 'sql' ? 'SQL koji pripremi bazu' : 'HTML stranice u okviru'}:\n${s.setup}`;
  if (s.linije) c += `\nLinije za poredati:\n${s.linije.join('\n')}`;
  if (stepState.linija) c += `\nUčenik je označio liniju ${stepState.linija}.`;
  if (stepState.ta) c += `\nUčenikov trenutni kod:\n${stepState.ta.value.slice(0, 3000)}`;
  if (stepState.last) c += `\nZadnje pokretanje: izlaz=${JSON.stringify(stepState.last.out || '').slice(0, 800)}; greška=${stepState.last.err || 'nema'}; testovi=${JSON.stringify(stepState.last.tests || [])}`;
  return c;
}

function renderTutorQuick() {
  if (!sample) return;
  const q = cur.tip === 'lek'
    ? ['Objasni ovaj korak jednostavnije', 'Daj mi još jedan primjer', 'Zašto se ovo radi ovako?', 'Šta nije u redu s mojim kodom?']
    : ['Objasni ovu temu jednostavnije', 'Daj primjer iz mog posla'];
  $('#tQuick').innerHTML = q.map(x => `<button data-tq="${esc(x)}">${esc(x)}</button>`).join('');
}
function tMsg(role, text) {
  const d = document.createElement('div'); d.className = 'tm ' + (role === 'user' ? 'u' : 'a'); d.textContent = text;
  $('#tMsgs').appendChild(d); $('#tMsgs').scrollTop = 1e9; return d;
}
function openTutor() { $('#tutor').hidden = false; $('#tOpen').hidden = true; $('#layout').classList.add('tutor-open'); $('#tIn').focus(); }
function closeTutor() { $('#tutor').hidden = true; $('#tOpen').hidden = !sample; $('#layout').classList.remove('tutor-open'); }

async function ask(text) {
  if (!sample || !text.trim()) return;
  openTutor();
  tMsg('user', text); tTurns.push({ role: 'user', content: text });
  const d = tMsg('assistant', 'Razmišljam…');
  tCtl?.abort(); tCtl = new AbortController();
  $('#tStop').hidden = false; $('#tSend').disabled = true;
  const input = [{ role: 'user', content: TUTOR_RULES + '\n\nKontekst (gdje je učenik sada):\n' + stepContext() + '\n\nPitanje slijedi.' }, ...tTurns.slice(-8)];
  try {
    const { text: t } = await sample(input, { cache: false, signal: tCtl.signal, onText: ({ text: x }) => { d.textContent = x; $('#tMsgs').scrollTop = 1e9; } });
    d.textContent = t; tTurns.push({ role: 'assistant', content: t });
  } catch (e) {
    d.textContent = e.text || '';
    if (e.code === 'cancelled') { if (!e.text) d.remove(); }
    else if (['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed'].includes(e.code)) { d.className = 'tm err'; d.textContent = 'Tutor nije dozvoljen u ovom prikazu. Ostatak aplikacije radi normalno.'; ENV.tutor = 'bad'; renderStatus(); }
    else if (e.code === 'rate_limited') { d.className = 'tm err'; d.textContent = (e.text ? e.text + '\n\n' : '') + 'Previše pitanja odjednom ili je dostignut limit. Pokušaj malo kasnije.'; }
    else { d.className = 'tm err'; d.textContent = (e.text ? e.text + '\n\n' : '') + 'Odgovor je prekinut. Pošalji pitanje ponovo.'; }
  } finally { $('#tStop').hidden = true; $('#tSend').disabled = false; }
}

// Rezerva kad Python ne radi u pregledniku: tutor procjenjuje kod i testove (jasno označeno kao procjena).
async function aiCheck(s, code) {
  $('#res').innerHTML = '<div class="out">Tutor provjerava tvoj kod (ovo nije pravo izvršavanje, nego procjena)…</div>';
  try {
    const r = await sample.json(`Ponašaj se kao Python interpreter i procijeni kod početnika. Zadatak: ${String(s.opis).replace(/<[^>]+>/g, '')}
Kod:
${code}
Testovi (Python assert; IZLAZ je sve što je kod ispisao):
${s.testovi.map((t, i) => `${i + 1}. ${t.opis}: ${t.kod}`).join('\n')}
Odgovori SAMO JSON: {"izlaz": "šta bi kod ispisao", "greska": null ili "TipGreške (linija N): poruka", "testovi": [{"ok": true, "poruka": "kratko na bosanskom"}]}`, { modelTier: 'default' });
    const res = { ok: !r.greska, out: String(r.izlaz || ''), err: r.greska, errType: r.greska ? String(r.greska).split(/[ :(]/)[0] : null, tests: (r.testovi || []).map(t => ({ ok: !!t.ok, m: t.poruka || '' })) };
    $('#res').innerHTML = '<p class="small muted">🤖 Procjena tutora (Python nije pokrenut u pregledniku):</p>' + outHtml(res, 'python');
    $('#tests').innerHTML = testsHtml(s.testovi, res.tests);
    if (res.tests.length && res.tests.every(t => t.ok)) markStep('ok');
  } catch (e) { $('#res').innerHTML = `<div class="hint">Tutor nije mogao provjeriti kod (${esc(e.code || 'greška')}).</div>`; }
}


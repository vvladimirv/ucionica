// ============================================================================
// Izvršavanje koda u pregledniku: Python (Pyodide) i SQL (sql.js); JavaScript je u 02-izvrsavanje-js.js.
// Svaki runner vraća isti oblik: { ok, out, err, errType, errLine, tests: [{ok, m}], tabele? } ili null.
// ============================================================================
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const claudeUse = name => (window.claude && typeof window.claude.use === 'function') ? window.claude.use(name).catch(() => null) : Promise.resolve(null);

const ENV = { py: 'mir', sql: 'wait', js: 'ok', tutor: 'wait', save: 'local' };   // py se učita tek na prvom Python koraku
function renderStatus() {
  const lbl = { ok: 'radi', wait: 'učitava se', mir: 'kad zatreba', bad: 'nedostupno', local: 'ovaj preglednik', cloud: 'tvoj nalog' };
  const cls = v => v === 'ok' || v === 'cloud' ? 'ok' : v === 'bad' ? 'bad' : v === 'local' || v === 'mir' ? '' : 'wait';
  $('#status').innerHTML = [['Python', ENV.py], ['JavaScript', ENV.js], ['SQL', ENV.sql], ['Tutor', ENV.tutor], ['Napredak', ENV.save]]
    .map(([n, v]) => `<span class="pill ${cls(v)}">${n}: ${lbl[v] || v}</span>`).join('');
}
function loadScript(src) {
  return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Ne mogu učitati ' + src)); document.head.appendChild(s); });
}

// ---------------------------------------------------------------- Python
// pyodide.asm.wasm (9,6 MB) je objavljen u 4 dijela jer upload većih fajlova ističe; ovdje se spajaju.
const _fetch = window.fetch.bind(window);
window.fetch = async (input, init) => {
  const url = input instanceof Request ? input.url : String(input);   // string, URL ili Request
  if (url.endsWith('/pyodide.asm.wasm')) {
    const base = url.slice(0, -'pyodide.asm.wasm'.length);
    const parts = await Promise.all([0, 1, 2, 3].map(i => _fetch(`${base}pyodide.asm.part${i}.wasm`).then(r => { if (!r.ok) throw new Error('dio ' + i + ': HTTP ' + r.status); return r.arrayBuffer(); })));
    return new Response(new Blob(parts), { status: 200, headers: { 'Content-Type': 'application/wasm' } });
  }
  return _fetch(input, init);
};

const PY_PRELUDE = String.raw`
import sys, io, json, traceback, re
def _sa_vrijednostima(kod, **vrijednosti):
    # Pokreni učenikov kod sa drugim početnim vrijednostima (zamijeni prvu liniju "ime = ...").
    for ime, v in vrijednosti.items():
        kod = re.sub(r'^' + ime + r'\s*=.*$', f'{ime} = {v!r}', kod, count=1, flags=re.M)
    buf = io.StringIO()
    old = sys.stdout
    sys.stdout = buf
    try:
        exec(compile(kod, '<tvoj kod>', 'exec'), {'__name__': '__main__'})
    finally:
        sys.stdout = old
    return buf.getvalue()
def _ucionica_run(code, tests_json):
    tests = json.loads(tests_json)
    out = io.StringIO()
    ns = {'__name__': '__main__'}
    old = (sys.stdout, sys.stderr)
    sys.stdout = sys.stderr = out
    steps = [0]
    def tr(frame, event, arg):
        if event == 'line':
            steps[0] += 1
            if steps[0] > 300000:
                raise TimeoutError('Kod se izvršava predugo — vjerovatno beskonačna petlja.')
        return tr
    res = {'ok': True, 'out': '', 'err': None, 'errType': None, 'errLine': None, 'tests': []}
    try:
        sys.settrace(tr)
        exec(compile(code, '<tvoj kod>', 'exec'), ns)
    except BaseException as e:
        res['ok'] = False
        res['errType'] = type(e).__name__
        tb = [f for f in traceback.extract_tb(e.__traceback__) if f.filename == '<tvoj kod>']
        if isinstance(e, SyntaxError):
            res['errLine'] = e.lineno
            res['err'] = f"{type(e).__name__} (linija {e.lineno}): {e.msg}"
        else:
            res['errLine'] = tb[-1].lineno if tb else None
            where = f" (linija {res['errLine']})" if res['errLine'] else ''
            res['err'] = f"{type(e).__name__}{where}: {e}"
    finally:
        sys.settrace(None)
        sys.stdout, sys.stderr = old
    res['out'] = out.getvalue()
    ns['IZLAZ'] = res['out']
    ns['KOD'] = code
    ns['_sa_vrijednostima'] = _sa_vrijednostima
    for t in tests:
        if not res['ok']:
            res['tests'].append({'ok': None, 'm': 'nije pokrenut (kod ima grešku)'})
            continue
        try:
            exec(compile(t['kod'], '<test>', 'exec'), ns)
            res['tests'].append({'ok': True, 'm': ''})
        except AssertionError as e:
            res['tests'].append({'ok': False, 'm': str(e)})
        except BaseException as e:
            res['tests'].append({'ok': False, 'm': f"{type(e).__name__}: {e}"})
    return json.dumps(res)
`;
let pyPromise = null;
function loadPy() {
  if (pyPromise) return pyPromise;
  ENV.py = 'wait'; renderStatus();
  pyPromise = (async () => {
    await loadScript('https://cdn.jsdelivr.net/npm/pyodide@314.0.7/pyodide.js');
    const py = await loadPyodide({ indexURL: new URL('py/', location.href).href, stdLibURL: new URL('py/python_stdlib.wasm', location.href).href });
    py.runPython(PY_PRELUDE);
    ENV.py = 'ok'; renderStatus();
    return py;
  })().catch(e => { ENV.py = 'bad'; renderStatus(); console.warn('Python nije dostupan:', e); return null; });
  return pyPromise;
}
async function runPy(code, tests = []) {
  const py = await loadPy();
  if (!py) return null;
  const fn = py.globals.get('_ucionica_run');
  const r = JSON.parse(fn(code, JSON.stringify(tests)));
  fn.destroy?.();
  return r;
}

// ---------------------------------------------------------------- SQL
let sqlPromise = null;
function loadSql() {
  if (sqlPromise) return sqlPromise;
  sqlPromise = (async () => {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js');
    const wasm = await (await _fetch(new URL('sql/sql-wasm.wasm', location.href).href)).arrayBuffer();
    const SQL = await initSqlJs({ wasmBinary: wasm });
    ENV.sql = 'ok'; renderStatus(); return SQL;
  })().catch(e => { ENV.sql = 'bad'; renderStatus(); console.warn('SQL nije dostupan:', e); return null; });
  return sqlPromise;
}
// Linija greške u SQL-u. sql.js ne daje poziciju, pa se ona izvodi iz poruke SQLite-a:
// pala pokrenuta naredba (npr. ograničenje) → linija gdje naredba počinje; greška pri čitanju naredbe →
// prvo mjesto spornog dijela iz poruke (near "…", no such column: …) u ostatku koda.
function sqlLinija(code, od, sql, poruka) {
  const linijaNa = i => code.slice(0, i).split('\n').length;
  const tekst = sql ?? code.slice(od);
  const prvi = Math.max(0, tekst.search(/\S/));
  if (sql) return linijaNa(od + prvi);
  if (/incomplete input/.test(poruka)) return code.replace(/\s+$/, '').split('\n').length;
  const m = poruka.match(/near "((?:[^"]|"")*)"|unrecognized token: "((?:[^"]|"")*)"|no such column: (\S+)|no such table: (\S+)|misuse of aggregate:? (\w+)|ambiguous column name: (\S+)|no such function: (\w+)/);
  const token = m && m.slice(1).find(x => x !== undefined);
  if (token) {
    const t = token.replace(/""/g, '"');
    const re = new RegExp(/^\w/.test(t) ? `(?<![\\w.])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!\\w)` : t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    // agregat u WHERE (misuse of aggregate) traži se poslije WHERE, jer se isti agregat često nalazi i u SELECT listi
    const w = m[5] !== undefined ? tekst.search(/\bWHERE\b/i) : -1;
    const i = w >= 0 && tekst.slice(w).search(re) >= 0 ? w + tekst.slice(w).search(re) : tekst.search(re);
    if (i >= 0) return linijaNa(od + i);
  }
  return linijaNa(od + prvi);
}
// Poruka za naredbu koja ne vraća redove (INSERT, UPDATE, CREATE…), da učenik vidi šta se desilo.
function sqlPoruka(sql, izmijenjeno) {
  const rijec = (sql.trim().match(/^\w+(\s+\w+)?/) || [''])[0].toUpperCase();
  const prva = rijec.split(/\s+/)[0];
  const opis = { INSERT: `dodano redova: ${izmijenjeno}`, UPDATE: `izmijenjeno redova: ${izmijenjeno}`, DELETE: `obrisano redova: ${izmijenjeno}`,
    BEGIN: 'transakcija je počela', COMMIT: 'izmjene su trajno upisane', ROLLBACK: 'izmjene iz transakcije su poništene',
    CREATE: /INDEX/.test(rijec) ? 'indeks je napravljen' : 'tabela je napravljena', DROP: 'obrisano', ALTER: 'tabela je izmijenjena' }[prva];
  return `✓ ${prva}${opis ? ' — ' + opis : ''}`;
}
// testovi: {opis, upit, ocekivano:[[...]], redoslijed?}; bez `upit` provjerava se rezultat tvog zadnjeg SELECT-a.
// Naredbe se izvršavaju jedna po jedna: rezultati idu redom u `blokovi` (tabela ili poruka), i ostaju i kad kasnija naredba padne.
async function runSql(code, tests = [], setup = '') {
  const SQL = await loadSql();
  if (!SQL) return null;
  const db = new SQL.Database();
  const res = { ok: true, out: '', err: null, errType: null, errLine: null, tabele: [], blokovi: [], tests: [] };
  try { if (setup) db.run(setup); } catch (e) { res.ok = false; res.err = 'Greška u pripremi baze: ' + e.message; db.close(); return res; }
  let last = null, pozicija = 0, trenutna = null;
  try {
    for (const st of db.iterateStatements(code)) {
      trenutna = { od: pozicija, sql: st.getSQL() };
      pozicija += trenutna.sql.length;
      const cols = st.getColumnNames(), rows = [];
      while (st.step()) rows.push(st.get());
      if (cols.length) { last = { cols, rows }; res.tabele.push(last); res.blokovi.push({ tabela: last }); }
      else res.blokovi.push({ poruka: sqlPoruka(trenutna.sql, db.getRowsModified()) });
      trenutna = null;
    }
  } catch (e) {
    res.ok = false; res.errType = 'SQLError';
    res.errLine = sqlLinija(code, trenutna ? trenutna.od : pozicija, trenutna && trenutna.sql, e.message);
    res.err = `SQL greška (linija ${res.errLine}): ${e.message}`;
  }
  res.out = res.blokovi.filter(b => b.poruka).map(b => b.poruka + '\n').join('');
  const norm = rows => rows.map(r => JSON.stringify(r.map(v => typeof v === 'number' ? Math.round(v * 100) / 100 : v)));
  for (const t of tests) {
    if (!res.ok) { res.tests.push({ ok: null, m: 'nije pokrenut (upit ima grešku)' }); continue; }
    try {
      const rows = t.upit ? (db.exec(t.upit)[0]?.values || []) : (last?.rows || []);
      let a = norm(rows), b = norm(t.ocekivano);
      if (!t.redoslijed) { a = a.sort(); b = b.sort(); }
      const ok = a.length === b.length && a.every((x, i) => x === b[i]);
      res.tests.push({ ok, m: ok ? '' : `očekivano: ${JSON.stringify(t.ocekivano).slice(0, 160)} — dobijeno: ${JSON.stringify(rows).slice(0, 160)}` });
    } catch (e) { res.tests.push({ ok: false, m: e.message }); }
  }
  db.close();
  return res;
}
const RUN = { python: runPy, sql: (c, t, s) => runSql(c, t, s) };   // js i dom dodaje 02-izvrsavanje-js.js

// Objašnjenja grešaka za početnike, po jeziku (ključ = tip greške iz runnera).
const GRESKE = {
  python: {
    NameError: 'Python ne zna za to ime. Najčešće: ime je pogrešno napisano, varijabla se koristi prije nego što je napravljena, ili je tekst napisan bez navodnika.',
    SyntaxError: 'Python ne može pročitati ovu liniju — prekršeno je pravilo pisanja: nedostaje dvotačka (:), zagrada ili navodnik, ili je nešto viška.',
    IndentationError: 'Pogrešno uvlačenje. Linije unutar if/for/def moraju biti uvučene (4 razmaka), a linije na istom nivou jednako uvučene.',
    TypeError: 'Operacija nad pogrešnim tipom, npr. sabiranje teksta i broja ("5" + 3), ili poziv funkcije sa pogrešnim brojem argumenata.',
    ValueError: 'Tip je dobar, ali vrijednost nije, npr. int("abc") — tekst koji nije broj.',
    ZeroDivisionError: 'Dijeljenje nulom nije dozvoljeno.',
    KeyError: 'U rječniku nema tog ključa. Provjeri naziv ključa ili koristi .get(ključ).',
    IndexError: 'Tražiš element liste koji ne postoji. Indeksi počinju od 0, a zadnji je len(lista) - 1.',
    AttributeError: 'Taj objekat nema tu metodu ili polje, npr. lista nema .add() (koristi .append()).',
    TimeoutError: 'Program se nije završio. Provjeri da li se uslov petlje ikad promijeni.',
    Timeout: 'Program se nije završio. Provjeri da li se uslov petlje ikad promijeni.',
  },
  js: {
    SyntaxError: 'JavaScript ne može pročitati kod: nedostaje ili je viška zagrada ( ), vitičasta zagrada { }, navodnik ili zarez. Pogledaj označenu liniju i onu prije nje.',
    ReferenceError: 'JavaScript ne zna za to ime: pogrešno je napisano (velika i mala slova se razlikuju), nije deklarisano sa const ili let, ili se koristi prije deklaracije.',
    TypeError: 'Vrijednost ne podržava to što tražiš: npr. poziv nečega što nije funkcija, čitanje polja od undefined ili null (x.ime kad je x undefined), ili nova vrijednost za const.',
    RangeError: 'Vrijednost je van dozvoljenog opsega — najčešće funkcija koja beskonačno poziva samu sebe.',
    Timeout: 'Program se nije završio. Provjeri da li se uslov petlje ikad promijeni i da li negdje čekaš (await) nešto što nikad ne stigne.',
  },
  sql: {
    SQLError: 'Baza nije mogla izvršiti upit — provjeri nazive tabela/kolona, zareze i navodnike.',
  },
};
const objasnjenjeGreske = (tip, lang) => (GRESKE[lang === 'dom' ? 'js' : lang] || {})[tip] || '';


// ============================================================================
// JavaScript: dva načina izvršavanja, isti oblik rezultata kao Python i SQL.
//   js  — Web Worker. Učenikov kod se upiše direktno u skriptu workera, pa preglednik tačno
//         javi liniju greške. Beskonačnu petlju prekida gašenje workera nakon 4 s.
//   dom — glavna nit, nad pravim DOM-om u izolovanom okviru (shadow DOM) sa pregledom stranice.
//         document/window/localStorage su zamjene vezane za okvir; svaka petlja dobije čuvara
//         (ubaciCuvara), jer glavnu nit ne možemo ugasiti kao worker.
// Oba imaju fetch prema lažnom serveru (napraviServer) i isti ispis konzole (formatiraj).
// formatiraj, napraviServer, jednako i ocekuj se prepisuju u worker kao tekst (toString),
// pa ne smiju koristiti ništa izvan sebe.
// ============================================================================

// Ispis vrijednosti kao u konzoli preglednika: tekst bez navodnika, unutar nizova/objekata sa njima.
function formatiraj(v, d = 0) {
  const u = x => formatiraj(x, d + 1);
  const t = typeof v;
  if (t === 'string') return d ? `'${v}'` : v;
  if (v === null || t === 'undefined' || t === 'number' || t === 'boolean') return String(v);
  if (t === 'bigint') return v + 'n';
  if (t === 'symbol') return v.toString();
  if (t === 'function') return /^class\b/.test(Function.prototype.toString.call(v)) ? `class ${v.name}` : `ƒ ${v.name}()`;
  if (v instanceof Error) return `${v.name}: ${v.message}`;
  if (v instanceof Promise) {
    const s = v[Symbol.for('ucionica.stanje')];
    return s && s.stanje !== 'pending' ? `Promise {<${s.stanje}>: ${u(s.vrijednost)}}` : 'Promise {<pending>}';
  }
  if (v[Symbol.toStringTag] === 'Response') return `Response {status: ${v.status}, ok: ${v.ok}, url: '${v.url}'}`;
  if (typeof Element !== 'undefined' && v instanceof Element) { const h = v.outerHTML; return h.length > 90 ? h.slice(0, 89) + '…' : h; }
  if (typeof NodeList !== 'undefined' && v instanceof NodeList) return `NodeList(${v.length}) [${[...v].map(u).join(', ')}]`;
  if (typeof Node !== 'undefined' && v instanceof Node) return v.nodeType === 3 ? `"${v.textContent}"` : v.nodeName.toLowerCase();
  if (v instanceof Date) return String(v);
  if (v instanceof Map) return d > 2 ? `Map(${v.size})` : `Map(${v.size}) {${[...v].map(([k, x]) => `${u(k)} => ${u(x)}`).join(', ')}}`;
  if (v instanceof Set) return d > 2 ? `Set(${v.size})` : `Set(${v.size}) {${[...v].map(u).join(', ')}}`;
  if (Array.isArray(v)) return d > 2 ? `Array(${v.length})` : `[${v.map(u).join(', ')}]`;
  if (d > 2) return '{…}';
  const kljuc = k => /^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`;
  return `{${Object.entries(v).map(([k, x]) => `${kljuc(k)}: ${u(x)}`).join(', ')}}`;
}

function jednako(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function ocekuj(stvarno, ocekivano, poruka) {
  if (!jednako(stvarno, ocekivano)) throw new Error((poruka ? poruka + ': ' : '') + 'očekivano ' + formatiraj(ocekivano, 1) + ', dobijeno ' + formatiraj(stvarno, 1));
}

// Lažni server koji se ponaša kao API u inhome: /api/klijenti (GET, POST, GET/PATCH/DELETE po id-u),
// /api/fakture (?klijent_id=), plus rute za vježbu grešaka: /api/pad (500), /api/profil (401),
// /api/spor (odgovor poslije 1,5 s). Adrese drugih sajtova daju mrežnu grešku, kao bez interneta.
// Svaki poziv napraviServer() ima svoju svježu bazu, pa se pokretanja ne miješaju.
function napraviServer(kasnjenje = 120) {
  const STANJE = Symbol.for('ucionica.stanje');
  const baza = {
    klijenti: [
      { id: 1, name: 'Amra Kovačević', phone: '061 123 456', city: 'Sarajevo' },
      { id: 2, name: 'Emir Hodžić', phone: '062 555 111', city: 'Mostar' },
      { id: 3, name: 'Selma Begić', phone: '', city: 'Tuzla' },
    ],
    fakture: [
      { id: 10, broj: 'FAK-1', klijent_id: 1, iznos: 1200, placeno: 1200 },
      { id: 11, broj: 'FAK-2', klijent_id: 1, iznos: 450, placeno: 0 },
      { id: 12, broj: 'FAK-3', klijent_id: 2, iznos: 3200, placeno: 1000 },
    ],
    sljedeciId: 4,
  };
  let naCekanju = 0;
  const kopija = x => JSON.parse(JSON.stringify(x));
  const OPIS = { 200: 'OK', 201: 'Created', 400: 'Bad Request', 401: 'Unauthorized', 404: 'Not Found', 405: 'Method Not Allowed', 415: 'Unsupported Media Type', 500: 'Internal Server Error' };

  function odgovor(status, tijelo, url) {
    const tekst = typeof tijelo === 'string' ? tijelo : JSON.stringify(tijelo);
    let procitano = false;
    const citaj = async ime => {
      if (procitano) throw new TypeError(`Failed to execute '${ime}' on 'Response': body stream already read`);
      procitano = true;
      return tekst;
    };
    return {
      [Symbol.toStringTag]: 'Response',
      status, ok: status >= 200 && status < 300, statusText: OPIS[status] || '', url,
      headers: new Headers({ 'content-type': typeof tijelo === 'string' ? 'text/plain; charset=utf-8' : 'application/json' }),
      get bodyUsed() { return procitano; },
      text: () => citaj('text'),
      json: async () => JSON.parse(await citaj('json')),
    };
  }

  function obradi(metoda, put, upit, zaglavlja, tijelo) {
    const m = put.match(/^\/api\/klijenti(?:\/([^/]+))?\/?$/);
    if (m) {
      if (m[1] === undefined) {
        if (metoda === 'GET') return [200, kopija(baza.klijenti)];
        if (metoda !== 'POST') return [405, { error: 'Metoda nije dozvoljena.' }];
        if (!(zaglavlja.get('content-type') || '').includes('application/json')) return [415, { error: 'Zahtjev mora imati zaglavlje Content-Type: application/json.' }];
        let data;
        try { data = JSON.parse(tijelo ?? ''); } catch (_) { return [400, { error: 'Tijelo zahtjeva nije ispravan JSON.' }]; }
        data = data || {};
        const name = String(data.name ?? '').trim();
        if (!name) return [400, { error: 'name required' }];
        const novi = { id: baza.sljedeciId++, name, phone: String(data.phone ?? '').trim(), city: String(data.city ?? '').trim() };
        baza.klijenti.push(novi);
        return [201, kopija(novi)];
      }
      const id = Number(m[1]);
      const k = baza.klijenti.find(x => x.id === id);
      if (!k) return [404, { error: 'Klijent ne postoji.' }];
      if (metoda === 'GET') return [200, kopija(k)];
      if (metoda === 'DELETE') { baza.klijenti = baza.klijenti.filter(x => x.id !== id); return [200, { ok: true }]; }
      if (metoda === 'PATCH') {
        let data;
        try { data = JSON.parse(tijelo ?? ''); } catch (_) { return [400, { error: 'Tijelo zahtjeva nije ispravan JSON.' }]; }
        if (data && data.name !== undefined && !String(data.name).trim()) return [400, { error: 'name required' }];
        for (const p of ['name', 'phone', 'city']) if (data && data[p] !== undefined) k[p] = String(data[p]).trim();
        return [200, kopija(k)];
      }
      return [405, { error: 'Metoda nije dozvoljena.' }];
    }
    if (put === '/api/fakture') {
      if (metoda !== 'GET') return [405, { error: 'Metoda nije dozvoljena.' }];
      const kid = upit.get('klijent_id');
      return [200, kopija(kid ? baza.fakture.filter(f => f.klijent_id === Number(kid)) : baza.fakture)];
    }
    if (put === '/api/pad') return [500, { error: 'Greška na serveru (namjerna, za vježbu).' }];
    if (put === '/api/profil') return [401, { error: 'Nisi prijavljen.' }];
    if (put === '/api/spor') return [200, { poruka: 'Stiglo poslije 1,5 s.' }, 1500];
    if (put.startsWith('/api/')) return [404, { error: 'Ruta ne postoji.' }];
    return [404, 'Nema tog fajla.'];
  }

  function fetch(ulaz, opcije = {}) {
    const adresa = String(ulaz && ulaz.url ? ulaz.url : ulaz);
    const metoda = String(opcije.method || 'GET').toUpperCase();
    let p;
    const zavrsi = (stanje, vrijednost) => { p[STANJE] = { stanje, vrijednost }; };
    p = new Promise((resolve, reject) => {
      if ((metoda === 'GET' || metoda === 'HEAD') && opcije.body != null) {
        const e = new TypeError("Failed to execute 'fetch': Request with GET/HEAD method cannot have body.");
        setTimeout(() => { zavrsi('rejected', e); reject(e); }, 0);
        return;
      }
      naCekanju++;
      const url = new URL(adresa, 'http://ucionica.local/');
      const vanjska = url.host !== 'ucionica.local';
      const zaglavlja = new Headers(opcije.headers || {});
      const tijelo = opcije.body == null ? undefined : String(opcije.body);
      setTimeout(() => {
        naCekanju--;
        if (vanjska) { const e = new TypeError('Failed to fetch'); zavrsi('rejected', e); reject(e); return; }
        const [status, podaci, dodatno] = obradi(metoda, url.pathname, url.searchParams, zaglavlja, tijelo);
        const isporuci = () => { const o = odgovor(status, podaci, url.pathname + url.search); zavrsi('fulfilled', o); resolve(o); };
        if (dodatno) { naCekanju++; setTimeout(() => { naCekanju--; isporuci(); }, dodatno); } else isporuci();
      }, kasnjenje);
    });
    p[STANJE] = { stanje: 'pending' };
    return p;
  }
  fetch.naCekanju = () => naCekanju;
  fetch.baza = baza;
  return fetch;
}

// ---------------------------------------------------------------- js: Web Worker
const JS_ROK_MS = 4000;
const AsyncFunction = (async () => {}).constructor;

// Skripta workera za jedno pokretanje. Učenikov kod počinje tačno na liniji `pomak + 1`.
function jsIzvor(code, tests) {
  const prije = `"use strict";
${formatiraj}
${jednako}
${ocekuj}
${napraviServer}
const __izlaz = [];
let __ponor = null;
const __upisi = s => { if (__ponor) __ponor.push(s); else { __izlaz.push(s); postMessage({ tip: 'log', s }); } };
const __konzola = pref => (...a) => __upisi(pref + a.map(x => formatiraj(x)).join(' '));
console.log = console.info = console.debug = console.table = __konzola('');
console.warn = __konzola('⚠ ');
console.error = __konzola('✗ ');
const __url = self.location.href;
const __pomak = __POMAK__;
// Prvi okvir steka koji pada u učenikov kod (greška može nastati dublje, npr. u lažnom serveru).
const __linija = e => {
  for (const l of String(e && e.stack || '').split('\\n')) {
    const i = l.lastIndexOf(__url);
    const m = i >= 0 && l.slice(i + __url.length).match(/^:(\\d+):\\d+/);
    const n = m ? Number(m[1]) - __pomak : 0;
    if (n >= 1 && n <= __BROJ_LINIJA__) return n;
  }
  return null;
};
const __greske = [];
const __zabiljezi = (e, prefiks = '') => { const n = __linija(e); __greske.push({ e, n, prefiks }); };
self.addEventListener('error', ev => { ev.preventDefault(); __zabiljezi(ev.error || { name: 'Error', message: ev.message, stack: '' }); });
self.addEventListener('unhandledrejection', ev => { ev.preventDefault(); __zabiljezi(ev.reason, 'Neuhvaćena greška u obećanju (Promise) — '); });
const __aktivni = new Set();
const __st = setTimeout, __ct = clearTimeout, __si = setInterval, __ci = clearInterval;
const __tajmeri = {
  setTimeout: (f, ms, ...a) => { const id = __st(() => { __aktivni.delete(id); f(...a); }, ms); __aktivni.add(id); return id; },
  clearTimeout: id => { __aktivni.delete(id); __ct(id); },
  setInterval: (f, ms, ...a) => { const id = __si(() => f(...a), ms); __aktivni.add(id); return id; },
  clearInterval: id => { __aktivni.delete(id); __ci(id); },
};
(async () => {
  const fetch = napraviServer();
  const { setTimeout, clearTimeout, setInterval, clearInterval } = __tajmeri;
  const KOD = __KOD__;
  let IZLAZ = '';
  // Kad je sve završeno: nema tajmera ni fetch-eva na čekanju (dvije provjere zaredom).
  const __mirno = async () => { let tiho = 0; while (tiho < 2) { await new Promise(r => __st(r, 15)); tiho = __aktivni.size || fetch.naCekanju() ? 0 : tiho + 1; } };
  // Ponovo pokreni učenikov kod sa drugim početnim vrijednostima (zamijeni prve "const/let ime = …").
  const saVrijednostima = async vrijednosti => {
    let kod = KOD;
    for (const [ime, v] of Object.entries(vrijednosti)) kod = kod.replace(new RegExp('^(\\\\s*(?:const|let|var)\\\\s+' + ime + '\\\\s*=).*$', 'm'), '$1 ' + JSON.stringify(v) + ';');
    const staro = __ponor; __ponor = [];
    try {
      await new (async () => {}).constructor('fetch', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', '"use strict";\\n' + kod)(napraviServer(0), setTimeout, clearTimeout, setInterval, clearInterval);
      return __ponor.join('\\n') + (__ponor.length ? '\\n' : '');
    } finally { __ponor = staro; }
  };
  let __testovi = null, __pad = null;
  try {
    __testovi = await (async () => {
`;
  const pomak = prije.split('\n').length - 1;
  const poslije = `
;return [${tests.map(t => `async () => {\n${t.kod}\n}`).join(',\n')}];
    })();
  } catch (e) { __pad = e; }
  await __mirno();
  IZLAZ = __izlaz.join('\\n') + (__izlaz.length ? '\\n' : '');
  const rez = { ok: true, out: IZLAZ, err: null, errType: null, errLine: null, tests: [] };
  const prva = __pad ? { e: __pad, n: __linija(__pad), prefiks: '' } : __greske[0];
  if (prva) {
    const e = prva.e || {};
    rez.ok = false; rez.errType = e.name || 'Error'; rez.errLine = prva.n;
    rez.err = prva.prefiks + (e.name || 'Error') + (prva.n ? ' (linija ' + prva.n + ')' : '') + ': ' + (e.message ?? String(e));
  }
  for (const t of (__testovi || ${JSON.stringify(tests.map(() => 0))})) {
    if (!__testovi || !rez.ok) { rez.tests.push({ ok: null, m: 'nije pokrenut (kod ima grešku)' }); continue; }
    try { await t(); rez.tests.push({ ok: true, m: '' }); }
    catch (x) { rez.tests.push({ ok: false, m: String(x && x.message || x) }); }
  }
  postMessage({ tip: 'kraj', rez });
})();
`;
  // Zamjena preko funkcije: tekst sa $' ili $& (npr. '5$') ne smije se protumačiti kao obrazac zamjene.
  const izvor = prije.replace('__POMAK__', () => pomak).replace('__BROJ_LINIJA__', () => code.split('\n').length).replace('__KOD__', () => JSON.stringify(code)) + code + poslije;
  return { izvor, pomak };
}

function runJs(code, tests = []) {
  return new Promise(resolve => {
    const { izvor, pomak } = jsIzvor(code, tests);
    const url = URL.createObjectURL(new Blob([izvor], { type: 'text/javascript' }));
    const log = [];
    const brojLinija = code.split('\n').length;
    let w;
    try { w = new Worker(url); } catch (e) { URL.revokeObjectURL(url); ENV.js = 'bad'; renderStatus(); resolve(null); return; }
    let gotovo = false;
    const kraj = rez => { if (gotovo) return; gotovo = true; clearTimeout(rok); w.terminate(); URL.revokeObjectURL(url); resolve(rez); };
    const izlaz = () => log.join('\n') + (log.length ? '\n' : '');
    const nijePokrenut = m => tests.map(() => ({ ok: null, m }));
    const rok = setTimeout(() => kraj({ ok: false, out: izlaz(), err: `Kod se izvršava predugo (više od ${JS_ROK_MS / 1000} s) — vjerovatno beskonačna petlja ili čekanje nečega što nikad ne stigne.`, errType: 'Timeout', errLine: null, tests: nijePokrenut('prekinuto') }), JS_ROK_MS);
    w.onmessage = e => { if (e.data.tip === 'log') log.push(e.data.s); else if (e.data.tip === 'kraj') kraj(e.data.rez); };
    // Ovdje stižu samo greške koje sprečavaju pokretanje: sintaksa (sa brojem linije).
    w.onerror = e => {
      e.preventDefault();
      const n = e.lineno ? e.lineno - pomak : null;
      const linija = n >= 1 && n <= brojLinija ? n : null;
      const poruka = String(e.message || 'Greška').replace(/^Uncaught /, '');
      const tip = (poruka.match(/^(\w*Error)\b/) || [])[1] || 'SyntaxError';
      kraj({ ok: false, out: izlaz(), err: linija ? poruka.replace(/^(\w*Error)/, `$1 (linija ${linija})`) : poruka, errType: tip, errLine: linija, tests: nijePokrenut('nije pokrenut (kod ima grešku)') });
    };
  });
}

// ---------------------------------------------------------------- dom: čuvar petlji
// Ubaci poziv čuvara u petlje, bez mijenjanja broja linija:
//   while (U)            → while (čuvar() && (U))          (važi i za kraj do … while)
//   for (A; U; B)        → for (A; čuvar() && (U); B)
//   for (x of/in y) { …  → for (x of/in y) { čuvar(); …
// Stringovi, template literali, komentari i regex literali se preskaču.
function ubaciCuvara(kod, ime) {
  const tokeni = [];               // { v, p (početak), k (kraj), vrsta: 'id' | 'z' (znak) | 'ostalo' }
  const n = kod.length;
  const stek = [];                 // otvorene ${ u template literalima: broj { unutar izraza
  const regexMoze = () => {
    const pr = tokeni[tokeni.length - 1];
    if (!pr) return true;
    if (pr.vrsta === 'id') return /^(return|typeof|instanceof|in|of|new|delete|void|throw|case|do|else|yield|await)$/.test(pr.v);
    if (pr.vrsta === 'z') return !/^[)\]]$/.test(pr.v);
    return false;
  };
  const template = od => {         // čitaj template literal od `od` (poslije ` ili }), vrati poziciju poslije kraja ili ${
    let j = od;
    while (j < n) {
      if (kod[j] === '\\') { j += 2; continue; }
      if (kod[j] === '`') return { kraj: j + 1, izraz: false };
      if (kod[j] === '$' && kod[j + 1] === '{') return { kraj: j + 2, izraz: true };
      j++;
    }
    return { kraj: n, izraz: false };
  };
  let i = 0;
  while (i < n) {
    const c = kod[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '/' && kod[i + 1] === '/') { while (i < n && kod[i] !== '\n') i++; continue; }
    if (c === '/' && kod[i + 1] === '*') { const k = kod.indexOf('*/', i + 2); i = k < 0 ? n : k + 2; continue; }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && kod[j] !== c && kod[j] !== '\n') j += kod[j] === '\\' ? 2 : 1;
      tokeni.push({ v: 'str', p: i, k: j + 1, vrsta: 'ostalo' }); i = j + 1; continue;
    }
    if (c === '`') {
      const r = template(i + 1);
      tokeni.push({ v: 'tmpl', p: i, k: r.kraj, vrsta: 'ostalo' });
      if (r.izraz) stek.push(0);
      i = r.kraj; continue;
    }
    if (c === '}' && stek.length && stek[stek.length - 1] === 0) {
      stek.pop();
      const r = template(i + 1);
      tokeni.push({ v: 'tmpl', p: i, k: r.kraj, vrsta: 'ostalo' });
      if (r.izraz) stek.push(0);
      i = r.kraj; continue;
    }
    if (c === '/' && regexMoze()) {
      let j = i + 1, klasa = false;
      while (j < n && kod[j] !== '\n') {
        if (kod[j] === '\\') { j += 2; continue; }
        if (kod[j] === '[') klasa = true; else if (kod[j] === ']') klasa = false;
        else if (kod[j] === '/' && !klasa) break;
        j++;
      }
      j++;
      while (j < n && /[a-z]/i.test(kod[j])) j++;
      tokeni.push({ v: 're', p: i, k: j, vrsta: 'ostalo' }); i = j; continue;
    }
    if (/[A-Za-z_$À-￿]/.test(c)) {
      let j = i + 1;
      while (j < n && /[\w$À-￿]/.test(kod[j])) j++;
      tokeni.push({ v: kod.slice(i, j), p: i, k: j, vrsta: 'id' }); i = j; continue;
    }
    if (/[0-9]/.test(c)) {
      let j = i + 1;
      while (j < n && /[\w.]/.test(kod[j])) j++;
      tokeni.push({ v: 'broj', p: i, k: j, vrsta: 'ostalo' }); i = j; continue;
    }
    if (c === '{' && stek.length) stek[stek.length - 1]++;
    if (c === '}' && stek.length) stek[stek.length - 1]--;
    tokeni.push({ v: c, p: i, k: i + 1, vrsta: 'z' });
    i++;
  }

  const umetni = [];               // [pozicija, tekst]
  const par = { '(': ')', '[': ']', '{': '}' };
  const zatvara = j => {           // indeks tokena koji zatvara zagradu na tokenu j
    const st = [];
    for (let x = j; x < tokeni.length; x++) {
      const v = tokeni[x].v;
      if (tokeni[x].vrsta !== 'z') continue;
      if (par[v]) st.push(par[v]);
      else if (v === ')' || v === ']' || v === '}') { if (st.pop() !== v) return -1; if (!st.length) return x; }
    }
    return -1;
  };
  const poziv = `${ime}()`;
  for (let x = 0; x < tokeni.length; x++) {
    const t = tokeni[x];
    if (t.vrsta !== 'id' || (t.v !== 'while' && t.v !== 'for')) continue;
    if (tokeni[x - 1] && tokeni[x - 1].v === '.') continue;
    let j = x + 1;
    if (t.v === 'for' && tokeni[j] && tokeni[j].v === 'await') j++;
    if (!tokeni[j] || tokeni[j].v !== '(') continue;
    const z = zatvara(j);
    if (z < 0) continue;
    if (t.v === 'while') { umetni.push([tokeni[j].k, `${poziv} && (`], [tokeni[z].p, ')']); continue; }
    // for: dvije ";" na prvom nivou zagrada = klasična petlja; inače for…of / for…in
    const tacke = [];
    let dubina = 0;
    for (let y = j + 1; y < z; y++) {
      const v = tokeni[y].v;
      if (tokeni[y].vrsta !== 'z') continue;
      if (par[v]) dubina++; else if (v === ')' || v === ']' || v === '}') dubina--;
      else if (v === ';' && dubina === 0) tacke.push(y);
    }
    if (tacke.length === 2) {
      const [a, b] = tacke;
      if (b === a + 1) umetni.push([tokeni[a].k, ` ${poziv}`]);
      else umetni.push([tokeni[a].k, ` ${poziv} && (`], [tokeni[b].p, ')']);
    } else if (tokeni[z + 1] && tokeni[z + 1].v === '{') umetni.push([tokeni[z + 1].k, ` ${poziv};`]);
  }
  umetni.sort((a, b) => b[0] - a[0]);
  let out = kod;
  for (const [p, s] of umetni) out = out.slice(0, p) + s + out.slice(p);
  return out;
}

// Čuvar: ako jedan neprekinut komad izvršavanja vrti petlje duže od `ms`, baci grešku (i nastavi je bacati).
function napraviCuvara(ms = 1500) {
  let brojac = 0, t0 = 0, stop = false;
  const greska = () => Object.assign(new Error(`Petlja se vrti predugo (više od ${ms / 1000} s) — vjerovatno beskonačna petlja. Provjeri da li se uslov petlje ikad promijeni.`), { name: 'Timeout' });
  return () => {
    if (stop) throw greska();
    if (brojac++ === 0) { t0 = performance.now(); setTimeout(() => { brojac = 0; }, 0); }
    else if ((brojac & 1023) === 0 && performance.now() - t0 > ms) { stop = true; throw greska(); }
    return true;
  };
}

// ---------------------------------------------------------------- dom: okvir sa stranicom
const CUVAR = '__ucionicaPetlja';
const DOM_PARAMETRI = ['document', 'window', 'console', 'fetch', 'localStorage', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'alert', 'ocekuj', 'jednako', 'T', CUVAR];
const STAGE_CSS = `
:host{display:block}
.stranica{font:15px/1.5 var(--body,system-ui,sans-serif);color:var(--ink);padding:12px 14px;min-height:3.2em;display:grid;gap:8px;align-content:start;overflow-wrap:anywhere}
.stranica>*{margin:0}
h1,h2,h3{font-family:var(--display,system-ui,sans-serif);line-height:1.2}
h1{font-size:1.35rem} h2{font-size:1.15rem} h3{font-size:1rem}
button{font:inherit;padding:5px 12px;border-radius:8px;border:1.5px solid var(--line);background:var(--surface2);color:var(--ink);cursor:pointer}
button:hover{border-color:var(--accent)}
button:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid var(--accent);outline-offset:1px}
input,select,textarea{font:inherit;padding:5px 10px;border-radius:8px;border:1.5px solid var(--line);background:var(--surface);color:var(--ink);max-width:100%}
form{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
ul,ol{padding-left:22px;display:grid;gap:4px}
li button{margin-left:8px;padding:0 8px}
table{border-collapse:collapse} th,td{border:1px solid var(--line);padding:4px 8px;text-align:left}
.gotovo{text-decoration:line-through;opacity:.6}
.skriveno{display:none}
.greska{color:var(--bad)}
.uspjeh{color:var(--good)}
.aktivan{background:var(--accent-soft);border-color:var(--accent)}
.kartica{border:1px solid var(--line);border-radius:10px;padding:8px 12px}
.ucitavanje{color:var(--muted);font-style:italic}
.prazno{color:var(--muted)}
`;

let domAktivno = null;           // vidljivi okvir koraka (konzola uživo, tajmeri, greške iz događaja)
let domPonor = null;             // gdje idu greške iz događaja i obećanja dok kod radi

function zaustaviDom() { if (domAktivno) { domAktivno.stani(); domAktivno = null; } }

const jeUcenickiKod = e => !!(e && typeof e.stack === 'string' && /eval at [\s\S]*<anonymous>:\d+:\d+/.test(e.stack));
window.addEventListener('error', ev => {
  if (domPonor && (jeUcenickiKod(ev.error) || !ev.error)) { ev.preventDefault(); domPonor.greska(ev.error || { name: 'Error', message: ev.message }); }
});
window.addEventListener('unhandledrejection', ev => {
  if (domPonor) { ev.preventDefault(); domPonor.greska(ev.reason, 'Neuhvaćena greška u obećanju (Promise) — '); }
});

// Linija učenikovog koda iz steka greške: prvi okvir "eval at … <anonymous>:L:K" (V8) koji pada u njegov kod.
// Tijelo funkcije počinje sa "use strict", pa je prva linija koda L = 4.
function domLinija(e, brojLinija) {
  for (const l of String(e && e.stack || '').split('\n')) {
    const m = /eval at/.test(l) && l.match(/<anonymous>:(\d+):\d+\)?\s*$/);
    const n = m ? Number(m[1]) - 3 : 0;
    if (n >= 1 && n <= brojLinija) return n;
  }
  return null;
}

// Tekst stranice kao što ga čovjek vidi (blokovi u novim redovima), za predvidi i testove.
function tekstStranice(el) {
  const blok = /^(P|DIV|LI|H[1-6]|TR|UL|OL|TABLE|FORM|SECTION|ARTICLE|HEADER|FOOTER)$/;
  let s = '';
  const idi = cv => {
    for (const c of cv.childNodes) {
      if (c.nodeType === 3) s += c.textContent.replace(/\s+/g, ' ');
      else if (c.nodeType === 1) {
        if (c.classList.contains('skriveno') || c.hidden || c.tagName === 'STYLE' || c.tagName === 'SCRIPT') continue;
        if (c.tagName === 'BR') { s += '\n'; continue; }
        const b = blok.test(c.tagName);
        if (b) s += '\n';
        if (c.tagName === 'INPUT' || c.tagName === 'TEXTAREA') s += c.value; else idi(c);
        if (b) s += '\n';
        else if (c.tagName === 'TD' || c.tagName === 'TH') s += ' ';
      }
    }
  };
  idi(el);
  return s.split('\n').map(l => l.trim()).filter(Boolean).join('\n');
}

function napraviSkladiste() {
  const m = new Map();
  return {
    getItem: k => m.has(String(k)) ? m.get(String(k)) : null,
    setItem: (k, v) => { m.set(String(k), String(v)); },
    removeItem: k => { m.delete(String(k)); },
    clear: () => m.clear(),
    key: i => [...m.keys()][i] ?? null,
    get length() { return m.size; },
  };
}

// Jedno pokretanje DOM koda u novom okviru. `vidljivo` = okvir koji učenik gleda i klikće.
async function izvrsiDom(fn, code, tests, setup, host, { log, vidljivo }) {
  const koren = host.attachShadow({ mode: 'open' });
  koren.innerHTML = `<style>${STAGE_CSS}</style><div class="stranica">${setup || ''}</div>`;
  const tijelo = koren.querySelector('.stranica');
  const brojLinija = code.split('\n').length;
  const greske = [];
  const ponor = { greska: (e, prefiks = '') => { const g = { e: e || {}, n: domLinija(e, brojLinija), prefiks }; greske.push(g); log.greska(g); } };

  // Stranica u okviru ne smije napustiti učionicu: link i slanje forme se uvijek zaustave.
  koren.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (a) { e.preventDefault(); log.info(`↪ Link bi otvorio ${a.getAttribute('href')} — u učionici je odlazak sa stranice isključen.`); }
  }, true);
  koren.addEventListener('submit', e => {
    let pozvao = false;
    const pd = e.preventDefault.bind(e);
    e.preventDefault = () => { pozvao = true; pd(); };
    pd();
    setTimeout(() => { if (!pozvao) log.info('⚠ Forma bi se poslala i stranica bi se ponovo učitala (nedostaje e.preventDefault()). U učionici je to spriječeno.'); }, 0);
  }, true);

  const tajmeri = new Set();
  const tj = {
    setTimeout: (f, ms, ...a) => { const id = setTimeout(() => { tajmeri.delete(id); f(...a); }, ms); tajmeri.add(id); return id; },
    clearTimeout: id => { tajmeri.delete(id); clearTimeout(id); },
    setInterval: (f, ms, ...a) => { const id = setInterval(() => f(...a), ms); tajmeri.add(-id); return id; },
    clearInterval: id => { tajmeri.delete(-id); clearInterval(id); },
  };
  const server = napraviServer();
  const odmah = f => Promise.resolve().then(() => f(new Event('DOMContentLoaded')));
  const doc = {
    body: tijelo,
    querySelector: s => tijelo.querySelector(s),
    querySelectorAll: s => tijelo.querySelectorAll(s),
    getElementById: id => koren.getElementById(id),
    getElementsByClassName: c => tijelo.getElementsByClassName(c),
    getElementsByTagName: t => tijelo.getElementsByTagName(t),
    createElement: (t, o) => document.createElement(t, o),
    createTextNode: t => document.createTextNode(t),
    createDocumentFragment: () => document.createDocumentFragment(),
    addEventListener: (t, f, o) => { if (t === 'DOMContentLoaded') odmah(f); else tijelo.addEventListener(t, f, o); },
    removeEventListener: (t, f, o) => tijelo.removeEventListener(t, f, o),
    get activeElement() { return koren.activeElement; },
    title: 'Moja stranica',
  };
  const kons = {};
  for (const [k, pref] of [['log', ''], ['info', ''], ['debug', ''], ['table', ''], ['warn', '⚠ '], ['error', '✗ ']]) kons[k] = (...a) => log.linija(pref + a.map(x => formatiraj(x)).join(' '));
  const win = {
    document: doc, console: kons, fetch: server, localStorage: napraviSkladiste(), ...tj,
    alert: m => kons.log(`🔔 alert: ${m}`),
    addEventListener: (t, f, o) => { if (t === 'load' || t === 'DOMContentLoaded') odmah(f); else tijelo.addEventListener(t, f, o); },
    removeEventListener: (t, f, o) => tijelo.removeEventListener(t, f, o),
    location: { href: 'https://ucionica.local/', pathname: '/', hash: '' },
    requestAnimationFrame: f => requestAnimationFrame(f),
  };
  win.window = win;
  const mirno = async () => {
    let tiho = 0;
    while (tiho < 2) { await new Promise(r => setTimeout(r, 15)); tiho = [...tajmeri].some(id => id > 0) || server.naCekanju() ? 0 : tiho + 1; }
  };
  const nadji = s => { const el = tijelo.querySelector(s); if (!el) throw new Error(`Na stranici nema elementa ${s}`); return el; };
  const T = {
    $: s => tijelo.querySelector(s),
    $$: s => [...tijelo.querySelectorAll(s)],
    tekst: s => { const el = s ? tijelo.querySelector(s) : tijelo; return el ? el.textContent.replace(/\s+/g, ' ').trim() : null; },
    stranica: () => tekstStranice(tijelo),
    broj: s => tijelo.querySelectorAll(s).length,
    klikni: async s => { nadji(s).click(); await mirno(); },
    upisi: async (s, v) => { const el = nadji(s); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); await mirno(); },
    posalji: async s => { const f = nadji(s); f.requestSubmit ? f.requestSubmit() : f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); await mirno(); },
    tipka: async (s, key) => { nadji(s).dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true })); await mirno(); },
    mirno, cekaj: ms => new Promise(r => setTimeout(r, ms)),
    server,
    get IZLAZ() { return log.izlaz(); },
  };
  const okvir = { stani: () => { for (const id of tajmeri) id > 0 ? clearTimeout(id) : clearInterval(-id); tajmeri.clear(); }, ponor };

  domPonor = ponor;
  let testovi = null, pad = null;
  try { testovi = await fn(doc, win, kons, server, win.localStorage, tj.setTimeout, tj.clearTimeout, tj.setInterval, tj.clearInterval, win.alert, ocekuj, jednako, T, napraviCuvara()); }
  catch (e) { pad = e; }
  await mirno();
  const rez = { ok: true, out: log.izlaz(), err: null, errType: null, errLine: null, tests: [], stranica: tekstStranice(tijelo) };
  const prva = pad ? { e: pad, n: domLinija(pad, brojLinija), prefiks: '' } : greske[0];
  if (prva) {
    rez.ok = false; rez.errType = prva.e.name || 'Error'; rez.errLine = prva.n;
    rez.err = prva.prefiks + (prva.e.name || 'Error') + (prva.n ? ` (linija ${prva.n})` : '') + ': ' + (prva.e.message ?? String(prva.e));
  }
  if (!vidljivo) for (const t of testovi || tests) {
    if (!testovi || !rez.ok) { rez.tests.push({ ok: null, m: 'nije pokrenut (kod ima grešku)' }); continue; }
    const prije = greske.length;
    try {
      await t();
      if (greske.length > prije) throw greske[prije].e;
      rez.tests.push({ ok: true, m: '' });
    } catch (x) { rez.tests.push({ ok: false, m: (x && x.name && x.name !== 'Error' ? x.name + ': ' : '') + String(x && x.message || x) }); }
  }
  if (domPonor === ponor && !vidljivo) domPonor = domAktivno ? domAktivno.ponor : null;
  if (!vidljivo) okvir.stani();
  return { rez, okvir };
}

// Sintaksna greška i njena linija: worker samo pročita kod (ne izvršava ga) i javi gdje je zapeo.
function provjeriSintaksu(code) {
  return new Promise(resolve => {
    const url = URL.createObjectURL(new Blob([`"use strict";\n(async function () {\n${code}\n});\npostMessage(0);`], { type: 'text/javascript' }));
    let w;
    const kraj = r => { clearTimeout(rok); if (w) w.terminate(); URL.revokeObjectURL(url); resolve(r); };
    const rok = setTimeout(() => kraj(null), 2000);
    try { w = new Worker(url); } catch (_) { kraj(null); return; }
    w.onmessage = () => kraj(null);
    w.onerror = e => {
      e.preventDefault();
      const n = e.lineno ? e.lineno - 2 : null;
      kraj({ poruka: String(e.message || 'SyntaxError').replace(/^Uncaught /, ''), linija: n >= 1 && n <= code.split('\n').length ? n : null });
    };
  });
}

function sloziDom(code, tests) {
  const tijelo = c => '"use strict";\n' + c + '\n;return [' + tests.map(t => `async () => {\n${t.kod}\n}`).join(',\n') + '];';
  try { return new AsyncFunction(...DOM_PARAMETRI, tijelo(ubaciCuvara(code, CUVAR))); }
  catch (e1) {
    try { const fn = new AsyncFunction(...DOM_PARAMETRI, tijelo(code)); console.warn('Čuvar petlji nije ubačen:', e1); return fn; }
    catch (e2) { return null; }
  }
}

// Vidljivo pokretanje (okvir + konzola u `box`) i, ako ima testova, još jedno skriveno pokretanje za testove,
// da klikovi testova ne mijenjaju stranicu koju učenik gleda.
async function runDom(code, tests = [], setup = '', box = null) {
  const brojLinija = code.split('\n').length;
  const fn = sloziDom(code, tests);
  const nijePokrenut = tests.map(() => ({ ok: null, m: 'nije pokrenut (kod ima grešku)' }));
  if (!fn) {
    const s = await provjeriSintaksu(code);
    const poruka = s ? s.poruka : 'SyntaxError: kod se ne može pročitati.';
    const tip = (poruka.match(/^(\w*Error)\b/) || [])[1] || 'SyntaxError';
    const r = { ok: false, out: '', err: s && s.linija ? poruka.replace(/^(\w*Error)/, `$1 (linija ${s.linija})`) : poruka, errType: tip, errLine: s ? s.linija : null, tests: nijePokrenut, stranica: '' };
    if (box) box.innerHTML = outHtml(r, 'dom');
    return r;
  }
  const napraviLog = el => {
    const linije = [];
    const dodaj = (tekst, cls) => { if (!el) return; const s = document.createElement('span'); if (cls) s.className = cls; s.textContent = tekst + '\n'; el.appendChild(s); };
    return {
      linija: s => { linije.push(s); dodaj(s); },
      info: s => dodaj(s, 'info'),
      greska: g => dodaj(g.prefiks + (g.e.name || 'Error') + (g.n ? ` (linija ${g.n})` : '') + ': ' + (g.e.message ?? String(g.e)), 'err'),
      izlaz: () => linije.join('\n') + (linije.length ? '\n' : ''),
    };
  };
  if (!box) {
    const host = document.createElement('div'); host.hidden = true; document.body.appendChild(host);
    try { return (await izvrsiDom(fn, code, tests, setup, host, { log: napraviLog(null), vidljivo: false })).rez; }
    finally { host.remove(); }
  }
  zaustaviDom();
  box.innerHTML = `<div class="stage"><div class="stage-bar"><span>Pregled stranice</span><span>kod mijenja samo ovaj okvir</span></div><div class="stage-host"></div></div>
    <div class="out"><span class="lbl">Konzola</span><span class="log"></span></div><div class="stage-hint"></div>`;
  const { rez, okvir } = await izvrsiDom(fn, code, tests, setup, box.querySelector('.stage-host'), { log: napraviLog(box.querySelector('.log')), vidljivo: true });
  domAktivno = okvir;
  const hint = objasnjenjeGreske(rez.errType, 'dom');
  if (!rez.ok && hint) box.querySelector('.stage-hint').innerHTML = `<div class="hint"><b>Šta ova greška znači:</b> ${esc(hint)}</div>`;
  if (rez.ok && !rez.out) box.querySelector('.log').innerHTML = '<span style="opacity:.6">(ništa nije ispisano)</span>';
  if (!tests.length) return rez;
  const host = document.createElement('div'); host.hidden = true; document.body.appendChild(host);
  try {
    const t = await izvrsiDom(fn, code, tests, setup, host, { log: napraviLog(null), vidljivo: false });
    return { ...rez, tests: rez.ok ? t.rez.tests : nijePokrenut };
  } finally { host.remove(); domPonor = domAktivno ? domAktivno.ponor : null; }
}

RUN.js = runJs;
RUN.dom = runDom;

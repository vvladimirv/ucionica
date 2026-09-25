// Testovi samih runnera (ne sadržaja lekcija): JavaScript u workeru, DOM u okviru, lažni server,
// ispis konzole, brojevi linija grešaka, zaštita od beskonačnih petlji i od napuštanja stranice.
// Upotreba: node scripts/provjeri-runnere.mjs
import { fileURLToPath } from 'node:url';
import { otvoriUcionicu } from './lib/preglednik.mjs';

const SLUCAJEVI = [
  // [naziv, jezik, kod, testovi, setup, provjera(r) → poruka greške ili '']
  ['js: ispis kao u konzoli', 'js', 'console.log("a", 1, [1, "x"], {ime: "Amra", n: null, "za-li": true}, undefined, 2.5)', [], '',
    r => r.out === "a 1 [1, 'x'] {ime: 'Amra', n: null, 'za-li': true} undefined 2.5\n" ? '' : 'izlaz: ' + JSON.stringify(r.out)],
  ['js: sintaksna greška sa linijom', 'js', 'console.log("x")\nconsole.log(Klijent dodan)\nconsole.log("y")', [], '',
    r => !r.ok && r.errType === 'SyntaxError' && r.errLine === 2 && /linija 2/.test(r.err) && r.out === '' ? '' : JSON.stringify(r)],
  ['js: greška pri izvršavanju sa linijom, izlaz do greške ostaje', 'js', 'console.log("prije")\nconst a = 1;\nnepostoji();\nconsole.log("poslije")', [], '',
    r => !r.ok && r.errType === 'ReferenceError' && r.errLine === 3 && r.out === 'prije\n' ? '' : JSON.stringify(r)],
  ['js: const se ne može promijeniti', 'js', 'const cijena = 8400;\ncijena = 9000;', [], '',
    r => r.errType === 'TypeError' && r.errLine === 2 ? '' : JSON.stringify(r)],
  ['js: strogi način (bez deklaracije = greška)', 'js', 'novo = 5;', [], '',
    r => r.errType === 'ReferenceError' && r.errLine === 1 ? '' : JSON.stringify(r)],
  ['js: beskonačna petlja se prekida, izlaz ostaje', 'js', 'console.log("prije");\nwhile (true) {}', [{ opis: 't', kod: 'ocekuj(1, 1)' }], '',
    r => r.errType === 'Timeout' && r.out === 'prije\n' && r.tests[0].ok === null ? '' : JSON.stringify(r)],
  ['js: $\' i $& u kodu', 'js', "console.log('Cijena: 5$', '$&', \"$'\")", [], '',
    r => r.out === "Cijena: 5$ $& $'\n" ? '' : JSON.stringify(r.out)],
  ['js: tajmer poslije glavnog koda', 'js', 'setTimeout(() => console.log("kasnije"), 50);\nconsole.log("odmah");', [], '',
    r => r.out === 'odmah\nkasnije\n' ? '' : JSON.stringify(r)],
  ['js: greška u tajmeru', 'js', 'setTimeout(() => {\n  null.x;\n}, 10);', [], '',
    r => r.errType === 'TypeError' && r.errLine === 2 ? '' : JSON.stringify(r)],
  ['js: fetch GET + json', 'js', 'const r = await fetch("/api/klijenti");\nconst d = await r.json();\nconsole.log(r.status, r.ok, d.length, d[0].name);', [], '',
    r => r.out === '200 true 3 Amra Kovačević\n' ? '' : JSON.stringify(r)],
  ['js: fetch POST bez Content-Type = 415, sa njim 201, prazno ime 400', 'js',
    'const a = await fetch("/api/klijenti", { method: "POST", body: JSON.stringify({ name: "Lejla" }) });\n' +
    'const b = await fetch("/api/klijenti", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "  Lejla " }) });\n' +
    'const c = await fetch("/api/klijenti", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: " " }) });\n' +
    'console.log(a.status, b.status, (await b.json()).name, c.status, (await c.json()).error);', [], '',
    r => r.out === '415 201 Lejla 400 name required\n' ? '' : JSON.stringify(r)],
  ['js: fetch bez await ispisuje Promise', 'js', 'console.log(fetch("/api/klijenti"));', [], '',
    r => r.out === 'Promise {<pending>}\n' ? '' : JSON.stringify(r)],
  ['js: Response u konzoli, 404 i 500', 'js', 'console.log(await fetch("/api/pad"));\nconsole.log((await fetch("/api/klijenti/99")).status);', [], '',
    r => r.out === "Response {status: 500, ok: false, url: '/api/pad'}\n404\n" ? '' : JSON.stringify(r)],
  ['js: tuđi sajt = mrežna greška', 'js', 'try { await fetch("https://example.com/x"); } catch (e) { console.log(e.name, e.message); }', [], '',
    r => r.out === 'TypeError Failed to fetch\n' ? '' : JSON.stringify(r)],
  ['js: neuhvaćena greška u obećanju', 'js', 'fetch("https://example.com").then(r => console.log(r));\nconsole.log("dalje");', [], '',
    r => !r.ok && /Neuhvaćena greška u obećanju/.test(r.err) && r.out === 'dalje\n' ? '' : JSON.stringify(r)],
  ['js: json() dva puta', 'js', 'const r = await fetch("/api/klijenti");\nawait r.json();\nawait r.json();', [], '',
    r => r.errType === 'TypeError' && /already read/.test(r.err) && r.errLine === 3 ? '' : JSON.stringify(r)],
  ['js: testovi, IZLAZ, KOD i poruka', 'js', 'const x = 2;\nconsole.log("x je", x);',
    [{ opis: 'a', kod: 'ocekuj(x, 2)' }, { opis: 'b', kod: 'ocekuj(x, 3, "x nije dobar")' }, { opis: 'c', kod: 'ocekuj(IZLAZ, "x je 2\\n"); ocekuj(KOD.includes("const x"), true)' }, { opis: 'd', kod: 'ocekuj(nema, 1)' }], '',
    r => r.ok && r.tests[0].ok && r.tests[1].ok === false && r.tests[1].m === 'x nije dobar: očekivano 3, dobijeno 2' && r.tests[2].ok && r.tests[3].ok === false && /nema is not defined/.test(r.tests[3].m) ? '' : JSON.stringify(r.tests)],
  ['js: saVrijednostima', 'js', 'const iznos = 1000;\nconst placeno = 400;\nconsole.log(placeno >= iznos ? "Plaćeno" : "Otvoreno");',
    [{ opis: 'a', kod: 'ocekuj((await saVrijednostima({ placeno: 1000 })).trim(), "Plaćeno")' }, { opis: 'b', kod: 'ocekuj(IZLAZ.trim(), "Otvoreno")' }], '',
    r => r.ok && r.tests.every(t => t.ok) && r.out === 'Otvoreno\n' ? '' : JSON.stringify(r)],

  ['dom: pravljenje elemenata', 'dom', 'const ul = document.querySelector("#lista");\nfor (const x of ["a", "b"]) {\n  const li = document.createElement("li");\n  li.textContent = x;\n  ul.append(li);\n}', [], '<ul id="lista"></ul>',
    r => r.ok && r.stranica === 'a\nb' ? '' : JSON.stringify(r)],
  ['dom: beskonačan while se prekida', 'dom', 'let i = 0;\nwhile (i < 5) {\n  i + 1;\n}', [], '',
    r => r.errType === 'Timeout' ? '' : JSON.stringify(r)],
  ['dom: beskonačan for bez uslova', 'dom', 'for (let i = 0; ; i++) {}', [], '', r => r.errType === 'Timeout' ? '' : JSON.stringify(r)],
  ['dom: beskonačan do…while', 'dom', 'let n = 0;\ndo { n++; } while (n > 0);', [], '', r => r.errType === 'Timeout' ? '' : JSON.stringify(r)],
  ['dom: for…of koji stalno dodaje', 'dom', 'const a = [1];\nfor (const x of a) { a.push(x); }', [], '', r => r.errType === 'Timeout' ? '' : JSON.stringify(r)],
  ['dom: while bez vitičastih zagrada', 'dom', 'let k = 3;\nwhile (k > 0) k++;', [], '', r => r.errType === 'Timeout' ? '' : JSON.stringify(r)],
  ['dom: petlja u rukovaocu događaja', 'dom', 'document.querySelector("#b").addEventListener("click", () => { while (true) {} });',
    [{ opis: 'klik', kod: 'await T.klikni("#b")' }], '<button id="b">x</button>',
    r => r.ok && r.tests[0].ok === false && /Timeout|predugo/.test(r.tests[0].m) ? '' : JSON.stringify(r)],
  ['dom: normalne petlje rade', 'dom', 'let s = 0;\nfor (let i = 0; i < 100000; i++) { s += i; }\nlet j = 0; while (j < 10) j++;\nfor (const k in { a: 1 }) s += 1;\nconsole.log(s, j);', [], '',
    r => r.out === '4999950001 10\n' ? '' : JSON.stringify(r)],
  ['dom: sintaksna greška sa linijom', 'dom', 'const a = 1;\nif (a > 0 {\n  console.log(a);\n}', [], '',
    r => r.errType === 'SyntaxError' && r.errLine === 2 ? '' : JSON.stringify(r)],
  ['dom: greška pri izvršavanju sa linijom', 'dom', 'const a = 1;\ndocument.querySelector("#nema").textContent = "x";', [], '',
    r => r.errType === 'TypeError' && r.errLine === 2 ? '' : JSON.stringify(r)],
  ['dom: klik i testovi', 'dom', 'let n = 0;\ndocument.querySelector("#b").addEventListener("click", () => {\n  n++;\n  document.querySelector("#p").textContent = n;\n});',
    [{ opis: 'dva klika', kod: 'await T.klikni("#b"); await T.klikni("#b"); ocekuj(T.tekst("#p"), "2")' }], '<button id="b">Klik</button><p id="p">0</p>',
    r => r.ok && r.tests[0].ok && r.stranica === 'Klik\n0' ? '' : JSON.stringify(r)],
  ['dom: greška u rukovaocu obara test', 'dom', 'document.querySelector("#b").addEventListener("click", () => {\n  null.x;\n});',
    [{ opis: 'klik', kod: 'await T.klikni("#b")' }], '<button id="b">x</button>',
    r => r.ok && r.tests[0].ok === false && /TypeError/.test(r.tests[0].m) ? '' : JSON.stringify(r)],
  ['dom: forma bez preventDefault ne napušta stranicu', 'dom', 'document.querySelector("#f").addEventListener("submit", e => console.log("poslano"));',
    [{ opis: 'slanje', kod: 'await T.posalji("#f"); ocekuj(T.IZLAZ, "poslano\\n")' }], '<form id="f"><input name="x"><button>OK</button></form>',
    r => r.ok && r.tests[0].ok ? '' : JSON.stringify(r)],
  ['dom: DOMContentLoaded i load se izvrše', 'dom', 'document.addEventListener("DOMContentLoaded", () => console.log("spremno"));\nwindow.addEventListener("load", () => console.log("učitano"));', [], '',
    r => r.out === 'spremno\nučitano\n' ? '' : JSON.stringify(r)],
  ['dom: localStorage je odvojen od učionice', 'dom', 'localStorage.setItem("ucionica-app", 1);\nconsole.log(localStorage.getItem("ucionica-app"), typeof localStorage.getItem("ucionica-app"), localStorage.getItem("nema"));', [], '',
    r => r.out === '1 string null\n' ? '' : JSON.stringify(r)],
  ['dom: fetch i prikaz', 'dom', 'const r = await fetch("/api/klijenti");\nconst d = await r.json();\ndocument.body.innerHTML = d.map(k => `<p>${k.name}</p>`).join("");', [], '',
    r => r.stranica === 'Amra Kovačević\nEmir Hodžić\nSelma Begić' ? '' : JSON.stringify(r)],
  ['dom: element u konzoli', 'dom', 'console.log(document.querySelector("#b"), document.querySelectorAll("li").length);', [], '<button id="b" class="x">Klik</button>',
    r => r.out === '<button id="b" class="x">Klik</button> 0\n' ? '' : JSON.stringify(r)],
];

// Čuvar petlji: rezultat ubacivanja mora biti ispravan JavaScript i ne smije dirati stringove/komentare/regex.
const CUVAR_SLUCAJEVI = [
  ['while (x) {}', 'while (G() && (x)) {}'],
  ['for (let i = 0; i < 3; i++) {}', 'for (let i = 0; G() && ( i < 3); i++) {}'],
  ['for (;;) {}', 'for (; G();) {}'],
  ['for (const [k, v] of Object.entries(o)) { f(k); }', 'for (const [k, v] of Object.entries(o)) { G(); f(k); }'],
  ['const s = "while (true) {}"; // for (;;)', 'const s = "while (true) {}"; // for (;;)'],
  ['const r = /for\\(/g; while ((m = r.exec(s)) !== null) {}', 'const r = /for\\(/g; while (G() && ((m = r.exec(s)) !== null)) {}'],
  ['const t = `x ${a ? "while" : "for"} y`; obj.while = 1;', 'const t = `x ${a ? "while" : "for"} y`; obj.while = 1;'],
  ['do { n++; } while (n < 3);', 'do { n++; } while (G() && (n < 3));'],
  ['for (let i = 0, j = 10; i < j; i++, j--) {}', 'for (let i = 0, j = 10; G() && ( i < j); i++, j--) {}'],
  ['const f = x => { for (const y of x) console.log(y); };', 'const f = x => { for (const y of x) console.log(y); };'],
  ['/* while (a) */ const x = a / b / c; while (a) b--;', '/* while (a) */ const x = a / b / c; while (G() && (a)) b--;'],
];

export async function provjeriRunnere(u) {
  const greske = [];
  for (const [naziv, jezik, kod, testovi, setup, provjera] of SLUCAJEVI) {
    const t0 = Date.now();
    let r;
    try {
      r = await u.page.evaluate(async ([j, k, t, s]) => {
        const x = await RUN[j](k, t, s);
        return x && { ok: x.ok, out: x.out, err: x.err, errType: x.errType, errLine: x.errLine ?? null, tests: x.tests, stranica: x.stranica };
      }, [jezik, kod, testovi, setup]);
    } catch (e) { greske.push(`${naziv}: ${e.message.split('\n')[0]}`); continue; }
    const g = r ? provjera(r) : 'runner nije dostupan';
    if (g) greske.push(`${naziv}: ${g}`);
    if (Date.now() - t0 > 6000) greske.push(`${naziv}: trajalo ${Date.now() - t0} ms`);
  }
  const cuvar = await u.page.evaluate(sl => sl.map(([ulaz, ocekivano]) => {
    const izlaz = ubaciCuvara(ulaz, 'G');
    let kompajlira = true;
    try { new AsyncFunction('G', '{\n' + izlaz + '\n}'); } catch (_) { kompajlira = false; }
    return { ulaz, izlaz, ocekivano, kompajlira };
  }), CUVAR_SLUCAJEVI);
  for (const c of cuvar) {
    if (c.izlaz !== c.ocekivano) greske.push(`čuvar: "${c.ulaz}" → "${c.izlaz}", očekivano "${c.ocekivano}"`);
    if (!c.kompajlira) greske.push(`čuvar: rezultat se ne može pročitati: "${c.izlaz}"`);
  }
  // Vidljivi okvir: klik u pregledu radi i piše u konzolu uživo; stranica učionice ostaje ista.
  const vidljivo = await u.page.evaluate(async () => {
    const box = document.createElement('div'); document.body.appendChild(box);
    const href = location.href;
    await runDom('document.querySelector("#b").addEventListener("click", () => console.log("klik"));\nconsole.log("spremno");', [{ opis: 't', kod: 'ocekuj(1, 1)' }], '<button id="b">B</button><a id="l" href="https://example.com">l</a>', box);
    const koren = box.querySelector('.stage-host').shadowRoot;
    koren.getElementById('b').click();
    koren.getElementById('l').click();
    await new Promise(r => setTimeout(r, 50));
    const log = box.querySelector('.log').textContent;
    zaustaviDom(); box.remove();
    return { log, istaStranica: location.href === href, lsNetaknut: (() => { try { return localStorage.getItem('ucionica-app') !== '1'; } catch (_) { return true; } })() };
  });
  if (vidljivo.log !== 'spremno\nklik\n↪ Link bi otvorio https://example.com — u učionici je odlazak sa stranice isključen.\n') greske.push('vidljivi okvir: konzola ' + JSON.stringify(vidljivo.log));
  if (!vidljivo.istaStranica) greske.push('vidljivi okvir: stranica učionice je promijenjena');
  if (!vidljivo.lsNetaknut) greske.push('dom: učenikov localStorage je prepisao pravi');
  return { greske, broj: SLUCAJEVI.length + CUVAR_SLUCAJEVI.length + 1 };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const u = await otvoriUcionicu();
  const t0 = Date.now();
  const r = await provjeriRunnere(u);
  for (const g of r.greske) console.log('GREŠKA · ' + g);
  for (const g of u.greskeStranice) console.log('GREŠKA STRANICE · ' + g);
  console.log(`runneri: ${r.broj} slučajeva za ${((Date.now() - t0) / 1000).toFixed(1)} s · ${r.greske.length} grešaka`);
  await u.zatvori();
  process.exit(r.greske.length || u.greskeStranice.length ? 1 : 0);
}

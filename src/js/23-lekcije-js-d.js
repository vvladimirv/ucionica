// ============================================================================
// Dio 2 · JavaScript — lekcija 8 (fetch i async, čitanje stvarnog apiFetch). Završna lekcija dijela.
// fetch u učionici razgovara sa lažnim serverom iz 02-izvrsavanje-js.js (napraviServer).
// U kodu: ` piši kao \`, ${ kao \${, a \ kao \\.
// ============================================================================
LEKCIJE_JS.push({
  id: 'js8', naslov: 'fetch i async: razgovor sa serverom', cilj: 'Kako preglednik šalje zahtjev serveru i čeka odgovor: obećanja, async/await, fetch, status kodovi, JSON i greške — i čitanje stvarnog apiFetch iz inhome. Završna lekcija JavaScript dijela.',
  koraci: [
    { tip: 'tekst', naslov: 'Odgovor stiže kasnije', html: `
      <p>Zahtjev serveru traje — desetine ili stotine milisekundi, a na lošoj mreži i sekunde. Da stranica za to vrijeme ne bi bila „zamrznuta“, <code>fetch</code> ne vraća odgovor odmah, nego <b>obećanje</b> (<i>Promise</i>): „odgovor će stići; javiću kad stigne“.</p>
      <p>Na obećanje se čeka riječju <code>await</code>: <code>const odgovor = await fetch("/api/klijenti");</code> Ova linija sačeka odgovor, a preglednik za to vrijeme normalno radi (klikovi, animacije). <code>await</code> se smije pisati samo unutar funkcije označene sa <code>async</code> — i, u učionici, na vrhu koda.</p>
      <p>Odgovor ima <code>status</code> (200, 404…), <code>ok</code> (true za statuse 200–299) i tijelo, koje se čita sa <code>await odgovor.json()</code>. I to je obećanje, jer tijelo možda još stiže.</p>
      <div class="note">U učionici <code>fetch</code> razgovara sa <b>lažnim serverom</b> koji se ponaša kao inhome API: <code>/api/klijenti</code>, <code>/api/klijenti/1</code>, <code>/api/fakture</code>. Odgovara za oko 0,1 s. Adrese drugih sajtova daju mrežnu grešku, kao da nema interneta.</div>` },
    { tip: 'primjer', jezik: 'js', naslov: 'Prvi fetch',
      kod: `console.log("Šaljem zahtjev…");
const odgovor = await fetch("/api/klijenti");
console.log(odgovor.status, odgovor.ok);

const klijenti = await odgovor.json();
console.log(klijenti.length, "klijenta");
for (const k of klijenti) {
  console.log(\`\${k.id}. \${k.name} (\${k.city})\`);
}`,
      obj: {
        2: 'GET zahtjev (podrazumijevana metoda) na <code>/api/klijenti</code>. <code>await</code> čeka odgovor.',
        3: 'Status 200 znači OK, pa je i <code>ok</code> true.',
        5: 'Tijelo odgovora je JSON tekst; <code>.json()</code> ga pretvori u niz objekata (JSON.parse iz lekcije 4). I ovdje treba await.',
        7: 'Obični niz objekata — sve iz lekcija 3–5 radi i ovdje.',
      } },
    { tip: 'predvidi', jezik: 'js', kod: `const odgovor = fetch("/api/klijenti");
console.log(odgovor);
console.log(odgovor.status);`,
      opcije: ['200', 'Promise {<pending>} · undefined', 'Response {status: 200, ok: true} · 200', 'Grešku'], t: 1,
      obj: 'Bez <code>await</code> dobiješ <b>obećanje</b>, a ne odgovor. Obećanje nema polje status, pa je undefined. Kad „podaci ne stižu“ ili je nešto neočekivano undefined, prvo provjeri da li fali await.' },
    { tip: 'tekst', naslov: 'Dvije vrste neuspjeha', html: `
      <p>Obje moraš obraditi:</p>
      <ul><li><b>Server je odgovorio, ali sa greškom</b>: status 400 (loš zahtjev), 401 (nisi prijavljen), 404 (ne postoji), 500 (server je pao). <b>fetch tada ne baca grešku</b> — obećanje se normalno ispuni, a ti moraš provjeriti <code>odgovor.ok</code>. Tijelo obično nosi poruku: <code>{"error": "…"}</code>.</li><li><b>Odgovor nije ni stigao</b> (nema interneta, server nedostupan): tada fetch <b>baca</b> grešku <code>TypeError: Failed to fetch</code>, koja se hvata sa <code>try … catch</code> — Pythonov try/except.</li></ul>
      <p>U inhome to radi jedna funkcija, <code>apiFetch</code>: svi pozivi serveru idu kroz nju, pa se ove provjere pišu jednom. Pred kraj lekcije ćeš je pročitati.</p>` },
    { tip: 'primjer', jezik: 'js', naslov: 'Obrada grešaka',
      kod: `async function ucitajKlijenta(id) {
  try {
    const odgovor = await fetch(\`/api/klijenti/\${id}\`);
    const podaci = await odgovor.json();
    if (!odgovor.ok) {
      console.log(\`Greška \${odgovor.status}: \${podaci.error}\`);
      return null;
    }
    return podaci;
  } catch (e) {
    console.log("Nema veze sa serverom. Provjeri internet pa pokušaj ponovo.");
    return null;
  }
}

const amra = await ucitajKlijenta(1);
console.log(amra?.name);
const nema = await ucitajKlijenta(99);
console.log(nema?.name);`,
      obj: {
        1: '<code>async</code> funkcija: unutra smije await. Poziva se sa await (linija 16).',
        2: '<code>try</code>: sve što može baciti grešku.',
        3: 'Adresa sa id-jem, napravljena template literalom: <code>/api/klijenti/1</code>.',
        5: 'Server je odgovorio, ali ne uspjehom (npr. 404): fetch NE baca grešku, provjera je naša.',
        9: 'Uspjeh: vrati podatke klijenta.',
        10: '<code>catch</code>: odgovor nije ni stigao (mreža).',
        11: 'Poruka razumljiva korisniku — ista rečenica stoji u inhome apiFetch.',
        16: 'Klijent 1 postoji.',
        18: 'Klijent 99 ne postoji → 404 i <code>null</code>; <code>?.</code> u liniji 19 zato ne pukne.',
      } },
    { tip: 'predvidi', jezik: 'js', pitanje: 'Ruta /api/pad uvijek vraća status 500. Šta se ispiše?',
      kod: `try {
  const odgovor = await fetch("/api/pad");
  console.log("Stiglo:", odgovor.status);
} catch (e) {
  console.log("Greška:", e.message);
}`,
      opcije: ['Stiglo: 500', 'Greška: Internal Server Error', 'Greška: Failed to fetch', 'Stiglo: 200'], t: 0,
      obj: 'Server je odgovorio — doduše sa 500 — pa fetch ne baca grešku i catch se ne izvrši. try/catch hvata samo mrežne greške; status provjeravaš sam, sa <code>odgovor.ok</code>.' },
    { tip: 'greska', jezik: 'js', pitanje: 'Program pada na liniji 4, ali uzrok je ranije. Klikni liniju sa stvarnim uzrokom.',
      kod: `const odgovor = await fetch("/api/klijenti");
const klijenti = odgovor.json();
console.log(klijenti.length);
console.log(klijenti.map(k => k.name));`,
      linija: 2, obj: 'Fali <code>await</code> ispred <code>odgovor.json()</code>, pa je <code>klijenti</code> obećanje, a ne niz. Obećanje nema length (linija 3 ispiše undefined bez greške) ni metodu map (linija 4 pada: „klijenti.map is not a function“).',
      ispravno: `const odgovor = await fetch("/api/klijenti");
const klijenti = await odgovor.json();
console.log(klijenti.length);
console.log(klijenti.map(k => k.name));` },
    { tip: 'primjer', jezik: 'js', naslov: 'POST: novi klijent',
      kod: `const odgovor = await fetch("/api/klijenti", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Lejla Mujić", phone: "061 222 333" }),
});
const novi = await odgovor.json();
console.log(odgovor.status, novi);

const los = await fetch("/api/klijenti", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "   " }),
});
console.log(los.status, await los.json());`,
      obj: {
        1: 'Drugi argument fetch-a je objekat sa opcijama zahtjeva.',
        2: 'Metoda POST: pravi novi zapis (Tema 1).',
        3: 'Zaglavlje kaže serveru da je tijelo JSON. Bez njega server odbije zahtjev (415), a Flask ne bi napunio request.json.',
        4: 'Tijelo mora biti <b>tekst</b>: objekat se pretvara sa JSON.stringify.',
        7: '201 Created i novi klijent, sa id-jem koji je dodijelio server.',
        12: 'Samo razmaci — server odbija: 400 i poruka „name required“. To je ona Flask ruta iz Python lekcije 9!',
      },
      poslije: 'U „Promijeni i probaj“ izbriši liniju 3 i pokreni: status postane 415.' },
    { tip: 'popuni', jezik: 'js', pitanje: 'Učitaj klijenta 2; ako odgovor nije uspješan ispiši status, a inače ime.',
      kod: `const odgovor = ___ fetch("/api/klijenti/2");
if (!odgovor.___) {
  console.log("Greška", odgovor.status);
} else {
  const klijent = await odgovor.___();
  console.log(klijent.name);
}`,
      odg: [['await'], ['ok'], ['json']],
      obj: 'Na fetch se čeka sa <code>await</code>; <code>ok</code> je true za uspješne statuse; tijelo se čita sa <code>json()</code> (opet uz await).' },
    { tip: 'poredaj', jezik: 'js', pitanje: 'Poredaj funkciju: pošalji zahtjev, provjeri status (prije čitanja tijela), pročitaj JSON i vrati broj faktura; na kraju je pozovi.',
      linije: ['async function brojFaktura() {', '  const odgovor = await fetch("/api/fakture");', '  if (!odgovor.ok) throw new Error("Greška " + odgovor.status);', '  const fakture = await odgovor.json();', '  return fakture.length;', '}', 'console.log(await brojFaktura());'],
      obj: 'Zahtjev, pa provjera statusa, pa tek onda čitanje tijela i rezultat. <code>throw</code> sam baci grešku — kao <code>raise</code> u Pythonu.' },
    { tip: 'primjer', jezik: 'dom', naslov: 'Četiri stanja ekrana',
      uvod: 'Sve zajedno: klik, fetch, obrada grešaka i DOM. Dok zahtjev traje, korisnik mora vidjeti da se nešto dešava.',
      setup: `<button id="ucitaj">Učitaj klijente</button>
<p id="poruka" class="prazno">Klikni dugme.</p>
<ul id="lista"></ul>`,
      kod: `const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const dugme = document.querySelector("#ucitaj");
const poruka = document.querySelector("#poruka");
const lista = document.querySelector("#lista");

dugme.addEventListener("click", async () => {
  dugme.disabled = true;
  poruka.textContent = "Učitavam…";
  poruka.className = "ucitavanje";
  try {
    const odgovor = await fetch("/api/klijenti");
    if (!odgovor.ok) throw new Error(\`server je vratio \${odgovor.status}\`);
    const klijenti = await odgovor.json();
    lista.innerHTML = klijenti.map(k => \`<li>\${esc(k.name)}</li>\`).join("");
    poruka.textContent = klijenti.length ? \`Klijenata: \${klijenti.length}\` : "Nema klijenata.";
    poruka.className = klijenti.length ? "uspjeh" : "prazno";
  } catch (e) {
    poruka.textContent = \`Greška: \${e.message}\`;
    poruka.className = "greska";
  } finally {
    dugme.disabled = false;
  }
});`,
      obj: {
        6: 'Slušač može biti <code>async</code> funkcija, pa unutra smije await.',
        7: 'Dugme se onemogući dok zahtjev traje — dvostruki klik ne šalje dva zahtjeva (idempotentnost, Tema 6).',
        8: 'Stanje „učitavanje“.',
        9: '<code>className</code> postavi klase elementa odjednom.',
        12: '<code>throw</code> sam baci grešku i skoči u catch. Tako 404 i 500 idu istim putem kao mrežna greška.',
        15: 'Stanje „uspjeh“, ili „prazno“ kad nema klijenata.',
        17: '<code>catch</code>: stanje „greška“, sa porukom.',
        20: '<code>finally</code> se izvrši uvijek, i poslije uspjeha i poslije greške — dugme se vrati.',
      },
      poslije: 'Pokreni i klikni „Učitaj klijente“. Pa u „Promijeni i probaj“ zamijeni adresu sa <code>"/api/pad"</code> (500) ili <code>"/api/spor"</code> (odgovor za 1,5 s) i klikni ponovo. To su četiri stanja ekrana iz Teme 10: učitavanje, prazno, greška i uspjeh.' },
    { tip: 'primjer', jezik: 'js', naslov: 'Tvoj kod: apiFetch iz inhome', bezPokretanja: true,
      uvod: 'Ovo je dio funkcije <code>apiFetch</code> iz <code>static/js/app-next-api.js</code> (skraćeno). Kroz nju idu svi pozivi serveru u inhome. Klikni svaku liniju — sada razumiješ svaki dio.',
      kod: `const doFetch = async headers => {
  try {
    return await fetch(\`\${API}\${path}\`, { credentials: 'include', method, headers, body });
  } catch (_) {
    throw new Error('Nema veze sa serverom. Provjeri internet pa pokušaj ponovo.');
  }
};
let response = await doFetch(jwt ? { ...baseHeaders, Authorization: \`Bearer \${jwt}\` } : baseHeaders);
if (response.status === 401 && jwt) {
  try { localStorage.removeItem('inhome_jwt'); } catch (_) {}
  response = await doFetch(baseHeaders);
}`,
      obj: {
        1: 'Pomoćna async strelica unutar apiFetch: pošalji zahtjev sa datim zaglavljima.',
        3: '<code>credentials: \'include\'</code> — pošalji i kolačiće (u njima je JWT prijava, Tema 1). <code>method, headers, body</code> je kraći zapis za <code>method: method</code> itd. <code>\${API}\${path}</code> — adresa servera plus putanja.',
        4: '<code>catch (_)</code> — odgovor nije stigao (mrežna greška)…',
        5: '…pa se pretvori u poruku na ljudskom jeziku. Ista rečenica kao u tvom primjeru.',
        8: 'Ako postoji sačuvan token (<code>jwt</code>), dodaj zaglavlje Authorization. <code>...baseHeaders</code> (spread) prepiše sva osnovna zaglavlja u novi objekat. Ternarni operator bira jedan od dva objekta.',
        9: '401 = „ne znam ko si“: token je istekao ili je loš…',
        10: '…obriši ga (u try, jer localStorage može biti nedostupan)…',
        11: '…i pokušaj još jednom, samo sa kolačićem. To je popravka buga sa „ustajalim Bearerom“ iz Teme 1.',
      } },
    { tip: 'zadatak', jezik: 'js', naslov: 'Dug klijenta sa servera',
      opis: `<p>Napiši async funkciju <code>dugKlijenta(id)</code> koja:</p><ul><li>učita fakture tog klijenta: <code>GET /api/fakture?klijent_id=ID</code></li><li>ako odgovor nije ok, baci grešku: <code>throw new Error("Greška " + odgovor.status)</code></li><li>inače vrati zbir <code>iznos - placeno</code> za sve njegove fakture (broj)</li></ul><p>Početni kod je poziva za klijenta 1 i ispisuje <code>Amra duguje 450 KM</code>.</p>`,
      pocetak: `async function dugKlijenta(id) {
  // tvoj kod
}

const dug = await dugKlijenta(1);
console.log(\`Amra duguje \${dug} KM\`);
`,
      testovi: [
        { opis: 'dugKlijenta(1) vraća 450', kod: "ocekuj(await dugKlijenta(1), 450, 'dugKlijenta(1)')" },
        { opis: 'dugKlijenta(2) vraća 2200', kod: "ocekuj(await dugKlijenta(2), 2200, 'dugKlijenta(2)')" },
        { opis: 'Klijent bez faktura: 0', kod: "ocekuj(await dugKlijenta(3), 0, 'dugKlijenta(3)')" },
        { opis: 'Ispis: Amra duguje 450 KM', kod: "ocekuj(IZLAZ.trim(), 'Amra duguje 450 KM', 'ispis')" },
        { opis: 'Neispravan id (server vrati 400) baca grešku', kod: "let bacila = false;\ntry { await dugKlijenta('abc'); } catch (e) { bacila = true; }\nocekuj(bacila, true, 'za odgovor koji nije ok funkcija treba baciti grešku')" },
      ],
      nagovjestaji: ['Zahtjev: <code>const odgovor = await fetch(`/api/fakture?klijent_id=${id}`);</code>', 'Provjera: <code>if (!odgovor.ok) throw new Error("Greška " + odgovor.status);</code>', 'Zbir: <code>const fakture = await odgovor.json();</code> pa <code>return fakture.reduce((s, f) =&gt; s + f.iznos - f.placeno, 0);</code>'],
      rjesenje: `async function dugKlijenta(id) {
  const odgovor = await fetch(\`/api/fakture?klijent_id=\${id}\`);
  if (!odgovor.ok) {
    throw new Error("Greška " + odgovor.status);
  }
  const fakture = await odgovor.json();
  return fakture.reduce((zbir, f) => zbir + f.iznos - f.placeno, 0);
}

const dug = await dugKlijenta(1);
console.log(\`Amra duguje \${dug} KM\`);`,
      objRj: 'Funkcija vraća broj ili baca grešku — nikad „pola“. Onaj ko je poziva odlučuje kako grešku prikazati (poruka, dugme „Pokušaj ponovo“). Ista podjela kao servis i ruta u Temi 5.' },
    { tip: 'tekst', naslov: 'Završio si JavaScript osnove 🎉', html: `
      <p>Sad znaš pročitati i napisati: let/const i tipove (i zamku sa <code>+</code>), if i <code>===</code>, nizove i petlje, objekte i JSON, funkcije i map/filter/reduce, DOM i render iz stanja, događaje i event delegation, fetch sa async/await i obradom grešaka — i razumiješ stvarni apiFetch iz svog projekta.</p>
      <p><b>Sljedeći koraci:</b></p>
      <ul><li><b>Tema 2 (Frontend arhitektura)</b> je sada potpuno čitljiva: state, render, event delegation, service worker.</li><li><b>Tema 0 (put jednog klika)</b>: prođi je ponovo i prati koji korak je JavaScript, a koji Python.</li><li>Dio 3 (SQL) stiže kao sljedeća faza u istom obliku.</li><li>Otvori <code>app-next-events.js</code>, nađi <code>closest(</code> i pitaj tutora da ti jedan takav slušač objasni liniju po liniju.</li></ul>
      <div class="row"><button class="btn primary" data-go="tema:m2">Tema 2: frontend arhitektura →</button><button class="btn" data-go="tema:m0">Tema 0: put jednog klika</button></div>` },
    { tip: 'kviz', p: 'Kada fetch baca grešku koju hvata catch?', o: ['Kad server vrati 404 ili 500', 'Samo kad odgovor ne stigne (mreža, server nedostupan); status se provjerava sa odgovor.ok', 'Nikad', 'Uvijek kad status nije 200'], t: 1, e: 'Odgovor sa greškom je i dalje odgovor. Zato su potrebne obje provjere: try/catch i odgovor.ok.' },
    { tip: 'kviz', p: 'Šta je u x poslije const x = fetch("/api/klijenti"), bez await?', o: ['Niz klijenata', 'Odgovor sa statusom', 'Obećanje (Promise) — odgovor još nije stigao', 'JSON tekst'], t: 2, e: 'Na obećanje se čeka sa await; tek tada dobiješ odgovor.' },
  ],
});

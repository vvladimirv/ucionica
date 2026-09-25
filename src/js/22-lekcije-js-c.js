// ============================================================================
// Dio 2 · JavaScript — lekcije 6–7 (DOM, događaji). Kod radi nad stranicom u okviru (jezik: 'dom');
// `setup` je HTML stranice prije pokretanja koda. U kodu: ` piši kao \`, ${ kao \${, a \ kao \\.
// ============================================================================
LEKCIJE_JS.push({
  id: 'js6', naslov: 'DOM: JavaScript mijenja stranicu', cilj: 'Kako JavaScript pronađe element na stranici, promijeni mu tekst i izgled, doda nove elemente i iscrta listu iz podataka — UI = f(state).',
  koraci: [
    { tip: 'tekst', naslov: 'Stranica je stablo objekata', html: `
      <p>Kad preglednik učita HTML, od njega napravi <b>DOM</b> (Document Object Model): stablo objekata u kojem je svaki element (<code>&lt;h1&gt;</code>, <code>&lt;ul&gt;</code>, <code>&lt;button&gt;</code>) jedan objekat sa poljima i metodama. JavaScript mijenja stranicu tako što mijenja te objekte, a preglednik odmah iscrta promjenu.</p>
      <ul><li><code>document.querySelector("#lista")</code> — nađi <b>prvi</b> element po CSS selektoru (<code>#id</code>, <code>.klasa</code>, <code>li</code>…); ako ga nema, vrati <code>null</code></li><li><code>document.querySelectorAll("li")</code> — nađi <b>sve</b></li><li><code>el.textContent = "…"</code> — postavi tekst elementa</li><li><code>document.createElement("li")</code> pa <code>lista.append(li)</code> — napravi novi element i dodaj ga</li><li><code>el.classList.add("gotovo")</code> i <code>remove(…)</code> — dodaj ili ukloni CSS klasu, tj. promijeni izgled</li></ul>
      <div class="note">Od ove lekcije kod mijenja <b>pravu malu stranicu</b> u okviru „Pregled stranice“. Iznad koda piše njen HTML. Okvir je odvojen od učionice: šta god uradiš, učionica ostaje ista.</div>` },
    { tip: 'primjer', jezik: 'dom', naslov: 'Nađi, promijeni, dodaj',
      setup: `<h1 id="naslov">Klijenti</h1>
<p id="info" class="ucitavanje">Učitavam…</p>
<ul id="lista"></ul>`,
      kod: `const naslov = document.querySelector("#naslov");
naslov.textContent = "Klijenti (3)";

const info = document.querySelector("#info");
info.textContent = "Spisak je ažuran.";
info.classList.remove("ucitavanje");
info.classList.add("uspjeh");

const lista = document.querySelector("#lista");
for (const ime of ["Amra", "Emir", "Selma"]) {
  const li = document.createElement("li");
  li.textContent = ime;
  lista.append(li);
}
console.log(document.querySelectorAll("li").length);`,
      obj: {
        1: 'Nađi element sa <code>id="naslov"</code>. <code>#</code> znači id, isto kao u CSS-u.',
        2: 'Zamijeni njegov tekst.',
        6: 'Ukloni klasu <code>ucitavanje</code> (siv, ukošen tekst)…',
        7: '…i dodaj klasu <code>uspjeh</code> (zeleno). Izgled se mijenja klasama, a boje su u CSS-u.',
        11: 'Napravi novi element <code>&lt;li&gt;</code>. Još nije na stranici.',
        12: 'Daj mu tekst.',
        13: 'Dodaj ga na kraj liste — tek sada se pojavi.',
        15: 'Sada na stranici postoje tri <code>&lt;li&gt;</code> elementa.',
      },
      poslije: 'Pokreni i gledaj okvir. Pa u „Promijeni i probaj“ dodaj četvrto ime u niz.' },
    { tip: 'tekst', naslov: 'textContent, innerHTML i esc()', html: `
      <p>Sadržaj elementa se postavlja na dva načina:</p>
      <ul><li><code>el.textContent = x</code> — x se prikaže <b>kao tekst</b>, doslovno.</li><li><code>el.innerHTML = x</code> — x se pročita <b>kao HTML</b>: oznake poput <code>&lt;b&gt;</code> postanu elementi.</li></ul>
      <p>innerHTML je zgodan za iscrtavanje cijelih dijelova ekrana odjednom (tako radi i inhome), ali je <b>opasan</b> za tekst koji je upisao korisnik: ako neko u ime klijenta upiše HTML sa skriptom, ona bi se izvršila u tuđem pregledniku. To je napad <b>XSS</b> (Tema 8).</p>
      <p>Zato inhome sav tuđi tekst prije ubacivanja u HTML propusti kroz funkciju <code>esc()</code>, koja znakove <code>&lt;</code>, <code>&gt;</code>, <code>&amp;</code> i navodnike pretvori u bezopasne oznake (<code>&amp;lt;</code> i slične), pa se prikažu kao tekst.</p>` },
    { tip: 'predvidi', jezik: 'dom', pitanje: 'Šta ispiše console.log u zadnjoj liniji? (Poslije odgovora pokreni i pogledaj okvir.)',
      setup: `<p id="a"></p>
<p id="b"></p>`,
      kod: `const ime = "<b>Amra</b>";
document.querySelector("#a").textContent = ime;
document.querySelector("#b").innerHTML = ime;
console.log(document.querySelector("#b").textContent);`,
      opcije: ['<b>Amra</b>', 'Amra', '**Amra**', 'Ništa'], t: 1,
      obj: 'U #b je innerHTML napravio pravi element <code>&lt;b&gt;</code>, pa je tekst paragrafa samo „Amra“ (podebljano). U #a je textContent prikazao oznake doslovno: <code>&lt;b&gt;Amra&lt;/b&gt;</code>.' },
    { tip: 'primjer', jezik: 'dom', naslov: 'Stanje → render → stranica',
      uvod: 'Ovako radi cijeli inhome ekran: podaci su u objektu <code>state</code>, a funkcija <code>render()</code> iz njih napravi HTML. Kad se podaci promijene, ne mijenja se stranica „ručno“ — promijeni se stanje i pozove render.',
      setup: `<ul id="lista"></ul>`,
      kod: `const esc = s => String(s ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const state = {
  klijenti: [
    { id: 1, name: "Amra", dug: 400 },
    { id: 2, name: "Emir <script>", dug: 0 },
  ],
};

function render() {
  document.querySelector("#lista").innerHTML = state.klijenti
    .map(k => \`<li class="\${k.dug > 0 ? "greska" : ""}">\${esc(k.name)} — \${k.dug} KM</li>\`)
    .join("");
}
render();
state.klijenti.push({ id: 3, name: "Selma", dug: 1250 });
render();`,
      obj: {
        1: 'Ista ideja kao <code>esc()</code> u inhome: opasne znakove pretvori u HTML oznake. <code>?? ""</code> — null i undefined postanu prazan tekst.',
        2: 'Svaki <code>.replace</code> zamijeni jedan znak svuda u tekstu (<code>/&amp;/g</code> je obrazac „svaki &amp;“). Pozivi su nanizani, jedan za drugim.',
        8: '<b>Stanje</b> (state): obični objekat sa podacima ekrana.',
        15: '<b>render</b>: iz stanja napravi HTML — uvijek cijeli, ispočetka.',
        17: 'map pretvori svakog klijenta u tekst jednog <code>&lt;li&gt;</code>; klasa <code>greska</code> (crveno) samo za one koji duguju. Ime ide kroz esc().',
        18: 'join spoji sve <code>&lt;li&gt;</code> u jedan tekst, koji ode u innerHTML.',
        20: 'Prvo iscrtavanje.',
        21: 'Promijeni <b>stanje</b>, ne stranicu…',
        22: '…pa ponovo iscrtaj. Ekran uvijek odgovara podacima: <b>UI = f(state)</b>.',
      },
      poslije: 'Ime „Emir &lt;script&gt;“ se prikazalo kao tekst, jer je prošlo kroz esc(). U „Promijeni i probaj“ izbriši <code>esc(</code> i <code>)</code> oko <code>k.name</code> i pokreni: oznaka nestane iz prikaza, jer ju je preglednik protumačio kao HTML.' },
    { tip: 'greska', jezik: 'dom', pitanje: 'Program pada na liniji 4, ali uzrok je ranije. Klikni liniju sa stvarnim uzrokom.',
      setup: `<ul id="lista"></ul>`,
      kod: `const lista = document.querySelector("lista");
const li = document.createElement("li");
li.textContent = "Amra";
lista.append(li);`,
      linija: 1, obj: 'Selektoru fali <code>#</code>: <code>"lista"</code> traži element <code>&lt;lista&gt;</code>, kojeg nema, pa querySelector vrati <code>null</code>. Greška se javi tek u liniji 4, kad od null tražiš append. Kad vidiš „Cannot read properties of null“, prvo provjeri selektor.',
      ispravno: `const lista = document.querySelector("#lista");
const li = document.createElement("li");
li.textContent = "Amra";
lista.append(li);` },
    { tip: 'popuni', jezik: 'dom', pitanje: 'Nađi element sa id="status", promijeni mu tekst u Plaćeno i dodaj mu klasu uspjeh.',
      setup: `<p id="status">Otvoreno</p>`,
      kod: `const el = document.___("#status");
el.___ = "Plaćeno";
el.classList.___("uspjeh");`,
      odg: [['querySelector'], ['textContent', 'innerText'], ['add']],
      obj: 'Element se traži sa <code>querySelector</code>, tekst se postavlja preko <code>textContent</code>, a klasa se dodaje sa <code>classList.add</code>.' },
    { tip: 'primjer', jezik: 'dom', naslov: 'Data-atributi i klase',
      uvod: 'Elementi mogu nositi i podatke: atribut <code>data-id="3"</code> u HTML-u se u JavaScriptu čita kao <code>el.dataset.id</code>. Tako inhome zna na koji je red kliknuto (lekcija 7).',
      setup: `<ul id="lista">
  <li data-id="1">Mjerenje</li>
  <li data-id="2" class="gotovo">Ponuda</li>
  <li data-id="3">Izrada</li>
</ul>`,
      kod: `const stavke = document.querySelectorAll("#lista li");
for (const li of stavke) {
  console.log(li.dataset.id, li.textContent, li.classList.contains("gotovo"));
}
const treca = document.querySelector('[data-id="3"]');
treca.classList.toggle("gotovo");
console.log(treca.classList.contains("gotovo"));`,
      obj: {
        1: '<code>querySelectorAll</code> vrati sve <code>&lt;li&gt;</code> unutar #lista — skoro niz, for…of radi.',
        3: '<code>dataset.id</code> je vrijednost atributa <code>data-id</code> — uvijek <b>tekst</b>. <code>contains</code> pita ima li element klasu.',
        5: 'Selektor po atributu: element čiji je data-id tačno "3".',
        6: '<code>toggle</code>: ako klase nema — dodaj je; ako je ima — ukloni je.',
      } },
    { tip: 'poredaj', jezik: 'dom', pitanje: 'Poredaj put podataka od odgovora servera do stranice: JSON tekst → objekat → imena → HTML → stranica.',
      setup: `<ul id="lista"></ul>`,
      linije: ['const odgovor = \'{"klijenti":[{"name":"Amra"},{"name":"Emir"}]}\';', 'const podaci = JSON.parse(odgovor);', 'const imena = podaci.klijenti.map(k => k.name);', 'const html = imena.map(ime => `<li>${ime}</li>`).join("");', 'document.querySelector("#lista").innerHTML = html;'],
      obj: 'Svaka linija koristi rezultat prethodne: tekst iz odgovora → objekat (JSON.parse) → niz imena (map) → HTML tekst (map + join) → na stranicu (innerHTML).' },
    { tip: 'zadatak', jezik: 'dom', naslov: 'Iscrtaj otvorene fakture',
      opis: `<p>Stranica ima praznu listu <code>#fakture</code> i paragraf <code>#ukupno</code>. Dopuni funkciju <code>render()</code> tako da iz <code>state.fakture</code>:</p><ul><li>u <code>#fakture</code> upiše po jedan <code>&lt;li&gt;</code> za svaku <b>otvorenu</b> fakturu (plaćeno manje od iznosa), sa tekstom <code>FAK-2: 450 KM</code> (broj: iznos KM)</li><li>u <code>#ukupno</code> upiše <code>Ukupno otvoreno: 3650 KM</code> — zbir iznosa otvorenih faktura</li></ul><p>Testovi će mijenjati stanje i ponovo zvati <code>render()</code>, zato sve računaj iz <code>state</code>, a ne iz brojeva napisanih rukom.</p>`,
      setup: `<h2>Otvorene fakture</h2>
<ul id="fakture"></ul>
<p id="ukupno"></p>`,
      pocetak: `const state = {
  fakture: [
    { broj: "FAK-1", iznos: 1200, placeno: 1200 },
    { broj: "FAK-2", iznos: 450, placeno: 0 },
    { broj: "FAK-3", iznos: 3200, placeno: 1000 },
  ],
};

function render() {
  // tvoj kod
}
render();
`,
      testovi: [
        { opis: 'Prikazane su 2 otvorene fakture', kod: "ocekuj(T.broj('#fakture li'), 2, 'broj stavki u #fakture')" },
        { opis: 'Tekst stavki: FAK-2: 450 KM i FAK-3: 3200 KM', kod: "ocekuj(T.$$('#fakture li').map(li => li.textContent.trim()), ['FAK-2: 450 KM', 'FAK-3: 3200 KM'], 'tekst stavki')" },
        { opis: 'Ukupno otvoreno: 3650 KM', kod: "ocekuj(T.tekst('#ukupno'), 'Ukupno otvoreno: 3650 KM', '#ukupno')" },
        { opis: 'Dvostruki render ne duplira stavke', kod: "render(); render(); ocekuj(T.broj('#fakture li'), 2, 'poslije još dva poziva render()')" },
        { opis: 'render radi iz stanja (nova faktura)', kod: "state.fakture.push({ broj: 'FAK-4', iznos: 100, placeno: 0 }); render(); ocekuj(T.broj('#fakture li'), 3, 'poslije nove fakture'); ocekuj(T.tekst('#ukupno'), 'Ukupno otvoreno: 3750 KM', '#ukupno poslije nove fakture')" },
      ],
      nagovjestaji: ['Otvorene fakture: <code>const otvorene = state.fakture.filter(f =&gt; f.placeno &lt; f.iznos);</code>', 'Lista: <code>otvorene.map(f =&gt; `&lt;li&gt;${f.broj}: ${f.iznos} KM&lt;/li&gt;`).join("")</code> upiši u <code>innerHTML</code> od #fakture. innerHTML zamijeni stari sadržaj, pa nema dupliranja.', 'Zbir: <code>otvorene.reduce((s, f) =&gt; s + f.iznos, 0)</code>, pa ga upiši u <code>textContent</code> od #ukupno.'],
      rjesenje: `const state = {
  fakture: [
    { broj: "FAK-1", iznos: 1200, placeno: 1200 },
    { broj: "FAK-2", iznos: 450, placeno: 0 },
    { broj: "FAK-3", iznos: 3200, placeno: 1000 },
  ],
};

function render() {
  const otvorene = state.fakture.filter(f => f.placeno < f.iznos);
  document.querySelector("#fakture").innerHTML = otvorene
    .map(f => \`<li>\${f.broj}: \${f.iznos} KM</li>\`)
    .join("");
  const ukupno = otvorene.reduce((s, f) => s + f.iznos, 0);
  document.querySelector("#ukupno").textContent = \`Ukupno otvoreno: \${ukupno} KM\`;
}
render();`,
      objRj: 'Brojeve faktura pišemo mi, pa esc() ovdje nije neophodan. Za tekst koji upisuje korisnik (ime klijenta, napomena) uvijek esc() — ili textContent.' },
    { tip: 'kviz', p: 'Šta vrati document.querySelector("#nema") kad takav element ne postoji?', o: ['Grešku', 'null', 'Prazan tekst', 'undefined'], t: 1, e: 'null — a greška dođe tek kad od null nešto tražiš (null.textContent).' },
    { tip: 'kviz', p: 'Zašto inhome tuđi tekst propušta kroz esc() prije innerHTML?', o: ['Zbog brzine', 'Da se tekst prikaže kao tekst, a ne protumači kao HTML (zaštita od XSS)', 'Zbog prevoda na druge jezike', 'Da bude podebljan'], t: 1, e: 'innerHTML izvršava HTML; esc() pretvori opasne znakove u bezopasne oznake.' },
  ],
});

LEKCIJE_JS.push({
  id: 'js7', naslov: 'Događaji: klik, unos, forma', cilj: 'addEventListener, objekat događaja, event delegation sa closest i data-atributima, forme i preventDefault — kako inhome reaguje na klik.',
  koraci: [
    { tip: 'tekst', naslov: 'Stranica čeka korisnika', html: `
      <p>Do sada se kod izvršio jednom, odozgo prema dolje. Web stranica mora <b>čekati</b> korisnika: klik, upis, slanje forme. Za to služi <b>slušač događaja</b>:</p>
      <p><code>dugme.addEventListener("click", funkcija)</code> — „kad neko klikne ovo dugme, pozovi ovu funkciju“. Funkcija se ne poziva odmah (zato bez zagrada iza imena!), nego se predaje pregledniku da je pozove kasnije — callback iz lekcije 5.</p>
      <p>Preglednik funkciji preda <b>objekat događaja</b> (obično se zove <code>e</code> ili <code>event</code>): <code>e.target</code> je element na koji je stvarno kliknuto, <code>e.key</code> tipka koja je pritisnuta, a <code>e.preventDefault()</code> zaustavi ono što bi preglednik inače uradio — npr. slanje forme i ponovno učitavanje stranice.</p>
      <p>Najčešći događaji: <code>click</code>, <code>input</code> (svaka promjena teksta u polju), <code>change</code>, <code>submit</code> (slanje forme) i <code>keydown</code> (pritisak tipke).</p>` },
    { tip: 'primjer', jezik: 'dom', naslov: 'Brojač klikova',
      setup: `<p>Kliknuto: <b id="broj">0</b> puta</p>
<button id="dugme">Klikni me</button>`,
      kod: `let klikova = 0;
const dugme = document.querySelector("#dugme");
const broj = document.querySelector("#broj");

dugme.addEventListener("click", () => {
  klikova++;
  broj.textContent = klikova;
  console.log(\`Klik broj \${klikova}\`);
});
console.log("Slušač je postavljen, čekam klik…");`,
      obj: {
        5: 'Postavi slušač: preglednik zapamti funkciju i zove je na svaki klik. Ova linija se izvrši odmah, ali tijelo funkcije tek kad neko klikne.',
        6: 'Svaki klik povećava brojač…',
        7: '…i upiše ga na stranicu.',
        10: 'Ovo se ispiše <b>prije</b> ikakvog klika: slušač samo čeka.',
      },
      poslije: 'Pokreni, pa klikni dugme u okviru „Pregled stranice“ nekoliko puta i gledaj konzolu.' },
    { tip: 'predvidi', jezik: 'dom', pitanje: 'Šta se ispiše odmah po pokretanju, bez klikanja?',
      setup: `<button id="d">Pozdravi</button>`,
      kod: `function pozdrav() {
  console.log("Zdravo!");
}
const dugme = document.querySelector("#d");
dugme.addEventListener("click", pozdrav());
console.log("Kraj");`,
      opcije: ['Kraj (a Zdravo! tek na klik)', 'Zdravo! · Kraj', 'Grešku', 'Kraj'], t: 1,
      obj: '<code>pozdrav()</code> sa zagradama <b>odmah poziva</b> funkciju — ispiše Zdravo! — i slušaču preda njen rezultat (undefined), pa klik kasnije ne radi ništa. Treba predati samu funkciju, bez zagrada: <code>addEventListener("click", pozdrav)</code>. Jedna od najčešćih grešaka.' },
    { tip: 'primjer', jezik: 'dom', naslov: 'Polje i forma',
      setup: `<form id="forma">
  <input id="ime" placeholder="Ime klijenta" autocomplete="off">
  <button>Dodaj</button>
</form>
<p id="pregled" class="prazno">Upiši ime…</p>
<ul id="lista"></ul>`,
      kod: `const forma = document.querySelector("#forma");
const polje = document.querySelector("#ime");
const pregled = document.querySelector("#pregled");
const lista = document.querySelector("#lista");

polje.addEventListener("input", () => {
  pregled.textContent = \`Dodaćeš: \${polje.value}\`;
});

forma.addEventListener("submit", e => {
  e.preventDefault();
  const ime = polje.value.trim();
  if (!ime) return;
  const li = document.createElement("li");
  li.textContent = ime;
  lista.append(li);
  polje.value = "";
});`,
      obj: {
        6: '<code>input</code>: poziva se na svako slovo.',
        7: '<code>polje.value</code> je ono što piše u polju — uvijek tekst.',
        10: '<code>submit</code>: forma se šalje, bilo Enterom bilo dugmetom.',
        11: 'Bez ovoga bi preglednik poslao formu i <b>ponovo učitao stranicu</b> — sve bi nestalo. U inhome svaka forma počinje ovom linijom.',
        12: '<code>trim()</code> ukloni razmake sa krajeva (Pythonov <code>strip</code>).',
        13: 'Prazno ime? Izađi iz funkcije. To je validacija, kao 400 na serveru.',
        17: 'Isprazni polje za sljedeći unos.',
      },
      poslije: 'Pokreni, upiši ime u polje i pritisni Enter. Probaj i samo razmake. Pa izbriši liniju 11 i pošalji formu: u konzoli se pojavi upozorenje (učionica ne dozvoljava ponovno učitavanje, ali prava stranica bi se učitala ispočetka).' },
    { tip: 'greska', jezik: 'dom',
      setup: `<button id="sacuvaj">Sačuvaj</button>`,
      kod: `const dugme = document.querySelector("#sacuvaj");
dugme.addEventListner("click", () => {
  console.log("Sačuvano");
});`,
      linija: 2, obj: 'Ime metode je pogrešno napisano: <code>addEventListner</code> umjesto <code>addEventListener</code> (fali „e“). Objekat nema metodu sa tim imenom, pa je to undefined, a undefined se ne može pozvati: „is not a function“. Tipfeler u imenu metode daje upravo ovu poruku.',
      ispravno: `const dugme = document.querySelector("#sacuvaj");
dugme.addEventListener("click", () => {
  console.log("Sačuvano");
});` },
    { tip: 'tekst', naslov: 'Jedan slušač za sve: event delegation', html: `
      <p>Kad lista ima 500 redova sa dugmetom „Obriši“, ne kači se 500 slušača. Kači se <b>jedan</b> slušač na zajedničkog roditelja: događaj klika „putuje“ od kliknutog elementa prema gore, kroz sve roditelje (<i>bubbling</i>), pa ga roditelj čuje.</p>
      <p>U slušaču se pita: <b>na šta je kliknuto?</b> <code>e.target.closest("[data-obrisi]")</code> nađe najbliži element — sam kliknuti ili nekog njegovog roditelja — koji ima atribut <code>data-obrisi</code>. Ako ga nema, klik nije bio na dugme za brisanje. Ako ga ima, <code>btn.dataset.obrisi</code> kaže <b>koji</b> red.</p>
      <p>To je <b>event delegation</b> iz Teme 2, i upravo tako radi inhome: jedan slušač na korijenu aplikacije (<code>handleAppNextClick</code>) za sve klikove. Radi i za redove koji se pojave kasnije i preživi ponovno iscrtavanje sa innerHTML.</p>` },
    { tip: 'primjer', jezik: 'dom', naslov: 'Stanje, render i jedan slušač',
      setup: `<ul id="app"></ul>`,
      kod: `const root = document.querySelector("#app");
const state = {
  zadaci: [
    { id: 1, tekst: "Mjerenje kuhinje" },
    { id: 2, tekst: "Ponuda za Amru" },
    { id: 3, tekst: "Narudžba ploča" },
  ],
};

function render() {
  root.innerHTML = state.zadaci
    .map(z => \`<li>\${z.tekst} <button data-obrisi="\${z.id}">✕</button></li>\`)
    .join("");
}

root.addEventListener("click", e => {
  const btn = e.target.closest("[data-obrisi]");
  if (!btn) return;
  const id = Number(btn.dataset.obrisi);
  state.zadaci = state.zadaci.filter(z => z.id !== id);
  render();
});
render();`,
      obj: {
        12: 'Svako dugme nosi id svog zadatka u <code>data-obrisi</code>.',
        16: '<b>Jedan</b> slušač na korijenu, za sve sadašnje i buduće redove.',
        17: '<code>closest</code>: dugme koje nosi data-obrisi, ili null ako je kliknuto pored njega.',
        18: 'Klik nije bio na dugme → ništa.',
        19: 'dataset daje tekst "2"; <code>Number</code> ga pretvori u broj, da <code>!==</code> poredi broj sa brojem.',
        20: 'Promijeni stanje: novi niz bez obrisanog zadatka…',
        21: '…pa iscrtaj. Stari elementi nestanu, a slušač na root ostaje.',
        23: 'Prvo iscrtavanje.',
      },
      poslije: 'Pokreni i briši zadatke klikom na ✕. Ovo je rješenje vježbe iz Teme 2.' },
    { tip: 'predvidi', jezik: 'dom',
      setup: `<button data-id="2">Obriši</button>`,
      kod: `const btn = document.querySelector("button");
const id = btn.dataset.id;
console.log(id === 2, Number(id) === 2, typeof id);`,
      opcije: ['true true number', 'false true string', 'true false string', 'false false string'], t: 1,
      obj: 'dataset uvijek daje <b>tekst</b> "2". Tekst nije jednak broju 2 kad se poredi sa <code>===</code>, pa bi bez Number() filter tiho ostavio sve zadatke — bug bez ikakve poruke.' },
    { tip: 'popuni', jezik: 'dom', pitanje: 'Jedan slušač na listi: klik na „Označi“ precrta tog klijenta.',
      setup: `<ul id="lista">
  <li>Amra <button data-id="1">Označi</button></li>
  <li>Emir <button data-id="2">Označi</button></li>
</ul>`,
      kod: `const lista = document.querySelector("#lista");
lista.___("click", e => {
  const btn = e.target.___("[data-id]");
  if (!btn) return;
  btn.parentElement.classList.toggle("gotovo");
  console.log(\`Označen klijent \${btn.dataset.___}\`);
});`,
      odg: [['addEventListener'], ['closest'], ['id']],
      obj: 'Slušač se kači sa <code>addEventListener</code>; <code>closest</code> nađe dugme sa data-id; <code>dataset.id</code> čita vrijednost atributa <code>data-id</code>. Pokreni pa klikni „Označi“.' },
    { tip: 'poredaj', jezik: 'dom', pokreni: false, pitanje: 'Poredaj slušač iz primjera: klik na ✕ briše zadatak, a klik pored dugmeta ne smije praviti grešku.',
      linije: ['root.addEventListener("click", e => {', '  const btn = e.target.closest("[data-obrisi]");', '  if (!btn) return;', '  const id = Number(btn.dataset.obrisi);', '  state.zadaci = state.zadaci.filter(z => z.id !== id);', '  render();', '});'],
      obj: 'Prvo nađi dugme, pa provjeri da li ga ima — tek onda smiješ čitati <code>btn.dataset</code> (od null bi pukao). Zatim id, promjena stanja i render.' },
    { tip: 'zadatak', jezik: 'dom', naslov: 'Lista zadataka',
      opis: `<p>Napravi malu listu zadataka po obrascu stanje → render → događaj:</p><ul><li><code>render()</code> za svaki zadatak iz <code>state.zadaci</code> napravi <code>&lt;li data-id="…"&gt;</code> sa tekstom zadatka; gotovim zadacima doda klasu <code>gotovo</code></li><li>u <code>#info</code> upiše <code>Otvoreno: N</code> — broj zadataka koji nisu gotovi</li><li>slanje forme doda novi zadatak (prazan tekst se ne dodaje), isprazni polje i ponovo iscrta</li><li><b>jedan</b> slušač na <code>#lista</code>: klik na zadatak mu promijeni <code>gotovo</code> (true ↔ false)</li><li>tekst koji upiše korisnik prikaže se kao tekst, a ne kao HTML (esc() ili textContent)</li></ul>`,
      setup: `<form id="forma">
  <input id="novi" placeholder="Novi zadatak" autocomplete="off">
  <button>Dodaj</button>
</form>
<ul id="lista"></ul>
<p id="info"></p>`,
      pocetak: `const state = {
  zadaci: [
    { id: 1, tekst: "Mjerenje kuhinje", gotovo: true },
    { id: 2, tekst: "Ponuda za Amru", gotovo: false },
  ],
  sljedeciId: 3,
};
const lista = document.querySelector("#lista");

function render() {
  // tvoj kod
}

// slušači ovdje

render();
`,
      testovi: [
        { opis: 'Početni prikaz: 2 zadatka, prvi precrtan, Otvoreno: 1', kod: "ocekuj(T.broj('#lista li'), 2, 'broj zadataka'); ocekuj(T.$('#lista li').classList.contains('gotovo'), true, 'prvi zadatak treba klasu gotovo'); ocekuj(T.tekst('#info'), 'Otvoreno: 1', '#info')" },
        { opis: 'Svaki zadatak ima data-id', kod: "ocekuj(T.$$('#lista li').map(li => li.dataset.id), ['1', '2'], 'data-id zadataka')" },
        { opis: 'Forma dodaje zadatak i prazni polje', kod: "await T.upisi('#novi', 'Narudžba ploča'); await T.posalji('#forma'); ocekuj(T.broj('#lista li'), 3, 'broj zadataka poslije dodavanja'); ocekuj(T.$('#novi').value, '', 'polje poslije dodavanja'); ocekuj(T.tekst('#info'), 'Otvoreno: 2', '#info poslije dodavanja')" },
        { opis: 'Prazan unos se ne dodaje', kod: "await T.upisi('#novi', '   '); await T.posalji('#forma'); ocekuj(T.broj('#lista li'), 3, 'broj zadataka poslije praznog unosa')" },
        { opis: 'Klik na zadatak mijenja gotovo (i nazad)', kod: "await T.klikni('#lista li[data-id=\"2\"]'); ocekuj(T.$('#lista li[data-id=\"2\"]').classList.contains('gotovo'), true, 'zadatak 2 poslije klika'); ocekuj(T.tekst('#info'), 'Otvoreno: 1', '#info poslije klika'); await T.klikni('#lista li[data-id=\"2\"]'); ocekuj(T.$('#lista li[data-id=\"2\"]').classList.contains('gotovo'), false, 'zadatak 2 poslije drugog klika')" },
        { opis: 'Unos korisnika se prikazuje kao tekst', kod: "await T.upisi('#novi', '<b>x</b>'); await T.posalji('#forma'); ocekuj(T.broj('#lista li b'), 0, 'oznaka <b> iz unosa ne smije postati HTML element')" },
      ],
      nagovjestaji: ['render: <code>lista.innerHTML = state.zadaci.map(z =&gt; `&lt;li data-id="${z.id}" class="${z.gotovo ? "gotovo" : ""}"&gt;${esc(z.tekst)}&lt;/li&gt;`).join("");</code> — esc() napiši kao u lekciji 6.', 'Otvoreni: <code>state.zadaci.filter(z =&gt; !z.gotovo).length</code>', 'Klik: <code>const li = e.target.closest("li[data-id]");</code>, pa nađi zadatak sa <code>find</code> i promijeni mu <code>gotovo = !gotovo</code>, pa render().'],
      rjesenje: `const state = {
  zadaci: [
    { id: 1, tekst: "Mjerenje kuhinje", gotovo: true },
    { id: 2, tekst: "Ponuda za Amru", gotovo: false },
  ],
  sljedeciId: 3,
};
const lista = document.querySelector("#lista");
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function render() {
  lista.innerHTML = state.zadaci
    .map(z => \`<li data-id="\${z.id}" class="\${z.gotovo ? "gotovo" : ""}">\${esc(z.tekst)}</li>\`)
    .join("");
  const otvoreno = state.zadaci.filter(z => !z.gotovo).length;
  document.querySelector("#info").textContent = \`Otvoreno: \${otvoreno}\`;
}

document.querySelector("#forma").addEventListener("submit", e => {
  e.preventDefault();
  const polje = document.querySelector("#novi");
  const tekst = polje.value.trim();
  if (!tekst) return;
  state.zadaci.push({ id: state.sljedeciId++, tekst: tekst, gotovo: false });
  polje.value = "";
  render();
});

lista.addEventListener("click", e => {
  const li = e.target.closest("li[data-id]");
  if (!li) return;
  const zadatak = state.zadaci.find(z => z.id === Number(li.dataset.id));
  zadatak.gotovo = !zadatak.gotovo;
  render();
});

render();`,
      objRj: '<code>state.sljedeciId++</code> vrati trenutnu vrijednost (3), pa je poveća — svaki novi zadatak dobije novi id. U tuđem kodu ćeš vidjeti i kraći zapis <code>{ id, tekst, gotovo: false }</code>: kad se ključ i varijabla isto zovu, dovoljno je jednom napisati ime.' },
    { tip: 'kviz', p: 'Šta ne valja u dugme.addEventListener("click", sacuvaj())?', o: ['Ništa', 'sacuvaj() se pozove odmah; treba predati funkciju bez zagrada: sacuvaj', 'Treba pisati "onclick"', 'Fali await'], t: 1, e: 'Sa zagradama se funkcija izvrši odmah, a slušač dobije njen rezultat.' },
    { tip: 'kviz', p: 'Zašto inhome ima jedan slušač na korijenu umjesto slušača na svakom dugmetu?', o: ['Brže se kuca', 'Radi i za elemente koji se iscrtaju kasnije i preživi ponovni render (event delegation)', 'Jer drugačije nije moguće', 'Zbog CSS-a'], t: 1, e: 'Slušači na samim dugmadima nestanu kad innerHTML zamijeni dugmad; slušač na korijenu ostaje.' },
  ],
});

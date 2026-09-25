// ============================================================================
// Dio 2 · JavaScript — lekcije 1–3 (konzola i varijable, odluke, nizovi i petlje).
// Kod u lekcijama je u template literalima, pa u JavaScript primjerima:
//   ` piši kao \`,   ${ kao \${,   a \ kao \\.
// Ako se to zaboravi, stranica pukne već pri učitavanju (provjera strukture to odmah javi).
// ============================================================================
const LEKCIJE_JS = [];

LEKCIJE_JS.push({
  id: 'js1', naslov: 'Prvi koraci: konzola i varijable', cilj: 'Gdje radi JavaScript, kako se ispisuje u konzolu, let i const, tipovi i najveća zamka u odnosu na Python.',
  koraci: [
    { tip: 'tekst', naslov: 'Jezik preglednika', html: `
      <p>Python radi na <b>serveru</b> (Flask u inhome). <b>JavaScript</b> radi u <b>pregledniku</b>, na računaru ili telefonu korisnika: kad klikneš „Sačuvaj klijenta“, JavaScript uhvati klik, pošalje zahtjev serveru i iscrta rezultat. Sav kod u <code>static/js/app-next*.js</code> je JavaScript.</p>
      <p>Pojmove već znaš iz Dijela 1: varijable, if, petlje, funkcije, liste i rječnici postoje i ovdje. Mijenja se <b>zapis</b>, ne ideja — zato ovaj dio ide brže.</p>
      <p>Umjesto <code>print(...)</code> piše se <code>console.log(...)</code>. Ispis ide u <b>konzolu</b>: u pravom pregledniku je otvaraš sa F12 → Console, a ovdje je u dijelu „Izlaz“.</p>
      <div class="note">Naredbe se završavaju tačka-zarezom <code>;</code>. JavaScript bi ga često dopisao i sam, ali ga u inhome kodu uvijek pišemo — piši ga i ti.</div>` },
    { tip: 'primjer', jezik: 'js', naslov: 'Prvi program', uvod: 'Klikni na svaku liniju, pa pritisni „Pokreni“.',
      kod: `// Komentar počinje sa dvije kose crte
console.log("Dobar dan!");
console.log(2 + 3);
console.log("2 + 3");
console.log("Klijent:", "Amra", 2026);`,
      obj: {
        1: 'Komentar: <code>//</code> umjesto Pythonovog <code>#</code>. JavaScript ga preskače.',
        2: '<code>console.log</code> je JavaScriptov <code>print</code>. Tekst u navodnicima ispiše se tačno kako piše. Na kraju naredbe je <code>;</code>.',
        3: 'Bez navodnika JavaScript računa: ispiše 5.',
        4: 'Sa navodnicima to je tekst: ispiše se doslovno <code>2 + 3</code>.',
        5: 'Više vrijednosti odvojenih zarezom ispiše se u jednom redu, sa razmakom između — kao <code>print("a", "b")</code>.',
      },
      poslije: 'Probaj „Promijeni i probaj“: izbriši jedan navodnik u liniji 2 i pokreni. Poruka greške kaže i broj linije.' },
    { tip: 'tekst', naslov: 'let i const', html: `
      <p>Varijabla se u JavaScriptu mora <b>najaviti</b> (deklarisati) prije upotrebe, jednom od dvije riječi:</p>
      <ul><li><code>const cijena = 8400;</code> — <b>konstanta</b>: vrijednost se više ne može zamijeniti.</li><li><code>let dug = 1200;</code> — varijabla čija će se vrijednost <b>mijenjati</b> (<code>dug = dug - 800;</code>).</li></ul>
      <p>Pravilo iz prakse: piši <code>const</code>, a <code>let</code> samo kad znaš da ćeš vrijednost mijenjati. Tako se odmah vidi šta se mijenja, a šta ne. (Postoji i stara riječ <code>var</code>; u novom kodu se ne koristi.)</p>
      <p>Imena se pišu <b>camelCase</b>: <code>cijenaSaPdv</code>, <code>brojRata</code> — svaka nova riječ počinje velikim slovom. U Pythonu je bilo <code>cijena_sa_pdv</code>. Velika i mala slova su bitna: <code>cijena</code> i <code>Cijena</code> su dvije različite varijable.</p>` },
    { tip: 'predvidi', jezik: 'js', kod: `let dug = 1200;
dug = dug - 800;
console.log(dug);`,
      opcije: ['1200', '400', 'dug - 800', 'Grešku, jer je dug već postojao'], t: 1,
      obj: 'Kao u Pythonu: desna strana se izračuna (1200 − 800), pa se rezultat spremi u <code>dug</code>. Riječ <code>let</code> se piše samo prvi put, kod najave.' },
    { tip: 'greska', jezik: 'js', kod: `const cijena = 8400;
console.log(cijena);
cijena = 9000;
console.log(cijena);`,
      linija: 3, obj: '<code>cijena</code> je <code>const</code>, pa joj se ne može dati nova vrijednost: <code>TypeError: Assignment to constant variable</code>. Ako se cijena mijenja, najavi je sa <code>let</code>. Primijeti da se linija 2 izvršila — program stane tek na grešci.',
      ispravno: `let cijena = 8400;
console.log(cijena);
cijena = 9000;
console.log(cijena);` },
    { tip: 'tekst', naslov: 'Tipovi i template literal', html: `
      <p>Tipovi su skoro isti kao u Pythonu, uz dvije razlike:</p>
      <ul><li><code>number</code> — <b>svi</b> brojevi, i cijeli i decimalni (nema odvojenih int i float): <code>8400</code>, <code>0.17</code></li><li><code>string</code> — tekst, u navodnicima <code>"…"</code> ili <code>'…'</code></li><li><code>boolean</code> — <code>true</code> ili <code>false</code>, malim slovima (u Pythonu <code>True</code>)</li><li><code>null</code> — „namjerno prazno“ i <code>undefined</code> — „još nema vrijednosti“. Python za oboje ima <code>None</code>.</li></ul>
      <p>Tekst sa vrijednostima piše se <b>template literalom</b> — to je JavaScriptov f-string. Tekst ide između znakova <code>\`</code> (backtick, obrnuti apostrof), a vrijednosti u <code>\${…}</code>:</p>
      <p><code>\`\${ime} duguje \${iznos} KM\`</code></p>
      <p class="small muted">Backtick nije apostrof. Na američkom rasporedu tastature je lijevo od tipke 1; na našem latiničnom rasporedu obično se dobija sa AltGr+7 (ako se ne pojavi odmah, pritisni još i razmak). Ako ga ne nađeš, kopiraj ga iz primjera.</p>` },
    { tip: 'primjer', jezik: 'js', naslov: 'Template literal i typeof',
      kod: `const ime = "Emir";
const iznos = 3200;
console.log("Klijent " + ime);
console.log(\`\${ime} duguje \${iznos} KM\`);
console.log(\`Sa PDV-om: \${iznos * 1.17} KM\`);
console.log(typeof iznos, typeof ime, typeof true);`,
      obj: {
        3: 'Spajanje teksta sa <code>+</code>, kao u Pythonu. Pazi na razmak na kraju <code>"Klijent "</code>.',
        4: 'Template literal: sve u <code>\${…}</code> zamijeni se vrijednošću. Radi i sa brojevima.',
        5: 'U <code>\${…}</code> može stajati i račun: 3200 × 1.17 = 3744.',
        6: '<code>typeof</code> kaže tip vrijednosti (Pythonov <code>type</code>): number, string, boolean.',
      } },
    { tip: 'tekst', naslov: 'Najveća zamka: + i tekst', html: `
      <p>U Pythonu <code>"5" + 3</code> daje grešku. JavaScript <b>ne javlja grešku</b>, nego pokuša „pogoditi“ šta želiš: čim je jedna strana znaka <code>+</code> tekst, i druga se pretvori u tekst i <b>spoje</b> se. <code>"5" + 3</code> je <code>"53"</code>.</p>
      <p>Ostale računske operacije (<code>-</code>, <code>*</code>, <code>/</code>) tekst pretvaraju u broj: <code>"5" * 3</code> je <code>15</code>. Nedosljedno — i zato opasno.</p>
      <p>Ovo je važno jer je sve što korisnik upiše u polje forme <b>tekst</b>, pa i „12“. Prije računanja tekst pretvori u broj sa <code>Number("12")</code>. Ako tekst nije broj, dobiješ <code>NaN</code> („Not a Number“ — nije broj).</p>
      <div class="note warn">Python bi pao sa jasnom greškom; JavaScript nastavi sa pogrešnim rezultatom. Zato u JavaScriptu tipove provjeravaš sam.</div>` },
    { tip: 'predvidi', jezik: 'js', kod: `const kolicina = "3";   // stiglo iz polja forme
console.log(kolicina + 2);
console.log(Number(kolicina) + 2);
console.log(kolicina * 2);`,
      opcije: ['5 · 5 · 6', '32 · 5 · 6', '32 · 5 · 32', 'Grešku'], t: 1,
      obj: '<code>"3" + 2</code> spaja tekst → 32. <code>Number("3") + 2</code> sabira brojeve → 5. Množenje tekst pretvara u broj → 6.' },
    { tip: 'popuni', jezik: 'js', pitanje: 'Selma naručuje 12 m² po 250 KM i dobija 100 KM popusta. Ime se ne mijenja, a ukupan iznos se mijenja.',
      kod: `___ ime = "Selma";
let ukupno = 12 * 250;
ukupno = ukupno ___ 100;
console.log(\`\${ime}: \${___} KM\`);`,
      odg: [['const'], ['-'], ['ukupno']],
      obj: 'Ime se ne mijenja → <code>const</code>. Popust se oduzima → <code>-</code>. U <code>\${…}</code> ide varijabla sa rezultatom.' },
    { tip: 'zadatak', jezik: 'js', naslov: 'Kalkulacija cijene u JavaScriptu',
      opis: `<p>Isti račun kao u Python lekciji 2: napravi konstante <code>materijal</code> (2300) i <code>rad</code> (1500), pa konstantu <code>cijena</code> = zbir materijala i rada <b>plus 20% marže</b> na taj zbir. Ispiši tačno <code>Cijena: 4560 KM</code>, template literalom.</p>`,
      pocetak: `const materijal = 2300;
const rad = 1500;
// izračunaj cijenu sa 20% marže i ispiši je
`,
      testovi: [
        { opis: 'Postoji cijena i iznosi 4560', kod: "ocekuj(cijena, 4560, 'cijena')" },
        { opis: 'Ispis je: Cijena: 4560 KM', kod: "ocekuj(IZLAZ.trim(), 'Cijena: 4560 KM', 'ispis')" },
        { opis: 'Ispis je napravljen template literalom (`)', kod: "ocekuj(KOD.includes('`'), true, 'u kodu nema znaka ` (backtick)')" },
      ],
      nagovjestaji: ['Zbir: <code>const osnova = materijal + rad;</code>', '20% od osnove je <code>osnova * 20 / 100</code>; cijena je osnova plus to.', 'Ispis: <code>console.log(`Cijena: ${cijena} KM`);</code>'],
      rjesenje: `const materijal = 2300;
const rad = 1500;
const osnova = materijal + rad;
const cijena = osnova + osnova * 20 / 100;
console.log(\`Cijena: \${cijena} KM\`);`,
      objRj: 'U Pythonu je ispis bio <code>4560.0</code>, jer dijeljenje daje float. JavaScript ima samo jednu vrstu broja, pa ispiše <code>4560</code>.' },
    { tip: 'kviz', p: 'Šta ispiše console.log("5" + 3)?', o: ['8', '53', 'Grešku', '"5" + 3'], t: 1, e: 'Čim je jedna strana znaka + tekst, JavaScript spaja tekst. U Pythonu bi to bila greška.' },
    { tip: 'kviz', p: 'Kada koristiš const, a kada let?', o: ['const za tekst, let za brojeve', 'const kad se vrijednost više neće dodjeljivati, let kad hoće', 'Svejedno je', 'Uvijek let, jer je fleksibilniji'], t: 1, e: 'Počni sa const; let samo kad zaista mijenjaš vrijednost. Tako se iz koda odmah vidi šta se mijenja.' },
  ],
});

LEKCIJE_JS.push({
  id: 'js2', naslov: 'Odluke i poređenja', cilj: 'if/else u JavaScript zapisu, strogo poređenje ===, istinite i lažne vrijednosti i kratki zapisi ? :, || i ??.',
  koraci: [
    { tip: 'tekst', naslov: 'Ista logika, drugi zapis', html: `
      <p>Logika je ista kao u Python lekciji 3, zapis je drugačiji:</p>
      <ul><li>uslov ide u <b>obične zagrade</b>: <code>if (dug &gt; 0)</code></li><li>blok ide u <b>vitičaste zagrade</b> <code>{ … }</code> umjesto dvotačke i uvlačenja. Uvlačimo i dalje (2 razmaka), ali samo radi čitljivosti — JavaScript gleda zagrade.</li><li><code>elif</code> se piše <code>else if</code></li><li><code>and</code>, <code>or</code> i <code>not</code> se pišu <code>&amp;&amp;</code>, <code>||</code> i <code>!</code></li></ul>
      <p>Jednakost se provjerava sa <b>tri</b> znaka: <code>===</code> (jednako) i <code>!==</code> (različito). Postoji i <code>==</code> sa dva znaka, ali on prije poređenja „pretvara“ tipove, pa je <code>"5" == 5</code> tačno. Koristi uvijek <code>===</code>.</p>` },
    { tip: 'primjer', jezik: 'js', naslov: 'Dug klijenta',
      kod: `const iznos = 1200;
const placeno = 800;

const dug = iznos - placeno;
if (dug > 0) {
  console.log(\`Klijent duguje \${dug} KM\`);
  console.log("Pošalji podsjetnik");
} else {
  console.log("Sve je plaćeno");
}
console.log("Provjera završena");`,
      obj: {
        5: 'Uslov u zagradama, pa <code>{</code> otvara blok. Dvotačke nema.',
        6: 'Linije između <code>{</code> i <code>}</code> pripadaju if-u.',
        8: '<code>}</code> zatvara if-blok, a <code>else {</code> otvara blok „inače“ — obično u istom redu.',
        10: 'Zatvara else-blok.',
        11: 'Van svih vitičastih zagrada: izvrši se uvijek.',
      },
      poslije: 'Promijeni <code>placeno</code> u 1200 i pokreni ponovo.' },
    { tip: 'predvidi', jezik: 'js', kod: `const kolicina = "5";
console.log(kolicina == 5);
console.log(kolicina === 5);
console.log(kolicina === "5");`,
      opcije: ['true · true · true', 'true · false · true', 'false · false · true', 'true · false · false'], t: 1,
      obj: '<code>==</code> prvo pretvori tekst "5" u broj 5, pa kaže true. <code>===</code> poredi i tip: tekst nije broj → false. Tekst "5" i tekst "5" su isti → true.' },
    { tip: 'primjer', jezik: 'js', naslov: 'Više mogućnosti: else if',
      kod: `const danaKasni = 20;
if (danaKasni === 0) {
  console.log("Na vrijeme");
} else if (danaKasni <= 15) {
  console.log("Blago kašnjenje");
} else if (danaKasni <= 30) {
  console.log("Pošalji opomenu");
} else {
  console.log("Pozovi klijenta");
}`,
      obj: {
        2: '20 === 0? Ne (false). Idemo dalje.',
        4: '<code>else if</code> je Pythonov <code>elif</code>. 20 &lt;= 15? Ne.',
        6: '20 &lt;= 30? Da — izvrši se linija 7, a ostatak se preskače.',
        8: '<code>else</code> hvata sve ostalo (više od 30 dana).',
      } },
    { tip: 'greska', jezik: 'js', kod: `const cijena = 1500;
if cijena > 1000 {
  console.log("Velika narudžba");
}`,
      linija: 2, obj: 'U JavaScriptu uslov mora biti u zagradama: <code>if (cijena &gt; 1000) {</code>. Bez njih jezik ne zna gdje uslov počinje i gdje završava.',
      ispravno: `const cijena = 1500;
if (cijena > 1000) {
  console.log("Velika narudžba");
}` },
    { tip: 'tekst', naslov: 'Istinito, lažno i podrazumijevane vrijednosti', html: `
      <p>U uslovu se <b>svaka</b> vrijednost ponaša kao <code>true</code> ili <code>false</code>. „Lažne“ (<i>falsy</i>) su samo: <code>false</code>, <code>0</code>, <code>""</code> (prazan tekst), <code>null</code>, <code>undefined</code> i <code>NaN</code>. Sve ostalo je „istinito“ — i <code>"0"</code>, i <code>"false"</code>, i prazan niz <code>[]</code> (u Pythonu je prazna lista bila lažna!).</p>
      <p>Zato <code>if (!ime)</code> znači „ako ime nije upisano“ — isto kao <code>if not name:</code> u Flask ruti.</p>
      <p>Dva kratka zapisa za podrazumijevanu vrijednost:</p>
      <ul><li><code>ime || "bez imena"</code> — ako je lijevo bilo šta lažno (i prazan tekst i 0), uzmi desno</li><li><code>popust ?? 0</code> — uzmi desno <b>samo</b> ako je lijevo <code>null</code> ili <code>undefined</code>; nula ostaje nula</li></ul>` },
    { tip: 'predvidi', jezik: 'js', kod: `const ime = "";
const telefon = "061 123 456";
const popust = 0;
console.log(ime || "bez imena");
console.log(telefon || "bez telefona");
console.log(popust || 10, popust ?? 10);`,
      opcije: ['bez imena · 061 123 456 · 10 0', '(prazno) · 061 123 456 · 0 0', 'bez imena · bez telefona · 10 10', 'bez imena · 061 123 456 · 10 10'], t: 0,
      obj: 'Prazan tekst je lažan → uzme se "bez imena". Telefon postoji → ostaje. Nula je lažna za <code>||</code> (pa dobiješ 10), ali <code>??</code> gleda samo null i undefined, pa nula ostaje 0. Za popust od 0% to je velika razlika!' },
    { tip: 'primjer', jezik: 'js', naslov: 'Ternarni operator: kratki if/else',
      kod: `const pro = false;
const admin = true;
const ukupno = 5000;

const pristup = (pro || admin) ? "Vidi analitiku" : "Zaključano";
const popust = ukupno >= 3000 ? 10 : 0;
console.log(pristup, popust);`,
      obj: {
        5: '<b>Ternarni operator</b>: <code>uslov ? akoDa : akoNe</code> — if/else koji <b>vraća vrijednost</b>. pro ili admin je true, pa je rezultat "Vidi analitiku". Liči na Lite/Pro provjeru u inhome.',
        6: 'Isto kao if/else koji popust postavi na 10 ili 0 — ali u jednoj liniji i sa const.',
      },
      poslije: 'Ternarni operator je zgodan za izbor između dvije vrijednosti. Za više grana piši običan if/else if — čitljivije je.' },
    { tip: 'popuni', jezik: 'js', pitanje: 'Narudžba veća od 3000 KM dobija 10% popusta. Zatim ternarnim operatorom napravi opis.',
      kod: `const ukupno = 5000;
let popust = 0;
if (ukupno ___ 3000) {
  popust = 10;
}
const opis = popust > 0 ___ "Sa popustom" : "Bez popusta";
console.log(opis, popust);`,
      odg: [['>', '>='], ['?']],
      obj: '„Veće od“ je <code>&gt;</code>. Ternarni operator: uslov, pa <code>?</code>, vrijednost ako je tačno, <code>:</code>, vrijednost ako nije.' },
    { tip: 'poredaj', jezik: 'js', pitanje: 'Poredaj linije da program ocijeni ponudu po bodovima.',
      linije: ['const bodovi = 85;', 'if (bodovi >= 90) {', '  console.log("Odlično");', '} else if (bodovi >= 70) {', '  console.log("Dobro");', '} else {', '  console.log("Treba popraviti");', '}'],
      obj: 'Varijabla prije upotrebe; svaki blok se otvara sa <code>{</code>, a <code>else if</code> i <code>else</code> stoje odmah iza <code>}</code> prethodnog bloka.' },
    { tip: 'zadatak', jezik: 'js', naslov: 'Status fakture',
      opis: `<p>Imaš <code>iznos</code> fakture i koliko je <code>placeno</code>. Ispiši tačno jednu riječ:</p><ul><li><code>Plaćeno</code> — ako je plaćeno koliko iznosi faktura ili više</li><li><code>Djelimično</code> — ako je nešto plaćeno, ali manje od iznosa</li><li><code>Neplaćeno</code> — ako nije plaćeno ništa</li></ul><p class="small muted">Testovi će tvoj kod pokrenuti i sa drugim vrijednostima, zato prve dvije linije ostavi kako jesu.</p>`,
      pocetak: `const iznos = 1000;
const placeno = 400;

// napiši if / else if / else ispod
`,
      testovi: [
        { opis: 'iznos 1000, placeno 400 → Djelimično', kod: "ocekuj(IZLAZ.trim(), 'Djelimično')" },
        { opis: 'placeno 1000 → Plaćeno', kod: "ocekuj((await saVrijednostima({ placeno: 1000 })).trim(), 'Plaćeno', 'kad je plaćeno koliko iznosi faktura')" },
        { opis: 'placeno 1200 → Plaćeno', kod: "ocekuj((await saVrijednostima({ placeno: 1200 })).trim(), 'Plaćeno', 'preplata je i dalje Plaćeno')" },
        { opis: 'placeno 0 → Neplaćeno', kod: "ocekuj((await saVrijednostima({ placeno: 0 })).trim(), 'Neplaćeno', 'kad nije plaćeno ništa')" },
      ],
      nagovjestaji: ['Prvi uslov: <code>if (placeno &gt;= iznos) {</code>', 'Drugi: <code>} else if (placeno &gt; 0) {</code> — tu stižeš samo ako prvi nije bio tačan.', 'Sve ostalo je <code>} else {</code>. Pazi da svaka <code>{</code> ima svoju <code>}</code>.'],
      rjesenje: `const iznos = 1000;
const placeno = 400;

if (placeno >= iznos) {
  console.log("Plaćeno");
} else if (placeno > 0) {
  console.log("Djelimično");
} else {
  console.log("Neplaćeno");
}`,
      objRj: 'Redoslijed uslova je bitan: da je <code>placeno &gt; 0</code> prvi, i puna uplata bi dobila „Djelimično“.' },
    { tip: 'kviz', p: 'Zašto se u JavaScriptu jednakost provjerava sa ===, a ne sa ==?', o: ['=== je brže za kucanje', '== prije poređenja pretvara tipove, pa je "5" == 5 tačno; === poredi i vrijednost i tip', '== ne postoji', 'Nema razlike'], t: 1, e: 'Sa === nema iznenađenja: tekst "5" i broj 5 nisu isto.' },
    { tip: 'kviz', p: 'Koja od ovih vrijednosti je „lažna“ (falsy)?', o: ['"0"', '[]', '0', '"false"'], t: 2, e: 'Samo broj 0. Tekstovi "0" i "false" nisu prazni, pa su istiniti; prazan niz je u JavaScriptu istinit.' },
  ],
});

LEKCIJE_JS.push({
  id: 'js3', naslov: 'Nizovi i petlje', cilj: 'Niz (Pythonova lista), petlje for…of i for sa brojačem, i najčešće metode niza.',
  koraci: [
    { tip: 'tekst', naslov: 'Niz je lista', html: `
      <p><b>Niz</b> (<i>array</i>) je JavaScriptova lista: <code>[1200, 450, 3200]</code>. Indeksi počinju od 0, broj elemenata je <code>niz.length</code> — svojstvo, bez zagrada (u Pythonu <code>len(lista)</code>) — a <code>niz.push(x)</code> dodaje na kraj (Pythonov <code>append</code>).</p>
      <p>Petlja „za svaki element“ piše se <code>for (const iznos of fakture) { … }</code> — isto kao Pythonov <code>for iznos in fakture:</code>. Pazi na riječ: <b>of</b>, ne in.</p>
      <p>Postoji i petlja sa brojačem, česta u starijem kodu: <code>for (let i = 0; i &lt; 3; i++) { … }</code> — „počni od 0, ponavljaj dok je i manje od 3, poslije svakog kruga povećaj i“. <code>i++</code> znači <code>i = i + 1</code>, a <code>x += 5</code> znači <code>x = x + 5</code>.</p>` },
    { tip: 'primjer', jezik: 'js', naslov: 'Rad sa nizom',
      kod: `const iznosi = [1200, 450, 3200];
console.log(iznosi[0]);
console.log(iznosi.length);
iznosi.push(800);
console.log(iznosi);
console.log(iznosi.includes(450), iznosi.indexOf(3200));`,
      obj: {
        1: 'Niz od tri broja. Iako je <code>const</code>, sadržaj niza se smije mijenjati: const samo znači da <code>iznosi</code> uvijek pokazuje na <b>isti</b> niz.',
        2: 'Prvi element, indeks 0.',
        3: '<code>length</code> je svojstvo, piše se bez zagrada.',
        4: '<code>push</code> dodaje na kraj.',
        5: 'Niz se u konzoli ispiše u uglastim zagradama.',
        6: '<code>includes</code> pita „ima li ga?“ (true/false), a <code>indexOf</code> vraća indeks — ili -1 ako ga nema.',
      } },
    { tip: 'predvidi', jezik: 'js', kod: `const klijenti = ["Amra", "Emir", "Selma"];
console.log(klijenti[1]);
console.log(klijenti[3]);`,
      opcije: ['Emir · Selma', 'Emir · undefined', 'Amra · Selma', 'Emir · Grešku'], t: 1,
      obj: 'Indeks 1 je drugi element (Emir). Indeks 3 ne postoji — Python bi javio IndexError, a JavaScript samo vrati <code>undefined</code> i nastavi. Opet: JavaScript ne upozorava, ti provjeravaš.' },
    { tip: 'primjer', jezik: 'js', naslov: 'Petlja for…of',
      kod: `const fakture = [1200, 450, 3200];
let ukupno = 0;
for (const iznos of fakture) {
  console.log(\`Faktura: \${iznos} KM\`);
  ukupno += iznos;
}
console.log(\`Ukupno: \${ukupno} KM\`);`,
      obj: {
        2: '<code>let</code>, jer se ukupno mijenja u petlji.',
        3: 'U svakom krugu <code>iznos</code> je sljedeći element: 1200, 450, 3200. Može biti <code>const</code>, jer svaki krug dobije svoju, novu varijablu.',
        5: 'Akumulator iz Python lekcije 4: <code>ukupno += iznos</code> je kraće od <code>ukupno = ukupno + iznos</code>.',
        7: 'Poslije petlje, jednom.',
      } },
    { tip: 'predvidi', jezik: 'js', kod: `for (let i = 0; i < 3; i++) {
  console.log(i);
}`,
      opcije: ['1 · 2 · 3', '0 · 1 · 2', '0 · 1 · 2 · 3', '3'], t: 1,
      obj: 'Kreće od 0; uslov <code>i &lt; 3</code> prestane važiti kad i postane 3, pa se 3 ne ispiše. Isto kao <code>range(3)</code> u Pythonu.' },
    { tip: 'greska', jezik: 'js', kod: `const faze = ["upit", "ponuda", "izrada"];
for (const faza of faze) {
  console.log(faza.toUpperCase());
}
console.log(faze[3].toUpperCase());`,
      linija: 5, obj: '<code>faze[3]</code> ne postoji, pa je <code>undefined</code> — a undefined nema metodu toUpperCase: <code>TypeError: Cannot read properties of undefined</code>. Ovo je najčešća greška u JavaScriptu. Zadnji element je <code>faze[faze.length - 1]</code>, ili kraće <code>faze.at(-1)</code>.',
      ispravno: `const faze = ["upit", "ponuda", "izrada"];
for (const faza of faze) {
  console.log(faza.toUpperCase());
}
console.log(faze.at(-1).toUpperCase());` },
    { tip: 'popuni', jezik: 'js', pitanje: 'Program treba naći najveću cijenu u nizu.',
      kod: `const cijene = [100, 250, 400, 180];
let najveca = 0;
for (const c ___ cijene) {
  if (c > najveca) {
    najveca = ___;
  }
}
console.log(najveca);`,
      odg: [['of'], ['c']],
      obj: 'for…<b>of</b> daje elemente niza. Kad je trenutna cijena veća od dosadašnje najveće, zapamti je.' },
    { tip: 'primjer', jezik: 'js', naslov: 'Petlja + if: filtriranje',
      kod: `const iznosi = [1200, 450, 3200, 90];
const velike = [];
for (const x of iznosi) {
  if (x >= 1000) {
    velike.push(x);
  }
}
console.log(velike);
console.log(velike.join(" + "));`,
      obj: {
        2: 'Prazan niz u koji skupljamo. <code>const</code> je u redu: mijenjamo sadržaj, niz ostaje isti.',
        4: 'if unutar petlje: dva nivoa vitičastih zagrada.',
        9: '<code>join</code> spoji elemente u jedan tekst, sa datim razdvajačem između.',
      } },
    { tip: 'poredaj', jezik: 'js', pitanje: 'Poredaj program koji broji koliko faktura je još otvoreno.',
      linije: ['const statusi = ["plaćeno", "otvoreno", "otvoreno", "plaćeno"];', 'let otvorenih = 0;', 'for (const s of statusi) {', '  if (s === "otvoreno") {', '    otvorenih++;', '  }', '}', 'console.log(otvorenih);'],
      obj: 'Podaci, pa brojač, pa petlja sa if-om unutra, pa ispis poslije petlje. Unutrašnja <code>}</code> zatvara if, vanjska petlju.' },
    { tip: 'zadatak', jezik: 'js', naslov: 'Pregled faktura',
      opis: `<p>Imaš niz iznosa faktura. Ispiši dvije linije:</p><ol><li><code>Ukupno: X</code> — zbir svih iznosa</li><li><code>Velikih: Y</code> — koliko faktura ima iznos 1000 ili više</li></ol><p>Koristi petlju <code>for…of</code>. Testovi će tvoj kod pokrenuti i sa drugim nizom.</p>`,
      pocetak: `const fakture = [1200, 450, 3200, 380];
let ukupno = 0;
let velikih = 0;
// petlja ovdje
`,
      testovi: [
        { opis: 'ukupno je 5230', kod: "ocekuj(ukupno, 5230, 'ukupno')" },
        { opis: 'velikih je 2', kod: "ocekuj(velikih, 2, 'velikih (1200 i 3200)')" },
        { opis: 'Ispis u dvije linije: Ukupno / Velikih', kod: "ocekuj(IZLAZ.trim().split('\\n'), ['Ukupno: 5230', 'Velikih: 2'], 'ispis')" },
        { opis: 'Radi i za niz [2000, 100]', kod: "ocekuj((await saVrijednostima({ fakture: [2000, 100] })).trim().split('\\n'), ['Ukupno: 2100', 'Velikih: 1'], 'za [2000, 100]')" },
      ],
      nagovjestaji: ['Petlja: <code>for (const iznos of fakture) {</code>', 'U petlji: <code>ukupno += iznos;</code>, pa <code>if (iznos &gt;= 1000) {</code> sa <code>velikih++;</code>', 'Ispisi idu <b>poslije</b> petlje: <code>console.log(`Ukupno: ${ukupno}`);</code>'],
      rjesenje: `const fakture = [1200, 450, 3200, 380];
let ukupno = 0;
let velikih = 0;
for (const iznos of fakture) {
  ukupno += iznos;
  if (iznos >= 1000) {
    velikih++;
  }
}
console.log(\`Ukupno: \${ukupno}\`);
console.log(\`Velikih: \${velikih}\`);` },
    { tip: 'kviz', p: 'Kako se u JavaScriptu dobije broj elemenata niza?', o: ['len(niz)', 'niz.length', 'niz.length()', 'niz.size'], t: 1, e: 'length je svojstvo, bez zagrada.' },
    { tip: 'kviz', p: 'Šta vrati niz[10] ako niz ima 3 elementa?', o: ['Grešku', 'undefined', 'null', 'Zadnji element'], t: 1, e: 'JavaScript ne javlja grešku, nego vrati undefined. Greška dođe tek kad nad tim undefined pokušaš nešto uraditi (npr. .toUpperCase()).' },
  ],
});

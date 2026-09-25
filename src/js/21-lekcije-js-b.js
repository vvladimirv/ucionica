// ============================================================================
// Dio 2 · JavaScript — lekcije 4–5 (objekti i JSON, funkcije).
// U kodu lekcija: ` piši kao \`,   ${ kao \${,   a \ kao \\.
// ============================================================================
LEKCIJE_JS.push({
  id: 'js4', naslov: 'Objekti i JSON', cilj: 'Objekat (Pythonov rječnik), tačka i ?., niz objekata kao tabela i JSON — oblik u kojem podaci putuju između preglednika i servera.',
  koraci: [
    { tip: 'tekst', naslov: 'Objekat je rječnik', html: `
      <p><b>Objekat</b> je JavaScriptov rječnik: parovi <b>ključ: vrijednost</b> u vitičastim zagradama. Ključevi se obično pišu <b>bez navodnika</b>:</p>
      <p><code>const klijent = { name: "Amra", phone: "061 123 456", dug: 400 };</code></p>
      <p>Vrijednost se čita <b>tačkom</b>: <code>klijent.name</code> (u Pythonu <code>klijent["name"]</code>). Uglaste zagrade rade i ovdje — <code>klijent["name"]</code> — i koriste se kad je ime ključa u varijabli: <code>klijent[polje]</code>.</p>
      <p>Ključ koji ne postoji <b>ne javlja grešku</b> (Python bi javio KeyError), nego daje <code>undefined</code>. Zato ne treba <code>.get()</code>: <code>klijent.popust ?? 0</code> radi isto što i <code>klijent.get("popust", 0)</code>.</p>
      <p class="small muted">Imena polja u primjerima (name, phone, city) su ista kao u JSON-u koji šalje inhome API.</p>` },
    { tip: 'primjer', jezik: 'js', naslov: 'Klijent kao objekat',
      kod: `const klijent = {
  name: "Amra",
  phone: "061 123 456",
  dug: 400,
};
console.log(klijent.name);
klijent.dug = 0;
klijent.email = "amra@mail.ba";
console.log(klijent);
console.log(klijent.adresa);
console.log(klijent.adresa?.grad);`,
      obj: {
        1: 'Objekat u više redova, radi čitljivosti. Otvara se sa <code>{</code>.',
        2: 'Ključ bez navodnika, dvotačka, vrijednost, zarez.',
        4: 'Zarez i poslije zadnjeg para je dozvoljen (i uobičajen u inhome kodu).',
        6: 'Čitanje tačkom.',
        7: 'Postojeći ključ → nova vrijednost. Objekat je <code>const</code>, ali mu se sadržaj smije mijenjati.',
        8: 'Novi ključ → novo polje.',
        10: 'Nepostojeći ključ → <code>undefined</code>, bez greške.',
        11: '<code>?.</code> (<i>optional chaining</i>): „ako lijevo postoji, idi dalje; ako ne, vrati undefined“. Bez <code>?</code> bi bilo <code>TypeError</code>, jer undefined nema polje grad.',
      } },
    { tip: 'predvidi', jezik: 'js', kod: `const posao = { naziv: "Kuhinja", faza: "izrada" };
posao.faza = "montaža";
console.log(posao.faza, posao.rok);`,
      opcije: ['izrada undefined', 'montaža undefined', 'montaža', 'Grešku'], t: 1,
      obj: 'Isti ključ ima samo jednu vrijednost; nova zamijeni staru. Ključ <code>rok</code> ne postoji, pa je undefined — bez greške.' },
    { tip: 'greska', jezik: 'js', kod: `const ponuda = { iznos: 3200, klijent: null };
console.log(ponuda.iznos);
console.log(ponuda.klijent.name);`,
      linija: 3, obj: '<code>ponuda.klijent</code> je <code>null</code>, a null nema polja: <code>TypeError: Cannot read properties of null</code>. Zaštita: <code>ponuda.klijent?.name</code> (daje undefined), ili provjera <code>if (ponuda.klijent)</code> prije čitanja.',
      ispravno: `const ponuda = { iznos: 3200, klijent: null };
console.log(ponuda.iznos);
console.log(ponuda.klijent?.name ?? "bez klijenta");` },
    { tip: 'primjer', jezik: 'js', naslov: 'Niz objekata = tabela',
      uvod: 'Niz objekata izgleda kao tabela: svaki objekat je red, svaki ključ kolona. Upravo ovako izgleda odgovor API-ja sa listom faktura.',
      kod: `const fakture = [
  { broj: "FAK-1", iznos: 1200, placeno: true },
  { broj: "FAK-2", iznos: 450, placeno: false },
  { broj: "FAK-3", iznos: 3200, placeno: false },
];
for (const f of fakture) {
  if (!f.placeno) {
    console.log(\`\${f.broj}: \${f.iznos} KM\`);
  }
}
console.log(fakture.length, fakture[2].broj);`,
      obj: {
        2: 'Jedan „red“: objekat sa tri polja.',
        6: '<code>f</code> je u svakom krugu jedan objekat.',
        7: '<code>!</code> je not: „ako NIJE plaćeno“.',
        8: 'U template literalu polja se čitaju tačkom — nema muke sa navodnicima kao u Python f-stringu.',
        11: 'Prvo indeks u nizu (treći red), pa polje u objektu.',
      } },
    { tip: 'tekst', naslov: 'JSON: podaci kao tekst', html: `
      <p>Kad preglednik i server razmjenjuju podatke, šalju <b>tekst</b> u formatu <b>JSON</b> (JavaScript Object Notation). Izgleda skoro kao objekat, ali su ključevi <b>uvijek</b> u dvostrukim navodnicima: <code>{"name":"Amra","dug":400}</code>.</p>
      <ul><li><code>JSON.stringify(objekat)</code> — objekat → JSON tekst, za slanje serveru. U Pythonu <code>json.dumps</code>.</li><li><code>JSON.parse(tekst)</code> — JSON tekst → objekat, kad stigne odgovor. U Pythonu <code>json.loads</code>.</li></ul>
      <p>Flaskov <code>jsonify(klijent)</code> na serveru pravi upravo takav tekst, a frontend ga vrati u objekat — ručno sa <code>JSON.parse</code>, ili sa <code>odgovor.json()</code> (lekcija 8).</p>` },
    { tip: 'predvidi', jezik: 'js', kod: `const k = { name: "Emir", dug: 0 };
const tekst = JSON.stringify(k);
console.log(tekst);
console.log(typeof tekst, typeof JSON.parse(tekst));`,
      opcije: ['{"name":"Emir","dug":0} · string object', "{name: 'Emir', dug: 0} · object object", '{"name":"Emir","dug":0} · object string', 'Emir 0 · string object'], t: 0,
      obj: 'stringify daje <b>tekst</b>: ključevi u dvostrukim navodnicima, bez razmaka. parse iz teksta napravi objekat. Tekst se u konzoli ispiše bez vanjskih navodnika, a objekat bi se ispisao kao <code>{name: \'Emir\', dug: 0}</code>.' },
    { tip: 'popuni', jezik: 'js', pitanje: 'Ispiši ime, promijeni grad u Mostar i sigurno pročitaj telefon (kojeg nema), sa zamjenom "nepoznat".',
      kod: `const klijent = { name: "Emir", city: "Sarajevo" };
console.log(klijent.___);
klijent.___ = "Mostar";
console.log(klijent.phone ___ "nepoznat");`,
      odg: [['name'], ['city'], ['??', '||']],
      obj: 'Polja se čitaju i mijenjaju tačkom. Za polje koje možda ne postoji: <code>??</code> (ili <code>||</code>) daje zamjensku vrijednost.' },
    { tip: 'primjer', jezik: 'js', naslov: 'Veza sa tvojim kodom: state', bezPokretanja: true,
      uvod: 'Ovo je <code>static/js/app-next-shared.js</code> iz inhome (skraćeno). Cijeli ekran aplikacije crta se iz ovog jednog objekta — o tome u lekciji 6.',
      kod: `// Centralni mutabilni state app-next UI-ja. Moduli ga mutiraju direktno,
// app-next.js orkestrira render preko \`renderShell\`.
export const state = { view: 'danas', workflow: null, projects: [], ... };`,
      obj: {
        1: 'Komentar: „centralno promjenljivo stanje korisničkog interfejsa“ — jedan objekat sa svim podacima ekrana, koji drugi moduli mijenjaju.',
        2: 'Crtanje ekrana iz tog stanja radi funkcija <code>renderShell</code>.',
        3: '<code>export</code> znači da ga i drugi fajlovi mogu uvesti. <code>view</code> je tekst (koji ekran je otvoren), <code>workflow: null</code> — podataka još nema, <code>projects: []</code> — prazan niz dok projekti ne stignu sa servera. Tri tačke ovdje samo znače „skraćeno“: pravi objekat ima stotinjak polja.',
      } },
    { tip: 'zadatak', jezik: 'js', naslov: 'Ukupan dug',
      opis: `<p>Niz <code>fakture</code> ima objekte sa poljima <code>iznos</code> i <code>placeno</code> (koliko je plaćeno). Izračunaj ukupan dug — zbir <code>iznos - placeno</code> za sve fakture — u varijablu <code>dug</code> i ispiši <code>Dug: X KM</code>.</p><p class="small muted">Testovi će tvoj kod pokrenuti i sa drugim fakturama, zato prvu liniju ostavi u jednom redu.</p>`,
      pocetak: `const fakture = [{ iznos: 1200, placeno: 1200 }, { iznos: 450, placeno: 0 }, { iznos: 3200, placeno: 1000 }];
let dug = 0;
// petlja ovdje
`,
      testovi: [
        { opis: 'dug je 2650', kod: "ocekuj(dug, 2650, 'dug (0 + 450 + 2200)')" },
        { opis: 'Ispis: Dug: 2650 KM', kod: "ocekuj(IZLAZ.trim(), 'Dug: 2650 KM', 'ispis')" },
        { opis: 'Radi i za druge fakture', kod: "ocekuj((await saVrijednostima({ fakture: [{ iznos: 100, placeno: 40 }] })).trim(), 'Dug: 60 KM', 'za jednu fakturu 100/40')" },
      ],
      nagovjestaji: ['<code>for (const f of fakture) {</code> — <code>f</code> je jedan objekat.', 'Dug jedne fakture: <code>f.iznos - f.placeno</code>. Dodaj ga u dug: <code>dug += …</code>', 'Ispis poslije petlje: <code>console.log(`Dug: ${dug} KM`);</code>'],
      rjesenje: `const fakture = [{ iznos: 1200, placeno: 1200 }, { iznos: 450, placeno: 0 }, { iznos: 3200, placeno: 1000 }];
let dug = 0;
for (const f of fakture) {
  dug += f.iznos - f.placeno;
}
console.log(\`Dug: \${dug} KM\`);` },
    { tip: 'kviz', p: 'Kako sigurno pročitati grad iz klijent.adresa, ako adrese možda nema?', o: ['klijent.adresa.grad', 'klijent.adresa?.grad', 'klijent.get("adresa")', 'klijent[adresa][grad]'], t: 1, e: '?. daje undefined umjesto greške kad adrese nema.' },
    { tip: 'kviz', p: 'Šta je JSON?', o: ['JavaScript biblioteka', 'Tekstualni format za podatke; objekat postaje JSON sa JSON.stringify, a nazad sa JSON.parse', 'Vrsta baze podataka', 'Drugo ime za objekat'], t: 1, e: 'Između preglednika i servera putuje tekst; JSON je dogovor kako taj tekst izgleda.' },
  ],
});

LEKCIJE_JS.push({
  id: 'js5', naslov: 'Funkcije', cilj: 'Funkcije u dva zapisa (function i strelica =>), return, funkcija kao vrijednost i metode niza map, filter, find i reduce.',
  koraci: [
    { tip: 'tekst', naslov: 'Dva zapisa iste ideje', html: `
      <p>Funkcija je ista ideja kao Pythonov <code>def</code>: imenovan recept sa parametrima, koji rezultat vraća sa <code>return</code>. JavaScript ima dva zapisa:</p>
      <ul><li><code>function saPdv(iznos) { return iznos * 1.17; }</code> — klasičan zapis</li><li><code>const saPdv = (iznos) =&gt; iznos * 1.17;</code> — <b>streličasta funkcija</b> (<i>arrow function</i>). Kad je tijelo jedan izraz, piše se bez vitičastih zagrada i bez <code>return</code>: vrijednost se vrati sama. Sa jednim parametrom otpadnu i zagrade: <code>iznos =&gt; iznos * 1.17</code>.</li></ul>
      <p>U inhome kodu ima oba: <code>export function esc(value) { … }</code> je klasična funkcija, a <code>const doFetch = async headers =&gt; { … }</code> u <code>app-next-api.js</code> je strelica.</p>
      <p>Funkcija bez <code>return</code> vraća <code>undefined</code> (Pythonov <code>None</code>).</p>` },
    { tip: 'primjer', jezik: 'js', naslov: 'Obje vrste funkcija',
      kod: `function saPdv(iznos) {
  return iznos * 1.17;
}

const cijenaPosla = (materijal, rad, marza = 20) => {
  const osnova = materijal + rad;
  return osnova + osnova * marza / 100;
};

console.log(saPdv(1000));
console.log(cijenaPosla(2300, 1500));
console.log(cijenaPosla(2300, 1500, 30));`,
      obj: {
        1: 'Klasična funkcija: riječ <code>function</code>, ime, parametri u zagradama, tijelo u <code>{ }</code>.',
        2: '<code>return</code> vraća rezultat pozivaocu.',
        5: 'Strelica spremljena u konstantu. <code>marza = 20</code> je podrazumijevana vrijednost, kao u Pythonu.',
        6: '<code>osnova</code> postoji samo unutar funkcije.',
        7: 'Strelica sa tijelom u <code>{ }</code>: tada <code>return</code> mora biti napisan.',
        10: 'Poziv: 1000 × 1.17 = 1170.',
        12: 'Treći argument zamijeni podrazumijevanu maržu.',
      } },
    { tip: 'predvidi', jezik: 'js', kod: `function udvostruci(x) {
  console.log(x * 2);
}
const rezultat = udvostruci(5);
console.log(rezultat);`,
      opcije: ['10 · 10', '10 · undefined', 'undefined · 10', '10 · None'], t: 1,
      obj: 'Funkcija <b>ispiše</b> 10, ali ne vrati ništa, pa je <code>rezultat</code> undefined. Ista stvar kao print i return u Python lekciji 6.' },
    { tip: 'greska', jezik: 'js', pitanje: 'Program pada na liniji 5, ali uzrok je ranije. Klikni liniju sa stvarnim uzrokom.',
      kod: `const saPopustom = (iznos) => {
  iznos * 0.9;
};
const cijena = saPopustom(1000);
console.log(cijena.toFixed(2));`,
      linija: 2, obj: 'Strelica sa vitičastim zagradama ne vraća ništa sama — treba <code>return iznos * 0.9;</code>. Bez return funkcija vrati undefined, a greška se pojavi tek u liniji 5, kad undefined zatražiš <code>toFixed</code>. Druga popravka: bez vitičastih zagrada, <code>(iznos) =&gt; iznos * 0.9</code> vraća automatski.',
      ispravno: `const saPopustom = (iznos) => {
  return iznos * 0.9;
};
const cijena = saPopustom(1000);
console.log(cijena.toFixed(2));` },
    { tip: 'tekst', naslov: 'Funkcija kao vrijednost', html: `
      <p>U JavaScriptu je funkcija <b>vrijednost</b>, kao broj ili tekst: možeš je spremiti u varijablu i <b>predati drugoj funkciji</b>. Funkcija predata na taj način zove se <b>callback</b> („pozovi nazad“): „evo ti ova funkcija, pozovi je kad bude trebalo“.</p>
      <p>Na tome počiva cijeli frontend: <code>dugme.addEventListener("click", funkcija)</code> kaže „kad neko klikne, pozovi ovu funkciju“ (lekcija 7), a <code>setTimeout(funkcija, 1000)</code> „pozovi je za sekundu“.</p>
      <p>Nizovi imaju metode koje primaju callback i zamjenjuju većinu petlji:</p>
      <ul><li><code>niz.map(f)</code> — novi niz: <b>svaki</b> element pretvoren funkcijom f</li><li><code>niz.filter(f)</code> — novi niz: samo elementi za koje f vrati true</li><li><code>niz.find(f)</code> — <b>prvi</b> element za koji f vrati true (ili undefined)</li><li><code>niz.reduce((zbir, x) =&gt; zbir + x, 0)</code> — svi elementi svedeni na jednu vrijednost, npr. zbir</li></ul>` },
    { tip: 'primjer', jezik: 'js', naslov: 'map, filter, find, reduce',
      kod: `const fakture = [
  { broj: "FAK-1", iznos: 1200, placeno: 1200 },
  { broj: "FAK-2", iznos: 450, placeno: 0 },
  { broj: "FAK-3", iznos: 3200, placeno: 1000 },
];
const brojevi = fakture.map(f => f.broj);
const otvorene = fakture.filter(f => f.placeno < f.iznos);
const treca = fakture.find(f => f.broj === "FAK-3");
const ukupno = fakture.reduce((zbir, f) => zbir + f.iznos, 0);

console.log(brojevi);
console.log(otvorene.length, treca.iznos, ukupno);`,
      obj: {
        6: 'map: od svake fakture uzmi broj → novi niz tekstova. Original ostaje isti.',
        7: 'filter: zadrži samo one gdje je plaćeno manje od iznosa (dvije).',
        8: 'find: <b>prva</b> faktura koja zadovoljava uslov — jedan objekat, ne niz.',
        9: 'reduce: kreni od 0 i za svaku fakturu dodaj njen iznos. Zamjena za akumulator iz lekcije 3.',
      } },
    { tip: 'predvidi', jezik: 'js', kod: `const cijene = [100, 250, 400];
const duplo = cijene.map(c => c * 2);
const skupe = cijene.filter(c => c > 200);
console.log(duplo, skupe, cijene);`,
      opcije: ['[200, 500, 800] [250, 400] [100, 250, 400]', '[200, 500, 800] [250, 400] [200, 500, 800]', '[200, 500, 800] [true, true] [100, 250, 400]', '[100, 250, 400] [250, 400] [100, 250, 400]'], t: 0,
      obj: 'map i filter prave <b>nove</b> nizove; originalni niz <code>cijene</code> se ne mijenja. filter vraća same elemente, a ne true/false.' },
    { tip: 'popuni', jezik: 'js', pitanje: 'Izdvoji klijente koji duguju, pa od njih napravi niz imena.',
      kod: `const klijenti = [
  { name: "Amra", dug: 400 },
  { name: "Emir", dug: 0 },
  { name: "Selma", dug: 1250 },
];
const duznici = klijenti.___(k => k.dug > 0);
const imena = duznici.___(k => k.name);
console.log(imena.join(", "));`,
      odg: [['filter'], ['map']],
      obj: 'filter zadrži objekte koji zadovoljavaju uslov; map svaki objekat pretvori u nešto drugo — ovdje u ime.' },
    { tip: 'poredaj', jezik: 'js', pitanje: 'Poredaj funkciju koja sabira stavke ponude, i njen poziv.',
      linije: ['function ukupno(stavke) {', '  let suma = 0;', '  for (const s of stavke) {', '    suma += s.cijena * s.kolicina;', '  }', '  return suma;', '}', 'console.log(ukupno([{ cijena: 120, kolicina: 3 }, { cijena: 200, kolicina: 1 }]));'],
      obj: 'Tijelo funkcije je između <code>{</code> i <code>}</code>; <code>return</code> ide poslije petlje (unutar petlje bi se vratila već prva stavka), a poziv na kraju.' },
    { tip: 'zadatak', jezik: 'js', naslov: 'Funkcija statusFakture',
      opis: `<p>Napiši funkciju <code>statusFakture(iznos, placeno)</code> koja <b>vraća</b> (return, ne console.log) tekst <code>"Plaćeno"</code>, <code>"Djelimično"</code> ili <code>"Neplaćeno"</code> — ista pravila kao u lekciji 2. Sada je logika upakovana u funkciju, pa je testovi mogu direktno pozvati.</p>`,
      pocetak: `function statusFakture(iznos, placeno) {
  // tvoj kod
}
`,
      testovi: [
        { opis: 'statusFakture(1000, 1000) je "Plaćeno"', kod: "ocekuj(statusFakture(1000, 1000), 'Plaćeno')" },
        { opis: 'statusFakture(1000, 1500) je "Plaćeno"', kod: "ocekuj(statusFakture(1000, 1500), 'Plaćeno')" },
        { opis: 'statusFakture(1000, 300) je "Djelimično"', kod: "ocekuj(statusFakture(1000, 300), 'Djelimično')" },
        { opis: 'statusFakture(1000, 0) je "Neplaćeno"', kod: "ocekuj(statusFakture(1000, 0), 'Neplaćeno')" },
        { opis: 'Funkcija vraća, a ne ispisuje', kod: "ocekuj(IZLAZ, '', 'funkcija ne treba ništa ispisivati — koristi return')" },
      ],
      nagovjestaji: ['Unutar funkcije napiši if / else if / else iz lekcije 2.', 'Umjesto <code>console.log("Plaćeno")</code> piši <code>return "Plaćeno";</code>'],
      rjesenje: `function statusFakture(iznos, placeno) {
  if (placeno >= iznos) {
    return "Plaćeno";
  } else if (placeno > 0) {
    return "Djelimično";
  }
  return "Neplaćeno";
}`,
      objRj: 'Poslije <code>return</code> funkcija odmah završava, pa zadnji <code>return</code> radi kao „inače“. Ovakva funkcija je <b>čista</b>: isti ulaz uvijek daje isti izlaz — najlakša za testiranje (Tema 7).' },
    { tip: 'zadatak', jezik: 'js', naslov: 'Dužnici bez petlje',
      opis: `<p>Iz niza <code>klijenti</code> napravi, <b>bez for petlje</b>:</p><ul><li><code>duznici</code> — niz <b>imena</b> klijenata koji duguju (dug veći od 0)</li><li><code>ukupanDug</code> — zbir svih dugova</li></ul><p>Koristi <code>filter</code>, <code>map</code> i <code>reduce</code>.</p>`,
      pocetak: `const klijenti = [
  { name: "Amra", dug: 400 },
  { name: "Emir", dug: 0 },
  { name: "Selma", dug: 1250 },
];
const duznici = [];
const ukupanDug = 0;
`,
      testovi: [
        { opis: 'duznici su ["Amra", "Selma"]', kod: "ocekuj(duznici, ['Amra', 'Selma'], 'duznici')" },
        { opis: 'ukupanDug je 1650', kod: "ocekuj(ukupanDug, 1650, 'ukupanDug')" },
        { opis: 'Bez for petlje', kod: "ocekuj(/for *[(]/.test(KOD), false, 'zadatak traži rješenje bez for petlje')" },
      ],
      nagovjestaji: ['Metode se mogu nizati: <code>klijenti.filter(…).map(…)</code> — map radi nad rezultatom filtera.', 'Zbir: <code>klijenti.reduce((zbir, k) =&gt; zbir + k.dug, 0)</code>'],
      rjesenje: `const klijenti = [
  { name: "Amra", dug: 400 },
  { name: "Emir", dug: 0 },
  { name: "Selma", dug: 1250 },
];
const duznici = klijenti.filter(k => k.dug > 0).map(k => k.name);
const ukupanDug = klijenti.reduce((zbir, k) => zbir + k.dug, 0);`,
      objRj: 'Nizanje metoda (filter pa map) je čest obrazac u inhome kodu: svaki korak radi jednu stvar i vraća novi niz za sljedeći.' },
    { tip: 'kviz', p: 'Šta vraća funkcija (x) => { x * 2 }?', o: ['x * 2', 'undefined — sa vitičastim zagradama treba return', 'Grešku', 'null'], t: 1, e: 'Bez vitičastih zagrada, x => x * 2 vraća automatski. Sa njima return mora biti napisan.' },
    { tip: 'kviz', p: 'Koja metoda vraća PRVI element niza koji zadovoljava uslov?', o: ['filter', 'map', 'find', 'reduce'], t: 2, e: 'find vraća jedan element (ili undefined); filter vraća niz svih koji odgovaraju.' },
  ],
});

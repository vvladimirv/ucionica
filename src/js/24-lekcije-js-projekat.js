// ============================================================================
// Dio 2 · JavaScript — projekat (poslije lekcija 1–8): forma za upit klijenta.
// Provjera podataka (čista funkcija) → događaj forme → cijela forma sa stanjem i iscrtavanjem.
// ============================================================================
LEKCIJE_JS.push({
  id: 'js9', projekat: true, naslov: 'Projekat: forma za upit klijenta', cilj: 'Sve iz Dijela 2 u jednoj formi: provjera unosa, događaj slanja, stanje i iscrtavanje, i sigurno prikazivanje teksta.',
  koraci: [
    { tip: 'tekst', naslov: 'Šta pravimo', html: `
      <p>Na sajtu firme je forma „Pošalji upit“: ime, telefon i opis (npr. „plakar u hodniku, 220 cm“). Kad klijent pošalje formu:</p>
      <ol><li>provjerimo podatke i pokažemo greške,</li><li>ako je sve u redu, upit dodamo u stanje i pokažemo potvrdu,</li><li>formu ispraznimo za sljedeći upit.</li></ol>
      <p>Provjeru pišemo kao <b>čistu funkciju</b>: prima podatke, vraća listu grešaka i ne dira stranicu. Takvu funkciju je najlakše testirati, a ista provjera mora postojati i na serveru.</p>` },
    { tip: 'zadatak', jezik: 'js', naslov: '1. Provjera podataka',
      opis: `<p>Napiši funkciju <code>provjeri(podaci)</code>. <code>podaci</code> je objekat <code>{ ime, telefon, opis }</code>. Funkcija vraća <b>niz poruka</b> (prazan niz ako je sve u redu):</p><ul><li>ime prazno ili samo razmaci → <code>"Upiši ime"</code></li><li>telefon bez razmaka kraći od 6 znakova → <code>"Telefon nije ispravan"</code></li><li>opis kraći od 10 znakova (bez razmaka na krajevima) → <code>"Opiši šta ti treba"</code></li></ul><p>Poruke idu tim redom.</p>`,
      pocetak: `function provjeri(podaci) {
  const greske = [];
  // tvoj kod
  return greske;
}

console.log(provjeri({ ime: "Amra", telefon: "061 123 456", opis: "Plakar u hodniku, 220 cm" }));
console.log(provjeri({ ime: " ", telefon: "061", opis: "" }));
`,
      testovi: [
        { opis: 'Ispravni podaci → prazan niz', kod: "ocekuj(provjeri({ ime: 'Amra', telefon: '061 123 456', opis: 'Plakar u hodniku, 220 cm' }), [], 'provjeri(ispravni podaci)')" },
        { opis: 'Sve pogrešno → tri poruke, tim redom', kod: "ocekuj(provjeri({ ime: ' ', telefon: '061', opis: '' }), ['Upiši ime', 'Telefon nije ispravan', 'Opiši šta ti treba'], 'provjeri(sve pogrešno)')" },
        { opis: 'Razmaci u telefonu se ne broje', kod: "ocekuj(provjeri({ ime: 'Emir', telefon: '06 1 2 3', opis: 'Radni sto po mjeri' }), ['Telefon nije ispravan'], 'telefon \"06 1 2 3\" ima samo 5 znakova bez razmaka')" },
        { opis: 'Opis od 10 znakova je dovoljan', kod: "ocekuj(provjeri({ ime: 'Emir', telefon: '062555111', opis: '  Kuhinja 3m  ' }), [], 'opis \"Kuhinja 3m\" ima 10 znakova')" },
      ],
      nagovjestaji: ['Ime: <code>if (!podaci.ime.trim()) greske.push("Upiši ime");</code>', 'Telefon bez razmaka: <code>podaci.telefon.replaceAll(" ", "").length &lt; 6</code>', 'Opis: <code>podaci.opis.trim().length &lt; 10</code>'],
      rjesenje: `function provjeri(podaci) {
  const greske = [];
  if (!podaci.ime.trim()) greske.push("Upiši ime");
  if (podaci.telefon.replaceAll(" ", "").length < 6) greske.push("Telefon nije ispravan");
  if (podaci.opis.trim().length < 10) greske.push("Opiši šta ti treba");
  return greske;
}

console.log(provjeri({ ime: "Amra", telefon: "061 123 456", opis: "Plakar u hodniku, 220 cm" }));
console.log(provjeri({ ime: " ", telefon: "061", opis: "" }));`,
      objRj: 'Funkcija ne zna ništa o stranici: prima objekat, vraća niz. Zato su testovi jednostavni, a istu logiku agent može prenijeti i na server (Flask ruta mora provjeriti isto, jer frontendu se ne vjeruje).' },
    { tip: 'poredajPopuni', jezik: 'dom', naslov: '2. Događaj slanja',
      setup: `<form id="forma">
  <input id="ime" value="Amra">
  <button>Pošalji</button>
</form>
<p id="poruka"></p>`,
      pitanje: 'Kad se forma pošalje, stranica ne smije da se ponovo učita, a u <code>#poruka</code> treba da piše „Hvala, Amra“. Poredaj linije i upiši šta fali.',
      linije: [
        'const forma = document.querySelector("#forma");',
        'forma.addEventListener("submit", e => { e.preventDefault();',
        '  const ime = document.querySelector("#ime").___.trim();',
        '  const poruka = "Hvala, " + ___;',
        '  document.querySelector("#poruka").textContent = poruka;',
        '});',
      ],
      odg: [['value'], ['ime']],
      obj: 'Element mora postojati prije nego mu dodaš slušač; unutar slušača svaka linija koristi vrijednost iz prethodne. preventDefault() sprečava da preglednik pošalje formu i ponovo učita stranicu.' },
    { tip: 'zadatak', jezik: 'dom', naslov: '3. Cijela forma',
      opis: `<p>Spoji sve. Kad se forma <code>#forma</code> pošalje:</p><ul><li>uzmi vrijednosti iz <code>#ime</code>, <code>#telefon</code> i <code>#opis</code> i pozovi <code>provjeri()</code></li><li>ako ima grešaka: u <code>#greske</code> upiši po jedan <code>&lt;li&gt;</code> za svaku poruku (kao tekst) i ništa ne dodaj</li><li>ako nema: dodaj upit u <code>state.upiti</code>, isprazni <code>#greske</code> i sva tri polja, a u <code>#info</code> upiši <code>Primljeno upita: N</code></li></ul><p>Funkcija <code>provjeri</code> je već tu, iz prvog koraka.</p>`,
      setup: `<form id="forma">
  <input id="ime" placeholder="Ime">
  <input id="telefon" placeholder="Telefon">
  <textarea id="opis" placeholder="Šta ti treba?"></textarea>
  <button>Pošalji upit</button>
</form>
<ul id="greske"></ul>
<p id="info">Primljeno upita: 0</p>`,
      pocetak: `function provjeri(podaci) {
  const greske = [];
  if (!podaci.ime.trim()) greske.push("Upiši ime");
  if (podaci.telefon.replaceAll(" ", "").length < 6) greske.push("Telefon nije ispravan");
  if (podaci.opis.trim().length < 10) greske.push("Opiši šta ti treba");
  return greske;
}

const state = { upiti: [] };

document.querySelector("#forma").addEventListener("submit", e => {
  e.preventDefault();
  // tvoj kod
});
`,
      testovi: [
        { opis: 'Prazna forma: tri greške u #greske, ništa nije dodano', kod: "await T.posalji('#forma'); ocekuj(T.$$('#greske li').map(li => li.textContent), ['Upiši ime', 'Telefon nije ispravan', 'Opiši šta ti treba'], 'stavke u #greske'); ocekuj(state.upiti.length, 0, 'broj upita'); ocekuj(T.tekst('#info'), 'Primljeno upita: 0', '#info')" },
        { opis: 'Ispravan upit se dodaje i polja se prazne', kod: "await T.upisi('#ime', 'Amra'); await T.upisi('#telefon', '061 123 456'); await T.upisi('#opis', 'Plakar u hodniku, 220 cm'); await T.posalji('#forma'); ocekuj(state.upiti.length, 1, 'broj upita'); ocekuj(T.tekst('#info'), 'Primljeno upita: 1', '#info'); ocekuj(T.broj('#greske li'), 0, 'greške poslije ispravnog upita'); ocekuj([T.$('#ime').value, T.$('#telefon').value, T.$('#opis').value], ['', '', ''], 'polja poslije slanja')" },
        { opis: 'Upit u stanju ima ime, telefon i opis', kod: "await T.upisi('#ime', 'Emir'); await T.upisi('#telefon', '062555111'); await T.upisi('#opis', 'Radni sto po mjeri'); await T.posalji('#forma'); ocekuj(state.upiti.at(-1), { ime: 'Emir', telefon: '062555111', opis: 'Radni sto po mjeri' }, 'zadnji upit u state.upiti')" },
        { opis: 'Greške se ne gomilaju (drugo slanje zamijeni prve)', kod: "await T.posalji('#forma'); await T.upisi('#ime', 'Emir'); await T.posalji('#forma'); ocekuj(T.$$('#greske li').map(li => li.textContent), ['Telefon nije ispravan', 'Opiši šta ti treba'], 'stavke u #greske poslije drugog slanja')" },
        { opis: 'Tekst se prikazuje kao tekst, ne kao HTML', kod: "await T.upisi('#ime', ''); await T.posalji('#forma'); ocekuj(T.broj('#greske b'), 0, 'HTML oznake u #greske')" },
      ],
      nagovjestaji: ['Podaci: <code>const podaci = { ime: document.querySelector("#ime").value, telefon: …, opis: … };</code> pa <code>const greske = provjeri(podaci);</code>', 'Greške: isprazni listu (<code>lista.innerHTML = ""</code>), pa za svaku poruku <code>createElement("li")</code> i <code>textContent</code>.', 'Bez grešaka: <code>state.upiti.push(podaci)</code>, polja na <code>""</code>, i <code>#info</code> na <code>"Primljeno upita: " + state.upiti.length</code>.'],
      rjesenje: `function provjeri(podaci) {
  const greske = [];
  if (!podaci.ime.trim()) greske.push("Upiši ime");
  if (podaci.telefon.replaceAll(" ", "").length < 6) greske.push("Telefon nije ispravan");
  if (podaci.opis.trim().length < 10) greske.push("Opiši šta ti treba");
  return greske;
}

const state = { upiti: [] };

document.querySelector("#forma").addEventListener("submit", e => {
  e.preventDefault();
  const polja = ["ime", "telefon", "opis"].map(id => document.querySelector("#" + id));
  const podaci = { ime: polja[0].value, telefon: polja[1].value, opis: polja[2].value };
  const greske = provjeri(podaci);
  const lista = document.querySelector("#greske");
  lista.innerHTML = "";
  for (const poruka of greske) {
    const li = document.createElement("li");
    li.textContent = poruka;
    lista.appendChild(li);
  }
  if (greske.length) return;
  state.upiti.push(podaci);
  for (const p of polja) p.value = "";
  document.querySelector("#info").textContent = "Primljeno upita: " + state.upiti.length;
});`,
      objRj: 'Obrazac je isti kao u lekcijama 6 i 7: događaj → podaci → provjera → stanje → prikaz. return poslije grešaka prekida funkciju, pa se neispravan upit nikad ne doda.' },
    { tip: 'kviz', naslov: 'Provjera na dva mjesta', p: 'Forma već provjerava podatke u pregledniku. Treba li server (Flask ruta) da ih provjeri ponovo?', o: ['Ne, dovoljna je provjera u pregledniku', 'Da: zahtjev se može poslati i mimo forme, pa server ne smije vjerovati frontendu', 'Samo ako je sajt spor', 'Samo za telefon'], t: 1, e: 'Provjera u pregledniku je za udobnost korisnika (odmah vidi grešku). Prava zaštita je na serveru, jer svako može poslati zahtjev direktno, bez tvoje forme.' },
  ],
});

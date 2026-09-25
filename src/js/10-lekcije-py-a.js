// ============================================================================
// Dio 1 · Python od nule — lekcije 1–3 (print, varijable, odluke).
// U Python kodu unutar ovih stringova NE koristiti obrnutu kosu crtu (\): JS bi je protumačio.
// ============================================================================
const LEKCIJE_PY = [];

LEKCIJE_PY.push({
  id: 'py1', naslov: 'Prvi program', cilj: 'Šta je program, kako ga računar čita i kako se nešto ispiše na ekran.',
  koraci: [
    { tip: 'tekst', naslov: 'Program je recept', html: `
      <p><b>Program</b> je spisak naredbi koje računar izvršava <b>jednu po jednu, odozgo prema dolje</b>, kao recept: prvo korak 1, pa korak 2… Računar ne preskače, ne pogađa i ne razmišlja — radi tačno ono što piše.</p>
      <p><b>Python</b> je jezik u kojem je napisan backend tvojih aplikacija (inhome, Sole-KP). Svaka linija je jedna naredba.</p>
      <p>Prva naredba koju učimo je <code>print(...)</code> — „ispiši“. Šta god staviš u zagrade, Python pokaže na ekranu (u dijelu „Izlaz“).</p>
      <div class="note">U ovoj aplikaciji kod se <b>stvarno izvršava</b> u tvom pregledniku. Ne možeš ništa pokvariti — slobodno mijenjaj i probaj.</div>` },
    { tip: 'primjer', naslov: 'Tvoj prvi program', uvod: 'Klikni na svaku liniju da vidiš šta radi, pa pritisni „Pokreni“.',
      kod: `# Ovo je komentar: Python ga preskače, služi ljudima
print("Dobar dan!")
print("Dobrodošli u INHome")
print(2 + 3)
print("2 + 3")`,
      obj: {
        1: 'Sve iza znaka <code>#</code> je <b>komentar</b>. Python ga potpuno ignoriše — piše se da ljudi razumiju kod.',
        2: '<code>print</code> je naredba „ispiši“. Tekst u <b>navodnicima</b> ispiše se tačno kako piše. Tekst u navodnicima zove se <b>string</b>.',
        3: 'Druga naredba se izvrši tek poslije prve. Zato je „Dobrodošli…“ u izlazu ispod „Dobar dan!“.',
        4: 'Bez navodnika Python <b>računa</b>: <code>2 + 3</code> postaje <code>5</code>, i ispiše se 5.',
        5: 'Sa navodnicima to je samo tekst — ispiše se doslovno <code>2 + 3</code>, bez računanja.',
      },
      poslije: 'Probaj „Promijeni i probaj“: dodaj svoju liniju, npr. <code>print("Moje ime je …")</code>, pa pokreni.' },
    { tip: 'predvidi', kod: `print("Ponuda")
print(100 + 50)
print("100 + 50")`,
      pitanje: 'Šta će se ispisati? (znak <code>·</code> u odgovorima znači „novi red“)',
      opcije: ['Ponuda · 150 · 150', 'Ponuda · 150 · 100 + 50', 'Ponuda · 100 + 50 · 150', '"Ponuda" · 150 · "100 + 50"'], t: 1,
      obj: 'Linije idu redom. Druga linija nema navodnike pa se računa (150); treća ima navodnike pa je tekst. Same navodnike Python ne ispisuje — oni samo kažu „ovo je tekst“.' },
    { tip: 'tekst', naslov: 'Greške su normalne', html: `
      <p>Kad Python ne razumije liniju, zaustavi se i ispiše <b>poruku greške</b>. To nije katastrofa nego pomoć: poruka kaže <b>šta</b> nije u redu i <b>u kojoj liniji</b>.</p>
      <p>Najčešća greška na početku: tekst bez navodnika. Python tada misli da je to <b>ime</b> nečega (o imenima u sljedećoj lekciji) i javi <code>SyntaxError</code> ili <code>NameError</code>.</p>
      <p>Iskusni programeri ne pišu kod bez grešaka — oni brzo <b>čitaju</b> poruke grešaka. To ćeš ovdje vježbati.</p>` },
    { tip: 'greska', kod: `print("Klijent: Amra")
print(Klijent dodan)
print("Kraj")`,
      linija: 2, obj: 'Tekst <code>Klijent dodan</code> nema navodnike, pa Python pokušava da ga pročita kao kod i ne uspije. Pokreni kod: vidjećeš da se prva linija izvrši, a na drugoj se program zaustavi — treća se nikad ne izvrši.',
      ispravno: `print("Klijent: Amra")
print("Klijent dodan")
print("Kraj")` },
    { tip: 'popuni', pitanje: 'Prva linija treba ispisati tekst, a druga <b>zbir</b> 1200 i 300 kao broj (ne kao tekst).',
      kod: `___("Ponuda je poslana")
print(___)`,
      odg: [['print'], ['1200 + 300', '1200+300', '1500']],
      obj: 'Naredba za ispis je <code>print</code>. Za zbir pišeš račun bez navodnika: <code>1200 + 300</code>.' },
    { tip: 'poredaj', pitanje: 'Poredaj linije tako da se faze posla ispišu ovim redom: mjerenje, ponuda, avans, izrada.',
      linije: ['print("1. Mjerenje")', 'print("2. Ponuda")', 'print("3. Avans")', 'print("4. Izrada")'],
      obj: 'Redoslijed izvršavanja = redoslijed linija. Računar ne gleda brojeve u tekstu, nego gdje se linija nalazi.' },
    { tip: 'zadatak', naslov: 'Napiši svoj program',
      opis: `<p>Napiši program koji ispisuje tačno <b>tri linije</b>:</p><ol><li><code>INHome</code></li><li><code>Kuhinja Hrast</code></li><li>rezultat računa <code>8400 + 1200</code> (neka Python izračuna, ne ti)</li></ol>`,
      pocetak: '# Napiši tri print naredbe ispod\n',
      testovi: [
        { opis: 'Ispisane su tačno 3 linije', kod: 'assert len(IZLAZ.splitlines()) == 3, f"Ispisano je {len(IZLAZ.splitlines())} linija, a treba 3"' },
        { opis: 'Prva linija je INHome', kod: 'assert IZLAZ.splitlines()[0] == "INHome", "Prva linija treba biti tačno: INHome"' },
        { opis: 'Druga linija je Kuhinja Hrast', kod: 'assert IZLAZ.splitlines()[1] == "Kuhinja Hrast", "Druga linija treba biti tačno: Kuhinja Hrast"' },
        { opis: 'Treća linija je rezultat računa (9600)', kod: 'assert IZLAZ.splitlines()[2] == "9600", "Treća linija treba biti 9600 — napiši print(8400 + 1200), bez navodnika"' },
      ],
      nagovjestaji: ['Trebaju ti tri linije, svaka počinje sa <code>print(</code> i završava sa <code>)</code>.', 'Tekst ide u navodnike: <code>print("INHome")</code>.', 'Za račun ne stavljaj navodnike: <code>print(8400 + 1200)</code>.'],
      rjesenje: `print("INHome")
print("Kuhinja Hrast")
print(8400 + 1200)` },
    { tip: 'kviz', p: 'Kojim redom Python izvršava linije programa?', o: ['Nasumično', 'Odozgo prema dolje, jednu po jednu', 'Prvo one sa brojevima, pa tekst', 'Odozdo prema gore'], t: 1, e: 'Uvijek odozgo prema dolje. Kasnije ćemo naučiti kako se neke linije preskoče (if) ili ponove (petlje).' },
    { tip: 'kviz', p: 'Šta ispiše print("5 + 5")?', o: ['10', '5 + 5', '"5 + 5"', 'Grešku'], t: 1, e: 'Navodnici znače tekst, pa se ispiše doslovno 5 + 5. Bez navodnika bi bilo 10.' },
  ],
});

LEKCIJE_PY.push({
  id: 'py2', naslov: 'Varijable i tipovi podataka', cilj: 'Kako program pamti vrijednosti (varijable), koje vrste vrijednosti postoje i kako se ubacuju u tekst.',
  koraci: [
    { tip: 'tekst', naslov: 'Varijabla je kutija sa natpisom', html: `
      <p><b>Varijabla</b> je <b>ime</b> pod kojim program zapamti neku vrijednost, kao kutija sa natpisom. Kasnije kutiju zoveš po imenu i dobiješ ono što je unutra.</p>
      <p><code>cijena = 8400</code> znači: „napravi kutiju <code>cijena</code> i stavi u nju 8400“. Znak <code>=</code> u programiranju <b>nije</b> „jednako“ iz matematike, nego <b>dodjela</b>: uzmi vrijednost desno i spremi je pod ime lijevo.</p>
      <p>Vrijednosti imaju <b>tip</b> (vrstu):</p>
      <ul><li><code>int</code> — cijeli broj: <code>8400</code></li><li><code>float</code> — decimalni broj: <code>0.17</code></li><li><code>str</code> — tekst (string): <code>"Amra"</code></li><li><code>bool</code> — da/ne: <code>True</code> ili <code>False</code></li><li><code>None</code> — „nema vrijednosti“</li></ul>
      <p>Tip određuje šta smiješ raditi: brojeve sabiraš, tekst spajaš, a broj i tekst ne možeš direktno sabrati.</p>` },
    { tip: 'primjer', naslov: 'Varijable u akciji',
      kod: `klijent = "Amra Kovačević"
cijena = 8400
pdv = 0.17
placeno = False
print(klijent)
print(cijena * pdv)
print(type(cijena))
print(type(klijent))`,
      obj: {
        1: 'Varijabla <code>klijent</code> dobija tekst (tip <code>str</code>). Imena varijabli pišemo malim slovima, bez razmaka (umjesto razmaka <code>_</code>).',
        2: '<code>cijena</code> je cijeli broj (<code>int</code>). Nema navodnika jer je broj.',
        3: '<code>pdv</code> je decimalni broj (<code>float</code>). Decimale se pišu <b>tačkom</b>, ne zarezom.',
        4: '<code>placeno</code> je <code>bool</code>: može biti samo <code>True</code> ili <code>False</code> (veliko početno slovo!).',
        5: 'Kad u <code>print</code> staviš ime varijable (bez navodnika), ispiše se ono što je u njoj.',
        6: 'Računa se sa vrijednostima iz kutija: 8400 × 0.17. Zvjezdica <code>*</code> je množenje.',
        7: '<code>type(...)</code> kaže kojeg je tipa vrijednost. Ispiše <code>&lt;class \'int\'&gt;</code>.',
        8: 'Za tekst ispiše <code>&lt;class \'str\'&gt;</code>.',
      },
      poslije: 'Primijeti rezultat linije 6: <code>1428.0</code>. Kad se u računu pojavi decimalni broj, i rezultat je decimalni.' },
    { tip: 'predvidi', kod: `x = 5
x = x + 2
print(x)`,
      opcije: ['5', '7', 'x + 2', 'Grešku, jer x ne može biti jednako x + 2'], t: 1,
      obj: 'Dodjela radi s desna na lijevo: prvo se izračuna desna strana (5 + 2 = 7), pa se rezultat spremi u <code>x</code>. Stara vrijednost se zamijeni. Zato <code>=</code> nije matematička jednakost.' },
    { tip: 'tekst', naslov: 'Tekst sa vrijednostima: f-string', html: `
      <p>Često treba ubaciti vrijednost u rečenicu: „Klijent Emir duguje 3200 KM“. Najlakše je <b>f-string</b>: ispred navodnika staviš slovo <code>f</code>, a varijable pišeš u vitičastim zagradama <code>{}</code>:</p>
      <p><code>f"{ime} duguje {iznos} KM"</code></p>
      <p>Tekst se može i spajati znakom <code>+</code>, ali <b>samo tekst sa tekstom</b>: <code>"Klijent " + ime</code> radi, a <code>"Iznos " + 3200</code> daje grešku jer je 3200 broj. Broj pretvaraš u tekst sa <code>str(3200)</code>, ili koristiš f-string koji to radi sam.</p>` },
    { tip: 'primjer', naslov: 'f-string',
      kod: `ime = "Emir"
iznos = 3200
print("Klijent " + ime)
print(f"{ime} duguje {iznos} KM")
print(f"Sa PDV-om: {iznos * 1.17} KM")`,
      obj: {
        3: 'Spajanje dva teksta sa <code>+</code>. Obrati pažnju na razmak na kraju <code>"Klijent "</code> — bez njega bi bilo „KlijentEmir“.',
        4: 'f-string: sve u <code>{}</code> Python zamijeni vrijednošću. Radi i sa brojevima, bez <code>str()</code>.',
        5: 'U <code>{}</code> može stajati i cijeli račun.',
      } },
    { tip: 'greska', kod: `iznos = 1500
poruka = "Iznos je " + iznos
print(poruka)`,
      linija: 2, obj: 'Tekst i broj se ne mogu spojiti sa <code>+</code> (<code>TypeError</code>). Python ne zna da li želiš sabirati ili spajati. Popravka: <code>f"Iznos je {iznos}"</code> ili <code>"Iznos je " + str(iznos)</code>.',
      ispravno: `iznos = 1500
poruka = f"Iznos je {iznos}"
print(poruka)` },
    { tip: 'popuni', pitanje: 'Klijent se zove <b>Selma</b>. Izračunaj cijenu za 12 kvadrata po 250 KM i ispiši je.',
      kod: `ime = ___
kvadrata = 12
cijena_po_kvadratu = 250
ukupno = kvadrata ___ cijena_po_kvadratu
print(f"{ime}: {___} KM")`,
      odg: [['"Selma"', "'Selma'"], ['*'], ['ukupno']],
      obj: 'Ime je tekst pa ide u navodnike; množenje je <code>*</code>; u f-string ide ime varijable u kojoj je rezultat.' },
    { tip: 'predvidi', kod: 'print(type("25"))', opcije: ["<class 'int'>", "<class 'str'>", "<class 'float'>", '25'], t: 1,
      obj: 'Iako izgleda kao broj, <code>"25"</code> je u navodnicima, pa je tekst. Ovo je čest izvor grešaka: podaci iz forme na web stranici stižu kao tekst i moraju se pretvoriti u broj sa <code>int("25")</code>.' },
    { tip: 'zadatak', naslov: 'Kalkulacija cijene',
      opis: `<p>Napravi varijable <code>materijal = 2300</code> i <code>rad = 1500</code>. Zatim napravi varijablu <code>cijena</code> koja je zbir materijala i rada <b>plus 20% marže</b> na taj zbir. Na kraju ispiši tačno: <code>Cijena: 4560.0 KM</code> (koristi f-string).</p>`,
      pocetak: `materijal = 2300
rad = 1500
# izračunaj cijenu sa 20% marže
`,
      testovi: [
        { opis: 'Postoji varijabla cijena', kod: 'assert "cijena" in dir(), "Napravi varijablu sa imenom cijena"' },
        { opis: 'cijena je 4560', kod: 'assert cijena == 4560, f"cijena je {cijena}, a treba 4560 (3800 + 20%)"' },
        { opis: 'Ispis je: Cijena: 4560.0 KM', kod: 'assert IZLAZ.strip() in ("Cijena: 4560.0 KM", "Cijena: 4560 KM"), f"Ispisano je: {IZLAZ.strip()!r}"' },
      ],
      nagovjestaji: ['Prvo izračunaj zbir: <code>osnova = materijal + rad</code>.', '20% od osnove je <code>osnova * 20 / 100</code>.', 'Cijena je osnova plus marža; ispis: <code>print(f"Cijena: {cijena} KM")</code>.'],
      rjesenje: `materijal = 2300
rad = 1500
osnova = materijal + rad
marza = osnova * 20 / 100
cijena = osnova + marza
print(f"Cijena: {cijena} KM")`,
      objRj: 'Dijeljenje <code>/</code> uvijek daje decimalni broj, zato piše 4560.0. Pomoćne varijable (osnova, marza) čine kod čitljivijim — isto rade i tvoji projekti.' },
    { tip: 'kviz', p: 'Šta znači linija broj = broj + 1?', o: ['Greška, to nije moguće', 'Povećaj vrijednost u varijabli broj za 1', 'Provjeri da li je broj jednak broju plus jedan', 'Napravi novu varijablu broj + 1'], t: 1, e: 'Desna strana se izračuna sa starom vrijednošću, pa se rezultat spremi nazad u istu varijablu.' },
    { tip: 'kviz', p: 'Kojeg je tipa vrijednost True?', o: ['str', 'int', 'bool', 'None'], t: 2, e: 'True i False su bool (logičke vrijednosti). Bez navodnika i sa velikim početnim slovom.' },
  ],
});

LEKCIJE_PY.push({
  id: 'py3', naslov: 'Odluke: if, elif, else', cilj: 'Kako program odlučuje šta da uradi: poređenja, uslovi i uvlačenje.',
  koraci: [
    { tip: 'tekst', naslov: 'Program koji odlučuje', html: `
      <p>Do sada se svaka linija izvršavala. Ali program često mora <b>odlučiti</b>: ako klijent duguje — pošalji podsjetnik, inače ništa.</p>
      <p><b>Poređenje</b> daje <code>True</code> ili <code>False</code>: <code>==</code> jednako, <code>!=</code> različito, <code>&lt;</code> manje, <code>&gt;</code> veće, <code>&lt;=</code>, <code>&gt;=</code>. Pažnja: <code>==</code> (dva znaka) poredi, a <code>=</code> (jedan) sprema u varijablu.</p>
      <p><code>if uslov:</code> — linije ispod, <b>uvučene 4 razmaka</b>, izvrše se samo kad je uslov <code>True</code>. <code>else:</code> je „inače“. Dvotačka na kraju i uvlačenje su obavezni: po uvlačenju Python zna šta pripada if-u.</p>
      <p>Uslovi se kombinuju: <code>and</code> (oba), <code>or</code> (bar jedan), <code>not</code> (suprotno).</p>` },
    { tip: 'primjer', naslov: 'Dug klijenta',
      kod: `iznos = 1200
placeno = 800

dug = iznos - placeno
if dug > 0:
    print(f"Klijent duguje {dug} KM")
    print("Pošalji podsjetnik")
else:
    print("Sve je plaćeno")
print("Provjera završena")`,
      obj: {
        4: 'Izračuna se dug: 1200 − 800 = 400.',
        5: '<code>dug &gt; 0</code> je poređenje: 400 &gt; 0 je <code>True</code>. Dvotačka <code>:</code> kaže „slijedi blok“.',
        6: 'Uvučena linija pripada if-u. Izvrši se jer je uslov True.',
        7: 'I ova je uvučena, dakle i ona pripada if-u.',
        8: '<code>else:</code> — blok ispod se izvrši samo ako je uslov bio False. Ovdje se preskače.',
        10: 'Ova linija <b>nije uvučena</b>, dakle nije dio ni if-a ni else-a. Izvrši se uvijek.',
      },
      poslije: 'Probaj promijeniti <code>placeno = 1200</code> i ponovo pokreni. Šta se ispiše?' },
    { tip: 'predvidi', kod: `avans = 0
if avans > 0:
    print("Kreni u izradu")
print("Čekam avans")`,
      opcije: ['Kreni u izradu', 'Čekam avans', 'Kreni u izradu · Čekam avans', 'Ništa'], t: 1,
      obj: '0 &gt; 0 je False, pa se uvučena linija preskače. Zadnja linija nije uvučena i izvrši se uvijek.' },
    { tip: 'primjer', naslov: 'Više mogućnosti: elif',
      uvod: '<code>elif</code> („else if“) dodaje nove uslove. Python ih provjerava redom i izvrši <b>samo prvi</b> koji je True.',
      kod: `dana_kasni = 20
if dana_kasni == 0:
    print("Na vrijeme")
elif dana_kasni <= 15:
    print("Blago kašnjenje")
elif dana_kasni <= 30:
    print("Pošalji opomenu")
else:
    print("Pozovi klijenta")`,
      obj: {
        2: '20 == 0? Ne (False). Idemo dalje.',
        4: '20 &lt;= 15? Ne. Idemo dalje.',
        6: '20 &lt;= 30? Da! Izvrši se linija 7, a ostatak se preskače.',
        8: '<code>else</code> hvata sve ostalo (više od 30 dana).',
      } },
    { tip: 'greska', kod: `cijena = 500
if cijena > 1000
    print("Velika narudžba")`,
      linija: 2, obj: 'Nedostaje dvotačka na kraju if linije: <code>if cijena &gt; 1000:</code>. Bez nje Python javlja SyntaxError.',
      ispravno: `cijena = 500
if cijena > 1000:
    print("Velika narudžba")` },
    { tip: 'greska', kod: `kolicina = 3
if kolicina > 0:
print("Ima na stanju")`,
      linija: 3, obj: 'Linija unutar if-a mora biti uvučena (4 razmaka). Python javlja IndentationError — „očekivao sam uvučen blok“.' },
    { tip: 'predvidi', kod: `pro = False
admin = True
if pro or admin:
    print("Vidi analitiku")
else:
    print("Zaključano")`,
      opcije: ['Vidi analitiku', 'Zaključano', 'Oba teksta', 'Grešku'], t: 0,
      obj: '<code>or</code> je True ako je bar jedan uslov True. admin je True, pa je cijeli uslov True. Ovo liči na Lite/Pro provjeru u inhome.' },
    { tip: 'popuni', pitanje: 'Popust od 10% dobija narudžba veća od 3000 KM; ostali nemaju popust.',
      kod: `ukupno = 5000
if ukupno ___ 3000:
    popust = 10
___:
    popust = 0
print(popust)`,
      odg: [['>', '>='], ['else']], obj: 'Poređenje „veće od“ je <code>&gt;</code>, a „inače“ je <code>else</code> (sa dvotačkom, koja je već napisana).' },
    { tip: 'poredaj', pitanje: 'Poredaj linije da program ocijeni ponudu po bodovima. Pazi: uvlačenje je već u linijama.',
      linije: ['bodovi = 85', 'if bodovi >= 90:', '    print("Odlično")', 'elif bodovi >= 70:', '    print("Dobro")', 'else:', '    print("Treba popraviti")'],
      obj: 'Varijabla mora postojati prije nego se koristi; ispod svakog if/elif/else ide njegova uvučena linija.' },
    { tip: 'zadatak', naslov: 'Status fakture',
      opis: `<p>Imaš <code>iznos</code> fakture i koliko je <code>placeno</code>. Ispiši tačno jednu riječ:</p><ul><li><code>Plaćeno</code> — ako je plaćeno koliko iznosi faktura ili više</li><li><code>Djelimično</code> — ako je nešto plaćeno, ali manje od iznosa</li><li><code>Neplaćeno</code> — ako nije plaćeno ništa</li></ul><p class="small muted">Testovi će tvoj kod pokrenuti i sa drugim vrijednostima za iznos i placeno, zato prve dvije linije ostavi kao varijable.</p>`,
      pocetak: `iznos = 1000
placeno = 400

# napiši if / elif / else ispod
`,
      testovi: [
        { opis: 'iznos 1000, placeno 400 → Djelimično', kod: 'assert _sa_vrijednostima(KOD, iznos=1000, placeno=400).strip() == "Djelimično", "Za 400 od 1000 treba Djelimično"' },
        { opis: 'iznos 1000, placeno 1000 → Plaćeno', kod: 'assert _sa_vrijednostima(KOD, iznos=1000, placeno=1000).strip() == "Plaćeno", "Kad je placeno jednako iznosu, treba Plaćeno"' },
        { opis: 'iznos 1000, placeno 1200 → Plaćeno', kod: 'assert _sa_vrijednostima(KOD, iznos=1000, placeno=1200).strip() == "Plaćeno", "Preplata je i dalje Plaćeno"' },
        { opis: 'iznos 1000, placeno 0 → Neplaćeno', kod: 'assert _sa_vrijednostima(KOD, iznos=1000, placeno=0).strip() == "Neplaćeno", "Kad je placeno 0, treba Neplaćeno"' },
      ],
      nagovjestaji: ['Prvi uslov: <code>if placeno &gt;= iznos:</code>', 'Drugi: <code>elif placeno &gt; 0:</code> — ovdje stižeš samo ako prvi nije bio tačan.', 'Sve ostalo je <code>else:</code>. Pazi na dvotačke i uvlačenje.'],
      rjesenje: `iznos = 1000
placeno = 400

if placeno >= iznos:
    print("Plaćeno")
elif placeno > 0:
    print("Djelimično")
else:
    print("Neplaćeno")`,
      objRj: 'Redoslijed uslova je bitan: da je <code>placeno &gt; 0</code> prvi, i puna uplata bi dobila „Djelimično“.' },
    { tip: 'kviz', p: 'Po čemu Python zna koje linije pripadaju if-u?', o: ['Po vitičastim zagradama', 'Po uvlačenju (razmaci na početku linije)', 'Po praznom redu', 'Po komentarima'], t: 1, e: 'U Pythonu uvlačenje nije ukras nego pravilo. (U JavaScriptu to rade vitičaste zagrade {}.)' },
    { tip: 'kviz', p: 'Koja je razlika između = i ==?', o: ['Nema razlike', '= sprema vrijednost u varijablu, == poredi dvije vrijednosti', '== sprema, = poredi', '== je samo za tekst'], t: 1, e: 'Česta greška: if x = 5: je greška; treba if x == 5:' },
  ],
});


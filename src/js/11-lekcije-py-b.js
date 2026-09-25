// ============================================================================
// Dio 1 · Python od nule — lekcije 4–6 (liste i petlje, rječnici, funkcije).
// ============================================================================
LEKCIJE_PY.push({
  id: 'py4', naslov: 'Liste i petlje', cilj: 'Kako čuvati više vrijednosti odjednom i uraditi nešto za svaku od njih.',
  koraci: [
    { tip: 'tekst', naslov: 'Lista: više vrijednosti u redu', html: `
      <p><b>Lista</b> čuva više vrijednosti jednu za drugom, u uglastim zagradama: <code>[1200, 450, 3200]</code>. Kao spisak faktura na papiru.</p>
      <p>Svaki element ima <b>indeks</b> (redni broj) koji <b>počinje od 0</b>: prvi element je <code>lista[0]</code>, drugi <code>lista[1]</code>. <code>len(lista)</code> kaže koliko ih ima, <code>lista.append(x)</code> dodaje na kraj.</p>
      <p><b>Petlja</b> <code>for</code> ponavlja blok za svaki element: <code>for iznos in fakture:</code> znači „za svaki iznos iz liste fakture, uradi ovo“. Varijabla <code>iznos</code> u svakom krugu dobije sljedeći element.</p>` },
    { tip: 'primjer', naslov: 'Rad sa listom',
      kod: `iznosi = [1200, 450, 3200]
print(iznosi[0])
print(len(iznosi))
iznosi.append(800)
print(iznosi)
print(sum(iznosi))`,
      obj: {
        1: 'Lista od tri broja. Elementi su odvojeni zarezom.',
        2: 'Indeks 0 = <b>prvi</b> element (1200). Računari broje od nule.',
        3: '<code>len</code> (length, dužina) vraća broj elemenata: 3.',
        4: '<code>append</code> dodaje 800 na kraj liste. Tačka znači „metoda ove liste“ — nešto što lista zna uraditi sama sa sobom.',
        5: 'Ispiše cijelu listu, sad sa četiri elementa.',
        6: '<code>sum</code> sabere sve brojeve u listi.',
      } },
    { tip: 'predvidi', kod: `klijenti = ["Amra", "Emir", "Selma"]
print(klijenti[1])`, opcije: ['Amra', 'Emir', 'Selma', 'Grešku'], t: 1,
      obj: 'Indeks 1 je <b>drugi</b> element jer brojanje počinje od 0: Amra je 0, Emir 1, Selma 2.' },
    { tip: 'primjer', naslov: 'Petlja for: uradi za svaki element',
      kod: `fakture = [1200, 450, 3200]
ukupno = 0
for iznos in fakture:
    print(f"Faktura: {iznos} KM")
    ukupno = ukupno + iznos
print(f"Ukupno: {ukupno} KM")`,
      obj: {
        2: 'Brojač počinje od 0. U njega ćemo sabirati.',
        3: 'Petlja: u prvom krugu <code>iznos</code> je 1200, u drugom 450, u trećem 3200. Dvotačka i uvlačenje — isto kao kod if-a.',
        4: 'Uvučeno = ponavlja se u svakom krugu.',
        5: 'Stari zbir plus trenutni iznos: 0+1200=1200, 1200+450=1650, 1650+3200=4850.',
        6: 'Nije uvučeno: izvrši se jednom, <b>poslije</b> petlje.',
      },
      poslije: 'Ovo je obrazac „akumulator“: varijabla prije petlje, povećava se u petlji, koristi se poslije. Srešćeš ga svuda.' },
    { tip: 'predvidi', kod: `for i in range(3):
    print(i)`, opcije: ['1 · 2 · 3', '0 · 1 · 2', '0 · 1 · 2 · 3', '3'], t: 1,
      obj: '<code>range(3)</code> daje brojeve 0, 1, 2 — tri broja, počevši od nule, <b>bez</b> 3.' },
    { tip: 'greska', kod: `faze = ["upit", "ponuda", "izrada"]
print(faze[0])
print(faze[3])`, linija: 3,
      obj: 'Lista ima 3 elementa sa indeksima 0, 1 i 2. Indeks 3 ne postoji → <code>IndexError</code>. Zadnji element je uvijek <code>faze[len(faze) - 1]</code>, ili kraće <code>faze[-1]</code>.' },
    { tip: 'popuni', pitanje: 'Program treba naći najveću cijenu u listi.',
      kod: `cijene = [100, 250, 400, 180]
najveca = 0
for c ___ cijene:
    if c > najveca:
        najveca = ___
print(najveca)`,
      odg: [['in'], ['c']], obj: '<code>for c in cijene</code> prolazi kroz listu; kad je trenutna cijena veća od dosadašnje najveće, zapamtimo je.' },
    { tip: 'primjer', naslov: 'Petlja + if: filtriranje',
      kod: `iznosi = [1200, 450, 3200, 90]
velike = []
for x in iznosi:
    if x >= 1000:
        velike.append(x)
print(velike)`,
      obj: {
        2: 'Prazna lista u koju ćemo skupljati.',
        4: 'if je uvučen u petlju, a append je uvučen u if — dva nivoa uvlačenja (8 razmaka).',
        5: 'Dodaje se samo kad je uslov tačan.',
      } },
    { tip: 'poredaj', pitanje: 'Poredaj program koji broji koliko faktura je još otvoreno.',
      linije: ['statusi = ["plaćeno", "otvoreno", "otvoreno", "plaćeno"]', 'otvorenih = 0', 'for s in statusi:', '    if s == "otvoreno":', '        otvorenih = otvorenih + 1', 'print(otvorenih)'],
      obj: 'Podaci, pa brojač, pa petlja sa if-om unutra, pa ispis poslije petlje.' },
    { tip: 'zadatak', naslov: 'Pregled faktura',
      opis: `<p>Imaš listu iznosa faktura. Ispiši dvije linije:</p><ol><li><code>Ukupno: X</code> — zbir svih iznosa</li><li><code>Velikih: Y</code> — koliko faktura ima iznos 1000 ili više</li></ol><p>Koristi <b>for</b> petlju (bez <code>sum</code>). Testovi će pokrenuti tvoj kod i sa drugim listama.</p>`,
      pocetak: `fakture = [1200, 450, 3200, 380]
ukupno = 0
velikih = 0
# petlja ovdje
`,
      testovi: [
        { opis: 'ukupno je 5230', kod: 'assert ukupno == 5230, f"ukupno je {ukupno}, a treba 5230"' },
        { opis: 'velikih je 2', kod: 'assert velikih == 2, f"velikih je {velikih}, a treba 2 (1200 i 3200)"' },
        { opis: 'Ispis je u dvije linije: Ukupno / Velikih', kod: 'assert IZLAZ.splitlines() == ["Ukupno: 5230", "Velikih: 2"], f"Ispisano: {IZLAZ.splitlines()}"' },
        { opis: 'Radi i za drugu listu [2000, 100]', kod: 'assert _sa_vrijednostima(KOD, fakture=[2000, 100]).splitlines() == ["Ukupno: 2100", "Velikih: 1"], "Za [2000, 100] treba Ukupno: 2100 i Velikih: 1"' },
      ],
      nagovjestaji: ['Petlja: <code>for iznos in fakture:</code>', 'U petlji: <code>ukupno = ukupno + iznos</code>, pa <code>if iznos &gt;= 1000:</code> sa <code>velikih = velikih + 1</code>.', 'Ispisi idu <b>poslije</b> petlje (bez uvlačenja): <code>print(f"Ukupno: {ukupno}")</code>.'],
      rjesenje: `fakture = [1200, 450, 3200, 380]
ukupno = 0
velikih = 0
for iznos in fakture:
    ukupno = ukupno + iznos
    if iznos >= 1000:
        velikih = velikih + 1
print(f"Ukupno: {ukupno}")
print(f"Velikih: {velikih}")` },
    { tip: 'kviz', p: 'Koji je indeks prvog elementa liste?', o: ['1', '0', '-1', 'Zavisi od liste'], t: 1, e: 'Uvijek 0. Zato lista od 3 elementa ima indekse 0, 1, 2.' },
    { tip: 'kviz', p: 'Šta radi lista.append(5)?', o: ['Briše 5 iz liste', 'Dodaje 5 na kraj liste', 'Dodaje 5 na početak', 'Vraća peti element'], t: 1, e: 'append = dodaj na kraj.' },
  ],
});

LEKCIJE_PY.push({
  id: 'py5', naslov: 'Rječnici: podaci sa imenima', cilj: 'Kako opisati jednu stvar (klijenta, fakturu) poljima sa imenima — isto kao JSON u tvojim API-jima.',
  koraci: [
    { tip: 'tekst', naslov: 'Rječnik je kartica sa poljima', html: `
      <p>Lista je dobra za „više istih stvari“. Za <b>jednu stvar sa više osobina</b> (klijent: ime, telefon, dug) koristi se <b>rječnik</b> (<code>dict</code>): parovi <b>ključ: vrijednost</b> u vitičastim zagradama.</p>
      <p><code>klijent = {"ime": "Amra", "dug": 400}</code> — ključ <code>"ime"</code> ima vrijednost <code>"Amra"</code>. Vrijednost čitaš sa <code>klijent["ime"]</code>, mijenjaš sa <code>klijent["dug"] = 0</code>.</p>
      <p>Ovo je najvažnija struktura za web: <b>JSON</b> koji tvoj frontend šalje i prima je upravo ovakav rječnik. <code>request.json</code> u Flasku je rječnik, a <code>jsonify(klijent)</code> pretvara rječnik u JSON odgovor.</p>` },
    { tip: 'primjer', naslov: 'Klijent kao rječnik',
      kod: `klijent = {
    "ime": "Amra",
    "telefon": "061 123 456",
    "dug": 400,
}
print(klijent["ime"])
klijent["dug"] = 0
klijent["email"] = "amra@mail.ba"
print(klijent)
print(klijent.get("adresa", "nema adrese"))`,
      obj: {
        1: 'Rječnik može ići u više redova radi čitljivosti. Otvara se sa <code>{</code>.',
        2: 'Ključ (tekst) : vrijednost, pa zarez.',
        4: 'Vrijednost može biti bilo kojeg tipa — ovdje broj.',
        6: 'Čitanje po ključu, u uglastim zagradama.',
        7: 'Postojeći ključ → vrijednost se <b>zamijeni</b>.',
        8: 'Novi ključ → <b>doda</b> se novo polje.',
        10: '<code>.get(ključ, zamjena)</code> ne javlja grešku ako ključ ne postoji — vrati zamjensku vrijednost. Tako radi i <code>data.get(\'name\')</code> u inhome.',
      } },
    { tip: 'predvidi', kod: `posao = {"naziv": "Kuhinja", "faza": "izrada"}
posao["faza"] = "montaža"
print(posao["faza"])`, opcije: ['izrada', 'montaža', 'izrada, montaža', 'Grešku'], t: 1,
      obj: 'Isti ključ može imati samo jednu vrijednost; nova zamijeni staru.' },
    { tip: 'greska', kod: `ponuda = {"iznos": 3200, "rok": 30}
print(ponuda["iznos"])
print(ponuda["popust"])`, linija: 3,
      obj: 'Ključ <code>"popust"</code> ne postoji → <code>KeyError</code>. Kad polje možda ne postoji (npr. opcionalno polje iz forme), koristi <code>ponuda.get("popust", 0)</code>.',
      ispravno: `ponuda = {"iznos": 3200, "rok": 30}
print(ponuda["iznos"])
print(ponuda.get("popust", 0))` },
    { tip: 'primjer', naslov: 'Lista rječnika = tabela',
      uvod: 'Lista rječnika izgleda kao tabela: svaki rječnik je jedan red, svaki ključ jedna kolona. Upravo ovako izgledaju podaci koje tvoj API vraća.',
      kod: `fakture = [
    {"broj": "FAK-1", "iznos": 1200, "placeno": True},
    {"broj": "FAK-2", "iznos": 450, "placeno": False},
    {"broj": "FAK-3", "iznos": 3200, "placeno": False},
]
for f in fakture:
    if not f["placeno"]:
        print(f"{f['broj']}: {f['iznos']} KM")`,
      obj: {
        2: 'Jedan „red“: faktura sa tri polja.',
        6: 'Petlja kroz redove: <code>f</code> je u svakom krugu jedan rječnik.',
        7: '<code>not</code> okreće True u False i obrnuto: „ako NIJE plaćeno“.',
        8: 'Unutar f-stringa koriste se jednostruki navodnici za ključeve, da se ne sudare sa vanjskim dvostrukim.',
      } },
    { tip: 'tekst', naslov: 'Veza sa tvojim kodom', html: `
      <p>Sad možeš pročitati dio stvarnog koda iz inhome (<code>core_data_routes.py</code>):</p>
      <div class="kod"><div class="ln"><span class="no">1</span><span class="tx">data = request.json <span class="kw">or</span> {}</span></div><div class="ln"><span class="no">2</span><span class="tx">name = (data.get(<span class="st">'name'</span>) <span class="kw">or</span> <span class="st">''</span>).strip()</span></div></div>
      <ul><li>Linija 1: <code>request.json</code> je rječnik koji je poslao preglednik. Ako nije poslano ništa (<code>None</code>), <code>or {}</code> uzme prazan rječnik — da linija 2 ne pukne.</li>
      <li>Linija 2: <code>data.get('name')</code> uzme ime ili <code>None</code>; <code>or ''</code> pretvori <code>None</code> u prazan tekst; <code>.strip()</code> ukloni razmake sa krajeva. Rezultat: uvijek tekst, nikad greška.</li></ul>
      <div class="note good">Ovo je <b>odbrambeno programiranje</b>: kod pretpostavlja da podaci mogu nedostajati i ne dozvoljava da zbog toga padne.</div>` },
    { tip: 'popuni', pitanje: 'Ispiši ime, promijeni grad u Mostar i sigurno pročitaj telefon (kojeg nema).',
      kod: `klijent = {"ime": "Emir", "grad": "Sarajevo"}
print(klijent[___])
klijent[___] = "Mostar"
print(klijent.___("telefon", "nepoznat"))`,
      odg: [['"ime"', "'ime'"], ['"grad"', "'grad'"], ['get']],
      obj: 'Ključevi su tekst pa idu u navodnike; za polje koje možda ne postoji koristi se <code>get</code>.' },
    { tip: 'predvidi', kod: `cijene = {"hrast": 120, "bukva": 90}
for drvo, cijena in cijene.items():
    print(drvo, cijena)`, opcije: ['hrast 120 · bukva 90', 'hrast · bukva', '120 · 90', 'Grešku'], t: 0,
      obj: '<code>.items()</code> daje parove (ključ, vrijednost), pa petlja dobija dvije varijable odjednom. <code>print</code> sa dvije vrijednosti stavi razmak između.' },
    { tip: 'zadatak', naslov: 'Ukupan dug',
      opis: `<p>Lista <code>fakture</code> ima rječnike sa poljima <code>iznos</code> i <code>placeno</code> (koliko je plaćeno). Izračunaj ukupan dug (zbir <code>iznos - placeno</code> za sve fakture) u varijablu <code>dug</code> i ispiši <code>Dug: X KM</code>.</p>`,
      pocetak: `fakture = [{"iznos": 1200, "placeno": 1200}, {"iznos": 450, "placeno": 0}, {"iznos": 3200, "placeno": 1000}]
dug = 0
# petlja ovdje
`,
      testovi: [
        { opis: 'dug je 2650', kod: 'assert dug == 2650, f"dug je {dug}, a treba 2650 (0 + 450 + 2200)"' },
        { opis: 'Ispis: Dug: 2650 KM', kod: 'assert IZLAZ.strip() == "Dug: 2650 KM", f"Ispisano: {IZLAZ.strip()!r}"' },
        { opis: 'Radi i za druge fakture', kod: 'assert _sa_vrijednostima(KOD, fakture=[{"iznos": 100, "placeno": 40}]).strip() == "Dug: 60 KM", "Za jednu fakturu 100/40 treba Dug: 60 KM"' },
      ],
      nagovjestaji: ['<code>for f in fakture:</code> — <code>f</code> je jedan rječnik.', 'Dug jedne fakture: <code>f["iznos"] - f["placeno"]</code>.', 'Dodaj ga u <code>dug</code>, a ispis stavi poslije petlje.'],
      rjesenje: `fakture = [{"iznos": 1200, "placeno": 1200}, {"iznos": 450, "placeno": 0}, {"iznos": 3200, "placeno": 1000}]
dug = 0
for f in fakture:
    dug = dug + f["iznos"] - f["placeno"]
print(f"Dug: {dug} KM")` },
    { tip: 'kviz', p: 'Kako pročitati polje "popust" bez greške ako ne postoji?', o: ['ponuda["popust"]', 'ponuda.get("popust", 0)', 'ponuda.popust', 'get(ponuda, "popust")'], t: 1, e: '.get vraća zamjensku vrijednost umjesto KeyError.' },
    { tip: 'kviz', p: 'Lista rječnika najviše liči na…', o: ['jedan broj', 'tabelu: svaki rječnik je red, svaki ključ kolona', 'jedan tekst', 'petlju'], t: 1, e: 'Zato se redovi iz baze i JSON iz API-ja u Pythonu obično predstavljaju kao lista rječnika.' },
  ],
});

LEKCIJE_PY.push({
  id: 'py6', naslov: 'Funkcije', cilj: 'Kako imenovati komad koda, pozivati ga više puta i dobiti rezultat nazad.',
  koraci: [
    { tip: 'tekst', naslov: 'Funkcija je imenovani recept', html: `
      <p><b>Funkcija</b> je komad koda sa imenom koji možeš <b>pozvati</b> kad god treba, sa različitim ulazima. Već koristiš ugrađene: <code>print</code>, <code>len</code>, <code>sum</code>. Sad pravimo svoje.</p>
      <p><code>def ime(parametri):</code> definiše funkciju. Tijelo je uvučeno. <code>return vrijednost</code> vraća rezultat onome ko je pozvao. <b>Parametri</b> su imena za ulaze; vrijednosti koje daješ pri pozivu zovu se <b>argumenti</b>.</p>
      <p>Zašto funkcije: pravilo napišeš <b>jednom</b> (DRY — sjećaš se <code>esc()</code> kopiranog 3 puta?), daš mu ime koje objašnjava šta radi, i možeš ga <b>testirati</b> odvojeno. Cijela arhitektura iz Dijela 4 počiva na dobrim funkcijama.</p>` },
    { tip: 'primjer', naslov: 'Prva funkcija',
      kod: `def sa_pdv(iznos):
    return iznos * 1.17

cijena = sa_pdv(1000)
print(cijena)
print(sa_pdv(200))`,
      obj: {
        1: '<code>def</code> = definiši. Ime funkcije je <code>sa_pdv</code>, parametar <code>iznos</code>. Ova linija <b>ne izvršava</b> ništa — samo zapamti recept.',
        2: '<code>return</code> vraća rezultat. <code>iznos</code> ovdje ima vrijednost koju je dao pozivalac.',
        4: '<b>Poziv</b>: izvrši funkciju sa iznos = 1000. Rezultat (1170.0) se spremi u <code>cijena</code>.',
        6: 'Drugi poziv, sa drugim argumentom. Ista funkcija, drugi rezultat.',
      } },
    { tip: 'predvidi', kod: `def pozdrav(ime):
    print(f"Zdravo, {ime}!")

pozdrav("Selma")
pozdrav("Emir")`, opcije: ['Zdravo, ime! · Zdravo, ime!', 'Zdravo, Selma! · Zdravo, Emir!', 'Ništa, funkcija samo definisana', 'Zdravo, Selma!'], t: 1,
      obj: 'Svaki poziv izvrši tijelo sa drugom vrijednošću parametra <code>ime</code>.' },
    { tip: 'tekst', naslov: 'return nije print', html: `
      <p>Ovo zbunjuje skoro svakog početnika:</p>
      <ul><li><code>print</code> samo <b>pokaže</b> vrijednost na ekranu. Program je ne može dalje koristiti.</li><li><code>return</code> <b>vrati</b> vrijednost pozivaocu, koji je može spremiti, sabrati, poslati dalje.</li></ul>
      <p>Funkcija bez <code>return</code> vraća posebnu vrijednost <code>None</code> („ništa“). Dobre funkcije za računanje gotovo uvijek <b>vraćaju</b>, a ne ispisuju.</p>` },
    { tip: 'predvidi', kod: `def udvostruci(x):
    print(x * 2)

rezultat = udvostruci(5)
print(rezultat)`, opcije: ['10 · 10', '10 · None', 'None · 10', '10'], t: 1,
      obj: 'Funkcija <b>ispiše</b> 10, ali ne vrati ništa, pa je <code>rezultat</code> = None. Da je linija 2 bila <code>return x * 2</code>, ispis bi bio samo 10.' },
    { tip: 'primjer', naslov: 'Više parametara i podrazumijevana vrijednost',
      kod: `def cijena_posla(materijal, rad, marza=20):
    osnova = materijal + rad
    return osnova + osnova * marza / 100

print(cijena_posla(2300, 1500))
print(cijena_posla(2300, 1500, marza=30))`,
      obj: {
        1: 'Tri parametra. <code>marza=20</code> je <b>podrazumijevana vrijednost</b>: ako je pozivalac ne da, bude 20.',
        2: '<code>osnova</code> postoji samo unutar funkcije (lokalna varijabla) — van nje ne postoji.',
        5: 'Poziv sa dva argumenta: marza je 20.',
        6: 'Imenovani argument <code>marza=30</code> — jasno je šta znači 30.',
      } },
    { tip: 'greska', kod: `def dug(iznos, placeno):
    return iznos - placeno

print(dug(1000))`, linija: 4,
      obj: 'Funkcija traži dva argumenta, a dobila je jedan → <code>TypeError: missing 1 required positional argument</code>. Poziv treba biti npr. <code>dug(1000, 400)</code>.' },
    { tip: 'popuni', kod: `___ status(placeno, iznos):
    if placeno >= iznos:
        ___ "Plaćeno"
    return "Otvoreno"

print(status(500, 500))`,
      odg: [['def'], ['return']], obj: 'Funkcija se definiše sa <code>def</code>, a rezultat vraća sa <code>return</code>. Kad se izvrši return, funkcija odmah završava — zato linija 4 radi kao „inače“.' },
    { tip: 'poredaj', pitanje: 'Poredaj funkciju koja sabira stavke, i njen poziv.',
      linije: ['def ukupno(stavke):', '    suma = 0', '    for s in stavke:', '        suma = suma + s', '    return suma', 'print(ukupno([100, 200, 300]))'],
      obj: 'Definicija prije poziva; return je poslije petlje (uvučen samo 4 razmaka, ne 8), inače bi se vratio već prvi element.' },
    { tip: 'zadatak', naslov: 'Funkcija status_fakture',
      opis: `<p>Napiši funkciju <code>status_fakture(iznos, placeno)</code> koja <b>vraća</b> (return, ne print) tekst:</p><ul><li><code>"Plaćeno"</code> ako je placeno ≥ iznos</li><li><code>"Djelimično"</code> ako je placeno &gt; 0</li><li><code>"Neplaćeno"</code> inače</li></ul><p>Ovo je ista logika kao u lekciji 3, ali sad upakovana u funkciju — pa je testovi mogu direktno pozvati.</p>`,
      pocetak: `def status_fakture(iznos, placeno):
    # tvoj kod
    pass
`,
      testovi: [
        { opis: 'status_fakture(1000, 1000) == "Plaćeno"', kod: 'assert status_fakture(1000, 1000) == "Plaćeno", f"Vratilo je {status_fakture(1000, 1000)!r}"' },
        { opis: 'status_fakture(1000, 1500) == "Plaćeno"', kod: 'assert status_fakture(1000, 1500) == "Plaćeno"' },
        { opis: 'status_fakture(1000, 300) == "Djelimično"', kod: 'assert status_fakture(1000, 300) == "Djelimično", f"Vratilo je {status_fakture(1000, 300)!r}"' },
        { opis: 'status_fakture(1000, 0) == "Neplaćeno"', kod: 'assert status_fakture(1000, 0) == "Neplaćeno", f"Vratilo je {status_fakture(1000, 0)!r}"' },
        { opis: 'Funkcija vraća (return), ne ispisuje', kod: 'assert IZLAZ == "", "Funkcija ne treba ništa ispisivati — koristi return"' },
      ],
      nagovjestaji: ['Obriši <code>pass</code> (to je samo „prazno mjesto“) i napiši if/elif/else unutar funkcije, uvučeno.', 'Umjesto <code>print("Plaćeno")</code> piši <code>return "Plaćeno"</code>.'],
      rjesenje: `def status_fakture(iznos, placeno):
    if placeno >= iznos:
        return "Plaćeno"
    elif placeno > 0:
        return "Djelimično"
    else:
        return "Neplaćeno"`,
      objRj: 'Ovakva funkcija je <b>čista</b>: isti ulaz uvijek daje isti izlaz i ništa ne mijenja van sebe. Takve funkcije su srce „domene“ u Sole-KP i najlakše se testiraju.' },
    { tip: 'zadatak', naslov: 'Popust po iznosu',
      opis: `<p>Napiši funkciju <code>sa_popustom(iznos)</code> koja vraća iznos nakon popusta:</p><ul><li>5000 ili više → 10% popusta</li><li>2000 ili više → 5% popusta</li><li>manje → bez popusta</li></ul>`,
      pocetak: `def sa_popustom(iznos):
    pass
`,
      testovi: [
        { opis: 'sa_popustom(6000) == 5400', kod: 'assert sa_popustom(6000) == 5400, f"Vratilo je {sa_popustom(6000)}"' },
        { opis: 'sa_popustom(5000) == 4500 (granica uključena)', kod: 'assert sa_popustom(5000) == 4500, f"Vratilo je {sa_popustom(5000)}"' },
        { opis: 'sa_popustom(2000) == 1900', kod: 'assert sa_popustom(2000) == 1900, f"Vratilo je {sa_popustom(2000)}"' },
        { opis: 'sa_popustom(1500) == 1500', kod: 'assert sa_popustom(1500) == 1500, f"Vratilo je {sa_popustom(1500)}"' },
      ],
      nagovjestaji: ['Provjeri prvo najveći prag (5000), pa manji — redoslijed je bitan.', '10% popusta: <code>iznos - iznos * 10 / 100</code> (ili <code>iznos * 0.9</code>).'],
      rjesenje: `def sa_popustom(iznos):
    if iznos >= 5000:
        return iznos - iznos * 10 / 100
    elif iznos >= 2000:
        return iznos - iznos * 5 / 100
    return iznos` },
    { tip: 'kviz', p: 'Kad se izvršava kod unutar def funkcije?', o: ['Kad Python pročita def', 'Tek kad funkciju pozoveš', 'Na kraju programa', 'Nikad'], t: 1, e: 'def samo zapamti recept; svaki poziv ga izvrši.' },
    { tip: 'kviz', p: 'Šta vraća funkcija koja nema return?', o: ['0', 'Prazan tekst', 'None', 'Grešku'], t: 2, e: 'None — Pythonovo „ništa“. Česta skrivena greška kad neko zaboravi return.' },
  ],
});


// ============================================================================
// Dio 1 · Python od nule — lekcije 7–9 (greške, klase, čitanje stvarnog koda).
// ============================================================================
LEKCIJE_PY.push({
  id: 'py7', naslov: 'Greške i try/except', cilj: 'Kako čitati poruke grešaka, kako obraditi očekivane greške i kako namjerno prijaviti grešku.',
  koraci: [
    { tip: 'tekst', naslov: 'Greške su poruke, ne kazne', html: `
      <p>Kad nešto pođe po zlu, Python pravi <b>izuzetak</b> (exception) i zaustavi program. Poruka ima dva bitna dijela: <b>tip</b> (npr. <code>ValueError</code>) i <b>opis</b>, plus <b>broj linije</b>.</p>
      <p>Neke greške su <b>očekivane</b>: korisnik u formu upiše „12a“ umjesto broja. Tada ne želiš da program padne, nego da lijepo odgovori. Za to služi <code>try / except</code>: „pokušaj ovo; ako se desi ta greška, uradi ovo drugo“.</p>
      <p>Ponekad greške <b>praviš sam</b> sa <code>raise</code>: kad podaci krše pravilo (popust veći od 30%), funkcija odbije posao sa jasnom porukom. Tako radi <code>ValidationError</code> u Sole-KP.</p>` },
    { tip: 'primjer', naslov: 'try / except',
      kod: `unos = "12a"
try:
    kolicina = int(unos)
    print(f"Količina: {kolicina}")
except ValueError:
    print("Unesi broj, npr. 12")
print("Nastavljam dalje")`,
      obj: {
        1: 'Zamisli da je ovo stiglo iz forme — tekst koji nije ispravan broj.',
        2: '<code>try:</code> — „pokušaj“ blok ispod.',
        3: '<code>int("12a")</code> ne može napraviti broj → nastaje <code>ValueError</code>. Ostatak try bloka (linija 4) se <b>preskače</b>.',
        5: 'Uhvaćena je upravo greška tipa ValueError: izvrši se ovaj blok.',
        7: 'Program nije pao: nastavlja normalno.',
      },
      poslije: 'Promijeni <code>unos = "12"</code> i pokreni: tada se except blok preskače.' },
    { tip: 'predvidi', kod: `unos = "12"
try:
    kolicina = int(unos)
    print(f"Količina: {kolicina}")
except ValueError:
    print("Unesi broj")
print("Kraj")`, opcije: ['Količina: 12 · Kraj', 'Unesi broj · Kraj', 'Količina: 12 · Unesi broj · Kraj', 'Kraj'], t: 0,
      obj: 'Nije bilo greške, pa except blok ne radi ništa.' },
    { tip: 'primjer', naslov: 'raise: odbij neispravne podatke',
      kod: `def provjeri_popust(pct):
    if pct < 0 or pct > 30:
        raise ValueError("Popust mora biti između 0 i 30%")
    return pct

try:
    provjeri_popust(45)
except ValueError as greska:
    print(f"Odbijeno: {greska}")`,
      obj: {
        3: '<code>raise</code> namjerno pravi grešku sa porukom. Funkcija se odmah prekida — <code>return</code> se ne izvrši.',
        7: 'Poziv sa 45 → funkcija podigne grešku.',
        8: '<code>as greska</code> spremi grešku u varijablu da možeš pročitati poruku.',
      } },
    { tip: 'greska', kod: `ukupno = 1200
broj_rata = 0
rata = ukupno / broj_rata
print(rata)`, linija: 3,
      obj: 'Dijeljenje nulom → <code>ZeroDivisionError</code>. Prije dijeljenja treba provjeriti: <code>if broj_rata &gt; 0:</code>.' },
    { tip: 'kviz', p: 'Poruka glasi: NameError: name \'cijna\' is not defined. Šta je najvjerovatnije problem?', o: ['Cijena je negativna', 'Ime varijable je pogrešno napisano (cijna umjesto cijena)', 'Nedostaje dvotačka', 'Dijeljenje nulom'], t: 1, e: 'NameError = Python ne zna za to ime. Najčešće je tipfeler ili varijabla korištena prije nego što je napravljena.' },
    { tip: 'popuni', kod: `___:
    iznos = float("abc")
___ ValueError:
    iznos = 0
print(iznos)`, odg: [['try'], ['except']], obj: 'Rizična linija ide u <code>try</code>, a obrada greške u <code>except TipGreške</code>.' },
    { tip: 'tekst', naslov: 'Upozorenje: ne gutaj greške', html: `
      <p>Najgora upotreba try/except je „uhvati sve i šuti“:</p>
      <div class="kod"><div class="ln"><span class="no">1</span><span class="tx"><span class="kw">try</span>:</span></div><div class="ln"><span class="no">2</span><span class="tx">    cursor.execute(statement)</span></div><div class="ln"><span class="no">3</span><span class="tx"><span class="kw">except</span> sqlite3.OperationalError:</span></div><div class="ln"><span class="no">4</span><span class="tx">    <span class="kw">pass</span></span></div></div>
      <p>Ovo je iz inhome (<code>_safe_add_column</code>): ako kolona već postoji, greška se ignoriše — ali se ignoriše i <b>svaka druga</b> greška iste vrste (npr. zaključana baza). Problem ostaje skriven.</p>
      <div class="note warn">Pravilo: hvataj <b>samo</b> grešku koju očekuješ i znaš obraditi, i to što uže. Ostale neka se vide.</div>` },
    { tip: 'zadatak', naslov: 'Siguran unos broja',
      opis: `<p>Napiši funkciju <code>u_broj(tekst)</code> koja od teksta iz forme napravi cijeli broj. Ako tekst nije broj, vrati <code>None</code> umjesto da program padne. Razmake oko broja ignoriši.</p>`,
      pocetak: `def u_broj(tekst):
    pass
`,
      testovi: [
        { opis: 'u_broj("12") == 12', kod: 'assert u_broj("12") == 12, f"Vratilo je {u_broj(\'12\')!r}"' },
        { opis: 'u_broj(" 7 ") == 7 (razmaci)', kod: 'assert u_broj(" 7 ") == 7, f"Vratilo je {u_broj(\' 7 \')!r}"' },
        { opis: 'u_broj("abc") je None', kod: 'assert u_broj("abc") is None, f"Vratilo je {u_broj(\'abc\')!r}, a treba None"' },
        { opis: 'u_broj("") je None', kod: 'assert u_broj("") is None, "Prazan tekst treba dati None"' },
      ],
      nagovjestaji: ['<code>int(tekst)</code> radi i sa razmacima oko broja; za sigurnost možeš i <code>tekst.strip()</code>.', 'Stavi <code>return int(tekst)</code> u <code>try:</code>, a u <code>except ValueError:</code> vrati <code>None</code>.'],
      rjesenje: `def u_broj(tekst):
    try:
        return int(tekst.strip())
    except ValueError:
        return None` },
    { tip: 'kviz', p: 'Kada je try/except dobar izbor?', o: ['Uvijek, oko cijelog programa', 'Za očekivane greške koje znaš smisleno obraditi (npr. loš unos)', 'Da sakrijem greške koje ne razumijem', 'Nikad'], t: 1, e: 'Za neočekivane greške bolje je da program glasno padne — tada ih vidiš i popraviš.' },
  ],
});

LEKCIJE_PY.push({
  id: 'py8', naslov: 'Klase i objekti', cilj: 'Kako se podaci i funkcije koje rade nad njima spoje u jednu cjelinu — osnova modela i servisa u tvojim projektima.',
  koraci: [
    { tip: 'tekst', naslov: 'Nacrt i proizvod', html: `
      <p><b>Klasa</b> je nacrt, kao tehnički crtež ormara. <b>Objekat</b> je konkretan ormar napravljen po tom crtežu. Po jednom nacrtu možeš napraviti mnogo objekata, i svaki ima svoje mjere.</p>
      <p>Objekat ima <b>polja</b> (atribute: broj, iznos) i <b>metode</b> (funkcije koje rade sa tim poljima: uplati, dug). <code>__init__</code> je posebna metoda koja se izvrši kad praviš objekat — postavi početno stanje. <code>self</code> znači „ovaj konkretni objekat“.</p>
      <p>U Sole-KP su <code>Journal</code> i <code>Faktura</code> modeli klase (SQLAlchemy od njih pravi tabele), a <code>PostingService</code> je klasa servisa.</p>` },
    { tip: 'primjer', naslov: 'Klasa Faktura',
      kod: `class Faktura:
    def __init__(self, broj, iznos):
        self.broj = broj
        self.iznos = iznos
        self.placeno = 0

    def uplati(self, iznos):
        self.placeno = self.placeno + iznos

    def dug(self):
        return self.iznos - self.placeno

f = Faktura("FAK-7", 1200)
f.uplati(500)
print(f.broj, f.dug())`,
      obj: {
        1: '<code>class</code> definiše nacrt. Imena klasa pišu se sa velikim početnim slovom.',
        2: '<code>__init__</code> se pozove automatski kad napraviš fakturu. Prvi parametar je uvijek <code>self</code>.',
        3: '<code>self.broj</code> = polje ovog objekta. Parametar <code>broj</code> se spremi u objekat da ga ima i kasnije.',
        5: 'Svaka nova faktura počinje sa 0 plaćeno.',
        7: 'Metoda: funkcija unutar klase. Mijenja stanje objekta.',
        10: 'Metoda koja računa iz polja i vraća rezultat.',
        13: 'Pravljenje objekta: Python pozove <code>__init__</code> sa broj="FAK-7", iznos=1200.',
        14: 'Poziv metode nad objektom <code>f</code>. <code>self</code> je tada <code>f</code> — ne pišeš ga u pozivu.',
        15: 'Čitanje polja i poziv metode: ispiše <code>FAK-7 700</code>.',
      } },
    { tip: 'predvidi', kod: `class Brojac:
    def __init__(self):
        self.n = 0

    def povecaj(self):
        self.n = self.n + 1

a = Brojac()
b = Brojac()
a.povecaj()
a.povecaj()
b.povecaj()
print(a.n, b.n)`, opcije: ['3 3', '2 1', '1 2', '0 0'], t: 1,
      obj: 'Svaki objekat ima <b>svoja</b> polja. a je povećan dva puta, b jednom. Isti nacrt, dva nezavisna brojača.' },
    { tip: 'greska', pitanje: 'Program pada kad pozove pozdrav(). Klikni liniju gdje je stvarni uzrok (ne gdje se greška prijavi).',
      kod: `class Klijent:
    def __init__(self, ime):
        self.ime = ime

    def pozdrav():
        return f"Zdravo, {self.ime}"

k = Klijent("Amra")
print(k.pozdrav())`, linija: 5,
      obj: 'Metodi fali parametar <code>self</code>: <code>def pozdrav(self):</code>. Python pri pozivu <code>k.pozdrav()</code> automatski preda objekat kao prvi argument, a metoda ga ne prima → TypeError u liniji 9. Poruka pokazuje liniju poziva, a uzrok je u definiciji — to se često dešava.' },
    { tip: 'popuni', kod: `class Proizvod:
    def ___(self, naziv, cijena):
        ___.naziv = naziv
        self.cijena = cijena

    def sa_pdv(self):
        return self.cijena * 1.17

p = Proizvod("Stolica", 100)
print(p.___())`,
      odg: [['__init__'], ['self'], ['sa_pdv']], obj: 'Konstruktor se zove <code>__init__</code> (dvije donje crte sa svake strane), polja se postavljaju preko <code>self</code>, a metoda se poziva po imenu sa zagradama.' },
    { tip: 'tekst', naslov: 'Novac: Decimal, ne float', html: `
      <p>Decimalni brojevi (<code>float</code>) se u računaru čuvaju binarno, pa neki ne mogu biti tačni: <code>0.1 + 0.2</code> nije tačno 0.3. Za novac to je neprihvatljivo — feninzi se gube ili pojavljuju.</p>
      <p>Zato se za novac koristi <code>Decimal</code>, koji računa dekadno, kao računovođa. Sole-KP čak <b>odbije</b> float u novčanim poljima (ADR-003).</p>` },
    { tip: 'primjer', naslov: 'Decimal',
      kod: `from decimal import Decimal
print(0.1 + 0.2)
print(Decimal("0.1") + Decimal("0.2"))
cijena = Decimal("19.99")
print(cijena * 3)`,
      obj: {
        1: 'Uvoz klase <code>Decimal</code> iz Pythonove standardne biblioteke (više o import-u u sljedećoj lekciji).',
        2: 'Float: ispiše <code>0.30000000000000004</code>.',
        3: 'Decimal pravljen iz <b>teksta</b> (u navodnicima) je tačan: <code>0.3</code>.',
        5: '<code>59.97</code> — tačno do feninga.',
      } },
    { tip: 'zadatak', naslov: 'Klasa Ponuda',
      opis: `<p>Napravi klasu <code>Ponuda</code>:</p><ul><li><code>__init__(self, klijent)</code> — spremi klijenta i napravi praznu listu <code>self.stavke</code></li><li><code>dodaj(self, naziv, cijena, kolicina=1)</code> — doda stavku (npr. kao rječnik) u listu</li><li><code>ukupno(self)</code> — vrati zbir <code>cijena * kolicina</code> svih stavki</li></ul>`,
      pocetak: `class Ponuda:
    def __init__(self, klijent):
        pass

    def dodaj(self, naziv, cijena, kolicina=1):
        pass

    def ukupno(self):
        pass
`,
      testovi: [
        { opis: 'Nova ponuda ima ukupno 0', kod: 'p = Ponuda("Amra")\nassert p.ukupno() == 0, f"Prazna ponuda: {p.ukupno()!r}"' },
        { opis: 'Pamti klijenta', kod: 'p = Ponuda("Amra")\nassert p.klijent == "Amra", "self.klijent treba biti Amra"' },
        { opis: 'dodaj + ukupno sa količinom', kod: 'p = Ponuda("Emir")\np.dodaj("Ploča", 120, 3)\np.dodaj("Montaža", 200)\nassert p.ukupno() == 560, f"ukupno je {p.ukupno()}, a treba 3*120 + 200 = 560"' },
        { opis: 'Dvije ponude su nezavisne', kod: 'a = Ponuda("A")\nb = Ponuda("B")\na.dodaj("X", 10)\nassert b.ukupno() == 0, "Stavke jedne ponude ne smiju se pojaviti u drugoj"' },
      ],
      nagovjestaji: ['U <code>__init__</code>: <code>self.klijent = klijent</code> i <code>self.stavke = []</code>.', 'U <code>dodaj</code>: <code>self.stavke.append({"naziv": naziv, "cijena": cijena, "kolicina": kolicina})</code>.', 'U <code>ukupno</code>: petlja kroz <code>self.stavke</code> sa akumulatorom, pa <code>return</code>.'],
      rjesenje: `class Ponuda:
    def __init__(self, klijent):
        self.klijent = klijent
        self.stavke = []

    def dodaj(self, naziv, cijena, kolicina=1):
        self.stavke.append({"naziv": naziv, "cijena": cijena, "kolicina": kolicina})

    def ukupno(self):
        suma = 0
        for s in self.stavke:
            suma = suma + s["cijena"] * s["kolicina"]
        return suma` },
    { tip: 'kviz', p: 'Šta je self u metodi?', o: ['Ime klase', 'Konkretni objekat nad kojim je metoda pozvana', 'Globalna varijabla', 'Kopija klase'], t: 1, e: 'U f.uplati(500), self je f.' },
    { tip: 'kviz', p: 'Koji je odnos klase i objekta?', o: ['Isto su', 'Klasa je nacrt, objekat je konkretna stvar po nacrtu', 'Objekat je nacrt klase', 'Klasa je lista objekata'], t: 1, e: 'Jedna klasa Faktura, hiljade objekata faktura.' },
  ],
});


// ============================================================================
// Dio 4 · vježbe uz teme: interaktivni koraci (ista šema kao lekcije, 51-koraci.js) u TEME[i].koraci.
// Napredak: P.data.teme[id].vj, po indeksu koraka — nove korake dodaj na kraj niza.
// ============================================================================
const temaZaVjezbe = id => TEME.find(t => t.id === id);

temaZaVjezbe('m4').koraci = [
  { tip: 'tekst', naslov: 'Transakcija: sve ili ništa', html: `
    <p>Uplata se knjiži na dvije fakture: sa jedne se skida, na drugu dodaje. Ako se izvrši samo prva naredba (nestane struje, greška u kodu), novac „nestane“. <b>Transakcija</b> to sprečava: <code>BEGIN</code> otvori cjelinu, <code>COMMIT</code> je potvrdi, a <code>ROLLBACK</code> vrati sve kao da se ništa nije desilo.</p>
    <p>U ovim vježbama radiš nad istom učioničkom bazom kao u Dijelu 3 (klijenti, projekti, fakture). Svako pokretanje kreće od svježe baze.</p>` },
  { tip: 'predvidi', jezik: 'sql', setup: BAZA, naslov: 'ROLLBACK',
    kod: `BEGIN;
UPDATE fakture SET placeno = placeno + 300 WHERE broj = 'FAK-2';
UPDATE fakture SET placeno = placeno - 300 WHERE broj = 'FAK-1';
ROLLBACK;
SELECT broj, placeno FROM fakture WHERE broj IN ('FAK-1', 'FAK-2') ORDER BY broj;`,
    opcije: ['FAK-1, 900 · FAK-2, 300', 'FAK-1, 1200 · FAK-2, 0', 'FAK-1, 1200 · FAK-2, 300'], t: 1,
    obj: 'ROLLBACK poništi obje izmjene iz transakcije, pa SELECT vidi stanje kakvo je bilo prije BEGIN: FAK-1 plaćena 1200, FAK-2 ništa.' },
  { tip: 'greska', jezik: 'sql', setup: BAZA, naslov: 'Pravilo baze odbija izmjenu',
    pitanje: 'Ovaj kod pada, a baza ne prihvati ni jednu izmjenu. Klikni na liniju koja krši pravilo iz tabele fakture.',
    kod: `BEGIN;
UPDATE fakture SET placeno = placeno + 500 WHERE broj = 'FAK-5';
UPDATE fakture SET placeno = placeno - 500 WHERE broj = 'FAK-2';
COMMIT;`,
    linija: 3, obj: 'FAK-2 ima plaćeno 0, pa bi poslije oduzimanja bilo -500. Tabela ima pravilo CHECK (placeno >= 0) i odbija tu izmjenu. Pravilo u bazi štiti podatke i kad kod pogriješi.' },
  { tip: 'predvidi', jezik: 'sql', setup: BAZA, naslov: 'Paginacija: stranica po stranica',
    pitanje: 'Lista faktura se prikazuje po 2 na stranici, poredano po datumu. Šta vraća druga stranica?',
    kod: `SELECT broj FROM fakture
ORDER BY datum
LIMIT 2 OFFSET 2;`,
    opcije: ['FAK-1 · FAK-2', 'FAK-3 · FAK-4', 'FAK-2 · FAK-3'], t: 1,
    obj: 'OFFSET 2 preskoči prve dvije (FAK-1 i FAK-2), a LIMIT 2 uzme sljedeće dvije. Bez ORDER BY redoslijed nije zagarantovan, pa bi se stranice mogle preklapati.' },
  { tip: 'zadatak', jezik: 'sql', setup: BAZA, naslov: 'Indeks za fakture klijenta',
    opis: `<p>Ekran klijenta stalno traži njegove fakture: <code>SELECT … FROM fakture WHERE klijent_id = ?</code>. Kad faktura bude hiljade, baza bez indeksa čita svaki red.</p><p>Napravi indeks <code>idx_fakture_klijent</code> na koloni <code>klijent_id</code> tabele <code>fakture</code>, pa ispod napiši upit koji vrati broj faktura klijenta 1.</p>`,
    pocetak: `-- 1) indeks

-- 2) broj faktura klijenta 1
`,
    testovi: [
      { opis: 'Indeks idx_fakture_klijent postoji na tabeli fakture', upit: "SELECT name, tbl_name FROM sqlite_master WHERE type = 'index' AND name = 'idx_fakture_klijent'", ocekivano: [['idx_fakture_klijent', 'fakture']] },
      { opis: 'Indeks je na koloni klijent_id', upit: "SELECT name FROM pragma_index_info('idx_fakture_klijent')", ocekivano: [['klijent_id']] },
      { opis: 'Zadnji upit vraća 2 (fakture klijenta 1)', ocekivano: [[2]] },
    ],
    nagovjestaji: ['Oblik: <code>CREATE INDEX ime ON tabela (kolona);</code>', "Brojanje: <code>SELECT COUNT(*) FROM fakture WHERE klijent_id = 1;</code>"],
    rjesenje: `-- 1) indeks
CREATE INDEX idx_fakture_klijent ON fakture (klijent_id);

-- 2) broj faktura klijenta 1
SELECT COUNT(*) FROM fakture WHERE klijent_id = 1;`,
    objRj: 'Indeks je kao kazalo na kraju knjige: pretraga po klijent_id više ne čita cijelu tabelu. Cijena je malo sporiji upis, jer se i kazalo mora ažurirati.' },
  { tip: 'kviz', naslov: 'N+1', p: 'Ekran prikazuje 50 projekata i za svaki ime klijenta. Kod prvo učita projekte, pa za svaki projekat posebno pita bazu za klijenta. Koliko je to upita i šta je rješenje?', o: ['1 upit; ništa ne treba mijenjati', '51 upit; jedan upit sa JOIN (ili IN) koji odmah vrati i ime klijenta', '50 upita; dodati indeks', '2 upita; dodati LIMIT'], t: 1, e: 'Jedan upit za listu plus po jedan za svaki red: 1 + 50. To je N+1. Sa JOIN-om baza spoji tabele u jednom upitu.' },
  { tip: 'kviz', naslov: 'Tuđi podaci', p: 'Više firmi koristi istu bazu, a svaki red ima organization_id. Šta je druga brava, osim filtera u kodu?', o: ['Duža lozinka baze', 'Row-Level Security u PostgreSQL-u: baza sama odbije redove druge organizacije', 'Paginacija', 'Indeks na organization_id'], t: 1, e: 'Filter u kodu se može zaboraviti u jednoj ruti. RLS je pravilo u samoj bazi, pa tuđe redove ne vraća ni kad kod pogriješi. SQLite nema RLS; to je funkcija PostgreSQL-a.' },
];

temaZaVjezbe('m8').koraci = [
  { tip: 'tekst', naslov: 'Autorizacija: šta smiješ', html: `
    <p>Prijava kaže <b>ko si</b>. Ali server mora za svaki zahtjev provjeriti i <b>da li ovaj red pripada tebi</b>. Ako zaboravi, dovoljno je u adresi promijeniti <code>/api/fakture/14</code> u <code>/api/fakture/15</code> i vidiš tuđu fakturu.</p>
    <p>U ovim vježbama: SQL injection, provjera vlasništva i ispis teksta koji je upisao korisnik.</p>` },
  { tip: 'predvidi', jezik: 'sql', setup: BAZA, naslov: 'SQL injection',
    pitanje: 'Kod je spojio upit od teksta: <code>"... WHERE grad = \'" + unos + "\'"</code>. Korisnik je u polje upisao <code>Mostar\' OR \'1\'=\'1</code>. Ovo je upit koji je stigao u bazu. Šta vraća?',
    kod: `SELECT ime FROM klijenti
WHERE grad = 'Mostar' OR '1'='1'
ORDER BY id;`,
    opcije: ['Emir Hodžić', 'Amra Kovačević · Emir Hodžić · Selma Begić · Lejla Mujić · Tarik Delić', 'Ništa (greška)'], t: 1,
    obj: "'1'='1' je uvijek tačno, pa uslov propusti sve redove. Unos je postao dio SQL-a. Odbrana su parametri (?): vrijednost ide bazi odvojeno i nikad ne postane naredba." },
  { tip: 'greska', bezPokretanja: true, naslov: 'Brisanje tuđe fakture',
    pitanje: 'Prijava radi i korisnik_id je tačan. Ipak, svaki prijavljeni korisnik može obrisati bilo čiju fakturu. Klikni na liniju gdje je problem.',
    kod: `def obrisi_fakturu(conn, korisnik_id, faktura_id):
    conn.execute(
        "DELETE FROM fakture WHERE id = ?",
        (faktura_id,),
    )
    conn.commit()`,
    linija: 3, obj: 'Uslov gleda samo id fakture. Treba i vlasnik: <code>WHERE id = ? AND user_id = ?</code> sa <code>(faktura_id, korisnik_id)</code>. Isti obrazac imaš u temi, u kodu iz inhome.' },
  { tip: 'zadatak', naslov: 'Tuđa faktura: 404',
    opis: `<p>Napiši funkciju <code>procitaj_fakturu(korisnik_id, faktura)</code>. <code>faktura</code> je rječnik iz baze (sa ključem <code>"user_id"</code>) ili <code>None</code> ako ne postoji. Funkcija vraća par (odgovor, status):</p><ul><li>faktura ne postoji → <code>({"error": "not found"}, 404)</code></li><li>faktura pripada drugom korisniku → isto <code>({"error": "not found"}, 404)</code></li><li>inače → <code>(faktura, 200)</code></li></ul><p class="small muted">Zašto 404, a ne 403: napadač ne saznaje ni da faktura sa tim brojem postoji.</p>`,
    pocetak: `def procitaj_fakturu(korisnik_id, faktura):
    pass
`,
    testovi: [
      { opis: 'Svoja faktura → 200', kod: 'f = {"id": 14, "user_id": 7, "iznos": 900}\nassert procitaj_fakturu(7, f) == (f, 200), f"Vratilo je {procitaj_fakturu(7, f)!r}"' },
      { opis: 'Tuđa faktura → 404', kod: 'f = {"id": 15, "user_id": 8, "iznos": 450}\nassert procitaj_fakturu(7, f) == ({"error": "not found"}, 404), f"Vratilo je {procitaj_fakturu(7, f)!r}"' },
      { opis: 'Nepostojeća faktura (None) → 404, bez greške', kod: 'assert procitaj_fakturu(7, None) == ({"error": "not found"}, 404)' },
    ],
    nagovjestaji: ['Prvo provjeri <code>if faktura is None or faktura["user_id"] != korisnik_id:</code>', 'U tom slučaju <code>return {"error": "not found"}, 404</code>, a na kraju <code>return faktura, 200</code>.'],
    rjesenje: `def procitaj_fakturu(korisnik_id, faktura):
    if faktura is None or faktura["user_id"] != korisnik_id:
        return {"error": "not found"}, 404
    return faktura, 200`,
    objRj: 'Redoslijed u uslovu je važan: ako je faktura None, desna strana se ne izvršava, pa nema greške. Ista odluka za „ne postoji“ i „tuđe“ ne otkriva ništa napadaču.' },
  { tip: 'zadatak', jezik: 'dom', naslov: 'Ime klijenta kao tekst, ne kao HTML',
    opis: `<p>Neko je pod ime klijenta upisao <code>&lt;b&gt;Amra&lt;/b&gt;</code>. Funkcija <code>render()</code> ubacuje imena kroz <code>innerHTML</code>, pa preglednik tekst izvrši kao HTML. Da je umjesto <code>&lt;b&gt;</code> bila skripta, to bi bio <b>XSS</b>.</p><p>Prepravi <code>render()</code> tako da se svako ime prikaže tačno kako je upisano, kao tekst (<code>textContent</code> ili <code>createElement</code>).</p>`,
    setup: `<h3>Klijenti</h3>
<ul id="lista"></ul>`,
    pocetak: `const state = { klijenti: ["Emir Hodžić", "<b>Amra</b>"] };

function render() {
  document.querySelector("#lista").innerHTML = state.klijenti
    .map(ime => \`<li>\${ime}</li>\`)
    .join("");
}
render();
`,
    testovi: [
      { opis: 'Dvije stavke u listi', kod: "ocekuj(T.broj('#lista li'), 2, 'broj stavki')" },
      { opis: 'Upisani HTML se ne izvršava (nema <b> u listi)', kod: "ocekuj(T.broj('#lista b'), 0, 'broj <b> elemenata u listi')" },
      { opis: 'Ime se vidi tačno kako je upisano', kod: "ocekuj(T.$$('#lista li').map(li => li.textContent), ['Emir Hodžić', '<b>Amra</b>'], 'tekst stavki')" },
      { opis: 'Dvostruki render ne duplira stavke', kod: "render(); render(); ocekuj(T.broj('#lista li'), 2, 'poslije još dva poziva render()')" },
    ],
    nagovjestaji: ['Isprazni listu: <code>lista.innerHTML = "";</code> (ovdje je to sigurno, jer ne ubacuješ korisnikov tekst).', 'Za svako ime: <code>const li = document.createElement("li"); li.textContent = ime; lista.appendChild(li);</code>'],
    rjesenje: `const state = { klijenti: ["Emir Hodžić", "<b>Amra</b>"] };

function render() {
  const lista = document.querySelector("#lista");
  lista.innerHTML = "";
  for (const ime of state.klijenti) {
    const li = document.createElement("li");
    li.textContent = ime;
    lista.appendChild(li);
  }
}
render();`,
    objRj: 'textContent uvijek tretira vrijednost kao tekst, pa se znakovi &lt; i &gt; prikažu, a ne izvrše. Ako baš praviš HTML od teksta, svaki korisnikov podatak prvo prođe kroz escape funkciju.' },
  { tip: 'kviz', naslov: 'CSRF', p: 'Tuđi sajt ima skrivenu formu koja šalje POST na tvoju aplikaciju. Zašto to može uspjeti?', o: ['Zato što tuđi sajt zna tvoju lozinku', 'Zato što preglednik uz zahtjev automatski pošalje tvoj kolačić za prijavu', 'Zato što je HTTPS isključen', 'Ne može uspjeti'], t: 1, e: 'Kolačić ide uz zahtjev bez obzira odakle je pokrenut. Odbrana: CSRF token koji tuđi sajt ne zna i SameSite postavka kolačića.' },
  { tip: 'kviz', naslov: 'Tajne', p: 'Gdje treba da stoji ključ za plaćanje ili lozinka baze?', o: ['U kodu, u fajlu config.py', 'U env varijabli na serveru; u gitu samo primjer bez prave vrijednosti', 'U komentaru iznad funkcije', 'U localStorage preglednika'], t: 1, e: 'Sve što je u gitu, vidi svako ko ima pristup repozitoriju (i zauvijek ostaje u istoriji). Env varijable postavljaš na serveru, van koda.' },
];

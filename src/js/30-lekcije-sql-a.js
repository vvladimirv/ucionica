// ============================================================================
// Dio 3 · SQL i baze — lekcije 1–3 (SELECT, grupisanje, JOIN).
// Svi SQL koraci imaju `setup: BAZA`: učionička baza jedne radionice namještaja (izmišljeni podaci;
// isti klijenti i fakture kao lažni server u JavaScript dijelu). SQLite preko sql.js.
// ============================================================================
const BAZA = `PRAGMA foreign_keys = ON;

CREATE TABLE klijenti (
  id INTEGER PRIMARY KEY,
  ime TEXT NOT NULL,
  telefon TEXT,
  grad TEXT NOT NULL
);
INSERT INTO klijenti (id, ime, telefon, grad) VALUES
  (1, 'Amra Kovačević', '061 123 456', 'Sarajevo'),
  (2, 'Emir Hodžić', '062 555 111', 'Mostar'),
  (3, 'Selma Begić', NULL, 'Tuzla'),
  (4, 'Lejla Mujić', '061 222 333', 'Sarajevo'),
  (5, 'Tarik Delić', NULL, 'Zenica');

CREATE TABLE projekti (
  id INTEGER PRIMARY KEY,
  klijent_id INTEGER NOT NULL REFERENCES klijenti(id),
  naziv TEXT NOT NULL,
  faza TEXT NOT NULL,
  vrijednost INTEGER NOT NULL
);
INSERT INTO projekti (id, klijent_id, naziv, faza, vrijednost) VALUES
  (1, 1, 'Kuhinja hrast', 'izrada', 8400),
  (2, 1, 'Plakar u hodniku', 'ponuda', 2300),
  (3, 2, 'Dnevni boravak', 'montaža', 5600),
  (4, 4, 'Kuhinja bijela', 'završeno', 8400),
  (5, 3, 'Radni sto', 'mjerenje', 900),
  (6, 2, 'Garderober', 'ponuda', 3100);

CREATE TABLE fakture (
  id INTEGER PRIMARY KEY,
  broj TEXT NOT NULL UNIQUE,
  klijent_id INTEGER NOT NULL REFERENCES klijenti(id),
  iznos INTEGER NOT NULL CHECK (iznos > 0),
  placeno INTEGER NOT NULL DEFAULT 0 CHECK (placeno >= 0),
  datum TEXT NOT NULL
);
INSERT INTO fakture (id, broj, klijent_id, iznos, placeno, datum) VALUES
  (10, 'FAK-1', 1, 1200, 1200, '2026-06-02'),
  (11, 'FAK-2', 1, 450, 0, '2026-07-15'),
  (12, 'FAK-3', 2, 3200, 1000, '2026-07-20'),
  (13, 'FAK-4', 4, 8400, 8400, '2026-08-01'),
  (14, 'FAK-5', 2, 900, 0, '2026-08-19'),
  (15, 'FAK-6', 3, 2600, 2600, '2026-09-03');`;

const LEKCIJE_SQL = [];

LEKCIJE_SQL.push({
  id: 'sql1', naslov: 'SELECT: pitanje bazi', cilj: 'Kako se iz tabele izaberu kolone i redovi: SELECT, FROM, WHERE, ORDER BY i LIMIT.',
  koraci: [
    { tip: 'tekst', naslov: 'Baza je skup tabela', html: `
      <p>Relaciona baza čuva podatke u <b>tabelama</b>: svaki klijent je jedan <b>red</b>, a svaki podatak o njemu (ime, telefon, grad) jedna <b>kolona</b>. <b>SQL</b> je jezik kojim se bazi postavljaju pitanja i daju naredbe. inhome koristi <b>SQLite</b> (cijela baza je jedan fajl), a Sole-KP <b>PostgreSQL</b>; osnovni SQL je u oba isti.</p>
      <p>Najčešće pitanje je <code>SELECT kolone FROM tabela;</code> — „daj mi ove kolone iz ove tabele“. Zvjezdica <code>*</code> znači „sve kolone“, a <code>;</code> završava naredbu.</p>
      <p>Ključne riječi (SELECT, FROM…) pišemo VELIKIM slovima: to je dogovor radi čitljivosti, SQL ne razlikuje velika i mala slova u njima.</p>
      <div class="note">U ovom dijelu radiš sa pravom SQLite bazom u pregledniku. Iznad svakog upita su tabele učioničke baze: klijenti, projekti i fakture jedne radionice namještaja. Svako pokretanje kreće od iste, svježe baze — ništa ne možeš pokvariti.</div>` },
    { tip: 'primjer', jezik: 'sql', setup: BAZA, naslov: 'Prvi upit',
      kod: `SELECT ime, grad
FROM klijenti;

SELECT *
FROM projekti;`,
      obj: {
        1: '<code>SELECT</code>: koje kolone želiš, odvojene zarezom. Kolone u rezultatu idu ovim redom.',
        2: '<code>FROM</code>: iz koje tabele. <code>;</code> završava naredbu.',
        4: '<code>*</code> = sve kolone. Zgodno za gledanje; u aplikacijama se kolone navode imenom, da se vidi šta se koristi.',
      } },
    { tip: 'tekst', naslov: 'WHERE: samo redovi koji odgovaraju', html: `
      <p><code>WHERE uslov</code> zadrži samo redove za koje je uslov tačan — kao <code>if</code> za svaki red.</p>
      <ul><li>poređenja: <code>=</code> (jedan znak!), <code>&lt;&gt;</code> ili <code>!=</code> (različito), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code></li><li>tekst ide u <b>jednostruke</b> navodnike: <code>grad = 'Sarajevo'</code></li><li>kombinovanje: <code>AND</code>, <code>OR</code>, <code>NOT</code>; kraće za više vrijednosti: <code>faza IN ('ponuda', 'izrada')</code></li><li><code>naziv LIKE 'Kuhinja%'</code> — tekst koji počinje sa „Kuhinja“ (<code>%</code> = bilo šta)</li><li><code>telefon IS NULL</code> — polje nema vrijednost. <code>NULL</code> znači „nepoznato“, pa <code>= NULL</code> nikad nije tačno.</li></ul>` },
    { tip: 'primjer', jezik: 'sql', setup: BAZA, naslov: 'Filtriranje',
      kod: `SELECT ime, telefon
FROM klijenti
WHERE grad = 'Sarajevo';

SELECT naziv, vrijednost
FROM projekti
WHERE faza = 'ponuda' AND vrijednost > 2500;

SELECT naziv
FROM projekti
WHERE naziv LIKE 'Kuhinja%';`,
      obj: {
        3: 'Samo klijenti iz Sarajeva. Tekst u jednostrukim navodnicima.',
        7: 'Oba uslova moraju važiti: projekti u ponudi, vrijedni više od 2500 KM.',
        11: '<code>LIKE</code> sa <code>%</code>: nazivi koji počinju sa „Kuhinja“.',
      } },
    { tip: 'predvidi', jezik: 'sql', setup: BAZA, pitanje: 'Koje redove vrati ovaj upit? (Pogledaj tabelu klijenti iznad.)',
      kod: `SELECT ime
FROM klijenti
WHERE grad = 'Sarajevo' OR grad = 'Tuzla';`,
      opcije: ['Amra Kovačević · Selma Begić · Lejla Mujić', 'Amra Kovačević · Lejla Mujić', 'Selma Begić', 'Ništa — grad ne može biti dva grada odjednom'], t: 0,
      obj: '<code>OR</code>: red prolazi ako važi bar jedan uslov — Sarajevo (Amra, Lejla) ili Tuzla (Selma). Ovdje dolaze redom kako su upisani, ali bez ORDER BY redoslijed nije zagarantovan.' },
    { tip: 'greska', jezik: 'sql', setup: BAZA,
      kod: `SELECT ime, grad
FROM klijenti
WHERE grad = Mostar;`,
      linija: 3, obj: 'Tekst mora biti u jednostrukim navodnicima: <code>\'Mostar\'</code>. Bez njih baza misli da je Mostar ime kolone i javi „no such column: Mostar“. SQLite ponekad prihvati i dvostruke navodnike, ali PostgreSQL ne: u SQL-u su dvostruki navodnici za imena kolona.',
      ispravno: `SELECT ime, grad
FROM klijenti
WHERE grad = 'Mostar';` },
    { tip: 'tekst', naslov: 'ORDER BY i LIMIT', html: `
      <p>Bez <code>ORDER BY</code> baza vraća redove kojim god redom joj odgovara — sada je to redoslijed upisa, ali na to se ne smiješ oslanjati.</p>
      <ul><li><code>ORDER BY vrijednost DESC</code> — od najveće (DESC = opadajuće; ASC = rastuće, podrazumijevano)</li><li><code>ORDER BY vrijednost DESC, naziv</code> — kad su vrijednosti iste, po nazivu</li><li><code>LIMIT 3</code> — samo prva tri reda. <code>LIMIT 20 OFFSET 40</code> je treća stranica po 20 redova (paginacija, Tema 4).</li></ul>
      <p>Redoslijed dijelova je uvijek isti: <code>SELECT … FROM … WHERE … ORDER BY … LIMIT …</code></p>` },
    { tip: 'predvidi', jezik: 'sql', setup: BAZA,
      kod: `SELECT naziv, vrijednost
FROM projekti
ORDER BY vrijednost DESC, naziv
LIMIT 3;`,
      opcije: ['Kuhinja bijela, 8400 · Kuhinja hrast, 8400 · Dnevni boravak, 5600', 'Kuhinja hrast, 8400 · Kuhinja bijela, 8400 · Dnevni boravak, 5600', 'Radni sto, 900 · Plakar u hodniku, 2300 · Garderober, 3100', 'Dnevni boravak, 5600 · Kuhinja bijela, 8400 · Kuhinja hrast, 8400'], t: 0,
      obj: 'Prvo po vrijednosti, od najveće. Dvije kuhinje imaju istu vrijednost (8400), pa odlučuje drugi ključ, naziv: „bijela“ je po abecedi prije „hrast“. LIMIT 3 zadrži prva tri reda.' },
    { tip: 'popuni', jezik: 'sql', setup: BAZA, pitanje: 'Klijenti za koje nemamo broj telefona, poredani po imenu.',
      kod: `SELECT ime, grad
___ klijenti
WHERE telefon ___ NULL
ORDER BY ime;`,
      odg: [['FROM', 'from'], ['IS', 'is']],
      obj: 'Tabela ide iza <code>FROM</code>. Za prazno polje piše se <code>IS NULL</code> — <code>= NULL</code> nikad nije tačno, jer NULL znači „nepoznato“.' },
    { tip: 'poredaj', jezik: 'sql', setup: BAZA, pitanje: 'Poredaj dijelove upita: dva najvrednija projekta koja nisu završena.',
      linije: ['SELECT naziv, vrijednost', 'FROM projekti', "WHERE faza <> 'završeno'", 'ORDER BY vrijednost DESC', 'LIMIT 2;'],
      obj: 'Redoslijed dijelova SQL upita je stalan: SELECT, FROM, WHERE, ORDER BY, LIMIT.' },
    { tip: 'zadatak', jezik: 'sql', setup: BAZA, naslov: 'Projekti u ponudi i izradi',
      opis: `<p>Napiši upit koji vraća <b>naziv</b> i <b>vrijednost</b> (tim redom) projekata koji su u fazi <code>ponuda</code> ili <code>izrada</code>, od najvrednijeg.</p>`,
      pocetak: `-- napiši upit ispod
`,
      testovi: [
        { opis: 'Tačni projekti i kolone, od najvrednijeg', ocekivano: [['Kuhinja hrast', 8400], ['Garderober', 3100], ['Plakar u hodniku', 2300]], redoslijed: true },
      ],
      nagovjestaji: ["Dvije faze: <code>faza = 'ponuda' OR faza = 'izrada'</code>, ili kraće <code>faza IN ('ponuda', 'izrada')</code>.", 'Od najvrednijeg: <code>ORDER BY vrijednost DESC</code>.'],
      rjesenje: `SELECT naziv, vrijednost
FROM projekti
WHERE faza IN ('ponuda', 'izrada')
ORDER BY vrijednost DESC;`,
      objRj: 'Test poredi i redoslijed redova i broj kolona: sa <code>SELECT *</code> bi rezultat imao pet kolona, pa ne bi prošao.' },
    { tip: 'kviz', p: 'Kako se u SQL-u provjerava da polje nema vrijednost?', o: ['telefon = NULL', 'telefon IS NULL', "telefon = ''", 'telefon == None'], t: 1, e: 'NULL znači „nepoznato“, pa ga ništa ne može biti jednako; zato postoji IS NULL. Prazan tekst \'\' je nešto drugo: vrijednost koja postoji, ali je prazna.' },
    { tip: 'kviz', p: 'Šta vrati SELECT * FROM klijenti LIMIT 2;?', o: ['Dvije kolone', 'Dva reda — a koja, zavisi od baze, jer nema ORDER BY', 'Klijenta sa id 2', 'Grešku'], t: 1, e: 'LIMIT ograniči broj redova. Za „prvih N“ po nečemu uvijek dodaj ORDER BY.' },
  ],
});

LEKCIJE_SQL.push({
  id: 'sql2', naslov: 'Brojanje i sabiranje: GROUP BY', cilj: 'Agregatne funkcije (COUNT, SUM, AVG, MIN, MAX), grupisanje sa GROUP BY i filtriranje grupa sa HAVING.',
  koraci: [
    { tip: 'tekst', naslov: 'Mnogo redova → jedan broj', html: `
      <p><b>Agregatne funkcije</b> svedu mnogo redova na jednu vrijednost: <code>COUNT(*)</code> broji redove, <code>SUM(iznos)</code> sabira, <code>AVG</code> računa prosjek, a <code>MIN</code> i <code>MAX</code> nađu najmanju i najveću vrijednost.</p>
      <p>U SELECT-u se može i računati: <code>iznos - placeno</code> je dug jedne fakture. <code>AS dug</code> daje ime koloni rezultata.</p>
      <p class="small muted">Iznosi u učioničkoj bazi su u cijelim KM, da primjeri budu kratki. U pravoj aplikaciji novac se čuva tipom koji ne gubi feninge (NUMERIC u PostgreSQL-u, Decimal u Pythonu — Tema 6).</p>` },
    { tip: 'primjer', jezik: 'sql', setup: BAZA, naslov: 'Pregled svih faktura',
      kod: `SELECT COUNT(*) AS broj_faktura,
       SUM(iznos) AS ukupno,
       SUM(iznos - placeno) AS dug,
       MAX(iznos) AS najveca
FROM fakture;

SELECT AVG(iznos), ROUND(AVG(iznos), 2), 7 / 2, 7.0 / 2
FROM fakture;`,
      obj: {
        1: '<code>COUNT(*)</code>: koliko ima redova. <code>AS</code> daje ime koloni rezultata.',
        3: 'Račun unutar SUM: za svaku fakturu iznos − plaćeno, pa zbir. To je ukupan dug.',
        7: 'AVG daje decimalni broj, ROUND ga zaokruži. Pažnja: u SQLite-u je <code>7 / 2</code> = 3, jer dva cijela broja daju cijeli rezultat; <code>7.0 / 2</code> = 3.5.',
      } },
    { tip: 'tekst', naslov: 'GROUP BY: zbir po grupama', html: `
      <p>Bez GROUP BY agregat računa preko <b>cijele</b> tabele. Sa <code>GROUP BY klijent_id</code> redovi se podijele u grupe sa istim klijentom, a agregat se računa <b>za svaku grupu posebno</b> — jedan red rezultata po grupi. Tako se dobije „dug po klijentu“ ili „broj projekata po fazi“.</p>
      <p>Pravilo: uz agregate u SELECT-u smiju stajati samo kolone po kojima grupišeš. SQLite je blag i pusti i druge (vrati bilo koju vrijednost iz grupe), ali PostgreSQL javi grešku — zato se drži pravila.</p>` },
    { tip: 'primjer', jezik: 'sql', setup: BAZA, naslov: 'Projekti po fazi',
      kod: `SELECT faza, COUNT(*) AS projekata, SUM(vrijednost) AS ukupno
FROM projekti
GROUP BY faza
ORDER BY ukupno DESC, faza;`,
      obj: {
        1: 'Za svaku fazu: naziv faze, broj projekata i zbir vrijednosti.',
        3: 'Grupe: svi projekti sa istom fazom. Ponuda ima dva projekta, ostale faze po jedan.',
        4: 'Rezultat se može sortirati po imenu kolone rezultata (ukupno); kod iste vrijednosti odlučuje faza.',
      } },
    { tip: 'predvidi', jezik: 'sql', setup: BAZA,
      kod: `SELECT klijent_id, SUM(iznos - placeno) AS dug
FROM fakture
GROUP BY klijent_id
ORDER BY klijent_id;`,
      opcije: ['1, 450 · 2, 3100 · 3, 0 · 4, 0', '1, 1650 · 2, 4100 · 3, 2600 · 4, 8400', '3550', '1, 450 · 2, 3100'], t: 0,
      obj: 'Jedan red po klijentu koji ima fakture (klijent 5 nema nijednu, pa ga nema). Amra (1): 0 + 450; Emir (2): 2200 + 900. Klijenti 3 i 4 su sve platili, pa im je dug 0 — grupa postoji, zbir je 0.' },
    { tip: 'tekst', naslov: 'WHERE ili HAVING', html: `
      <p><code>WHERE</code> filtrira <b>redove prije</b> grupisanja; <code>HAVING</code> filtrira <b>grupe poslije</b> grupisanja, pa u njemu smiju agregati: <code>HAVING SUM(iznos - placeno) &gt; 0</code> — „samo klijenti koji duguju“.</p>
      <p>Puni redoslijed dijelova: <code>SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY … LIMIT …</code></p>` },
    { tip: 'greska', jezik: 'sql', setup: BAZA,
      kod: `SELECT klijent_id, SUM(iznos) AS ukupno
FROM fakture
WHERE SUM(iznos) > 2000
GROUP BY klijent_id;`,
      linija: 3, obj: 'Agregat (SUM) ne smije u WHERE: WHERE radi nad pojedinačnim redovima, prije sabiranja — „misuse of aggregate“. Uslov nad zbirom ide u HAVING, poslije GROUP BY.',
      ispravno: `SELECT klijent_id, SUM(iznos) AS ukupno
FROM fakture
GROUP BY klijent_id
HAVING SUM(iznos) > 2000;` },
    { tip: 'popuni', jezik: 'sql', setup: BAZA, pitanje: 'Gradovi u kojima imamo više od jednog klijenta.',
      kod: `SELECT grad, ___(*) AS klijenata
FROM klijenti
___ BY grad
HAVING COUNT(*) ___ 1;`,
      odg: [['COUNT', 'count'], ['GROUP', 'group'], ['>']],
      obj: 'Brojanje je <code>COUNT(*)</code>, grupisanje <code>GROUP BY</code>, a „više od jednog“ je <code>&gt; 1</code> u HAVING, jer se odnosi na grupu.' },
    { tip: 'poredaj', jezik: 'sql', setup: BAZA, pitanje: 'Poredaj upit: dug po klijentu za fakture od jula, samo klijenti koji duguju, od najvećeg duga.',
      linije: ['SELECT klijent_id, SUM(iznos - placeno) AS dug', 'FROM fakture', "WHERE datum >= '2026-07-01'", 'GROUP BY klijent_id', 'HAVING SUM(iznos - placeno) > 0', 'ORDER BY dug DESC;'],
      obj: 'WHERE (redovi) ide prije GROUP BY, HAVING (grupe) poslije njega, a ORDER BY na kraju. Datumi zapisani kao 2026-07-01 porede se kao tekst — i to radi, jer je godina prva.' },
    { tip: 'zadatak', jezik: 'sql', setup: BAZA, naslov: 'Pregled po klijentu',
      opis: `<p>Za svakog klijenta koji <b>duguje</b> vrati četiri kolone, tim redom: <code>klijent_id</code>, broj njegovih faktura, ukupan iznos faktura i dug (zbir <code>iznos - placeno</code>). Poredaj od najvećeg duga.</p>`,
      pocetak: `SELECT klijent_id
FROM fakture;
`,
      testovi: [
        { opis: 'Dva klijenta sa dugom, tačni brojevi, od najvećeg duga', ocekivano: [[2, 2, 4100, 3100], [1, 2, 1650, 450]], redoslijed: true },
      ],
      nagovjestaji: ['Četiri kolone: <code>klijent_id, COUNT(*), SUM(iznos), SUM(iznos - placeno) AS dug</code>.', '<code>GROUP BY klijent_id</code>, pa <code>HAVING SUM(iznos - placeno) &gt; 0</code>.', 'Na kraju <code>ORDER BY dug DESC</code>.'],
      rjesenje: `SELECT klijent_id,
       COUNT(*) AS faktura,
       SUM(iznos) AS ukupno,
       SUM(iznos - placeno) AS dug
FROM fakture
GROUP BY klijent_id
HAVING SUM(iznos - placeno) > 0
ORDER BY dug DESC;`,
      objRj: 'Imena kolona (faktura, ukupno) su po želji; test poredi vrijednosti i redoslijed. Imena klijenata su u drugoj tabeli — kako ih dodati, uči sljedeća lekcija (JOIN).' },
    { tip: 'kviz', p: 'Koja je razlika između WHERE i HAVING?', o: ['Nema je', 'WHERE filtrira redove prije grupisanja, HAVING grupe poslije grupisanja', 'HAVING je brži', 'WHERE radi samo sa brojevima'], t: 1, e: 'Zato agregati (SUM, COUNT…) smiju u HAVING, a ne smiju u WHERE.' },
    { tip: 'kviz', p: 'Šta vrati SELECT COUNT(*) FROM fakture WHERE placeno = 0;?', o: ['Zbir neplaćenih iznosa', 'Broj faktura na kojima ništa nije plaćeno (ovdje 2)', 'Sve fakture', 'NULL'], t: 1, e: 'COUNT(*) broji redove koji prođu WHERE: FAK-2 i FAK-5.' },
  ],
});

LEKCIJE_SQL.push({
  id: 'sql3', naslov: 'JOIN: spajanje tabela', cilj: 'Primarni i strani ključ, JOIN koji spaja redove dvije tabele, LEFT JOIN za redove bez para i JOIN zajedno sa GROUP BY.',
  koraci: [
    { tip: 'tekst', naslov: 'Ključevi povezuju tabele', html: `
      <p>Svaki red ima <b>primarni ključ</b> (<code>id</code>) koji ga jedinstveno označava. Faktura ne prepisuje ime klijenta, nego čuva <code>klijent_id</code> — <b>strani ključ</b> koji pokazuje na <code>klijenti.id</code>. Tako je svaka činjenica na jednom mjestu (normalizacija, Tema 3).</p>
      <p><code>JOIN</code> spaja redove dvije tabele po uslovu: <code>FROM fakture f JOIN klijenti k ON k.id = f.klijent_id</code> — uz svaku fakturu stavi klijenta čiji je id jednak njenom klijent_id. <code>f</code> i <code>k</code> su kratka imena (aliasi) tabela, pa se kolone pišu kao <code>k.ime</code>, <code>f.iznos</code>.</p>
      <ul><li><code>JOIN</code> (tačnije INNER JOIN) — samo parovi koji se poklope</li><li><code>LEFT JOIN</code> — <b>svi</b> redovi lijeve tabele; ako nemaju para, kolone desne tabele su NULL</li></ul>` },
    { tip: 'primjer', jezik: 'sql', setup: BAZA, naslov: 'Faktura i ime klijenta',
      kod: `SELECT f.broj, k.ime, f.iznos
FROM fakture f
JOIN klijenti k ON k.id = f.klijent_id
ORDER BY f.broj;`,
      obj: {
        1: 'Kolone iz obje tabele, sa aliasom ispred.',
        2: '<code>fakture f</code>: tabela i njen alias.',
        3: 'Spoji svaki red faktura sa redom klijenata čiji je id jednak klijent_id. Ovo je obrazac koji ćeš pisati najčešće.',
      } },
    { tip: 'predvidi', jezik: 'sql', setup: BAZA,
      kod: `SELECT k.ime, p.naziv
FROM klijenti k
JOIN projekti p ON p.klijent_id = k.id
WHERE k.grad = 'Sarajevo'
ORDER BY p.naziv;`,
      opcije: ['Lejla Mujić, Kuhinja bijela · Amra Kovačević, Kuhinja hrast · Amra Kovačević, Plakar u hodniku', 'Amra Kovačević, Kuhinja hrast · Lejla Mujić, Kuhinja bijela', 'Amra Kovačević, Kuhinja hrast · Amra Kovačević, Plakar u hodniku · Lejla Mujić, Kuhinja bijela', 'Amra Kovačević · Lejla Mujić'], t: 0,
      obj: 'Klijent sa dva projekta pojavi se <b>dva puta</b> — jednom sa svakim projektom. Sarajevo: Amra (dva projekta) i Lejla (jedan). ORDER BY p.naziv poreda po nazivu projekta.' },
    { tip: 'primjer', jezik: 'sql', setup: BAZA, naslov: 'LEFT JOIN: i oni bez para',
      kod: `SELECT k.ime, COUNT(p.id) AS projekata
FROM klijenti k
LEFT JOIN projekti p ON p.klijent_id = k.id
GROUP BY k.id, k.ime
ORDER BY projekata DESC, k.ime;`,
      obj: {
        3: '<code>LEFT JOIN</code>: svi klijenti, i Tarik koji nema nijedan projekat — za njega su kolone projekta NULL.',
        1: '<code>COUNT(p.id)</code> broji samo redove gdje projekat postoji. <code>COUNT(*)</code> bi Tariku dao 1, jer njegov red postoji (sa NULL-ovima).',
        4: 'Grupiše se po k.id, a ne samo po imenu: dva klijenta mogu imati isto ime.',
      } },
    { tip: 'predvidi', jezik: 'sql', setup: BAZA, pitanje: 'Koji klijenti nemaju nijednu fakturu?',
      kod: `SELECT k.ime
FROM klijenti k
LEFT JOIN fakture f ON f.klijent_id = k.id
WHERE f.id IS NULL;`,
      opcije: ['Tarik Delić', 'Selma Begić · Tarik Delić', 'Ništa', 'Amra Kovačević · Emir Hodžić · Selma Begić · Lejla Mujić'], t: 0,
      obj: 'LEFT JOIN zadrži sve klijente; onima bez fakture su kolone fakture NULL. <code>WHERE f.id IS NULL</code> zadrži baš njih — čest obrazac za „ko nema…“.' },
    { tip: 'greska', jezik: 'sql', setup: BAZA,
      kod: `SELECT id, ime, iznos
FROM klijenti k
JOIN fakture f ON f.klijent_id = k.id;`,
      linija: 1, obj: 'Kolona <code>id</code> postoji u obje tabele, pa baza ne zna koju misliš: „ambiguous column name: id“. Uz JOIN piši alias ispred kolone: <code>k.id</code> ili <code>f.id</code>.',
      ispravno: `SELECT f.id, k.ime, f.iznos
FROM klijenti k
JOIN fakture f ON f.klijent_id = k.id;` },
    { tip: 'popuni', jezik: 'sql', setup: BAZA, pitanje: 'Ime i ukupan dug klijenata koji duguju.',
      kod: `SELECT k.ime, SUM(f.iznos - f.placeno) AS dug
FROM klijenti k
___ fakture f ___ f.klijent_id = k.id
GROUP BY k.id, k.ime
HAVING SUM(f.iznos - f.placeno) > 0;`,
      odg: [['JOIN', 'INNER JOIN', 'join', 'inner join'], ['ON', 'on']],
      obj: 'Tabele se spajaju sa <code>JOIN</code>, a uslov spajanja ide iza <code>ON</code>.' },
    { tip: 'poredaj', jezik: 'sql', setup: BAZA, pitanje: 'Poredaj upit: nezavršeni projekti sa imenom klijenta, od najvrednijeg.',
      linije: ['SELECT k.ime, p.naziv, p.vrijednost', 'FROM projekti p', 'JOIN klijenti k ON k.id = p.klijent_id', "WHERE p.faza <> 'završeno'", 'ORDER BY p.vrijednost DESC;'],
      obj: 'JOIN ide odmah iza FROM (dio je izvora podataka), a WHERE i ORDER BY poslije njega.' },
    { tip: 'zadatak', jezik: 'sql', setup: BAZA, naslov: 'Ko nam duguje',
      opis: `<p>Vrati <b>ime</b>, <b>grad</b> i <b>dug</b> (tim redom) za klijente koji duguju, od najvećeg duga. Dug je zbir <code>iznos - placeno</code> njihovih faktura.</p>`,
      pocetak: `SELECT k.ime, k.grad
FROM klijenti k;
`,
      testovi: [
        { opis: 'Emir i Amra, sa gradom i dugom, od najvećeg duga', ocekivano: [['Emir Hodžić', 'Mostar', 3100], ['Amra Kovačević', 'Sarajevo', 450]], redoslijed: true },
      ],
      nagovjestaji: ['Spoji: <code>JOIN fakture f ON f.klijent_id = k.id</code>.', 'Grupiši po klijentu: <code>GROUP BY k.id, k.ime, k.grad</code>; dug je <code>SUM(f.iznos - f.placeno)</code>.', 'Samo dužnici: <code>HAVING SUM(f.iznos - f.placeno) &gt; 0</code>, pa <code>ORDER BY dug DESC</code>.'],
      rjesenje: `SELECT k.ime, k.grad, SUM(f.iznos - f.placeno) AS dug
FROM klijenti k
JOIN fakture f ON f.klijent_id = k.id
GROUP BY k.id, k.ime, k.grad
HAVING SUM(f.iznos - f.placeno) > 0
ORDER BY dug DESC;` },
    { tip: 'zadatak', jezik: 'sql', setup: BAZA, naslov: 'Broj faktura za svakog klijenta',
      opis: `<p>Za <b>svakog</b> klijenta — i one bez ijedne fakture — vrati ime i broj njegovih faktura, poredano po imenu.</p>`,
      pocetak: `SELECT k.ime
FROM klijenti k
ORDER BY k.ime;
`,
      testovi: [
        { opis: 'Svih 5 klijenata, Tarik sa 0, po imenu', ocekivano: [['Amra Kovačević', 2], ['Emir Hodžić', 2], ['Lejla Mujić', 1], ['Selma Begić', 1], ['Tarik Delić', 0]], redoslijed: true },
      ],
      nagovjestaji: ['„I oni bez faktura“ znači <code>LEFT JOIN</code>.', 'Broji <code>COUNT(f.id)</code>, a ne <code>COUNT(*)</code> — inače bi Tarik imao 1.'],
      rjesenje: `SELECT k.ime, COUNT(f.id) AS faktura
FROM klijenti k
LEFT JOIN fakture f ON f.klijent_id = k.id
GROUP BY k.id, k.ime
ORDER BY k.ime;` },
    { tip: 'kviz', p: 'Šta LEFT JOIN vrati za klijenta koji nema nijednu fakturu?', o: ['Ne vrati ga', 'Vrati ga jednom, sa NULL u kolonama fakture', 'Grešku', 'Vrati ga sa nulama u kolonama fakture'], t: 1, e: 'Zato se sa LEFT JOIN broji COUNT(f.id) i traži WHERE f.id IS NULL.' },
    { tip: 'kviz', p: 'Zašto se u JOIN upitu piše k.id umjesto samo id?', o: ['Zbog brzine', 'Jer kolona id postoji u obje tabele; alias kaže iz koje', 'Tako je ljepše', 'Jer je id rezervisana riječ'], t: 1, e: 'Bez aliasa baza javi „ambiguous column name“.' },
  ],
});

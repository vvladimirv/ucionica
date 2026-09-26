// ============================================================================
// Dio 3 · SQL i baze — lekcije 4–5 (mijenjanje podataka i pravila; transakcije, parametri, indeksi).
// Baza je BAZA iz 30-lekcije-sql-a.js. Citati iz inhome su isti kao u temama (isti fajlovi i linije).
// ============================================================================
LEKCIJE_SQL.push({
  id: 'sql4', naslov: 'Mijenjanje podataka i pravila', cilj: 'INSERT, UPDATE i DELETE, zašto WHERE spašava podatke, i pravila koja baza sama sprovodi (NOT NULL, UNIQUE, CHECK, strani ključ).',
  koraci: [
    { tip: 'tekst', naslov: 'Tri naredbe za izmjene', html: `
      <ul><li><code>INSERT INTO tabela (kolone) VALUES (vrijednosti);</code> — dodaj red</li><li><code>UPDATE tabela SET kolona = vrijednost WHERE uslov;</code> — izmijeni redove koji zadovolje uslov</li><li><code>DELETE FROM tabela WHERE uslov;</code> — obriši redove koji zadovolje uslov</li></ul>
      <div class="note warn"><b>UPDATE i DELETE bez WHERE pogode SVE redove.</b> Navika iskusnih: prvo napiši <code>SELECT</code> sa istim WHERE i pogledaj koje redove pogađa, pa tek onda UPDATE ili DELETE.</div>
      <p>Poslije svake izmjene u izlazu piše koliko je redova pogođeno — to je isti broj koji Python dobije kao <code>cursor.rowcount</code> (Tema 4).</p>` },
    { tip: 'primjer', jezik: 'sql', setup: BAZA, naslov: 'Dodaj, izmijeni, obriši',
      kod: `INSERT INTO klijenti (ime, telefon, grad)
VALUES ('Adnan Softić', '063 777 888', 'Bihać');

UPDATE fakture
SET placeno = placeno + 450
WHERE broj = 'FAK-2';

DELETE FROM projekti
WHERE faza = 'mjerenje';

SELECT id, ime, grad FROM klijenti WHERE grad = 'Bihać';
SELECT broj, iznos, placeno FROM fakture WHERE broj = 'FAK-2';
SELECT COUNT(*) AS projekata FROM projekti;`,
      obj: {
        1: 'INSERT: navedeš kolone, pa vrijednosti istim redom. <code>id</code> ne pišeš — baza ga dodijeli sama (INTEGER PRIMARY KEY).',
        4: 'UPDATE: koja tabela…',
        5: '…SET: nova vrijednost; može se računati iz stare (placeno + 450).',
        6: '…WHERE: koji redovi. Bez ove linije bi se promijenile sve fakture!',
        8: 'DELETE: obriši redove koji zadovolje WHERE (ovdje jedan projekat).',
        11: 'Provjera: novi klijent je dobio id 6.',
      } },
    { tip: 'predvidi', jezik: 'sql', setup: BAZA, pitanje: 'Koliko otvorenih faktura (plaćeno manje od iznosa) ostane poslije ovog UPDATE-a?',
      kod: `UPDATE fakture
SET placeno = iznos;

SELECT COUNT(*) AS otvorenih FROM fakture WHERE placeno < iznos;`,
      opcije: ['0', '2', '3', '6'], t: 0,
      obj: 'Bez WHERE UPDATE pogodi <b>sve</b> fakture — sve su sada „plaćene“. Poruka iznad rezultata kaže da je izmijenjeno 6 redova. Na pravoj bazi ovo je nesreća, zato prvo SELECT sa istim WHERE.' },
    { tip: 'tekst', naslov: 'Pravila u samoj bazi', html: `
      <p>Kod tabele (<code>CREATE TABLE</code>) se uz kolone pišu i <b>ograničenja</b> (<i>constraints</i>), koja baza sprovodi sama — i kad kod ima bug, i kad neko ručno mijenja podatke:</p>
      <ul><li><code>NOT NULL</code> — vrijednost je obavezna</li><li><code>UNIQUE</code> — ne smije se ponoviti (broj fakture)</li><li><code>CHECK (iznos &gt; 0)</code> — vrijednost mora zadovoljiti uslov</li><li><code>REFERENCES klijenti(id)</code> — <b>strani ključ</b>: mora pokazivati na postojeći red</li></ul>
      <p>Pogledaj „SQL koji je napravio ove tabele“ ispod tabela: tamo su sva pravila učioničke baze.</p>
      <p class="small muted">SQLite provjerava strane ključeve tek poslije <code>PRAGMA foreign_keys = ON;</code> (u učioničkoj bazi je uključeno). PostgreSQL ih provjerava uvijek.</p>` },
    { tip: 'greska', jezik: 'sql', setup: BAZA, pitanje: 'Druga naredba pada na liniji 4, gdje počinje, ali uzrok je u jednoj vrijednosti. Klikni liniju sa stvarnim uzrokom.',
      kod: `INSERT INTO fakture (broj, klijent_id, iznos, datum)
VALUES ('FAK-7', 5, 1500, '2026-09-20');

INSERT INTO fakture (broj, klijent_id, iznos, datum)
VALUES ('FAK-8', 5, -300, '2026-09-21');`,
      linija: 5, obj: 'Kolona iznos ima pravilo <code>CHECK (iznos &gt; 0)</code>, pa baza odbije -300: „CHECK constraint failed“. Prva naredba je prošla — svaka naredba je zasebna, osim u transakciji (lekcija 5).',
      ispravno: `INSERT INTO fakture (broj, klijent_id, iznos, datum)
VALUES ('FAK-7', 5, 1500, '2026-09-20');

INSERT INTO fakture (broj, klijent_id, iznos, datum)
VALUES ('FAK-8', 5, 300, '2026-09-21');` },
    { tip: 'predvidi', jezik: 'sql', setup: BAZA, pitanje: 'Amra (id 1) ima fakture i projekte. Šta se desi?',
      kod: `DELETE FROM klijenti
WHERE id = 1;`,
      opcije: ['Obriše Amru', 'Obriše Amru i njene fakture', 'Grešku — na Amru pokazuju njene fakture i projekti (strani ključ)', 'Ništa se ne desi'], t: 2,
      obj: 'Strani ključ štiti vezu: baza ne dozvoli brisanje klijenta dok na njega pokazuju redovi u tabelama fakture i projekti — inače bi fakture ostale „ničije“ („FOREIGN KEY constraint failed“). Isto ponašanje Sole-KP traži za valutu sa <code>ondelete="RESTRICT"</code> (Tema 3).' },
    { tip: 'popuni', jezik: 'sql', setup: BAZA, pitanje: 'Dodaj klijenta Nermina iz Travnika, pa mu upiši telefon.',
      kod: `___ INTO klijenti (ime, grad)
VALUES ('Nermin Čolić', 'Travnik');

UPDATE klijenti
___ telefon = '062 999 000'
___ ime = 'Nermin Čolić';

SELECT ime, telefon, grad FROM klijenti WHERE grad = 'Travnik';`,
      odg: [['INSERT', 'insert'], ['SET', 'set'], ['WHERE', 'where']],
      obj: 'Novi red: <code>INSERT</code>. Izmjena: <code>UPDATE … SET … WHERE …</code> — WHERE kaže kojem klijentu.' },
    { tip: 'poredaj', jezik: 'sql', setup: BAZA, pitanje: 'Poredaj naredbe tako da na kraju tabela uplate ima jednu uplatu od 500 KM za fakturu 14, i da je zadnji upit pokaže.',
      linije: ['CREATE TABLE uplate (id INTEGER PRIMARY KEY, faktura_id INTEGER NOT NULL REFERENCES fakture(id), iznos INTEGER NOT NULL CHECK (iznos > 0));', 'INSERT INTO uplate (faktura_id, iznos) VALUES (14, 400);', 'UPDATE uplate SET iznos = 500 WHERE faktura_id = 14;', 'SELECT faktura_id, iznos FROM uplate;'],
      obj: 'Tabela mora postojati prije upisa, red prije izmjene, a upit na kraju vidi konačno stanje.' },
    { tip: 'zadatak', jezik: 'sql', setup: BAZA, naslov: 'Uplata i novi klijent',
      opis: `<p>Emir je platio fakturu <code>FAK-5</code> u cijelosti, a javio se i novi klijent: <b>Jasmin Kurtović</b> iz Sarajeva, telefon <code>061 444 555</code>. Napiši naredbe koje:</p><ol><li>fakturu FAK-5 označe kao plaćenu (<code>placeno</code> = <code>iznos</code>)</li><li>dodaju novog klijenta</li></ol><p>Testovi poslije tvog koda provjeravaju stanje baze, i to da ostale fakture nisu dirane.</p>`,
      pocetak: `-- 1) FAK-5 je plaćena u cijelosti

-- 2) novi klijent
`,
      testovi: [
        { opis: 'FAK-5 je plaćena (900)', upit: "SELECT placeno FROM fakture WHERE broj = 'FAK-5'", ocekivano: [[900]] },
        { opis: 'Ostale fakture nisu dirane', upit: "SELECT broj, placeno FROM fakture WHERE broj <> 'FAK-5' ORDER BY broj", ocekivano: [['FAK-1', 1200], ['FAK-2', 0], ['FAK-3', 1000], ['FAK-4', 8400], ['FAK-6', 2600]], redoslijed: true },
        { opis: 'Jasmin Kurtović je dodan sa telefonom i gradom', upit: "SELECT ime, telefon, grad FROM klijenti WHERE ime = 'Jasmin Kurtović'", ocekivano: [['Jasmin Kurtović', '061 444 555', 'Sarajevo']] },
        { opis: 'Ukupno 6 klijenata', upit: 'SELECT COUNT(*) FROM klijenti', ocekivano: [[6]] },
      ],
      nagovjestaji: ["Uplata: <code>UPDATE fakture SET placeno = iznos WHERE broj = 'FAK-5';</code> — bez WHERE bi se „platile“ sve fakture.", "Klijent: <code>INSERT INTO klijenti (ime, telefon, grad) VALUES (…);</code> — tekst u jednostrukim navodnicima."],
      rjesenje: `-- 1) FAK-5 je plaćena u cijelosti
UPDATE fakture
SET placeno = iznos
WHERE broj = 'FAK-5';

-- 2) novi klijent
INSERT INTO klijenti (ime, telefon, grad)
VALUES ('Jasmin Kurtović', '061 444 555', 'Sarajevo');`,
      objRj: '<code>--</code> počinje komentar u SQL-u. Test „ostale fakture nisu dirane“ hvata najopasniju grešku: UPDATE bez WHERE.' },
    { tip: 'kviz', p: 'Šta uradi DELETE FROM fakture; (bez WHERE)?', o: ['Ništa, jer fali uslov', 'Obriše sve fakture', 'Obriše prvu fakturu', 'Javi grešku'], t: 1, e: 'Bez WHERE pogodi sve redove. Zato prvo SELECT sa istim uslovom.' },
    { tip: 'kviz', p: 'Zašto pravilo CHECK (iznos > 0) u bazi, kad kod aplikacije već provjerava iznos?', o: ['Nije potrebno', 'Druga linija odbrane: štiti i od bugova, ručnih izmjena i drugih programa koji pišu u bazu', 'Zbog brzine', 'Da se ljepše prikaže'], t: 1, e: 'Pravilo u bazi važi za sve koji pišu u nju (Tema 3).' },
  ],
});

LEKCIJE_SQL.push({
  id: 'sql5', naslov: 'Transakcije, sigurnost i indeksi', cilj: 'Sve ili ništa (BEGIN, COMMIT, ROLLBACK), zašto se korisnički unos nikad ne lijepi u SQL (parametri ?), i kako indeks ubrzava pretragu. Završna lekcija SQL dijela.',
  koraci: [
    { tip: 'tekst', naslov: 'Transakcija: sve ili ništa', html: `
      <p>Neki posao traži više izmjena koje moraju proći <b>zajedno</b>. Uplata je greškom upisana na FAK-1, a pripada FAK-2: treba je skinuti sa jedne i dodati na drugu. Ako prvi UPDATE prođe, a drugi ne, novac „nestane“.</p>
      <p><b>Transakcija</b> grupiše naredbe: <code>BEGIN;</code> počne, <code>COMMIT;</code> trajno upiše sve izmjene odjednom, a <code>ROLLBACK;</code> poništi sve od BEGIN-a. To je „A“ iz ACID (Tema 4).</p>
      <p>Van transakcije svaka naredba se upiše odmah, sama za sebe (<i>autocommit</i>).</p>` },
    { tip: 'primjer', jezik: 'sql', setup: BAZA, naslov: 'Premještanje uplate',
      kod: `BEGIN;
UPDATE fakture SET placeno = placeno - 450 WHERE broj = 'FAK-1';
UPDATE fakture SET placeno = placeno + 450 WHERE broj = 'FAK-2';
COMMIT;

SELECT broj, iznos, placeno FROM fakture WHERE broj IN ('FAK-1', 'FAK-2');`,
      obj: {
        1: 'Početak transakcije.',
        2: 'Skini 450 KM sa FAK-1…',
        3: '…i dodaj ih na FAK-2. Do COMMIT-a ove izmjene nisu trajne.',
        4: 'COMMIT: obje izmjene postaju trajne odjednom.',
      } },
    { tip: 'primjer', jezik: 'sql', setup: BAZA, naslov: 'ROLLBACK: probaj pa poništi',
      kod: `BEGIN;
DELETE FROM fakture WHERE placeno = 0;
SELECT COUNT(*) AS faktura FROM fakture;
ROLLBACK;
SELECT COUNT(*) AS faktura FROM fakture;`,
      obj: {
        2: 'Obriše dvije neplaćene fakture…',
        3: '…pa ih unutar transakcije ostane 4…',
        4: '…ROLLBACK poništi sve od BEGIN-a…',
        5: '…pa ih je opet 6. Tako se i u pravoj bazi može bezbjedno isprobati izmjena.',
      } },
    { tip: 'predvidi', jezik: 'sql', setup: BAZA, pitanje: 'Faktura FAK-99 ne postoji. Koliko je plaćeno na FAK-1 na kraju?',
      kod: `BEGIN;
UPDATE fakture SET placeno = placeno - 450 WHERE broj = 'FAK-1';
UPDATE fakture SET placeno = placeno + 450 WHERE broj = 'FAK-99';
ROLLBACK;
SELECT placeno FROM fakture WHERE broj = 'FAK-1';`,
      opcije: ['1200', '750', 'Grešku — FAK-99 ne postoji', 'Ništa'], t: 0,
      obj: 'Drugi UPDATE ne nađe FAK-99 i izmijeni <b>0 redova</b> — za bazu to nije greška! Zato aplikacija provjerava broj izmijenjenih redova i, kad nije 1, radi ROLLBACK — kao funkcija prebaci_uplatu u Temi 4. Poslije ROLLBACK FAK-1 ima opet 1200.' },
    { tip: 'greska', jezik: 'sql', setup: BAZA,
      kod: `UPDATE fakture SET placeno = iznos WHERE broj = 'FAK-2';
COMMIT;`,
      linija: 2, obj: 'COMMIT bez BEGIN: nema otvorene transakcije („cannot commit - no transaction is active“). UPDATE iz linije 1 je već upisan sam za sebe (autocommit), pa COMMIT nema šta da završi.',
      ispravno: `BEGIN;
UPDATE fakture SET placeno = iznos WHERE broj = 'FAK-2';
COMMIT;` },
    { tip: 'tekst', naslov: 'SQL injection: nikad ne lijepi unos u SQL', html: `
      <p>Aplikacija pravi upit od onoga što je korisnik upisao, npr. ime za pretragu. Ako se taj tekst <b>zalijepi</b> u SQL (spajanjem stringova, f-stringom), korisnik može promijeniti značenje upita. Unos <code>x' OR '1'='1</code> zatvori navodnik i doda uslov koji je uvijek tačan.</p>
      <p>Odbrana je uvijek ista: <b>parametri</b>. U upitu stoji <code>?</code> na mjestu vrijednosti, a vrijednosti se bazi šalju <b>odvojeno</b>. Baza ih tretira samo kao podatke, nikad kao SQL — šta god korisnik upisao (Tema 8).</p>` },
    { tip: 'primjer', jezik: 'sql', setup: BAZA, naslov: 'Šta se desi sa zalijepljenim unosom',
      kod: `-- Aplikacija je u upit zalijepila unos korisnika: x' OR '1'='1
SELECT ime, telefon
FROM klijenti
WHERE ime = 'x' OR '1'='1';`,
      obj: {
        1: 'Upit je napravljen kao <code>"… WHERE ime = \'" + unos + "\'"</code>, a korisnik je upisao <code>x\' OR \'1\'=\'1</code>.',
        4: 'Unos je zatvorio navodnik i dodao <code>OR \'1\'=\'1\'</code>, što je uvijek tačno — upit vrati <b>sve</b> klijente. Sa DELETE ili UPDATE šteta bi bila još veća.',
      } },
    { tip: 'primjer', jezik: 'python', bezPokretanja: true, naslov: 'Tvoj kod: parametri u inhome',
      uvod: 'Ovo je <code>inhome/repositories/project_repository.py:87</code> (isti citat kao u Temi 8). Klikni svaku liniju.',
      kod: `cursor = conn.execute(
    'UPDATE projekti SET data=? WHERE id=? AND user_id=?',
    (json.dumps(payload), project_id, user_id),
)`,
      obj: {
        1: '<code>conn.execute(upit, vrijednosti)</code>: upit i vrijednosti idu bazi odvojeno.',
        2: 'Tri <code>?</code> su mjesta za vrijednosti. Tekst upita je uvijek isti, šta god korisnik poslao. <code>AND user_id=?</code> je i autorizacija: mijenjaju se samo projekti prijavljenog korisnika.',
        3: 'Vrijednosti za upitnike, istim redom. Baza ih nikad ne čita kao SQL — nema SQL injectiona.',
      } },
    { tip: 'tekst', naslov: 'Indeks: kazalo u knjizi', html: `
      <p>Da nađe fakture klijenta 2, baza bez indeksa pročita <b>sve</b> redove tabele (<i>full scan</i>). Na šest redova to je trenutno; na milion je sporo. <b>Indeks</b> na koloni je kao kazalo na kraju knjige: baza skoči direktno na tražene redove.</p>
      <p>Cijena: indeks zauzima prostor, a svaki upis mora ažurirati i njega. Zato se pravi za kolone po kojima se <b>često traži</b> (npr. <code>user_id</code>, <code>klijent_id</code>), a ne za sve (Tema 4). <code>EXPLAIN QUERY PLAN</code> pokaže kako bi baza tražila.</p>` },
    { tip: 'primjer', jezik: 'sql', setup: BAZA, naslov: 'Plan upita prije i poslije indeksa',
      kod: `EXPLAIN QUERY PLAN
SELECT * FROM fakture WHERE klijent_id = 2;

CREATE INDEX idx_fakture_klijent ON fakture(klijent_id);

EXPLAIN QUERY PLAN
SELECT * FROM fakture WHERE klijent_id = 2;`,
      obj: {
        1: 'EXPLAIN QUERY PLAN ne vrati podatke, nego plan: kako bi baza izvršila upit ispod.',
        2: 'Rezultat „SCAN fakture“: čitaj sve redove.',
        4: 'Indeks na koloni klijent_id.',
        7: 'Sada „SEARCH fakture USING INDEX …“: baza skače direktno na redove klijenta 2.',
      } },
    { tip: 'popuni', jezik: 'sql', setup: BAZA, pitanje: 'Emir plaća FAK-5 i mijenja broj telefona. Obje izmjene neka prođu zajedno.',
      kod: `___;
UPDATE fakture SET placeno = placeno + 900 WHERE broj = 'FAK-5';
UPDATE klijenti SET telefon = '062 555 112' WHERE id = 2;
___;`,
      odg: [['BEGIN', 'begin', 'BEGIN TRANSACTION', 'begin transaction'], ['COMMIT', 'commit']],
      obj: 'Transakcija počinje sa <code>BEGIN</code>, a izmjene postaju trajne sa <code>COMMIT</code>.' },
    { tip: 'poredaj', jezik: 'sql', setup: BAZA, pitanje: 'Poredaj: probno obriši neplaćene fakture, pogledaj koliko bi ih ostalo, pa poništi i provjeri da je sve kao prije.',
      linije: ['BEGIN;', 'DELETE FROM fakture WHERE placeno = 0;', 'SELECT COUNT(*) AS preostalo FROM fakture;', 'ROLLBACK;', 'SELECT COUNT(*) AS poslije FROM fakture;'],
      obj: 'BEGIN prije izmjene, provjera unutar transakcije, ROLLBACK, pa provjera da je baza opet ista.' },
    { tip: 'zadatak', jezik: 'sql', setup: BAZA, naslov: 'Ispravka uplate u transakciji',
      opis: `<p>Uplata od <b>450 KM</b> je greškom upisana na <code>FAK-1</code>, a pripada <code>FAK-2</code>. U <b>jednoj transakciji</b> umanji <code>placeno</code> na FAK-1 za 450 i povećaj ga na FAK-2 za 450.</p>`,
      pocetak: `-- ispravka uplate
`,
      testovi: [
        { opis: 'FAK-1: plaćeno 750', upit: "SELECT placeno FROM fakture WHERE broj = 'FAK-1'", ocekivano: [[750]] },
        { opis: 'FAK-2: plaćeno 450', upit: "SELECT placeno FROM fakture WHERE broj = 'FAK-2'", ocekivano: [[450]] },
        { opis: 'Ostale fakture nisu dirane', upit: "SELECT broj, placeno FROM fakture WHERE broj NOT IN ('FAK-1', 'FAK-2') ORDER BY broj", ocekivano: [['FAK-3', 1000], ['FAK-4', 8400], ['FAK-5', 0], ['FAK-6', 2600]], redoslijed: true },
        { opis: 'Izmjene su u transakciji (BEGIN … COMMIT)', kodSadrzi: ['\\bBEGIN\\b', '\\bCOMMIT\\b'] },
      ],
      nagovjestaji: ['Počni sa <code>BEGIN;</code> i završi sa <code>COMMIT;</code>.', "Između dva UPDATE-a: <code>SET placeno = placeno - 450 WHERE broj = 'FAK-1'</code>, pa isto sa <code>+ 450</code> za FAK-2."],
      rjesenje: `-- ispravka uplate
BEGIN;
UPDATE fakture SET placeno = placeno - 450 WHERE broj = 'FAK-1';
UPDATE fakture SET placeno = placeno + 450 WHERE broj = 'FAK-2';
COMMIT;`,
      objRj: 'U aplikaciji bi poslije svakog UPDATE-a stajala i provjera da je izmijenjen tačno jedan red, a kod greške ROLLBACK — to u čistom SQL-u ne možeš, pa to radi Python (Tema 4, prebaci_uplatu).' },
    { tip: 'tekst', naslov: 'Završio si SQL osnove 🎉', html: `
      <p>Sad znaš pročitati i napisati: SELECT sa WHERE, ORDER BY i LIMIT; COUNT, SUM i GROUP BY sa HAVING; JOIN i LEFT JOIN; INSERT, UPDATE i DELETE; pravila u bazi; transakcije; parametre protiv SQL injectiona; i kako indeks mijenja plan upita.</p>
      <p><b>Sljedeći koraci:</b></p>
      <ul><li><b>Tema 3 i Tema 4 (baze)</b> sada su potpuno čitljive: normalizacija, JOIN, transakcije, indeksi, N+1 i RLS.</li><li><b>Tema 8 (sigurnost)</b>: SQL injection i autorizacija po <code>user_id</code>.</li><li>Otvori <code>repositories/</code> u inhome i pronađi <code>?</code> u upitima — pitaj tutora da ti objasni jedan upit liniju po liniju.</li></ul>
      <div class="row"><button class="btn primary" data-go="tema:m3">Tema 3: model podataka →</button><button class="btn" data-go="tema:m4">Tema 4: pouzdanost i brzina</button></div>` },
    { tip: 'kviz', p: 'Šta garantuje transakcija (BEGIN … COMMIT)?', o: ['Da je upit brži', 'Da se sve izmjene upišu zajedno, ili nijedna (ROLLBACK)', 'Da nema grešaka u kodu', 'Da se podaci šifruju'], t: 1, e: 'Sve ili ništa — atomarnost (A u ACID).' },
    { tip: 'kviz', p: 'Koja je prava odbrana od SQL injectiona?', o: ['Skrivanje imena tabela', 'Parametri (?): vrijednosti se bazi šalju odvojeno od teksta upita', 'Duža lozinka baze', 'Brisanje navodnika iz unosa'], t: 1, e: 'Brisanje ili „čišćenje“ znakova je krhko i uvijek se nađe zaobilazni put; sa parametrima unos nikad ne postane SQL.' },
  ],
});

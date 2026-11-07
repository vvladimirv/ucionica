// ============================================================================
// Dio 3 · SQL — projekat (poslije lekcija 1–5): izvještaj faktura (JOIN, GROUP BY, HAVING, datumi).
// ============================================================================
LEKCIJE_SQL.push({
  id: 'sql6', projekat: true, naslov: 'Projekat: izvještaj faktura', cilj: 'Sve iz Dijela 3 u jednom izvještaju: fakture po klijentu, dug, dužnici i promet po mjesecima.',
  koraci: [
    { tip: 'tekst', naslov: 'Šta pravimo', html: `
      <p>Na kraju mjeseca treba izvještaj za knjigovođu i za tebe:</p>
      <ol><li>za svakog klijenta: broj faktura i ukupan iznos,</li><li>dug po klijentu, samo oni koji duguju, najveći prvi,</li><li>promet po mjesecima.</li></ol>
      <p>Baza je ista kao u Dijelu 3: <code>klijenti</code>, <code>projekti</code>, <code>fakture</code>. Dug jedne fakture je <code>iznos - placeno</code>.</p>` },
    { tip: 'zadatak', jezik: 'sql', setup: BAZA, naslov: '1. Fakture po klijentu',
      opis: `<p>Napiši upit koji za svakog klijenta koji ima fakture vrati: <code>ime</code>, broj faktura i zbir iznosa. Poredaj po imenu.</p>`,
      pocetak: `SELECT
FROM klijenti
`,
      testovi: [
        { opis: 'Četiri klijenta sa fakturama, po imenu', ocekivano: [['Amra Kovačević', 2, 1650], ['Emir Hodžić', 2, 4100], ['Lejla Mujić', 1, 8400], ['Selma Begić', 1, 2600]], redoslijed: true },
        { opis: 'Koristi JOIN i GROUP BY', kodSadrzi: ['join', 'group\\s+by'] },
      ],
      nagovjestaji: ['Spoji tabele: <code>FROM klijenti k JOIN fakture f ON f.klijent_id = k.id</code>.', 'Kolone: <code>k.ime, COUNT(*), SUM(f.iznos)</code>, pa <code>GROUP BY k.id</code> i <code>ORDER BY k.ime</code>.'],
      rjesenje: `SELECT k.ime, COUNT(*), SUM(f.iznos)
FROM klijenti k
JOIN fakture f ON f.klijent_id = k.id
GROUP BY k.id
ORDER BY k.ime;`,
      objRj: 'JOIN spoji svaku fakturu sa njenim klijentom, a GROUP BY skupi redove jednog klijenta u jedan. Tarik nema faktura, pa ga JOIN ne vrati (za njega bi trebao LEFT JOIN).' },
    { tip: 'zadatak', jezik: 'sql', setup: BAZA, naslov: '2. Dužnici',
      opis: `<p>Sada izvještaj dužnika: <code>ime</code>, <code>telefon</code> i ukupan dug (zbir <code>iznos - placeno</code>). Samo klijenti čiji je dug veći od 0, najveći dug prvi.</p>`,
      pocetak: `SELECT k.ime, k.telefon
FROM klijenti k
JOIN fakture f ON f.klijent_id = k.id
GROUP BY k.id
`,
      testovi: [
        { opis: 'Emir (3100) pa Amra (450)', ocekivano: [['Emir Hodžić', '062 555 111', 3100], ['Amra Kovačević', '061 123 456', 450]], redoslijed: true },
        { opis: 'Uslov na zbiru je u HAVING', kodSadrzi: ['having'] },
      ],
      nagovjestaji: ['Dug: dodaj kolonu <code>SUM(f.iznos - f.placeno) AS dug</code>.', 'Uslov na zbiru ide poslije GROUP BY: <code>HAVING dug &gt; 0</code>, pa <code>ORDER BY dug DESC</code>.'],
      rjesenje: `SELECT k.ime, k.telefon, SUM(f.iznos - f.placeno) AS dug
FROM klijenti k
JOIN fakture f ON f.klijent_id = k.id
GROUP BY k.id
HAVING dug > 0
ORDER BY dug DESC;`,
      objRj: 'WHERE filtrira pojedinačne fakture prije grupisanja; HAVING filtrira grupe poslije, pa tek on vidi zbir. U PostgreSQL-u u HAVING ponovi izraz (HAVING SUM(f.iznos - f.placeno) > 0), jer tamo ime kolone iz SELECT-a ne važi u HAVING.' },
    { tip: 'poredajPopuni', jezik: 'sql', setup: BAZA, naslov: '3. Promet po mjesecima',
      pitanje: 'Upit treba da vrati zbir faktura po mjesecu. <code>strftime(\'%Y-%m\', datum)</code> od datuma <code>2026-07-15</code> napravi <code>2026-07</code>. Poredaj dijelove upita i upiši po čemu se grupiše.',
      linije: [
        "SELECT strftime('%Y-%m', datum) AS mjesec, SUM(iznos)",
        'FROM fakture',
        'GROUP BY ___',
        'ORDER BY mjesec;',
      ],
      odg: [['mjesec', "strftime('%Y-%m', datum)"]],
      obj: 'Dijelovi upita imaju stalan redoslijed: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY. strftime je funkcija SQLite-a; u PostgreSQL-u isto radi to_char(datum, \'YYYY-MM\') ili date_trunc(\'month\', datum).' },
    { tip: 'predvidi', jezik: 'sql', setup: BAZA, naslov: '4. Provjeri izvještaj',
      pitanje: 'Prije nego izvještaj pošalješ knjigovođi, provjeri jedan broj. Koliko je ukupno nenaplaćeno?',
      kod: `SELECT SUM(iznos - placeno) FROM fakture;`,
      opcije: ['3550', '3100', '16750'], t: 0,
      obj: 'Dug Emira (3100) i Amre (450) je 3550; ostale fakture su plaćene. Zbir mora odgovarati izvještaju dužnika: to je brza provjera da upit nije izgubio ni udvostručio redove.' },
    { tip: 'kviz', naslov: 'WHERE ili HAVING', p: 'Treba ti dug samo za fakture iz 2026. godine, po klijentu. Gdje ide uslov na datum?', o: ['U HAVING, jer je izvještaj grupisan', 'U WHERE, jer se odnosi na pojedinačne fakture, prije grupisanja', 'U ORDER BY', 'Svejedno'], t: 1, e: "Uslov na redove (datum fakture) ide u WHERE: WHERE f.datum >= '2026-01-01'. HAVING je za uslove na zbir grupe, kao dug > 0." },
  ],
});

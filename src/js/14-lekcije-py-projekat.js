// ============================================================================
// Dio 1 · Python — projekat (poslije lekcija 1–9): obračun ponude za namještaj po mjeri.
// Svaki zadatak dobija rješenje prethodnog kao početak (skela), pa se program gradi korak po korak.
// ============================================================================
LEKCIJE_PY.push({
  id: 'py10', projekat: true, naslov: 'Projekat: ponuda za namještaj', cilj: 'Sve iz Dijela 1 u jednom malom programu: cijena elemenata, zbir, popust, PDV i tekst ponude, funkciju po funkciju.',
  koraci: [
    { tip: 'tekst', naslov: 'Šta pravimo', html: `
      <p>Klijentica naručuje kuhinju: gornje i donje elemente po mjeri. Program treba da izračuna ponudu:</p>
      <ol><li>cijenu jednog elementa iz širine, visine i cijene po kvadratnom metru,</li><li>zbir svih stavki,</li><li>popust i PDV,</li><li>tekst ponude, red po red.</li></ol>
      <p>Svaki dio je posebna funkcija. Tako se svaka može provjeriti testom, a agentu kasnije možeš reći tačno koju da promijeni. Svaki sljedeći zadatak već sadrži rješenja prethodnih.</p>
      <div class="note">Ovo je projekat: nema novih pojmova, samo spajanje onoga što znaš (funkcije, liste, rječnici, petlje, if, f-stringovi).</div>` },
    { tip: 'zadatak', naslov: '1. Cijena jednog elementa',
      opis: `<p>Napiši funkciju <code>cijena_elementa(sirina_cm, visina_cm, cijena_m2)</code> koja vraća cijenu elementa u KM, zaokruženu na 2 decimale.</p><p>Površina u m² je <code>sirina_cm / 100 * visina_cm / 100</code>. Primjer: element 80 × 70 cm po 250 KM/m² košta <code>140.0</code>.</p>`,
      pocetak: `def cijena_elementa(sirina_cm, visina_cm, cijena_m2):
    pass

print(cijena_elementa(80, 70, 250))
`,
      testovi: [
        { opis: '80 × 70 cm po 250 KM/m² → 140.0', kod: 'assert cijena_elementa(80, 70, 250) == 140.0, f"Vratilo je {cijena_elementa(80, 70, 250)!r}"' },
        { opis: '60 × 72 cm po 310 KM/m² → 133.92', kod: 'assert cijena_elementa(60, 72, 310) == 133.92, f"Vratilo je {cijena_elementa(60, 72, 310)!r}"' },
        { opis: 'Ispis 140.0', kod: 'assert IZLAZ.strip() == "140.0", f"Ispisano je {IZLAZ.strip()!r}"' },
      ],
      nagovjestaji: ['Prvo površina: <code>povrsina = sirina_cm / 100 * visina_cm / 100</code>.', 'Pa <code>return round(povrsina * cijena_m2, 2)</code>.'],
      rjesenje: `def cijena_elementa(sirina_cm, visina_cm, cijena_m2):
    povrsina = sirina_cm / 100 * visina_cm / 100
    return round(povrsina * cijena_m2, 2)

print(cijena_elementa(80, 70, 250))`,
      objRj: 'Dijeljenje sa 100 pretvara centimetre u metre. round(…, 2) uklanja sitne ostatke koje računar ostavi pri radu sa decimalama.' },
    { tip: 'poredajPopuni', naslov: '2. Zbir stavki',
      pitanje: 'Funkcija <code>ukupno(stavke)</code> sabira cijenu puta količinu za svaku stavku. Poredaj linije i upiši ključ koji fali.',
      linije: [
        'def ukupno(stavke):',
        '    zbir = 0',
        '    for s in stavke:',
        '        zbir = zbir + s["___"] * s["kolicina"]',
        '    return zbir',
        'print(ukupno([{"cijena": 250, "kolicina": 2}, {"cijena": 100, "kolicina": 1}]))',
      ],
      odg: [['cijena']],
      obj: 'zbir mora postojati prije petlje, a return dolazi poslije nje (uvučen kao petlja, ne kao njeno tijelo). 250 × 2 + 100 × 1 = 600.' },
    { tip: 'zadatak', naslov: '3. Popust i PDV',
      opis: `<p>Dopiši dvije funkcije:</p><ul><li><code>sa_popustom(iznos, popust_posto)</code> → iznos umanjen za procenat, npr. <code>sa_popustom(1000, 10)</code> je <code>900.0</code></li><li><code>sa_pdv(iznos)</code> → iznos uvećan za PDV od 17 % (stopa u BiH), zaokružen na 2 decimale, npr. <code>sa_pdv(900)</code> je <code>1053.0</code></li></ul>`,
      pocetak: `PDV = 0.17

def ukupno(stavke):
    zbir = 0
    for s in stavke:
        zbir = zbir + s["cijena"] * s["kolicina"]
    return zbir

def sa_popustom(iznos, popust_posto):
    pass

def sa_pdv(iznos):
    pass
`,
      testovi: [
        { opis: 'sa_popustom(1000, 10) → 900.0', kod: 'assert sa_popustom(1000, 10) == 900.0, f"Vratilo je {sa_popustom(1000, 10)!r}"' },
        { opis: 'sa_popustom(1250, 0) → 1250', kod: 'assert sa_popustom(1250, 0) == 1250, f"Vratilo je {sa_popustom(1250, 0)!r}"' },
        { opis: 'sa_pdv(900) → 1053.0', kod: 'assert sa_pdv(900) == 1053.0, f"Vratilo je {sa_pdv(900)!r}"' },
        { opis: 'sa_pdv(1125) → 1316.25 (zaokruženo)', kod: 'assert sa_pdv(1125) == 1316.25, f"Vratilo je {sa_pdv(1125)!r}"' },
        { opis: 'sa_pdv koristi PDV, ne broj napisan rukom', kod: 'assert "PDV" in KOD.split("def sa_pdv")[1], "u funkciji sa_pdv koristi konstantu PDV"' },
      ],
      nagovjestaji: ['Popust: <code>return iznos * (1 - popust_posto / 100)</code>.', 'PDV: <code>return round(iznos * (1 + PDV), 2)</code>.'],
      rjesenje: `PDV = 0.17

def ukupno(stavke):
    zbir = 0
    for s in stavke:
        zbir = zbir + s["cijena"] * s["kolicina"]
    return zbir

def sa_popustom(iznos, popust_posto):
    return iznos * (1 - popust_posto / 100)

def sa_pdv(iznos):
    return round(iznos * (1 + PDV), 2)`,
      objRj: 'Stopa PDV-a je na jednom mjestu (PDV = 0.17). Ako se promijeni, mijenjaš jednu liniju, a ne tražiš broj 1.17 po cijelom programu.' },
    { tip: 'zadatak', naslov: '4. Tekst ponude',
      opis: `<p>Napiši <code>ponuda(klijent, stavke, popust_posto)</code> koja vraća <b>listu redova</b> ponude. Za Amru, stavke iz početnog koda i popust 10 % redovi su:</p>
<pre>Ponuda za: Amra Kovačević
Ukupno: 1250.00 KM
Popust 10%: -125.00 KM
Za platiti sa PDV: 1316.25 KM</pre>
<p>Iznosi uvijek sa 2 decimale: <code>f"{iznos:.2f}"</code>. Koristi funkcije iz prethodnih koraka.</p>`,
      pocetak: `PDV = 0.17

def ukupno(stavke):
    zbir = 0
    for s in stavke:
        zbir = zbir + s["cijena"] * s["kolicina"]
    return zbir

def sa_popustom(iznos, popust_posto):
    return iznos * (1 - popust_posto / 100)

def sa_pdv(iznos):
    return round(iznos * (1 + PDV), 2)

def ponuda(klijent, stavke, popust_posto):
    pass

stavke = [
    {"naziv": "Donji element", "cijena": 350, "kolicina": 3},
    {"naziv": "Gornji element", "cijena": 200, "kolicina": 1},
]
for red in ponuda("Amra Kovačević", stavke, 10) or []:
    print(red)
`,
      testovi: [
        { opis: 'Četiri reda za Amrinu ponudu', kod: 'r = ponuda("Amra Kovačević", stavke, 10)\nassert r == ["Ponuda za: Amra Kovačević", "Ukupno: 1250.00 KM", "Popust 10%: -125.00 KM", "Za platiti sa PDV: 1316.25 KM"], f"Vratilo je {r!r}"' },
        { opis: 'Bez popusta: popust je 0.00 KM', kod: 'r = ponuda("Emir", [{"naziv": "Sto", "cijena": 100, "kolicina": 2}], 0)\nassert r == ["Ponuda za: Emir", "Ukupno: 200.00 KM", "Popust 0%: -0.00 KM", "Za platiti sa PDV: 234.00 KM"], f"Vratilo je {r!r}"' },
        { opis: 'Koristi ukupno() i sa_pdv() (ne računa ponovo)', kod: 'tijelo = KOD.split("def ponuda")[1]\nassert "ukupno(" in tijelo and "sa_pdv(" in tijelo, "u funkciji ponuda pozovi ukupno(...) i sa_pdv(...)"' },
      ],
      nagovjestaji: ['Prvo izračunaj: <code>osnovica = ukupno(stavke)</code>, <code>nakon = sa_popustom(osnovica, popust_posto)</code>, <code>popust = osnovica - nakon</code>.', 'Vrati listu od 4 f-stringa, npr. <code>f"Ukupno: {osnovica:.2f} KM"</code> i <code>f"Popust {popust_posto}%: -{popust:.2f} KM"</code>.'],
      rjesenje: `PDV = 0.17

def ukupno(stavke):
    zbir = 0
    for s in stavke:
        zbir = zbir + s["cijena"] * s["kolicina"]
    return zbir

def sa_popustom(iznos, popust_posto):
    return iznos * (1 - popust_posto / 100)

def sa_pdv(iznos):
    return round(iznos * (1 + PDV), 2)

def ponuda(klijent, stavke, popust_posto):
    osnovica = ukupno(stavke)
    nakon = sa_popustom(osnovica, popust_posto)
    popust = osnovica - nakon
    return [
        f"Ponuda za: {klijent}",
        f"Ukupno: {osnovica:.2f} KM",
        f"Popust {popust_posto}%: -{popust:.2f} KM",
        f"Za platiti sa PDV: {sa_pdv(nakon):.2f} KM",
    ]

stavke = [
    {"naziv": "Donji element", "cijena": 350, "kolicina": 3},
    {"naziv": "Gornji element", "cijena": 200, "kolicina": 1},
]
for red in ponuda("Amra Kovačević", stavke, 10) or []:
    print(red)`,
      objRj: 'ponuda() ne zna kako se računa PDV, samo poziva sa_pdv(). Kad agentu kažeš „promijeni zaokruživanje PDV-a“, mijenja se jedna mala funkcija, a testovi pokažu da ponuda i dalje radi.' },
    { tip: 'kviz', naslov: 'Zašto funkcije', p: 'Zašto je ponuda podijeljena na ukupno, sa_popustom, sa_pdv i ponuda, umjesto jedne velike funkcije?', o: ['Zato što Python ne dozvoljava duge funkcije', 'Svaku malu funkciju možeš posebno testirati i promijeniti, a da ne diraš ostale', 'Zato što je tako brže za računar', 'Nema razlike'], t: 1, e: 'Male funkcije sa jednim poslom se lako testiraju i lako opisuju agentu: „u sa_pdv promijeni…“. Isti princip je u temi 5 (arhitektura koda).' },
  ],
});

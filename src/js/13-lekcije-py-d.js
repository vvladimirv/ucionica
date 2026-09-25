// ============================================================================
// Dio 1 · Python od nule — lekcija 9 (moduli, dekoratori, čitanje stvarne Flask rute).
// ============================================================================
LEKCIJE_PY.push({
  id: 'py9', naslov: 'Čitanje stvarnog koda', cilj: 'import, dekoratori (@) i cijela Flask ruta iz inhome — liniju po liniju. Završna lekcija Python dijela.',
  koraci: [
    { tip: 'tekst', naslov: 'Kod je podijeljen u fajlove', html: `
      <p>Veliki programi nisu u jednom fajlu. Svaki <code>.py</code> fajl je <b>modul</b>, a <code>import</code> uvozi ono što je napisano u drugom modulu ili u <b>biblioteci</b> (tuđem gotovom kodu, npr. Flask).</p>
      <ul><li><code>import math</code> — uvezi cijeli modul, koristi kao <code>math.ceil(...)</code></li><li><code>from datetime import date</code> — uvezi samo jednu stvar, koristi direktno kao <code>date(...)</code></li></ul>
      <p>Na vrhu svakog tvog fajla ima desetak import linija — sad znaš šta znače.</p>` },
    { tip: 'primjer', naslov: 'import',
      kod: `import math
from datetime import date

print(math.ceil(4.2))
danas = date(2026, 9, 24)
print(danas.year)
print(danas.strftime("%d.%m.%Y"))`,
      obj: {
        1: 'Uvoz modula <code>math</code> (matematika) iz standardne biblioteke — dolazi uz Python.',
        2: 'Iz modula <code>datetime</code> uvozi se samo klasa <code>date</code>.',
        4: '<code>ceil</code> zaokruži naviše: 5. Npr. „koliko ploča treba za 4.2 m²“.',
        5: 'Objekat datuma (sjećaš se klasa?).',
        7: 'Metoda koja formatira datum kako je navikao čovjek: 24.09.2026.',
      } },
    { tip: 'tekst', naslov: 'Dekorator: @ iznad funkcije', html: `
      <p>U tvojim rutama iznad funkcija stoji <code>@core_bp.route(...)</code> i <code>@jwt_required()</code>. To su <b>dekoratori</b>: funkcije koje <b>omotaju</b> tvoju funkciju i dodaju joj ponašanje, bez mijenjanja njenog koda.</p>
      <p>Analogija: portir na ulazu u zgradu. Stan (tvoja funkcija) se ne mijenja, ali prije ulaska portir provjeri ličnu kartu. <code>@jwt_required()</code> je upravo takav portir: ako nema važeće prijave, odmah vrati 401 i tvoja funkcija se <b>uopšte ne pokrene</b>.</p>
      <p><code>@route</code> je drugačiji dekorator: on <b>prijavi</b> funkciju Flasku pod određenim URL-om, da Flask zna koju funkciju da pozove kad stigne zahtjev.</p>` },
    { tip: 'primjer', naslov: 'Svoj dekorator (pojednostavljen portir)',
      kod: `def samo_prijavljeni(funkcija):
    def omotac(korisnik):
        if korisnik is None:
            return "401: prijavi se"
        return funkcija(korisnik)
    return omotac

@samo_prijavljeni
def lista_klijenata(korisnik):
    return f"Klijenti za {korisnik}"

print(lista_klijenata("Amra"))
print(lista_klijenata(None))`,
      obj: {
        1: 'Dekorator je funkcija koja <b>prima funkciju</b> (u Pythonu se i funkcije mogu predavati kao vrijednosti).',
        2: 'Unutra se pravi nova funkcija — omotač — koja će se zvati umjesto originala.',
        3: 'Portir: nema korisnika?',
        4: '…odmah vrati odgovor, original se ne poziva.',
        5: 'Inače pozovi originalnu funkciju.',
        8: '<code>@samo_prijavljeni</code> iznad funkcije znači: <code>lista_klijenata = samo_prijavljeni(lista_klijenata)</code>.',
        13: 'Bez korisnika dobije se 401 — tijelo <code>lista_klijenata</code> nije ni pokrenuto.',
      },
      poslije: 'Ne moraš znati pisati dekoratore. Dovoljno je znati šta rade kad ih vidiš iznad funkcije.' },
    { tip: 'primjer', naslov: 'Stvarna ruta iz inhome', bezPokretanja: true,
      uvod: 'Ovo je <code>core_data_routes.py</code> iz tvog projekta (skraćeno). Klikni svaku liniju — sada razumiješ svaki dio.',
      kod: `@core_bp.route('/api/klijenti', methods=['POST'])
@jwt_required()
def create_klijent():
    uid = _uid()
    data = request.json or {}
    name = (data.get('name') or '').strip()
    if not name:
        return jsonify({'error': 'name required'}), 400
    kid = _db.create_klijent(uid, name)
    return jsonify(_db.get_klijent(uid, kid)), 201`,
      obj: {
        1: 'Dekorator koji prijavi funkciju: kad stigne <b>POST</b> zahtjev na <code>/api/klijenti</code>, Flask pozove funkciju ispod. <code>methods</code> je lista (lekcija 4).',
        2: 'Portir: provjeri JWT prijavu. Bez nje → 401 i ništa ispod se ne izvrši.',
        3: 'Obična funkcija (lekcija 6), bez parametara — podatke uzima iz zahtjeva.',
        4: 'Pomoćna funkcija vrati id prijavljenog korisnika (user id). Koristi se da svako vidi samo svoje klijente.',
        5: '<code>request.json</code> je rječnik iz tijela zahtjeva (lekcija 5); <code>or {}</code> štiti od praznog zahtjeva.',
        6: 'Sigurno čitanje imena: <code>.get</code> + <code>or \'\'</code> + <code>.strip()</code> — uvijek dobiješ tekst.',
        7: '<code>not name</code> je True kad je tekst prazan (prazan tekst se ponaša kao False).',
        8: 'Validacija: vrati JSON greške i <b>status kod 400</b> (loš zahtjev). Funkcija ovdje završava.',
        9: 'Poziv funkcije iz drugog modula (<code>_db</code>) koja upiše klijenta u bazu i vrati njegov novi id.',
        10: 'Odgovor: podaci novog klijenta kao JSON i <b>201</b> (kreirano). Funkcija vraća <b>dvije</b> vrijednosti odjednom — (odgovor, kod).',
      } },
    { tip: 'kviz', p: 'Šta se desi ako neko pošalje zahtjev bez prijave?', o: ['Klijent se napravi bez imena', 'jwt_required vrati 401 i create_klijent se uopšte ne pokrene', 'Vrati se 400', 'Server padne'], t: 1, e: 'Dekorator je portir: tijelo funkcije se ne izvršava.' },
    { tip: 'kviz', p: 'Pošalje se {"name": "   "} (samo razmaci). Šta vrati ruta?', o: ['201 i klijent "   "', '400 sa greškom name required', '401', '500'], t: 1, e: '.strip() ukloni razmake, ostane prazan tekst, not name je True → 400.' },
    { tip: 'poredaj', pitanje: 'Poredaj dijelove rute ispravnim redom.',
      linije: ["@core_bp.route('/api/klijenti', methods=['POST'])", '@jwt_required()', 'def create_klijent():', '    data = request.json or {}', "    name = (data.get('name') or '').strip()", '    if not name:', "        return jsonify({'error': 'name required'}), 400", '    return jsonify({"name": name}), 201'],
      obj: 'Dekoratori iznad def-a, pa čitanje podataka, pa validacija (koja može ranije završiti), pa uspješan odgovor.', pokreni: false },
    { tip: 'zadatak', naslov: 'Završni zadatak: ruta bez Flaska',
      opis: `<p>Napiši funkciju <code>napravi_klijenta(data)</code> koja radi isto što i ruta iznad, ali bez Flaska — prima rječnik i <b>vraća par</b> (odgovor, status):</p><ul><li>ako <code>data</code> nema ime ili je ime prazno/samo razmaci → vrati <code>({"error": "name required"}, 400)</code></li><li>inače → vrati <code>({"id": 1, "name": ime_bez_razmaka}, 201)</code></li></ul><p class="small muted">Par se vraća ovako: <code>return {"error": "…"}, 400</code>. <code>data</code> može biti i <code>None</code>.</p>`,
      pocetak: `def napravi_klijenta(data):
    pass
`,
      testovi: [
        { opis: 'Ispravno ime → 201 i ime bez razmaka', kod: 'assert napravi_klijenta({"name": "  Amra "}) == ({"id": 1, "name": "Amra"}, 201), f"Vratilo je {napravi_klijenta({\'name\': \'  Amra \'})!r}"' },
        { opis: 'Prazno ime → 400', kod: 'assert napravi_klijenta({"name": "   "}) == ({"error": "name required"}, 400), f"Vratilo je {napravi_klijenta({\'name\': \'   \'})!r}"' },
        { opis: 'Nema polja name → 400', kod: 'assert napravi_klijenta({"phone": "061"}) == ({"error": "name required"}, 400)' },
        { opis: 'data je None → 400 (ne pada)', kod: 'assert napravi_klijenta(None) == ({"error": "name required"}, 400), "Za None treba 400, bez greške"' },
      ],
      nagovjestaji: ['Prva linija: <code>data = data or {}</code> — tako None postane prazan rječnik.', 'Ime: <code>ime = (data.get("name") or "").strip()</code>.', '<code>if not ime: return {"error": "name required"}, 400</code>, a na kraju <code>return {"id": 1, "name": ime}, 201</code>.'],
      rjesenje: `def napravi_klijenta(data):
    data = data or {}
    ime = (data.get("name") or "").strip()
    if not ime:
        return {"error": "name required"}, 400
    return {"id": 1, "name": ime}, 201`,
      objRj: 'Upravo si izdvojio <b>poslovnu logiku</b> iz rute u čistu funkciju koja se testira bez servera. To je ideja slojeva iz Teme 5 (Arhitektura koda).' },
    { tip: 'tekst', naslov: 'Završio si Python osnove 🎉', html: `
      <p>Sad znaš pročitati i napisati: varijable i tipove, if/elif/else, liste i petlje, rječnike, funkcije, greške, klase i Decimal, import i dekoratore — i razumiješ stvarnu rutu iz svog projekta.</p>
      <p><b>Sljedeći koraci:</b></p>
      <ul><li><b>Dio 4 · Teme</b> sada će biti mnogo jasniji: preporuka je <b>Tema 0 (put jednog klika)</b> i <b>Tema 5 (arhitektura)</b>.</li><li>Dio 2 (JavaScript) i Dio 3 (SQL) stižu kao sljedeće faze u istom obliku.</li><li>Otvori bilo koji fajl iz inhome ili Sole-KP, kopiraj funkciju i pitaj tutora da ti je objasni liniju po liniju.</li></ul>
      <div class="row"><button class="btn primary" data-go="tema:m0">Tema 0: put jednog klika →</button><button class="btn" data-go="tema:m5">Tema 5: arhitektura koda</button></div>` },
  ],
});


// ============================================================================
// Dio 5 · Rad sa AI agentima — lekcije 1–2 (kako agent radi, dobar zahtjev).
// Cilj cijele učionice: sve iz dijelova 1–4 služi da agentu daješ precizne zahtjeve i provjeriš rezultat.
// jezik 'tekst' = napisan tekst (testovi u 04-izvrsavanje-tekst.js), 'diff' = prikaz izmjena.
// U kodu lekcija: ` piši kao \`,   ${ kao \${,   a \ kao \\ (u regexima testova \\ postaje \).
// ============================================================================
const LEKCIJE_AG = [];

LEKCIJE_AG.push({
  id: 'ag1', naslov: 'Kako agent radi', cilj: 'Šta se dešava između tvog zahtjeva i agentovog „gotovo“: petlja alata, kontekst, pamćenje i dozvole.',
  koraci: [
    { tip: 'tekst', naslov: 'Agent = model + alati + petlja', html: `
      <p>Kad u Claude Code ili Codexu napišeš zahtjev, ne odgovara ti „chat“, nego <b>agent</b>: jezički model koji smije koristiti <b>alate</b> i koji radi u <b>petlji</b> dok ne završi.</p>
      <ul><li><b>Alati za čitanje:</b> <code>Read</code> (pročitaj fajl), <code>Grep</code> (traži tekst u svim fajlovima), <code>Glob</code> (nađi fajlove po imenu).</li>
      <li><b>Alati za mijenjanje:</b> <code>Edit</code> (izmijeni dio fajla), <code>Write</code> (napiši cijeli fajl).</li>
      <li><b>Komande:</b> <code>Bash</code> / <code>PowerShell</code> — pokreće <code>npm run test:fast</code>, <code>pytest</code>, <code>git</code>…</li></ul>
      <p>Model sam ne „zna“ tvoj projekat. Sve što zna o njemu, zna jer je to <b>pročitao alatom u ovoj sesiji</b> ili jer mu je neko to ubacio (CLAUDE.md, hook).</p>
      <div class="analogy"><b>Analogija:</b> agent je izvrstan majstor koji svako jutro dođe bez sjećanja na jučer. Plan na zidu (STATUS.md), pravila na vratima (CLAUDE.md) i libela koja sama pišti (hookovi, testovi) rade više od dužih uputstava usmeno.</div>` },
    { tip: 'tekst', naslov: 'Petlja: čitaj → uradi → provjeri', html: `
      <div class="flow">
        <div class="box lc"><span class="k">1 · ti</span><b>zahtjev</b><span>simptom, cilj, gotovo kad</span></div><span class="arrow">→</span>
        <div class="box lnet"><span class="k">2 · model</span><b>odluči</b><span>koji alat sada?</span></div><span class="arrow">→</span>
        <div class="box ls"><span class="k">3 · alat</span><b>Read / Edit / Bash</b><span>stvarno se izvrši</span></div><span class="arrow">→</span>
        <div class="box ld"><span class="k">4 · rezultat</span><b>vraća se modelu</b><span>sadržaj fajla, izlaz testa</span></div></div>
      <p>Koraci 2–4 se ponavljaju: model pročita rezultat, odluči sljedeći alat, i tako dok ne misli da je gotovo. Jedan tvoj zahtjev često znači 10–40 poziva alata.</p>
      <p>Zato su <b>testovi</b> toliko važni: ako agent u petlji pokrene test i vidi crveno, sam nastavi popravljati. Bez testa, jedini „test“ je njegovo mišljenje da je dobro.</p>` },
    { tip: 'poredaj', jezik: 'tekst', pokreni: false, pitanje: 'Zahtjev je: „Dodaj polje email klijentu“. Poredaj korake onako kako ih dobar agent radi.',
      linije: [
        'Pročita CLAUDE.md i AGENTS.md (pravila projekta)',
        'Grep: traži gdje se pravi klijent (POST /api/klijenti)',
        'Read: pročita pronađene fajlove',
        'Edit: doda polje u rutu, bazu i formu',
        'Bash: pokrene npm run test:fast',
        'Test pao: pročita grešku i popravi',
        'Testovi zeleni: javi šta je uradio i kako provjeriti',
      ],
      obj: 'Prvo pravila, pa traženje, pa čitanje — tek onda izmjena. Provjera ide poslije svake izmjene, a „gotovo“ tek kad je zeleno. Kad agent mijenja kod koji nije pročitao, to je znak da zahtjev nije bio jasan.' },
    { tip: 'primjer', jezik: 'tekst', bezPokretanja: true, naslov: 'Kako izgleda jedna sesija',
      uvod: 'Skraćen zapis stvarne vrste sesije. Klikni na linije sa tačkicom.',
      kod: `> Brisanje fakture vraća 500 (DELETE /api/fakture/15). Nađi uzrok.
● Read(AGENTS.md)
● Grep("fakture/<", core_data_routes.py)
● Read(core_data_routes.py, linije 1180–1230)
● Bash(pytest tests/test_fakture.py -k brisanje)
  ✗ 1 failed: IntegrityError: FOREIGN KEY constraint failed
● Edit(core_data_routes.py): prvo obriši stavke, pa fakturu, u transakciji
● Bash(pytest tests/test_fakture.py -k brisanje)
  ✓ 1 passed
Uzrok: faktura ima stavke (strani ključ), a ruta je brisala samo fakturu.`,
      obj: {
        1: 'Tvoj zahtjev: simptom (500) i tačno mjesto (metoda i ruta). Agent ne mora pogađati.',
        2: 'Prvo pravila projekta. Claude Code CLAUDE.md učita sam na početku; ovdje agent čita i AGENTS.md.',
        3: 'Grep traži tekst kroz sve fajlove — tako agent nađe gdje je ruta, bez čitanja cijelog projekta.',
        5: 'Prije izmjene pokrene test koji pokazuje problem. Crveni test je dokaz da je uzrok nađen.',
        6: 'Greška iz baze: strani ključ (Dio 3, lekcija SQL 4). Kad znaš taj pojam, razumiješ i agentov izvještaj.',
        7: 'Izmjena tek kad je uzrok jasan. Transakcija (SQL 5): sve ili ništa.',
        9: 'Isti test sada prolazi — to je dokaz, ne agentovo mišljenje.',
      } },
    { tip: 'tekst', naslov: 'Kontekst: šta agent „vidi“', html: `
      <p><b>Kontekst</b> (<i>context window</i>) je sve što agent u jednom trenutku ima pred sobom: tvoje poruke, pročitane fajlove, izlaze komandi. Kontekst je <b>ograničen</b>.</p>
      <ul><li>Dugi izlazi (500 linija testova) ga brzo pune. Zato inhome ima subagenta <code>tester</code>: on pokrene testove i vrati samo kratak izvještaj.</li>
      <li>Kad se kontekst napuni, stari dio se <b>sažme</b> i detalji se gube. Duga sesija sa mnogo tema radi lošije od kratke sa jednom temom.</li>
      <li><b>Nova sesija počinje prazna.</b> Ništa iz jučerašnjeg razgovora ne postoji, osim onoga što je zapisano u fajlovima (CLAUDE.md, STATUS.md, git historija).</li></ul>
      <p class="note">Pravilo: jedna sesija = jedan zadatak. Kad završiš, snimi stanje (commit, STATUS) i počni novu sesiju.</p>` },
    { tip: 'predvidi', jezik: 'tekst', bezPokretanja: true, pitanje: 'Šta agent u drugoj sesiji zna o CACHE pravilu?',
      kod: `Sesija 1 (juče):
  ti: „Kad mijenjaš static/, uvijek podigni CACHE u sw.js.“
  agent: „Razumijem, zapamtiću.“

Sesija 2 (danas, nova sesija):
  ti: „Promijeni boju dugmeta u static/css/app.css.“`,
      opcije: ['Zna — rekao je „zapamtiću“', 'Ne zna — osim ako pravilo piše u CLAUDE.md/AGENTS.md ili ga hook radi sam', 'Zna, jer je isti projekat', 'Zna, jer vidi jučerašnji commit'], t: 1,
      obj: 'Agent nema pamćenje između sesija; „zapamtiću“ važi samo do kraja razgovora. Pravilo mora biti zapisano (CLAUDE.md) ili, još bolje, izvršeno automatski (hook sw-stamp u inhome). Upravo zato je to pravilo u inhome postalo hook.' },
    { tip: 'tekst', naslov: 'Dozvole: šta agent smije bez pitanja', html: `
      <p>Agent pita prije rizičnih radnji, a ti biraš koliko slobode ima:</p>
      <ul><li><b>Pitaj za sve</b> — sigurno, ali sporo.</li><li><b>Dozvoljene komande</b> — lista u <code>.claude/settings.json</code> (<code>permissions.allow</code>): npr. <code>npm run test:fast</code> bez pitanja.</li><li><b>Plan mode</b> — agent samo čita i pravi plan; ništa ne mijenja dok ne odobriš.</li></ul>
      <p>Tvoj project-guard dodaje granice koje važe uvijek: agent ne čita <code>.env</code> (tajne) i ne povećava fajl preko 500 linija. To su <b>hookovi</b> (lekcija 4).</p>
      <p class="small muted">Iz inhome: lista dozvola je rasla „jedno odobrenje po jedno“ i nosi stare putanje. Povremeno je očisti — svaka stavka je vrata koja su stalno otvorena.</p>` },
    { tip: 'kviz', p: 'Koji poziv alata je najrizičniji?', o: ['Read(app.py)', 'Grep("klijent")', 'Bash(git push --force)', 'Glob("**/*.test.js")'], t: 2, e: 'Čitanje ne mijenja ništa. Komanda koja prepisuje historiju na GitHubu ne može se lako vratiti — to agent nikad ne radi bez tvog izričitog „da“.' },
    { tip: 'kviz', p: 'Agent kaže „Gotovo, sve radi“. Šta je dokaz?', o: ['To što je agent siguran', 'Izlaz testova (npr. test:fast zelen) i diff koji si pregledao', 'Dugačak odgovor', 'To što nije bilo grešaka u razgovoru'], t: 1, e: 'Dokaz je ono što mašina provjeri i što možeš pogledati. Lekcija 5 je cijela o tome.' },
    { tip: 'kviz', p: 'Zašto jedna sesija za jedan zadatak?', o: ['Jer je jeftinije', 'Jer se kontekst puni i stari detalji se sažimaju; kratka sesija sa jednom temom radi preciznije', 'Jer agent ne smije raditi dugo', 'Nema razloga'], t: 1, e: 'Kontekst je ograničen. Zapiši stanje (commit, STATUS) i počni svježe.' },
  ],
});

LEKCIJE_AG.push({
  id: 'ag2', naslov: 'Dobar zahtjev agentu', cilj: 'Pet dijelova preciznog zahtjeva: simptom, gdje, dokaz, granice i definicija gotovog — i zašto „popravi“ ne radi.',
  koraci: [
    { tip: 'tekst', naslov: 'Pet dijelova zahtjeva', html: `
      <table class="tbl"><tr><th>Dio</th><th>Pitanje</th><th>Primjer</th></tr>
      <tr><td><b>Simptom</b></td><td>Šta tačno vidiš?</td><td>„Brisanje fakture vraća 500.“</td></tr>
      <tr><td><b>Gdje</b></td><td>Koji ekran, ruta, fajl ili sloj?</td><td>„DELETE /api/fakture/15, dugme Obriši u dosijeu.“</td></tr>
      <tr><td><b>Dokaz</b></td><td>Kako se vidi problem?</td><td>„Network tab: status 500, tijelo: IntegrityError.“</td></tr>
      <tr><td><b>Granice</b></td><td>Šta se NE smije dirati?</td><td>„Ne mijenjaj obračun ni Lite/Pro pravila.“</td></tr>
      <tr><td><b>Gotovo kad</b></td><td>Kako znamo da je riješeno?</td><td>„Novi pytest prolazi i test:fast je zelen.“</td></tr></table>
      <p>Sve pojmove iz tabele znaš iz dijelova 1–4: status kod, ruta, Network, test. Zato je ovaj kurs počeo od koda — da „popravi“ postane precizan zahtjev.</p>` },
    { tip: 'kviz', p: 'Koji zahtjev agentu je najbolji?', o: ['Popravi bug', 'Zašto ne radi?', 'Brisanje fakture vraća 500 (Network: DELETE /api/fakture/15). Nađi uzrok, dodaj test koji ga reproducira, popravi, pokreni test:fast.', 'Napravi da radi'], t: 2, e: 'Simptom, lokacija, dokaz i definicija gotovog. Agent ne gubi vrijeme na pogađanje, a ti znaš kad je gotovo.' },
    { tip: 'primjer', jezik: 'tekst', bezPokretanja: true, naslov: 'Dobar zahtjev, dio po dio',
      kod: `Bug: u Evidenciji uplata piše „1 zapisa“ umjesto „1 zapis“.
Gdje: frontend, ekran Evidencija uplata (brojač iznad tabele).
Dokaz: sa jednom uplatom vidi se „1 zapisa“; sa 2 i 5 je ispravno.
Granice: ne mijenjaj druge tekstove ni backend.
Test: dodaj Vitest za 1, 2, 5, 11, 21 i 22 zapisa.
Gotovo kad: novi test i npm run test:fast su zeleni, commit fix(uplate).`,
      obj: {
        1: '<b>Simptom</b> u jednoj rečenici, tačnim riječima sa ekrana.',
        2: '<b>Gdje</b>: sloj (frontend) i ekran. Agent odmah zna da ne traži po Pythonu.',
        3: '<b>Dokaz</b>: kad se dešava, a kad ne. To je pola dijagnoze.',
        4: '<b>Granice</b> sprečavaju da agent „usput“ prepravi i ono što radi.',
        5: 'Test opisuje ponašanje (Dio 4, tema 7). Brojevi 11, 21, 22 su zamke bosanske gramatike.',
        6: '<b>Gotovo kad</b>: provjerljivo, bez „mislim da radi“. I kako se commit zove.',
      } },
    { tip: 'greska', jezik: 'tekst', bezPokretanja: true, pitanje: 'Jedna linija ovog zahtjeva pravi problem. Klikni na nju.',
      kod: `Bug: dugme Sačuvaj na formi klijenta ne radi kad je telefon prazan.
Gdje: POST /api/klijenti vraća 400 „phone required“.
Dokaz: Network tab, tijelo odgovora {"error": "phone required"}.
Usput preuredi cijeli ekran klijenata da bude ljepši.
Gotovo kad: klijent bez telefona se sačuva, pytest za prazan telefon prolazi.`,
      linija: 4, obj: 'Nepovezan, neodređen posao u istom zahtjevu: agent će mijenjati desetine linija koje nisu dio buga, diff postaje nečitljiv, a „ljepši“ nema definiciju gotovog. Redizajn je poseban zadatak (sa inventarom funkcija, Dio 4 tema 10).' },
    { tip: 'popuni', jezik: 'tekst', pokreni: false, pitanje: 'Popuni šablon zahtjeva riječima iz kursa.',
      kod: `Simptom: klik na Obriši fakturu vraća status 500.
Dokaz: ___ tab u pregledniku, zahtjev DELETE /api/fakture/15.
Radi na novoj ___, ne direktno na main.
Gotovo kad: novi ___ reproducira grešku i sada prolazi.`,
      odg: [['Network', 'network'], ['grani', 'grana'], ['test', 'pytest', 'pytest test']],
      obj: 'Network tab pokazuje metodu, status i tijelo odgovora (Dio 4, tema 1). Grana čuva main čistim (lekcija 6). Test koji prvo pada, pa prolazi, dokazuje da je baš taj bug popravljen.' },
    { tip: 'tekst', naslov: 'Veći posao: prvo plan', html: `
      <p>Za posao veći od jednog buga (nova funkcija, promjena baze, refaktor) traži <b>prvo plan, ne kod</b>: „Predloži plan u koracima, sa fajlovima koje mijenjaš i testovima. Ne mijenjaj ništa dok ne odobrim.“ U Claude Code za to postoji <b>plan mode</b>.</p>
      <ul><li>Plan pročitaš za 2 minute; loš diff od 800 linija čitaš sat.</li>
      <li>U planu se vidi da li je agent razumio granice (npr. Lite/Pro).</li>
      <li>Kad agent <b>dva puta</b> ne uspije, ne ponavljaj „pokušaj opet“: opiši šta si vidio, traži novi plan, ili počni novu sesiju sa sažetkom (i jačim modelom — lekcija 10).</li></ul>` },
    { tip: 'zadatak', jezik: 'tekst', naslov: 'Napiši zahtjev za bug',
      opis: `<p>Bug iz stvarnog rada: <b>„Kad dva puta brzo kliknem Kreiraj fakturu, nastanu dvije fakture.“</b></p><p>Napiši agentu zahtjev sa svih pet dijelova. Razmisli: gdje je udobnost (frontend: dugme), a gdje prava zaštita (backend: server ne smije napraviti dvije)? Kakav test dokazuje popravku?</p><p class="small muted">Testovi provjeravaju da li zahtjev ima sve dijelove. Riječi biraš sam.</p>`,
      pocetak: `Napravi da ne pravi dvije fakture.`,
      testovi: [
        { opis: 'Simptom: dvostruki klik pravi dvije fakture', ima: ['faktur'], bilo: ['dva puta', 'dvostruk', 'dupl', 'dvije'], poruka: 'opiši šta se tačno desi (dvostruki klik → dvije fakture)' },
        { opis: 'Gdje: spominje frontend (dugme)', bilo: ['frontend', 'dugm'], poruka: 'reci šta se radi na dugmetu (frontend)' },
        { opis: 'Gdje: spominje backend (server, ruta)', bilo: ['backend', 'server', 'POST', '/api/'], poruka: 'prava zaštita je na serveru: spomeni backend ili rutu POST /api/fakture' },
        { opis: 'Dokaz: traži test', ima: ['test'], poruka: 'traži test koji dokazuje popravku (npr. pytest: dva POST-a = jedna faktura)' },
        { opis: 'Granice: šta ne dirati', bilo: ['ne mijenjaj', 'ne diraj', 'bez promjen', 'granic'], poruka: 'dodaj granice, npr. „ne mijenjaj obračun“' },
        { opis: 'Gotovo kad', bilo: ['gotovo kad', 'gotovo je kad', 'definicija gotovog', 'zelen'], poruka: 'napiši kad je gotovo (koji testovi moraju biti zeleni)' },
        { opis: 'Dovoljno detalja (bar 30 riječi)', minRijeci: 30 },
      ],
      nagovjestaji: ['Počni simptomom: „Dvostruki klik na Kreiraj fakturu pravi dvije fakture.“', 'Frontend: dugme onemogućeno dok zahtjev traje. Backend: POST /api/fakture ne pravi drugu fakturu za isti zahtjev (npr. isti ključ u kratkom vremenu).', 'Završi sa „Gotovo kad: …“ i granicama („ne mijenjaj obračun ni Lite/Pro pravila“).'],
      rjesenje: `Bug: dvostruki klik na „Kreiraj fakturu“ pravi dvije fakture (nije idempotentno).

Cilj:
1. Frontend: dugme onemogućeno dok zahtjev traje.
2. Backend (prava zaštita): POST /api/fakture prima ključ zahtjeva
   (UUID iz frontenda); isti ključ u 10 min vraća postojeću fakturu, ne pravi novu.
   Jedinstveni indeks na (user_id, kljuc_zahtjeva).
3. Testovi: pytest — dva POST-a sa istim ključem = jedna faktura;
   Playwright — dvostruki klik = jedna faktura u listi.

Granice: bez promjene obračuna i Lite/Pro pravila.
Gotovo kad: test:fast i novi testovi zeleni, commit po koraku.`,
      objRj: 'Precizan zahtjev imenuje problem (idempotentnost, Dio 4 tema 6), razdvaja udobnost (frontend) od zaštite (backend + jedinstveni indeks u bazi) i definiše dokaz.' },
    { tip: 'kviz', p: 'Agent je dva puta pokušao popraviti isti bug i nije uspio. Najbolji potez?', o: ['Napisati „pokušaj opet“', 'Opisati šta si vidio poslije pokušaja, tražiti plan sa uzrokom prije nove izmjene (ili novu sesiju sa sažetkom)', 'Obrisati projekat', 'Pustiti ga da radi dok ne uspije'], t: 1, e: 'Ponavljanje istog zahtjeva daje isti rezultat. Novi podatak (šta se vidi) ili nov pristup (plan, svjež kontekst, jači model) mijenja ishod.' },
    { tip: 'kviz', p: 'Kada tražiš „prvo plan, ne kod“?', o: ['Za ispravku jednog slova', 'Za veći posao: nova funkcija, promjena baze, refaktor', 'Nikad, gubi se vrijeme', 'Samo kad agent pogriješi'], t: 1, e: 'Plan je jeftin za čitanje i u njemu se vide pogrešne pretpostavke prije nego postanu 800 linija koda.' },
  ],
});


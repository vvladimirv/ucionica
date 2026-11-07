// ============================================================================
// Dio 5 · Rad sa AI agentima — lekcija 10, id ag7 (alati oko agenta, izbor modela, završni zadatak). Zadnja u dijelu.
// U kodu lekcija: ` piši kao \`,   ${ kao \${,   a \ kao \\ (u regexima testova \\ postaje \).
// ============================================================================
LEKCIJE_AG.push({
  id: 'ag7', naslov: 'Alati oko agenta, izbor modela i završni zadatak', cilj: 'Skill, subagent, MCP i plan mode — kad šta; koji model za koji posao; i cijeli tok rada sa agentom u jednom zahtjevu.',
  koraci: [
    { tip: 'tekst', naslov: 'Kutija alata oko agenta', html: `
      <div style="overflow-x:auto"><table class="tbl"><tr><th>Alat</th><th>Šta je</th><th>Kad ga koristiš</th><th>Tvoj primjer</th></tr>
      <tr><td><b>CLAUDE.md</b></td><td>pravila koja agent pročita na početku</td><td>kako se radi u projektu</td><td>inhome, claude-plugins</td></tr>
      <tr><td><b>Hook</b></td><td>skripta na događaj</td><td>pravilo koje se ne smije zaboraviti</td><td>sw-stamp, test-fast, guard</td></tr>
      <tr><td><b>Skill / slash komanda</b></td><td>sačuvano uputstvo za ponovljiv posao</td><td>isti tok rada svaki put</td><td><code>/kraj-sesije</code>, <code>/nova-funkcija</code>, <code>/provjeri</code></td></tr>
      <tr><td><b>Subagent</b></td><td>pomoćnik sa svojim kontekstom, alatima i modelom</td><td>posao sa dugim izlazom ili drugim pogledom</td><td><code>tester</code>, <code>cuvar-pravila</code></td></tr>
      <tr><td><b>MCP</b></td><td>priključak koji agentu dodaje nove alate</td><td>agent treba vanjski sistem</td><td>Google Drive, preglednik</td></tr>
      <tr><td><b>Plan mode</b></td><td>agent samo čita i planira</td><td>veći posao, prije koda</td><td>ova izmjena učionice</td></tr></table></div>` },
    { tip: 'kviz', p: 'Na kraju svakog rada ponavljaš: testovi, STATUS, mali commitovi, push. Šta je pravi alat?', o: ['Svaki put napisati sve ponovo', 'Skill (slash komanda) — kod tebe /kraj-sesije', 'MCP', 'Hook na svaki Edit'], t: 1, e: 'Ponovljiv tok rada sa više koraka = skill. Pokreneš ga jednom riječju, a koraci su uvijek isti.' },
    { tip: 'kviz', p: 'Izlaz testova ima 600 linija i puni kontekst glavnog agenta. Šta je rješenje?', o: ['Manje testova', 'Subagent (tester) koji pokrene testove i vrati kratku presudu', 'Duži CLAUDE.md', 'Plan mode'], t: 1, e: 'Subagent ima svoj kontekst: dugi izlaz ostaje kod njega, a glavni agent dobije pet redova.' },
    { tip: 'kviz', p: 'Agent treba pročitati dokument sa Google Drive-a. Šta mu treba?', o: ['Hook', 'MCP priključak (connector) za Google Drive', 'Subagent', 'Ništa, sam će naći'], t: 1, e: 'MCP dodaje agentu nove alate (čitaj Drive, pretraži, …). Bez njega agent vidi samo fajlove na disku i komande.' },
    { tip: 'tekst', naslov: 'Koji model za koji posao (Sole-KP MODEL_ROUTING)', html: `
      <p>Cilj nije uvijek najjači model, nego <b>najniži nivo koji je dovoljno pouzdan</b> za rizik i složenost zadatka. Jači model je sporiji i troši više (tvoj plan, tokene).</p>
      <table class="tbl"><tr><th>Klasa</th><th>Primjeri</th><th>Claude Code</th></tr>
      <tr><td><b>A</b> kritičan dizajn</td><td>model podataka, rizične migracije, sigurnost, novac</td><td>najjači (Opus)</td></tr>
      <tr><td><b>B</b> složen razvoj</td><td>više modula, težak bug</td><td>Sonnet; Opus ako je rizično ili prethodni pokušaj nije uspio</td></tr>
      <tr><td><b>C</b> običan razvoj</td><td>CRUD, forme, testovi</td><td>Sonnet</td></tr>
      <tr><td><b>D</b> mehanički posao</td><td>preimenovanje, formatiranje</td><td>mali brzi model (Haiku)</td></tr></table>
      <ul><li>Eskaliraj bar jednu klasu kad <b>dva pokušaja</b> nisu riješila problem.</li><li>Subagenti za rutinu (<code>tester</code>) idu na Haiku; skillovi imaju <code>model:</code> u frontmatteru.</li><li>Ni ovaj tutor ne treba najjači model za kratko objašnjenje — zato podrazumijevano koristi brži, a „Detaljniji odgovor“ uključi jači.</li></ul>` },
    { tip: 'kviz', p: 'Preimenovati varijablu u 20 fajlova. Koja klasa?', o: ['A', 'B', 'C', 'D — mehanički posao, mali model'], t: 3, e: 'Nema dizajnerske odluke ni rizika koji traži razmišljanje; testovi potvrde da ništa nije puklo.' },
    { tip: 'kviz', p: 'Nova migracija koja mijenja kako se čuva iznos novca. Koja klasa?', o: ['D', 'C', 'B', 'A — kritičan dizajn: podaci i novac'], t: 3, e: 'Greška u modelu podataka i novcu je skupa i teško se vraća (Dio 4, teme 4 i 6). Tu ide najjači model i plan prije koda.' },
    { tip: 'zadatak', jezik: 'tekst', naslov: 'Napiši subagenta',
      opis: `<p>Napiši fajl subagenta <code>.claude/agents/pregledac-sigurnosti.md</code>. Treba da pregleda izmijenjene <code>/api</code> rute (autentifikacija, autorizacija po user_id, parametrizovani upiti) i <b>ništa ne mijenja</b>.</p><ul><li>frontmatter između dvije linije <code>---</code>: <code>name</code>, <code>description</code> (šta radi i kad se koristi), <code>tools</code> (samo alati za čitanje), <code>model</code></li><li>ispod frontmattera: uputstvo subagentu</li></ul>`,
      pocetak: `---
name:
description:
tools:
model:
---
`,
      testovi: [
        { opis: 'Frontmatter između dvije linije ---', ima: ['^---\\s*$[\\s\\S]*^---\\s*$'] },
        { opis: 'name: ime malim slovima sa crticama', ima: ['^name: [a-z][a-z0-9-]+\\s*$'] },
        { opis: 'description kaže šta radi i kad se koristi', ima: ['^description: .{30,}', '^description: .*(koristi|kad|prije)'], poruka: 'opis bar 30 znakova, sa „Koristi ga …“ ili „prije …“ — po tome glavni agent zna kad da ga pozove' },
        { opis: 'tools: samo čitanje (bez Edit i Write)', ima: ['^tools: \\S'], nema: ['^tools: .*\\b(Edit|Write|MultiEdit|NotebookEdit)\\b'], poruka: 'navedi alate za čitanje (Read, Grep, Glob), bez Edit i Write' },
        { opis: 'model: haiku ili sonnet', ima: ['^model: (haiku|sonnet)\\s*$'] },
        { opis: 'Uputstvo ispod frontmattera', ima: ['^---\\s*$[\\s\\S]*^---\\s*$\\s*\\S'], poruka: 'ispod druge linije --- napiši uputstvo, npr. „Ti si pregledač sigurnosti. Nikad ne mijenjaš fajlove…“' },
      ],
      nagovjestaji: ['Uzor je <code>tester.md</code> iz lekcije 5.', 'Alati za čitanje: <code>tools: Read, Grep, Glob</code>.', 'Pregled sigurnosti traži razumijevanje, pa je <code>model: sonnet</code> dobar izbor.'],
      rjesenje: `---
name: pregledac-sigurnosti
description: Pregleda izmijenjene /api rute (autentifikacija, autorizacija po user_id, parametrizovani upiti). Koristi ga prije commita koji dira rute. Samo čita.
tools: Read, Grep, Glob
model: sonnet
---
Ti si pregledač sigurnosti. Nikad ne mijenjaš fajlove.
Za svaku izmijenjenu rutu provjeri: @jwt_required, filter po user_id (tuđi zapis = 404), ? parametre u SQL-u.
Vrati tabelu: ruta, problem, prijedlog. Ako je sve u redu, jedna rečenica.`,
      objRj: 'Opis odlučuje kad će ga glavni agent pozvati; alati odlučuju šta smije. Bez Edit/Write pregledač ne može „usput popraviti“ — to ostaje odluka glavnog agenta i tvoja.' },
    { tip: 'tekst', naslov: 'Završni zadatak: sve zajedno', html: `
      <p>Sve iz ovog dijela u jednom zahtjevu: <b>prvo plan</b>, <b>grana</b>, <b>pravila</b> projekta, <b>testovi</b>, <b>granice</b>, <b>gotovo kad</b> i <b>commit</b>.</p>
      <p>Nova funkcija za inhome: <b>„Podsjetnik za neplaćene fakture starije od 30 dana“</b> — lista na početnom ekranu, samo za Pro.</p>
      <p class="small muted">Iza ovog zahtjeva stoji cijeli kurs: ruta i status kodovi (Dio 4 tema 1), SQL upit sa WHERE i datumom (Dio 3), Lite/Pro provjera na backendu (tema 8), test (tema 7).</p>` },
    { tip: 'zadatak', jezik: 'tekst', naslov: 'Završni zahtjev agentu',
      opis: `<p>Napiši agentu cijeli zahtjev za funkciju <b>„Podsjetnik za neplaćene fakture starije od 30 dana“</b> (lista na početnom ekranu, samo za Pro korisnike).</p><p>Testovi traže sve dijelove iz lekcija 2–6.</p>`,
      pocetak: `Napravi podsjetnik za neplaćene fakture.`,
      testovi: [
        { opis: 'Prvo plan, pa kod', bilo: ['plan'], poruka: 'traži prvo plan (fajlovi, koraci, testovi) prije koda' },
        { opis: 'Radi na grani (ili worktree)', bilo: ['gran', 'worktree', 'branch'], poruka: 'reci da radi na novoj grani, ne na main' },
        { opis: 'Pravila i stanje projekta', bilo: ['AGENTS\\.md', 'CLAUDE\\.md', 'STATUS'], poruka: 'uputi agenta na pravila (AGENTS.md / CLAUDE.md) ili STATUS' },
        { opis: 'Lite/Pro: provjera na backendu', ima: ['\\bpro\\b'], bilo: ['backend', 'server', '/api'], poruka: 'samo za Pro — i provjera mora biti na backendu' },
        { opis: 'Testovi', ima: ['test'], bilo: ['pytest', 'vitest', 'playwright', 'test:fast'], poruka: 'navedi koje testove (pytest, Vitest, Playwright, test:fast)' },
        { opis: 'Granice', bilo: ['ne mijenjaj', 'ne diraj', 'bez promjen', 'granic'], poruka: 'dodaj granice (šta se ne smije mijenjati)' },
        { opis: 'Gotovo kad', bilo: ['gotovo kad', 'gotovo je kad', 'definicija gotovog'] },
        { opis: 'Commit', ima: ['commit'] },
        { opis: 'Dovoljno detalja (bar 50 riječi)', minRijeci: 50 },
      ],
      nagovjestaji: ['Kostur: Cilj → Prvo plan → Grana → Koraci (backend, frontend) → Testovi → Granice → Gotovo kad.', 'Backend: GET ruta vraća neplaćene fakture starije od 30 dana; za Lite 403 (ili prazno), provjera plana na serveru.', 'Gotovo kad: pytest za Pro, Lite i fakturu od 29 dana; test:fast zelen; mali commitovi feat(fakture).'],
      rjesenje: `Cilj: na početnom ekranu lista neplaćenih faktura starijih od 30 dana, samo za Pro.

Prvo plan, ne kod: pročitaj AGENTS.md i STATUS.md, pa predloži korake,
fajlove i testove. Ne mijenjaj ništa dok ne odobrim.

Poslije odobrenja, na novoj grani feat/podsjetnik-fakture:
1. Backend: GET /api/fakture/podsjetnik — neplaćeno > 0 i datum stariji od 30 dana,
   samo fakture ovog korisnika (user_id). Lite korisnik dobija 403; provjera plana na serveru.
2. Frontend: kartica na početnom ekranu, sa stanjima učitavanje/prazno/greška; Lite je ne vidi.
3. Testovi: pytest (Pro vidi, Lite 403, faktura od 29 dana nije na listi, tuđa faktura nije na listi),
   Vitest za prikaz kartice.

Granice: ne mijenjaj obračun faktura ni postojeće rute.
Gotovo kad: novi testovi i npm run test:fast zeleni, mali commitovi feat(fakture): …, pa PR.`,
      objRj: 'Svaka rečenica ima posao: plan štiti od pogrešnih pretpostavki, grana štiti main, user_id i 403 su sigurnost, 29 dana je granični slučaj u testu, a „gotovo kad“ kaže tebi i agentu kad se staje.' },
    { tip: 'tekst', naslov: 'Kraj kursa: šta sada znaš', html: `
      <p>Prošao si put od <code>print("Zdravo")</code> do zahtjeva koji bi napisao iskusan programer. Za rad sa agentom to znači:</p>
      <ul><li>Čitaš agentov izvještaj i diff i razumiješ pojmove: ruta, status kod, transakcija, strani ključ, test.</li>
      <li>Zahtjev ima simptom, mjesto, dokaz, granice i „gotovo kad“.</li>
      <li>Pravila koja se ne smiju zaboraviti su hook ili test, ne velika slova u CLAUDE.md.</li>
      <li>„Gotovo“ je zelena provjera, ne agentovo mišljenje.</li>
      <li>Jedan agent = jedna grana; mali commitovi; model po težini posla.</li></ul>
      <div class="note good">Sljedeći korak je u tvom projektu: uzmi jedan stvarni bug iz inhome i napiši zahtjev po šablonu iz lekcije 2. Ako zapne, tutor (ili besplatni AI preko 📋 dugmeta) pogleda tvoj zahtjev.</div>
      <div class="row"><button class="btn" data-go="rjecnik">Rječnik pojmova</button><button class="btn" data-go="lek:ag2:0">Ponovi: dobar zahtjev</button><button class="btn" data-go="tema:m0">Tema 0: put jednog klika</button></div>` },
  ],
});


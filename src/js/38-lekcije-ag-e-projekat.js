// ============================================================================
// Dio 5 · Rad sa AI agentima — projekat na svom repozitoriju (id ag11), prije završne lekcije ag7.
// Okvir 4D iz Anthropicovog kursa „AI Fluency: Framework & Foundations“ (Dakan i Feller):
// Delegation, Description, Discernment, Diligence. Ovdje: delegiranje, opis, procjena, odgovornost.
// Zadaci su jezik 'tekst': testovi gledaju samo oblik teksta; sadržaj ocjenjuješ ti (i tutor).
// ============================================================================
LEKCIJE_AG.push({
  id: 'ag11', projekat: true, naslov: 'Projekat: zadatak na svom repozitoriju', cilj: 'Jedan stvaran zadatak iz tvog projekta (inhome, Sole-KP ili drugi), od odluke šta dati agentu do provjere i commita, po okviru 4D.',
  koraci: [
    { tip: 'tekst', naslov: 'Okvir 4D', html: `
      <p>Anthropic u kursu <b>AI Fluency</b> opisuje četiri vještine rada sa AI-jem. Koristimo ih kao kontrolnu listu za jedan stvaran zadatak:</p>
      <ol><li><b>Delegiranje</b>: šta dati agentu, a šta ostaje tebi (odluke, provjera, ono što agent ne može znati).</li>
      <li><b>Opis</b>: jasan zahtjev — cilj, gdje, granice, kad je gotovo.</li>
      <li><b>Procjena</b>: da li je rezultat dobar? Gledaš šta je urađeno, kako je urađeno i da li je agent bio iskren o tome šta nije uspio.</li>
      <li><b>Odgovornost</b>: ti odgovaraš za ono što ide u projekat, bez obzira ko je napisao kod.</li></ol>
      <p>Ova lekcija se radi <b>uz tvoj projekat</b>: izaberi jedan mali, stvaran zadatak (bug, mala izmjena teksta, novi test). Ne veliku funkciju — za prvi put nešto što se provjeri za 10 minuta.</p>
      <div class="note">Testovi ovdje provjeravaju samo da li tekst ima sve dijelove. Da li je dobar, procjenjuješ ti; tutor (💬) može dati drugo mišljenje.</div>` },
    { tip: 'zadatak', jezik: 'tekst', naslov: '1. Delegiranje: šta daješ, šta zadržavaš',
      opis: `<p>Opiši zadatak i podijeli ga: šta radi agent, a šta ostaje tebi. Napiši tri kratka dijela, svaki u svom redu ili pasusu:</p><ul><li><b>Zadatak:</b> šta treba uraditi i u kojem projektu</li><li><b>Agent:</b> šta mu daješ</li><li><b>Ja:</b> šta zadržavaš (odluka, provjera, nešto što samo ti znaš)</li></ul>`,
      pocetak: `Zadatak:
Agent:
Ja:`,
      testovi: [
        { opis: 'Ima dio „Zadatak:“ sa sadržajem', ima: ['^\\s*zadatak:\\s*\\S'], poruka: 'iza „Zadatak:“ napiši šta treba uraditi' },
        { opis: 'Ima dio „Agent:“ sa sadržajem', ima: ['^\\s*agent:\\s*\\S'], poruka: 'iza „Agent:“ napiši šta daješ agentu' },
        { opis: 'Ima dio „Ja:“ sa sadržajem', ima: ['^\\s*ja:\\s*\\S'], poruka: 'iza „Ja:“ napiši šta zadržavaš' },
        { opis: 'Dovoljno konkretno (bar 25 riječi)', minRijeci: 25 },
      ],
      nagovjestaji: ['Primjer: Zadatak: u inhome se na listi faktura datum prikazuje kao 2026-07-15 umjesto 15. 7. 2026.', 'Agent: nađe gdje se datum formatira, popravi i doda test. Ja: odlučujem format i provjeravam na telefonu.'],
      rjesenje: `Zadatak: u inhome, na listi faktura datum se prikazuje kao 2026-07-15, a treba 15. 7. 2026.
Agent: nađe gdje se datum formatira na frontendu, popravi samo prikaz i doda test za funkciju formatiranja.
Ja: odlučujem format datuma, provjeravam ekran na telefonu i odobravam commit. Baza i API ostaju kako jesu.`,
      objRj: 'Agent dobija posao koji se može provjeriti (popravka + test). Tebi ostaje ono što agent ne može znati (koji format žele tvoji klijenti) i završna provjera.' },
    { tip: 'zadatak', jezik: 'tekst', naslov: '2. Opis: zahtjev agentu',
      opis: `<p>Napiši zahtjev za taj zadatak. Neka ima dijelove iz lekcije 2: <b>cilj</b>, <b>gdje</b> (fajl, ekran ili ruta), <b>granice</b> (šta se ne dira) i <b>gotovo kad</b> (kako se provjerava). Traži i da agent na kraju kaže šta nije uspio ili nije provjerio.</p>`,
      pocetak: `Cilj:
`,
      testovi: [
        { opis: 'Cilj', ima: ['cilj'] },
        { opis: 'Gdje (fajl, ekran, ruta ili funkcija)', bilo: ['fajl', 'ekran', 'ruta', '/api', 'funkcij', '\\.(py|js|html|css)\\b'], poruka: 'reci gdje: fajl, ekran, rutu ili funkciju' },
        { opis: 'Granice', bilo: ['ne mijenjaj', 'ne diraj', 'bez promjen', 'granic', 'samo '], poruka: 'dodaj šta se ne smije mijenjati' },
        { opis: 'Gotovo kad', bilo: ['gotovo kad', 'gotovo je kad', 'definicija gotovog'] },
        { opis: 'Provjera testom', ima: ['test'] },
        { opis: 'Traži iskren izvještaj (šta nije urađeno ili provjereno)', bilo: ['nije uspio', 'nije uspjel', 'nisi uspio', 'nije provjer', 'nisi provjer', 'šta nije', 'sta nije', 'ne znaš', 'nisi siguran'], poruka: 'traži da agent kaže šta nije uspio ili nije provjerio' },
        { opis: 'Dovoljno detalja (bar 40 riječi)', minRijeci: 40 },
      ],
      nagovjestaji: ['Kostur: Cilj → Gdje → Granice → Gotovo kad → Izvještaj.', 'Kraj zahtjeva: „Na kraju napiši šta si promijenio, koje testove si pokrenuo i šta nisi provjerio.“'],
      rjesenje: `Cilj: datum na listi faktura prikazuj kao 15. 7. 2026. (dan. mjesec. godina.).
Gdje: frontend, ekran Fakture; nađi funkciju koja formatira datum i pokaži mi je prije izmjene.
Granice: ne mijenjaj bazu, API ni format datuma u JSON-u; samo prikaz.
Gotovo kad: test za funkciju formatiranja prolazi (i za datum 2026-01-05), postojeći testovi su zeleni.
Radi na novoj grani, mali commit.
Na kraju napiši šta si promijenio, koje testove si pokrenuo i šta nisi provjerio ili nisi uspio.`,
      objRj: 'Zadnja rečenica je dio procjene: agent koji mora reći šta nije provjerio rjeđe tvrdi „sve radi“ bez dokaza.' },
    { tip: 'tekst', naslov: 'Pokreni zadatak', html: `
      <p>Sada zahtjev daj svom agentu (Claude Code, Codex ili drugom) u svom projektu, na novoj grani. Pusti ga da radi, a ti ne prihvataj ništa dok ne pročitaš izvještaj.</p>
      <ul><li>Ako agent prvo predloži plan, pročitaj ga: da li dira samo ono što si rekao?</li><li>Kad završi, kopiraj njegov završni izvještaj i listu promijenjenih fajlova (ili diff). Trebaće ti u sljedećem koraku.</li></ul>
      <p class="small muted">Ako sada nemaš projekat pri ruci, koristi primjer iz rješenja prethodnog koraka i zamisli šta bi agent mogao vratiti.</p>` },
    { tip: 'zadatak', jezik: 'tekst', naslov: '3. Procjena: da li je dobro',
      opis: `<p>Zalijepi agentov izvještaj (ili ga ukratko prepiši), a ispod njega napiši <b>svoju procjenu</b> sa tri dijela:</p><ul><li><b>Šta je promijenjeno:</b> koji fajlovi, da li samo ono što si tražio</li><li><b>Dokaz:</b> koji test ili provjera pokazuje da radi</li><li><b>Odluka:</b> prihvatam, tražim ispravku (šta) ili odbacujem</li></ul>`,
      pocetak: `Izvještaj agenta:

Šta je promijenjeno:
Dokaz:
Odluka:`,
      testovi: [
        { opis: 'Izvještaj agenta nije prazan', ima: ['izvještaj agenta:\\s*\\S'], poruka: 'zalijepi ili prepiši šta je agent rekao' },
        { opis: '„Šta je promijenjeno“ sa sadržajem', ima: ['^\\s*šta je promijenjeno:\\s*\\S'] },
        { opis: '„Dokaz“ sa sadržajem i testom ili provjerom', ima: ['^\\s*dokaz:\\s*\\S'], bilo: ['test', 'provjer', 'pokren'], poruka: 'dokaz je test ili provjera koju si vidio, ne „agent kaže da radi“' },
        { opis: '„Odluka“ sa sadržajem', ima: ['^\\s*odluka:\\s*\\S'] },
        { opis: 'Dovoljno detalja (bar 40 riječi)', minRijeci: 40 },
      ],
      nagovjestaji: ['Za „Šta je promijenjeno“ pogledaj listu fajlova u diffu: ima li fajla koji nisi očekivao?', 'Za „Dokaz“: koji test je agent pokrenuo i da li si vidio izlaz? Ako ne, pokreni ga ti.'],
      rjesenje: `Izvještaj agenta:
Promijenio sam formatDatum u static/js/format.js i dodao test u tests/format.test.js. Testovi prolaze. Nisam provjerio prikaz na telefonu.

Šta je promijenjeno: dva fajla, oba očekivana; baza i API nisu dirani.
Dokaz: pokrenuo sam testove i vidio da novi test prolazi i za 2026-01-05; na telefonu sam otvorio ekran Fakture i datum je dobar.
Odluka: prihvatam, uz jednu ispravku: test neka provjeri i prazan datum.`,
      objRj: 'Procjena nije „agent kaže da radi“. To je ono što si ti vidio: fajlovi u diffu, izlaz testa i ekran. Agent je sam rekao šta nije provjerio, pa si to provjerio ti.' },
    { tip: 'zadatak', jezik: 'tekst', naslov: '4. Odgovornost: tvoja pravila',
      opis: `<p>Napiši svoja lična pravila za rad sa agentom: <b>3 do 5 kratkih rečenica</b>, svaka u svom redu. Šta uvijek radiš prije commita? Šta nikad ne prepuštaš agentu?</p>`,
      pocetak: `Uvijek `,
      testovi: [
        { opis: 'Bar 3 pravila (3 linije)', ima: ['^.+$\\n^.+$\\n^.+$'], poruka: 'napiši bar 3 pravila, svako u svom redu' },
        { opis: 'Najviše 5 linija', maxLinija: 5 },
        { opis: 'Pravila su odlučna (uvijek, nikad, prije, ne …)', bilo: ['uvijek', 'nikad', 'prije', '^\\s*ne '], poruka: 'pravilo je jasno kad kaže uvijek, nikad ili prije' },
      ],
      nagovjestaji: ['Primjeri: „Nikad ne spajam PR koji nisam pročitao.“ „Uvijek tražim test za bug koji se popravlja.“'],
      rjesenje: `Nikad ne spajam izmjenu koju nisam pročitao u diffu.
Uvijek tražim test koji pada prije popravke i prolazi poslije.
Prije commita sam provjerim ekran koji je mijenjan.
Lozinke i ključeve ne dajem agentu u poruci.`,
      objRj: 'Ovo je tvoja „izjava o odgovornosti“. Najvažnija pravila kasnije možeš pretvoriti u hook ili test (lekcija 4), da ih mašina provjerava umjesto tebe.' },
    { tip: 'kviz', naslov: '4D', p: 'Agent je javio „Gotovo, sve radi“, bez spiska fajlova i bez testova. Koja od četiri vještine je sada na redu?', o: ['Delegiranje', 'Opis', 'Procjena: tražiš dokaz (diff, test) prije nego prihvatiš', 'Nijedna, posao je gotov'], t: 2, e: 'Procjena je provjera rezultata i načina rada. „Sve radi“ bez dokaza nije rezultat koji možeš prihvatiti; a sljedeći put to ide i u Opis („na kraju napiši koje testove si pokrenuo“).' },
  ],
});

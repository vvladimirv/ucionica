// ============================================================================
// Dio 5 · Rad sa AI agentima — lekcije 3–4 (memorija projekta, hookovi).
// U kodu lekcija: ` piši kao \`,   ${ kao \${,   a \ kao \\ (u regexima testova \\ postaje \).
// ============================================================================
LEKCIJE_AG.push({
  id: 'ag3', naslov: 'Memorija projekta: CLAUDE.md, AGENTS.md, STATUS', cilj: 'Agent ne pamti ništa između sesija. Šta mu zapisati, gdje, i zašto kratko pobjeđuje dugo.',
  koraci: [
    { tip: 'tekst', naslov: 'Tri mjesta, tri vrste znanja', html: `
      <table class="tbl"><tr><th>Šta</th><th>Gdje</th><th>Mijenja se</th><th>Primjer</th></tr>
      <tr><td><b>Pravila</b>: kako se radi</td><td><code>CLAUDE.md</code>, <code>AGENTS.md</code></td><td>rijetko</td><td>„Prije gotovo pokreni test:fast.“</td></tr>
      <tr><td><b>Stanje</b>: gdje smo</td><td><code>STATUS.md</code></td><td>na kraju sesije</td><td>„Radi: … Sljedeće: … Blokeri: …“</td></tr>
      <tr><td><b>Historija</b>: šta je urađeno</td><td>git (commit poruke)</td><td>svaki commit</td><td><code>fix(uplate): „1 zapis“ umjesto „1 zapisa“</code></td></tr></table>
      <p><code>CLAUDE.md</code> Claude Code učita <b>sam</b> na početku svake sesije. <code>AGENTS.md</code> je isti dogovor za Codex i druge agente.</p>
      <p>Kad se ove tri stvari pomiješaju (dnevnik u CLAUDE.md, pravila u STATUS-u), agent dobije mnogo teksta, a malo pravila — i pravila se izgube.</p>` },
    { tip: 'primjer', jezik: 'tekst', bezPokretanja: true, naslov: 'Dobar CLAUDE.md: claude-plugins (12 linija)',
      kod: `- Hookovi su Node skripte (bez npm zavisnosti), jedna skripta = jedan hook.
  Uz svaku ide *.test.js (node:test).
- Hookovi su fail-open: greška se upiše u ~/.claude/pravila.log i izađe se sa 0.
  Jedini izuzetak su blokade tajni.
- Skillovi imaju model: u frontmatteru: haiku za rutinu, sonnet za commit/pregled.
- Prije commita: npm test i claude plugin validate . moraju proći.`,
      obj: {
        1: 'Pravilo + oblik: agent zna kako novi hook mora izgledati.',
        2: 'Uz pravilo ide i provjera: svaki hook ima test.',
        3: 'Svjesna odluka sa razlogom (fail-open = kad provjera pukne, pusti dalje; Dio 4, tema 6).',
        4: 'Izuzetak je izričit. Bez ove linije agent bi i tajne pustio.',
        5: 'Pravilo koje štedi novac: jeftiniji model za rutinu (lekcija 10).',
        6: 'Definicija gotovog za cijeli repo, u jednoj liniji.',
      } },
    { tip: 'primjer', jezik: 'tekst', bezPokretanja: true, naslov: 'Jedan izvor za dva agenta (inhome)',
      kod: `@AGENTS.md

Zajednička pravila, izvori istine, workfile model i pravila frontend isporuke su u AGENTS.md
(uvezen iznad), da ih Codex i Claude čitaju iz istog fajla. Ovdje je samo ono što važi isključivo
za Claude Code.
- Nakon izmjene koda provjere pokretati preko subagenta tester, ne direktno.`,
      obj: {
        1: '<code>@AGENTS.md</code> na vrhu CLAUDE.md uveze cijeli AGENTS.md. Pravila su na jednom mjestu (DRY, Dio 4 tema 6).',
        3: 'Objašnjenje zašto: Codex čita AGENTS.md, Claude CLAUDE.md. Da se pravila ne razilaze, CLAUDE.md samo uvozi.',
        6: 'U CLAUDE.md ostaje samo ono što postoji samo u Claude Code (subagenti, hookovi).',
      } },
    { tip: 'kviz', p: 'Gdje ide „danas smo popravili pluralizaciju uplata“?', o: ['CLAUDE.md', 'U commit poruku (i kratko u STATUS ako mijenja šta je sljedeće)', 'U AGENTS.md', 'Nigdje'], t: 1, e: 'Šta je urađeno je historija, a historija je git. CLAUDE.md sadrži samo pravila koja važe i sutra.' },
    { tip: 'greska', jezik: 'tekst', bezPokretanja: true, pitanje: 'Jedna linija ne pripada u CLAUDE.md. Klikni na nju.',
      kod: `# CLAUDE.md
- Prije "gotovo" pokreni npm run test:fast; crveno znači stop.
- Lite korisnik nikad ne vidi Pro podatke; provjera je i na backendu.
- 27.9. popravljen bug sa fakturama, Emir kaže da sad radi.
- Novi fajl ima najviše 500 linija; dijeli po odgovornostima.`,
      linija: 4, obj: 'To je dnevnik, ne pravilo: sutra ne govori agentu ništa o tome kako raditi, a troši kontekst u svakoj sesiji. Mjesto mu je commit poruka ili PROJECT_PROGRESS.' },
    { tip: 'zadatak', jezik: 'tekst', naslov: 'Pretvori dnevnik u pravila',
      opis: `<p>Ovaj CLAUDE.md je postao dnevnik. Prepiši ga u <b>kratka pravila</b>: svaka linija počinje sa <code>- </code>, bez datuma, bez „šta je urađeno“. Zadrži ono što važi i sutra: test:fast, Lite/Pro i subagenta tester.</p>`,
      pocetak: `# CLAUDE.md
23.9. dodali smo sw-stamp, ne zaboravi CACHE
24.9. agent opet zaboravio test:fast prije commita!!
25.9. popravljen bug u uplatama
26.9. Lite korisnici su vidjeli Pro podatke, pazi na to
26.9. dugi izlaz testova puni kontekst, koristi tester
27.9. radili na dizajnu dosijea, super izgleda`,
      testovi: [
        { opis: 'Najviše 12 linija', maxLinija: 12 },
        { opis: 'Bez datuma', nema: ['\\b\\d{1,2}\\.\\d{1,2}\\.'], poruka: 'ukloni datume — to je dnevnik' },
        { opis: 'Pravila su stavke liste (bar 3 linije sa „- “)', ima: ['^- .*\\n- .*\\n- '], poruka: 'napiši bar tri pravila, svako u svom redu koje počinje sa „- “' },
        { opis: 'Pravilo o test:fast', ima: ['test:fast'] },
        { opis: 'Pravilo o Lite/Pro', ima: ['\\blite\\b', '\\bpro\\b'] },
        { opis: 'Pravilo o subagentu tester', ima: ['tester'] },
        { opis: 'Nema zapisa „šta je urađeno“', nema: ['popravljen', 'super izgleda', 'radili'], poruka: 'ukloni zapise o urađenom (to ide u commit poruke)' },
      ],
      nagovjestaji: ['Za svaku liniju pitaj: da li ovo govori agentu KAKO da radi i sutra? Ako ne, briši.', 'Iz „agent opet zaboravio test:fast“ nastaje pravilo: „- Prije gotovo i prije commita pokreni npm run test:fast.“', 'CACHE pravilo radi hook sw-stamp; dovoljno je napisati da se CACHE ne mijenja ručno.'],
      rjesenje: `# CLAUDE.md
- Prije "gotovo" i prije commita pokreni npm run test:fast; crveno znači stop.
- CACHE u sw.js podiže hook sw-stamp poslije izmjene u static/; ne mijenjaj ga ručno.
- Lite korisnik nikad ne vidi Pro podatke; provjera plana je i na backendu.
- Testove pokreći preko subagenta tester, da dugi izlaz ne puni kontekst.
- Šta je urađeno ide u commit poruke, ne ovdje.`,
      objRj: 'Svaka linija je pravilo sa razlogom ili posljedicom. „Pazi na to“ je postalo provjerljivo („provjera plana je i na backendu“).' },
    { tip: 'tekst', naslov: 'STATUS.md: stanje u 30 linija', html: `
      <p>STATUS odgovara na jedno pitanje: <b>gdje smo stali?</b> Tvoj <code>claude-plugins/STATUS.md</code> ima 21 liniju i tri sekcije:</p>
      <pre>## Radi
- project-kickstart 0.4.7 …, 55 testova
## Sljedeće
1. INHome: napomena za /codex-worktree … čeka push i PR u main
## Blokeri / otvorena pitanja
- nema</pre>
      <p>Hook <code>session-start.js</code> (project-memory) ga na početku sesije ubaci agentu — ali samo prvih <b>40 linija</b>. Sole-KP <code>CURRENT_STATE.md</code> ima <b>2296 linija</b>: agent vidi mali početak, a ostatak ne postoji za njega.</p>
      <p>Komande <code>/stanje</code> i <code>/kraj-sesije</code> iz tvojih pluginova ga održavaju.</p>` },
    { tip: 'zadatak', jezik: 'js', naslov: 'Provjera STATUS-a (kao hook)',
      opis: `<p>Napiši funkciju <code>provjeriStatus(tekst)</code> koja <b>vraća niz problema</b> (prazan niz ako je sve u redu):</p><ul><li>više od 30 linija → <code>"predug"</code></li><li>za svaku sekciju <code>Radi</code>, <code>Sljedeće</code>, <code>Blokeri</code>: ako tekst ne sadrži <code>"## "</code> + ime → <code>"nema "</code> + ime</li></ul><p class="small muted">Ovako izgleda i pravi hook: pravilo („STATUS je kratak i ima tri sekcije“) postaje funkcija koju mašina provjeri svaki put.</p>`,
      pocetak: `function provjeriStatus(tekst) {
  const problemi = [];
  const linije = tekst.split("\\n");
  // 1. više od 30 linija → problemi.push("predug")
  // 2. za "Radi", "Sljedeće", "Blokeri": ako tekst ne sadrži "## " + ime → problemi.push("nema " + ime)
  return problemi;
}`,
      testovi: [
        { opis: 'Dobar STATUS nema problema', kod: "ocekuj(provjeriStatus('# STATUS\\n## Radi\\n- x\\n## Sljedeće\\n1. y\\n## Blokeri\\n- nema'), [], 'dobar STATUS')" },
        { opis: 'Bez sekcije Blokeri', kod: "ocekuj(provjeriStatus('## Radi\\n## Sljedeće'), ['nema Blokeri'], 'bez Blokeri')" },
        { opis: 'Predug STATUS (43 linije)', kod: "ocekuj(provjeriStatus('## Radi\\n## Sljedeće\\n## Blokeri\\n' + '- red\\n'.repeat(40)), ['predug'], 'predug')" },
        { opis: 'Prazan STATUS', kod: "ocekuj(provjeriStatus(''), ['nema Radi', 'nema Sljedeće', 'nema Blokeri'], 'prazan')" },
      ],
      nagovjestaji: ['Broj linija je <code>linije.length</code>; uporedi ga sa 30 u <code>if</code>.', 'Petlja: <code>for (const ime of ["Radi", "Sljedeće", "Blokeri"]) { … }</code>', 'Sadrži li tekst sekciju: <code>tekst.includes("## " + ime)</code>; ispred stavi <code>!</code> za „ne sadrži“.'],
      rjesenje: `function provjeriStatus(tekst) {
  const problemi = [];
  const linije = tekst.split("\\n");
  if (linije.length > 30) problemi.push("predug");
  for (const ime of ["Radi", "Sljedeće", "Blokeri"]) {
    if (!tekst.includes("## " + ime)) problemi.push("nema " + ime);
  }
  return problemi;
}` },
    { tip: 'kviz', p: 'Pravilo treba da važi i za Codex i za Claude. Gdje ga pišeš?', o: ['Samo u CLAUDE.md', 'U AGENTS.md, a CLAUDE.md ga uvozi sa @AGENTS.md', 'U STATUS.md', 'U oba fajla, dvaput'], t: 1, e: 'Jedno mjesto, dva čitaoca. Dvije kopije se prije ili kasnije raziđu.' },
    { tip: 'kviz', p: 'Zašto je dug CLAUDE.md (300+ linija) loš?', o: ['Nije loš, više je bolje', 'Troši kontekst u svakoj sesiji, a važna pravila se izgube među nevažnim', 'Git ga ne može snimiti', 'Agent ga ne može pročitati'], t: 1, e: 'Kratka, konkretna pravila sa razlogom. Sve što mašina može provjeriti bolje je kao hook ili test (lekcija 4).' },
  ],
});

LEKCIJE_AG.push({
  id: 'ag4', naslov: 'Hookovi: pravilo koje mašina provjerava', cilj: 'Kad agent zaboravi pravilo, hook ga ne zaboravi: događaji, ulaz kao JSON, blokiranje i tvoja prva dva hooka.',
  koraci: [
    { tip: 'tekst', naslov: 'Pravilo prekršeno dva puta postaje hook', html: `
      <p>U inhome je pravilo „podigni CACHE u sw.js“ ručno pominjano <b>128 puta</b>. Danas ga radi hook <code>sw-stamp.mjs</code> poslije svake izmjene u <code>static/</code> — nijednom nije zaboravljeno.</p>
      <p><b>Hook</b> je skripta koju Claude Code sam pokrene na <b>događaj</b>:</p>
      <table class="tbl"><tr><th>Događaj</th><th>Kada</th><th>Tvoj primjer</th></tr>
      <tr><td><code>SessionStart</code></td><td>početak sesije</td><td>ubaci STATUS.md i zadnje commitove</td></tr>
      <tr><td><code>PreToolUse</code></td><td>prije alata — <b>može blokirati</b></td><td>ne čitaj .env; ne rasti preko 500 linija</td></tr>
      <tr><td><code>PostToolUse</code></td><td>poslije alata</td><td>sw-stamp poslije Edit/Write</td></tr>
      <tr><td><code>Stop</code></td><td>agent završio odgovor</td><td>test-fast: crveno → nastavi popravljati</td></tr></table>
      <p>Tvoj skill <code>/pravilo-u-hook</code> (project-guard) radi upravo ovo: pravilo iz AGENTS.md pretvori u test, hook ili podešavanje.</p>` },
    { tip: 'primjer', jezik: 'js', bezPokretanja: true, naslov: 'inhome/.claude/hooks/sw-stamp.mjs',
      kod: `const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  let filePath = '';
  try {
    const data = JSON.parse(input || '{}');
    filePath = data.tool_input?.file_path || '';
  } catch { process.exit(0); }
  if (!filePath) process.exit(0);

  const rel = path.relative(root, path.resolve(root, filePath)).split(path.sep).join('/');
  if (!rel.startsWith('static/') || rel === 'static/sw.js') process.exit(0);

  execFileSync(process.execPath, [path.join(root, 'scripts', 'sw-cache.mjs')]);
  process.exit(0);
});`,
      obj: {
        1: 'Folder projekta: Claude Code ga daje kroz env varijablu (Dio 4, tema 9).',
        3: 'Claude Code šalje hooku podatke o alatu kao JSON tekst na ulaz (stdin). Ovdje se skupljaju komadi…',
        5: '…a kad stigne sve (end), obrađuju se.',
        8: '<code>JSON.parse</code> (JS lekcija 4): tekst → objekat, npr. <code>{tool_name: "Edit", tool_input: {file_path: "static/js/app.js"}}</code>.',
        9: '<code>?.</code>: ako nema tool_input, ne pukne nego da undefined.',
        10: 'Pokvaren ulaz → izađi sa 0: hook nikad ne blokira rad zbog svoje greške (fail-open).',
        14: 'Radi samo za fajlove u static/, i ne za sam sw.js (inače bi se vrtio u krug).',
        16: 'Pokrene istu skriptu kao <code>npm run sw:stamp</code>.',
        17: 'Izlaz 0 = sve u redu, agent nastavlja.',
      } },
    { tip: 'popuni', jezik: 'js', pokreni: false, pitanje: 'Uključi taj hook u <code>.claude/settings.local.json</code>: pokreće se <b>poslije</b> alata, i to samo za alate koji mijenjaju fajlove.',
      kod: `{
  "hooks": {
    "___": [
      {
        "matcher": "___",
        "hooks": [
          { "type": "command", "command": "node", "args": [".claude/hooks/sw-stamp.mjs"] }
        ]
      }
    ]
  }
}`,
      odg: [['PostToolUse'], ['Edit|Write|MultiEdit', 'Edit|Write', 'Write|Edit', 'Edit|MultiEdit|Write', 'Write|Edit|MultiEdit']],
      obj: 'Događaj <code>PostToolUse</code> = poslije alata. <code>matcher</code> je regex imena alata: <code>|</code> znači „ili“, pa hook reaguje na Edit, Write i MultiEdit, a ne na Read ili Bash.' },
    { tip: 'tekst', naslov: 'Kako hook kaže „ne“', html: `
      <p>Hook dobije JSON na ulazu, a odgovara <b>izlaznim kodom</b> ili JSON-om:</p>
      <ul><li><b>exit 0</b> — u redu, nastavi.</li>
      <li><b>exit 2</b> — blokiraj; tekst iz <code>stderr</code> ide agentu kao poruka. U Stop hooku to znači „nisi gotov“: agent dobije grešku i nastavi raditi.</li>
      <li><b>JSON odluka</b> (PreToolUse) — project-guard vraća <code>{ permissionDecision: "deny", permissionDecisionReason: "…" }</code>; razlog agent pročita i prilagodi se.</li></ul>
      <p>Dobar razlog kaže <b>šta umjesto toga</b>: „Ne dodaj kod u ovaj fajl. Prvo ga podijeli po odgovornostima, ili novi kod stavi u novi fajl.“</p>` },
    { tip: 'predvidi', jezik: 'js', bezPokretanja: true, pitanje: 'Stop hook <code>test-fast.mjs</code>: agent je završio odgovor, a <code>npm run test:fast</code> pada. Šta se dešava?',
      kod: `try {
  execSync('npm run test:fast', { cwd: root });
  console.log(JSON.stringify({ systemMessage: 'test:fast ✓' }));
  process.exit(0);
} catch (error) {
  console.error('npm run test:fast je pao. Popravi prije nego kažeš da je gotovo:\\n' + zadnjih40linija);
  process.exit(2);
}`,
      opcije: ['Agent kaže „gotovo“ i staje', 'Hook izađe sa 2, agent dobije izlaz testa i nastavi popravljati', 'Hook obriše izmjene', 'Ništa, hook samo ispiše poruku'], t: 1,
      obj: 'exit 2 u Stop hooku vraća agenta na posao sa porukom iz stderr (zadnjih 40 linija izlaza testa). „Crveno = stop“ više ne zavisi od toga da li se agent sjeti pravila.' },
    { tip: 'primjer', jezik: 'js', naslov: 'Odluka kao obična funkcija',
      uvod: 'Srce PreToolUse hooka je funkcija: ulaz je objekat o alatu, izlaz je odluka ili null. Pokreni i promijeni komandu.',
      kod: `function odluka(ulaz) {
  if (ulaz.tool_name === "Bash" && ulaz.tool_input.command.includes("rm -rf")) {
    return { odluka: "deny", razlog: "Brisanje foldera radi korisnik ručno." };
  }
  return null;
}
console.log(odluka({ tool_name: "Bash", tool_input: { command: "rm -rf static" } }));
console.log(odluka({ tool_name: "Read", tool_input: { file_path: "app.py" } }));`,
      obj: {
        1: 'Ulaz je isti oblik koji hook dobije kroz stdin (poslije JSON.parse).',
        2: 'Dva uslova sa <code>&amp;&amp;</code>: alat je Bash I komanda sadrži „rm -rf“.',
        3: 'Blokada sa razlogom koji agentu kaže šta dalje.',
        5: '<code>null</code> = nemam primjedbu, pusti.',
      } },
    { tip: 'zadatak', jezik: 'js', naslov: 'Hook za tajne',
      opis: `<p>Napiši <code>odluka(ulaz)</code> kao u project-guard <code>secrets.js</code>:</p><ul><li><code>Read</code>, <code>Edit</code> ili <code>Write</code> nad fajlom <code>.env</code> ili <code>.env.nešto</code> → blokiraj, <b>osim</b> <code>.env.example</code> (u njemu su primjeri, ne tajne).</li><li><code>Bash</code> komanda u kojoj je <code>.env</code> kao cijela riječ (npr. <code>cat .env</code>) → blokiraj.</li><li>Blokada: <code>{ odluka: "deny", razlog: "…" }</code>; inače <code>null</code>.</li></ul>`,
      pocetak: `function odluka(ulaz) {
  const alat = ulaz.tool_name;
  const put = ulaz.tool_input.file_path || "";
  const komanda = ulaz.tool_input.command || "";
  const ime = put.split("/").pop();   // "C:/dev/inhome/.env" → ".env"
  // tvoj kod: vrati { odluka: "deny", razlog: "…" } ili null
  return null;
}`,
      testovi: [
        { opis: 'Read .env je blokiran', kod: "ocekuj(odluka({ tool_name: 'Read', tool_input: { file_path: 'C:/dev/inhome/.env' } })?.odluka, 'deny', 'Read .env')" },
        { opis: 'Edit .env.production je blokiran', kod: "ocekuj(odluka({ tool_name: 'Edit', tool_input: { file_path: 'C:/dev/Sole-KP/.env.production' } })?.odluka, 'deny', 'Edit .env.production')" },
        { opis: 'Read .env.example je dozvoljen', kod: "ocekuj(odluka({ tool_name: 'Read', tool_input: { file_path: 'C:/dev/inhome/.env.example' } }), null, 'Read .env.example')" },
        { opis: 'Obični fajlovi su dozvoljeni', kod: "ocekuj(odluka({ tool_name: 'Edit', tool_input: { file_path: 'C:/dev/inhome/app.py' } }), null, 'Edit app.py')" },
        { opis: 'Bash: cat .env je blokiran', kod: "ocekuj(odluka({ tool_name: 'Bash', tool_input: { command: 'cat .env' } })?.odluka, 'deny', 'cat .env')" },
        { opis: 'Bash: npm run test:fast je dozvoljen', kod: "ocekuj(odluka({ tool_name: 'Bash', tool_input: { command: 'npm run test:fast' } }), null, 'npm run test:fast')" },
        { opis: 'Blokada ima razlog (tekst)', kod: "ocekuj(typeof odluka({ tool_name: 'Read', tool_input: { file_path: '.env' } })?.razlog, 'string', 'razlog')" },
      ],
      nagovjestaji: ['Da li je ime tajna: <code>ime === ".env" || (ime.startsWith(".env.") &amp;&amp; ime !== ".env.example")</code>', 'Da li je alat jedan od tri: <code>["Read", "Edit", "Write"].includes(alat)</code>', 'Za Bash: regex <code>/\\.env(\\s|$)/.test(komanda)</code> — „.env“ iza kojeg je razmak ili kraj teksta.'],
      rjesenje: `function odluka(ulaz) {
  const alat = ulaz.tool_name;
  const put = ulaz.tool_input.file_path || "";
  const komanda = ulaz.tool_input.command || "";
  const ime = put.split("/").pop();
  const tajna = ime === ".env" || (ime.startsWith(".env.") && ime !== ".env.example");
  if (["Read", "Edit", "Write"].includes(alat) && tajna) {
    return { odluka: "deny", razlog: "Tajne čita i mijenja samo korisnik; primjer ide u .env.example." };
  }
  if (alat === "Bash" && /\\.env(\\s|$)/.test(komanda)) {
    return { odluka: "deny", razlog: "Komanda dira .env; to radi korisnik ručno." };
  }
  return null;
}`,
      objRj: 'Pravi hook oko ove funkcije samo pročita stdin, pozove je i odluku ispiše kao JSON. Logika je čista funkcija, pa se lako testira — kao hookovi u claude-plugins.' },
    { tip: 'zadatak', jezik: 'js', naslov: 'Hook za limit od 500 linija',
      opis: `<p>Tvoj project-guard blokira izmjenu kad bi fajl imao više od <code>maks</code> linija <b>i</b> raste. Stari veliki fajlovi (monoliti) smiju se smanjivati.</p><p>Napiši <code>provjeriVelicinu(sada, poslije, maks)</code>: ako je <code>poslije &gt; maks</code> i <code>poslije &gt; sada</code>, vrati poruku (tekst) u kojoj piše broj linija poslije izmjene; inače <code>null</code>.</p>`,
      pocetak: `function provjeriVelicinu(sada, poslije, maks) {
  return null;
}`,
      testovi: [
        { opis: 'Nov fajl od 520 linija: blokiran', kod: "ocekuj(typeof provjeriVelicinu(100, 520, 500), 'string', '100 → 520')" },
        { opis: 'Poruka kaže broj linija', kod: "ocekuj(String(provjeriVelicinu(100, 520, 500)).includes('520'), true, 'poruka sadrži 520')" },
        { opis: 'Monolit koji se smanjuje: dozvoljen', kod: "ocekuj(provjeriVelicinu(900, 850, 500), null, '900 → 850')" },
        { opis: 'Ispod limita: dozvoljen', kod: "ocekuj(provjeriVelicinu(480, 499, 500), null, '480 → 499')" },
        { opis: 'Tačno na granici prelazi: 500 → 501', kod: "ocekuj(typeof provjeriVelicinu(500, 501, 500), 'string', '500 → 501')" },
      ],
      nagovjestaji: ['Dva uslova moraju biti tačna: <code>poslije &gt; maks &amp;&amp; poslije &gt; sada</code>.', 'Poruka: <code>`Fajl bi imao ${poslije} linija (maks ${maks}). Podijeli ga po odgovornostima.`</code>'],
      rjesenje: `function provjeriVelicinu(sada, poslije, maks) {
  if (poslije > maks && poslije > sada) {
    return \`Fajl bi imao \${poslije} linija (maks \${maks}). Podijeli ga po odgovornostima ili novi kod stavi u novi fajl.\`;
  }
  return null;
}` },
    { tip: 'kviz', p: 'Hook za provjeru veličine fajla ima bug i baci grešku. Šta treba da se desi?', o: ['Blokirati sve izmjene dok se ne popravi', 'Pustiti izmjenu i zapisati grešku u log (fail-open) — osim kod blokade tajni', 'Obrisati hook', 'Ugasiti Claude Code'], t: 1, e: 'Pravilo iz claude-plugins/CLAUDE.md: hookovi su fail-open, jer pokvaren hook ne smije zaustaviti sav rad. Tajne su izuzetak (fail-fast): tamo je bolje blokirati nego procuriti.' },
    { tip: 'kviz', p: 'Zašto PreToolUse hook mora biti brz (ispod 200 ms)?', o: ['Zbog cijene', 'Pokreće se prije SVAKOG poziva alata; spor hook uspori svaki korak agenta', 'Jer ga Git traži', 'Ne mora'], t: 1, e: 'Agent pozove alat desetine puta po zadatku. 2 s × 40 poziva = više od minute čekanja na svaki zahtjev.' },
  ],
});


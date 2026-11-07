// ============================================================================
// Dio 5 · Rad sa AI agentima — lekcije 5–6 (provjera rada agenta, git i paralelni rad).
// U kodu lekcija: ` piši kao \`,   ${ kao \${,   a \ kao \\ (u regexima testova \\ postaje \).
// ============================================================================
LEKCIJE_AG.push({
  id: 'ag5', naslov: 'Provjera rada agenta', cilj: '„Gotovo“ nije dokaz. Kako čitati diff, šta testovi dokazuju, gdje se agenti najčešće „snađu“ na pogrešan način i ko provjerava umjesto tebe.',
  koraci: [
    { tip: 'tekst', naslov: 'Tri provjere prije „gotovo“', html: `
      <ol><li><b>Testovi</b> — mašina provjeri ponašanje: <code>npm run test:fast</code>, <code>pytest</code>. <b>Crveno znači stop</b>, ne „poznata greška“.</li>
      <li><b>Diff</b> — pogledaš ŠTA je promijenjeno. Ne moraš razumjeti svaku liniju; tražiš ono što ne pripada zadatku ili krši pravilo.</li>
      <li><b>Ekran</b> — jednom klikneš ono što si tražio, kao korisnik.</li></ol>
      <p>Agent se ponekad „snađe“ na pogrešan način: isključi test koji pada, zakuca vrijednost umjesto da je čita iz okruženja, ili ukloni provjeru jer „smeta“. Sve troje se vidi u diffu za pola minute.</p>` },
    { tip: 'primjer', jezik: 'tekst', bezPokretanja: true, naslov: 'inhome: test:fast je lanac provjera',
      kod: `"test:fast":
     node scripts/verify-app-next-sources.mjs
  && node scripts/sw-cache.mjs --check
  && eslint static/js scripts tests/vitest tests/playwright --quiet
  && vitest run`,
      obj: {
        1: 'Skripta iz package.json. Pokreće se sa <code>npm run test:fast</code> (i sama, kroz Stop hook).',
        2: 'Provjera da su izvori ekrana ispravni (build gate).',
        3: '<code>&amp;&amp;</code> znači: sljedeće se pokreće SAMO ako je prethodno prošlo. Ovdje: je li CACHE u sw.js podignut.',
        4: 'Lint: greške u kodu koje se vide bez pokretanja (nepostojeća varijabla, zaboravljen import).',
        5: 'Vitest: brzi unit testovi (709 testova za ~16 s).',
      } },
    { tip: 'predvidi', jezik: 'tekst', bezPokretanja: true, pitanje: 'eslint je našao grešku. Šta se dešava sa <code>vitest run</code>?',
      kod: `node scripts/verify-app-next-sources.mjs   ✓
&& node scripts/sw-cache.mjs --check       ✓
&& eslint …                                 ✗ 1 error
&& vitest run                               ?`,
      opcije: ['Pokrene se normalno', 'Ne pokrene se — && staje na prvoj grešci, a cijela komanda je crvena', 'Pokrene se dvaput', 'Preskoči eslint i nastavi'], t: 1,
      obj: '<code>&amp;&amp;</code> je „i onda, ako je uspjelo“. Prva greška zaustavi lanac i cijeli test:fast je crven. Zato popraviš prvu grešku pa pokreneš ponovo.' },
    { tip: 'tekst', naslov: 'Kako čitati diff', html: `
      <p><b>Diff</b> pokazuje razliku prije i poslije:</p>
      <ul><li><code>@@ fajl @@</code> — koji fajl (i gdje u njemu).</li>
      <li>linija sa <code>-</code> na početku — <span style="color:var(--bad)">obrisana</span>.</li>
      <li>linija sa <code>+</code> — <span style="color:var(--good)">dodana</span>.</li>
      <li>linija bez znaka — nepromijenjena, tu je radi konteksta.</li></ul>
      <p>Gdje ga vidiš: u Claude Code desktop aplikaciji (pregled izmjena), sa <code>git diff</code>, ili u PR-u na GitHubu. Pitaj se za svaku izmjenu: <b>da li ovo pripada zadatku?</b></p>` },
    { tip: 'greska', jezik: 'diff', bezPokretanja: true, pitanje: 'Zadatak je bio „popravi brisanje fakture“. Agent kaže da su testovi zeleni. Klikni liniju koja to objašnjava.',
      kod: `@@ tests/test_fakture.py @@
 def test_brisanje_fakture_brise_stavke(client):
+    pytest.skip("pada na CI, riješiti kasnije")
     r = client.delete("/api/fakture/15")
     assert r.status_code == 200
     assert broj_stavki(15) == 0`,
      linija: 3, obj: 'Test nije popravljen nego <b>isključen</b>: skip znači da se uopšte ne izvrši, pa je „zeleno“ lažno. Pravilo: agent ne isključuje i ne briše test koji pada bez tvog izričitog odobrenja.' },
    { tip: 'greska', jezik: 'diff', bezPokretanja: true, pitanje: 'Zadatak je bio „prijava ne radi lokalno“. Klikni liniju koju ne smiješ pustiti u commit.',
      kod: `@@ config.py @@
 import os
-JWT_SECRET = os.environ["JWT_SECRET"]
+JWT_SECRET = "moj-tajni-kljuc-123"
 DB_PATH = os.environ.get("DB_PATH", "var/inhome.db")`,
      linija: 4, obj: 'Tajna je zakucana u kod i završila bi na GitHubu. Tajne se čitaju iz okruženja (<code>.env</code> lokalno, env varijable na Renderu; Dio 4, teme 8 i 9). Ispravno: vrati staru liniju, a vrijednost stavi u <code>.env</code>.' },
    { tip: 'greska', jezik: 'diff', bezPokretanja: true, pitanje: 'Zadatak je bio „marža se ne prikazuje u dosijeu“. Klikni liniju koja krši pravilo projekta.',
      kod: `@@ static/js/app-next-dosije.js @@
 function renderFinansije(posao, plan) {
-  if (plan !== "pro") return "";
   return \`<section>Marža: \${posao.marza} %</section>\`;
 }`,
      linija: 3, obj: 'Obrisana je provjera plana: sada i Lite korisnik vidi Pro podatak (maržu). Pravilo iz AGENTS.md: „Čuvati Lite/Pro razliku.“ Prava popravka je naći zašto Pro korisnik ne vidi maržu, a provjeru ostaviti (i na backendu).' },
    { tip: 'primjer', jezik: 'tekst', bezPokretanja: true, naslov: 'Ko provjerava umjesto tebe: subagenti (inhome)',
      kod: `---
name: tester
description: Pokreće testove relevantne za trenutne izmjene i vraća samo kratak izvještaj.
tools: Read, Grep, Glob, Bash, PowerShell
model: haiku
---
Ti si tester za INHome. Ne mijenjaš nijedan fajl, samo pokrećeš provjere i izvještavaš.`,
      obj: {
        2: 'Ime po kojem ga glavni agent poziva.',
        3: 'Opis: glavni agent po njemu odlučuje KAD da ga pozove.',
        4: 'Nema Edit ni Write: tester ne može ništa promijeniti, samo pokrenuti i pročitati.',
        5: 'Jeftin, brz model: pokretanje testova je rutina.',
        7: 'Uputstvo. Dugi izlaz testova ostane u testerovom kontekstu; glavnom agentu stigne samo presuda.',
      },
      poslije: 'Komanda <code>/provjeri</code> u inhome pokrene <code>tester</code>, pa <code>cuvar-pravila</code> (pregled izmjena prema CLAUDE.md i AGENTS.md, checklist ✓/✗). Oba samo čitaju.' },
    { tip: 'zadatak', jezik: 'js', naslov: 'Presuda: gotovo ili stop',
      opis: `<p>Napiši <code>presuda(provjere)</code>. Ulaz je niz objekata <code>{ ime, ok }</code>. Vrati:</p><ul><li><code>"gotovo"</code> ako su sve provjere prošle,</li><li><code>"stop: "</code> + imena palih provjera odvojena sa <code>", "</code> (npr. <code>"stop: lint, vitest"</code>),</li><li><code>"stop: nema provjera"</code> ako je niz prazan — bez provjera nema dokaza.</li></ul>`,
      pocetak: `function presuda(provjere) {
  // provjere: [{ ime: "lint", ok: true }, { ime: "vitest", ok: false }]
  return "gotovo";
}`,
      testovi: [
        { opis: 'Sve zeleno → gotovo', kod: "ocekuj(presuda([{ ime: 'lint', ok: true }, { ime: 'vitest', ok: true }]), 'gotovo', 'sve zeleno')" },
        { opis: 'Jedna pala → stop: vitest', kod: "ocekuj(presuda([{ ime: 'lint', ok: true }, { ime: 'vitest', ok: false }]), 'stop: vitest', 'vitest pao')" },
        { opis: 'Dvije pale → obje, redom', kod: "ocekuj(presuda([{ ime: 'lint', ok: false }, { ime: 'build', ok: true }, { ime: 'vitest', ok: false }]), 'stop: lint, vitest', 'dvije pale')" },
        { opis: 'Bez provjera → nema dokaza', kod: "ocekuj(presuda([]), 'stop: nema provjera', 'prazan niz')" },
      ],
      nagovjestaji: ['Prvo prazan niz: <code>if (provjere.length === 0) return …</code>', 'Imena palih: <code>provjere.filter(p =&gt; !p.ok).map(p =&gt; p.ime)</code> (JS lekcija 5).', 'Spajanje: <code>pale.join(", ")</code>.'],
      rjesenje: `function presuda(provjere) {
  if (provjere.length === 0) return "stop: nema provjera";
  const pale = provjere.filter(p => !p.ok).map(p => p.ime);
  if (pale.length > 0) return "stop: " + pale.join(", ");
  return "gotovo";
}`,
      objRj: 'Ista logika kao Stop hook i /provjeri: ne pita se agent da li misli da je gotovo, nego šta kažu provjere. Prazan spisak nije „sve prošlo“.' },
    { tip: 'kviz', p: 'test:fast je crven, a agent kaže: „To je poznata greška, nije od mene.“ Šta radiš?', o: ['Prihvatiš i commitaš', 'Stop: tražiš dokaz (isti test pada i na main prije izmjene) ili popravku; crveno ne ide u commit', 'Isključiš test', 'Obrišeš test'], t: 1, e: 'Iz tvojih pravila: crveni testovi znače stop, ne „poznata baza“. Ako greška stvarno postoji od ranije, to je poseban zadatak — ali tvoj commit ne smije ostaviti crveno.' },
    { tip: 'kviz', p: 'Zašto tester subagent koristi haiku, a cuvar-pravila glavni model?', o: ['Slučajno', 'Pokretanje testova je rutina; procjena da li izmjena krši pravila traži razumijevanje', 'Haiku je sigurniji', 'Da bude sporije'], t: 1, e: 'Najniži model koji je dovoljno pouzdan za zadatak (lekcija 10).' },
  ],
});

LEKCIJE_AG.push({
  id: 'ag6', naslov: 'Git i paralelni rad', cilj: 'Grana, commit, PR i worktree: kako agent radi a da ne pokvari main, i kako dva agenta rade istovremeno.',
  koraci: [
    { tip: 'tekst', naslov: 'Git u pet riječi', html: `
      <ul><li><b>Commit</b> — snimak stanja sa porukom. Mali commitovi = lako vratiti jedan korak.</li>
      <li><b>Grana</b> (<i>branch</i>) — odvojena linija rada. <code>main</code> je ono što radi; nova grana je pješčanik.</li>
      <li><b>PR</b> (<i>pull request</i>) — zahtjev da se grana spoji u main, uz diff i provjere (CI na GitHubu).</li>
      <li><b>Merge</b> — spajanje grane u main.</li>
      <li><b>Worktree</b> — drugi folder iste repozitorije na drugoj grani. Dva agenta rade u dva foldera i ne gaze se.</li></ul>
      <div class="flow">
        <div class="box ld"><span class="k">main</span><b>radi</b><span>niko ne radi direktno</span></div><span class="arrow">→</span>
        <div class="box lnet"><span class="k">grana</span><b>claude/…</b><span>agent radi ovdje</span></div><span class="arrow">→</span>
        <div class="box ls"><span class="k">commitovi</span><b>mali koraci</b><span>test:fast zelen</span></div><span class="arrow">→</span>
        <div class="box lc"><span class="k">PR</span><b>pregled</b><span>diff + CI</span></div><span class="arrow">→</span>
        <div class="box ld"><span class="k">merge</span><b>main</b><span>nova verzija</span></div></div>
      <p class="small muted">I ova učionica se mijenja upravo tako: sesija radi u worktree-ju na grani <code>claude/ai-agents-workshop-…</code>.</p>` },
    { tip: 'poredaj', jezik: 'tekst', pokreni: false, pitanje: 'Poredaj korake jednog zadatka od početka do main-a.',
      linije: [
        'git status — šta je već izmijenjeno (tuđe izmjene ne diraj)',
        'git switch -c fix/uplate-broj — nova grana',
        'agent mijenja kod',
        'npm run test:fast — provjera',
        'git commit -m "fix(uplate): …" — mali snimak',
        'git push i PR — pregled diffa i CI',
        'merge u main',
      ],
      obj: 'Pravilo iz inhome AGENTS.md: prije editovanja <code>git status</code>, i postojeće izmjene tretirati kao tuđi rad. Provjera ide prije commita, pregled prije main-a.' },
    { tip: 'primjer', jezik: 'tekst', bezPokretanja: true, naslov: 'Stvarni git log (inhome)',
      kod: `585cfc59 fix(baza,paleta): bez API rute u editoru Baze; „šablon“ u paleti i kalkulatoru
0db89476 docs(progress): zapis za 2026-09-27 — integracija PR #53, #54, #55 i uplate na main
907263b8 Merge fix/uplate-pluralizacija: „1 zapis“ umjesto „1 zapisa“ u Evidenciji uplata
efa0350f fix(uplate): „1 zapis“ umjesto „1 zapisa“ u Evidenciji uplata
98eb4480 fix(dijakritika): „Otkazivanje“ sa z u UI-ju; kapija hvata i obrnutu gresku`,
      obj: {
        1: 'Obrazac <code>tip(oblast): šta</code>. Tip: fix = popravka, feat = nova funkcija, docs = dokumenti, refactor, test, chore.',
        2: 'Zapis o napretku je poseban commit (docs), odvojen od koda.',
        3: 'Merge: grana <code>fix/uplate-pluralizacija</code> je spojena u main.',
        4: 'Sam popravak: jedan mali commit sa jasnom porukom. Za godinu dana, <code>git log</code> tačno kaže kad i zašto.',
        5: 'Popravka + zaštita od ponavljanja („kapija hvata i obrnutu grešku“) u istom koraku.',
      } },
    { tip: 'kviz', p: 'Koja commit poruka je najbolja?', o: ['izmjene', 'fix', 'fix(fakture): brisanje fakture briše i stavke u transakciji', 'Popravio sam onaj bug od juče što smo pričali, sad bi trebalo da radi.'], t: 2, e: 'Tip, oblast i šta se promijenilo, u jednom redu. Poruka se čita godinama kasnije, bez konteksta razgovora.' },
    { tip: 'zadatak', jezik: 'tekst', naslov: 'Napiši commit poruku',
      opis: `<p>Agent je popravio da u Evidenciji uplata piše <b>„1 zapis“</b> umjesto <b>„1 zapisa“</b>. Napiši commit poruku po obrascu <code>tip(oblast): šta</code>.</p><p class="small muted">Prva linija: najviše 72 znaka, bez tačke na kraju. Ispod prazne linije smije ići opširnije objašnjenje.</p>`,
      pocetak: `izmjene`,
      testovi: [
        { opis: 'Prva linija: tip(oblast): opis', linija: 1, ima: ['^(fix|feat|docs|refactor|test|chore|style|perf)\\([a-z0-9,-]+\\): \\S'], poruka: 'počni sa npr. fix(uplate): i opisom' },
        { opis: 'Prva linija najviše 72 znaka', linija: 1, maxZnakova: 72 },
        { opis: 'Kaže o čemu se radi (uplate)', linija: 1, ima: ['uplat'] },
        { opis: 'Bez tačke na kraju prve linije', linija: 1, nema: ['\\.$'] },
        { opis: 'Tip odgovara popravci (fix)', linija: 1, ima: ['^fix'], poruka: 'ovo je popravka buga, pa je tip fix' },
      ],
      nagovjestaji: ['Tip je <code>fix</code> (popravka), oblast <code>uplate</code>.', 'Šta: „1 zapis“ umjesto „1 zapisa“ u Evidenciji uplata.'],
      rjesenje: `fix(uplate): „1 zapis“ umjesto „1 zapisa“ u Evidenciji uplata` },
    { tip: 'tekst', naslov: 'Dva agenta istovremeno (Sole-KP)', html: `
      <table class="tbl"><tr><th>Agent</th><th>Grana</th><th>Folder</th></tr>
      <tr><td>Integracija</td><td><code>main</code></td><td>nema direktnog rada</td></tr>
      <tr><td>Claude Code</td><td><code>agent/claude-current</code></td><td>originalni folder</td></tr>
      <tr><td>Codex</td><td><code>agent/codex-parallel</code></td><td><code>C:\\Dev\\Sole-KP-codex</code> (worktree)</td></tr></table>
      <p>Pravila iz <code>PARALLEL_WORK.md</code>:</p>
      <ul><li>Agent ne mijenja fajlove koje trenutno posjeduje drugi agent.</li>
      <li>Migracije, zavisnosti (<code>uv.lock</code>) i zajednički helperi imaju <b>jednog vlasnika</b> po zadatku.</li>
      <li>Integracija na main ide <b>jedna grana odjednom</b>, uz pregled diffa i testove.</li>
      <li>Ako oba zadatka trebaju isti fajl, jedan završi i integriše, pa drugi nastavi od novog main-a.</li></ul>
      <p>Tvoj skill <code>/codex-worktree</code> pravi worktree i granu za Codex, a <code>spoji &lt;zadatak&gt;</code> vraća rad kroz PR.</p>` },
    { tip: 'predvidi', jezik: 'tekst', bezPokretanja: true, pitanje: 'Dva agenta u ISTOM folderu i na istoj grani mijenjaju isti fajl. Šta je najvjerovatnije?',
      kod: `Claude Code: Edit(workflow_service.py) — dodaje obračun avansa
Codex:       Edit(workflow_service.py) — mijenja nazive funkcija
(isti folder, grana main, isto vrijeme)`,
      opcije: ['Git automatski spoji obje izmjene', 'Jedan pregazi dio izmjena drugog ili ih pomiješa; testovi i diff postanu nečitljivi', 'Drugi agent sačeka prvog', 'Ništa posebno'], t: 1,
      obj: 'Agenti ne znaju jedan za drugog. Zato: jedan agent = jedna grana = jedan folder (worktree), i jedan vlasnik zajedničkog fajla.' },
    { tip: 'kviz', p: 'Oba zadatka trebaju novu migraciju baze. Kako?', o: ['Oba agenta istovremeno prave migraciju', 'Jedan zadatak je vlasnik migracije: završi i integriše u main, pa drugi nastavi od novog main-a', 'Preskoči migraciju', 'Svaki agent svoju bazu'], t: 1, e: 'Migracije su numerisan niz (Dio 4, tema 4): dvije paralelne „0023“ se sudaraju.' },
    { tip: 'kviz', p: 'Šta je worktree?', o: ['Kopija projekta na USB-u', 'Drugi radni folder iste git repozitorije, na drugoj grani', 'Grana na GitHubu', 'Backup'], t: 1, e: 'Jedna historija, dva foldera. Svaki agent ima svoj, pa se izmjene ne miješaju dok ih PR ne spoji.' },
  ],
});


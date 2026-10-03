// Dio 5 · Rad sa Claudeom i agentima: tema 11 (iz 40-teme.js) + teme 12–16.
// Činjenice o Claude Code i Claudeu provjerene u zvaničnoj dokumentaciji (code.claude.com,
// platform.claude.com, support.claude.com) 2026-10-03. Alat se brzo mijenja: pri izmjeni provjeri ponovo.

Object.assign(DIA, {
  prompt(){ const L=[['1 · materijal','Dokument, mejl, tabela','Dug tekst ide na početak, u oznaci: &lt;ugovor&gt;…&lt;/ugovor&gt;','ld'],['2 · kontekst','Ko si, za koga, zašto','„Radionica namještaja po mjeri, klijent je arhitekta, ide u ponudu.“','lc'],['3 · zadatak i format','Šta tačno i u kom obliku','„Tabela: stavka, količina, cijena. Najviše 10 redova.“','ls'],['4 · primjer','Kako izgleda dobro','Stara ponuda koja ti se sviđa, kao uzor stila.','ls'],['5 · pitanje','Na kraju','Konkretno pitanje ili nalog, poslije svega gore.','lnet']];
    return `<div class="stack">${L.map(([k,b,s,c],i)=>`<div class="box ${c}"><span class="k">${k}</span><b>${b}</b><span>${s}</span></div>${i<4?'<span class="arrow" style="text-align:center">↓</span>':''}`).join('')}</div>
    <p class="small muted" style="margin-top:8px">Nije svaki prompt toliko dug. Ali kad odgovor nije dobar, gotovo uvijek fali jedan od ovih dijelova.</p>`; },
  memorija(){ const L=[['~/.claude/CLAUDE.md','Tvoja pravila za sve projekte','npr. „odgovaraj na bosanskom“','lc'],['./CLAUDE.md','Pravila projekta, u gitu, za cijeli tim','komande za test, šta se ne dira','ls'],['./CLAUDE.local.md','Lično za ovaj projekt, u .gitignore','tvoja testna baza, tvoje skraćenice','ls'],['podfolder/CLAUDE.md','Učita se tek kad Claude čita fajlove u tom folderu','pravila samo za frontend','ld']];
    return `<div class="stack">${L.map(([k,b,s,c],i)=>`<div class="box ${c}"><span class="k">${k}</span><b>${b}</b><span>${s}</span></div>${i<3?'<span class="arrow" style="text-align:center">↓ sve se sabira, ne briše jedno drugo</span>':''}`).join('')}</div>
    <p class="small muted" style="margin-top:8px">Sve pronađene datoteke se spoje u kontekst sesije. Bliža datoteka (folder u kojem radiš) se čita zadnja.</p>`; },
  subagenti(){ return `<div class="flow">
    <div class="box lc"><span class="k">glavna sesija</span><b>„Zašto faktura kasni?“</b><span>tvoj razgovor, tvoj kontekst</span></div><span class="arrow">→</span>
    <div class="stack" style="flex:1 1 180px">
      <div class="box ls"><span class="k">subagent 1 · Explore</span><b>pretraži rute</b><span>čita 30 fajlova u svom kontekstu</span></div>
      <div class="box ls"><span class="k">subagent 2</span><b>pokreni testove</b><span>dug izlaz ostaje kod njega</span></div>
      <div class="box ls"><span class="k">subagent 3</span><b>pregledaj git log</b><span>radi istovremeno sa ostalima</span></div></div><span class="arrow">→</span>
    <div class="box ld"><span class="k">nazad</span><b>tri kratka sažetka</b><span>glavna sesija odlučuje šta dalje</span></div></div>`; },
  mcp(){ return `<div class="flow">
    <div class="box lc"><span class="k">Claude Code</span><b>„Koji PR-ovi čekaju?“</b><span>vidi alate koje serveri nude</span></div><span class="arrow">⇄</span>
    <div class="box lnet"><span class="k">MCP server</span><b>github</b><span>mali program: prevodi poziv alata u API servisa</span></div><span class="arrow">⇄</span>
    <div class="box ld"><span class="k">servis</span><b>GitHub</b><span>pravi podaci, prava dozvola</span></div></div>
    <p class="small muted" style="margin-top:8px">Isto za bazu, Google Drive, Figmu, Sentry… Jedan protokol, mnogo servera. Svaki server je novi alat, ali i nova vrata u tvoje podatke.</p>`; },
  raspored(){ return `<div style="overflow-x:auto"><table class="tbl"><tr><th></th><th>/loop</th><th>Desktop zadatak</th><th>Rutina (cloud)</th></tr>
    <tr><td>Gdje radi</td><td>tvoj računar</td><td>tvoj računar</td><td>Anthropic cloud</td></tr>
    <tr><td>Računar upaljen?</td><td>da</td><td>da</td><td>ne</td></tr>
    <tr><td>Sesija otvorena?</td><td>da</td><td>ne</td><td>ne</td></tr>
    <tr><td>Lokalni fajlovi</td><td>da</td><td>da</td><td>ne (svježa kopija repozitorija)</td></tr>
    <tr><td>Najkraći razmak</td><td>1 min</td><td>1 min</td><td>1 sat</td></tr></table></div>
    <p class="small muted" style="margin-top:8px">Četvrta opcija su GitHub Actions: zadatak vezan za repozitorij (novi PR, raspored u CI-ju). Izvor: Claude Code dokumentacija, „Run prompts on a schedule“.</p>`; },
});

TEME.push(
{ id:'m12', n:'12', dio:5, naslov:'Promptovi i dokumenti', pod:'Kontekst, zadatak, format, primjer; analiza dokumenata; pisanje',
  ideja:[
    'Claude odgovara na ono što napišeš, ne na ono što misliš. Dobar prompt je kao dobar radni nalog: <b>kontekst</b> (ko si, za koga je), <b>zadatak</b> (šta tačno), <b>format</b> (tabela, mejl, 5 redova) i po potrebi <b>primjer</b> dobrog rezultata. Reci i <b>zašto</b>: „kratko, jer klijent čita na telefonu“ radi bolje od samog „kratko“, jer Claude onda zna šta je važno.',
    'Dokumenti (PDF ponude, ugovori, Excel, slike skica): dug materijal stavi <b>na početak</b>, a pitanje <b>na kraj</b>. Anthropic u dokumentaciji navodi da pitanje na kraju u njihovim testovima popravlja odgovor do 30%, naročito kod više dokumenata. Za dug dokument traži da Claude <b>prvo izdvoji citate</b> relevantnih dijelova, pa tek onda zaključi: tako vidiš na čemu se zaključak zasniva i lako ga provjeriš. Oznake kao <code>&lt;ugovor&gt;…&lt;/ugovor&gt;</code> odvajaju materijal od uputstva.',
    'Pisanje (mejlovi, ponude, izvještaji): daj svoj stari dobar tekst kao uzor stila i reci kome ide. Za prepisku zalijepi cijelu nit i reci šta želiš postići („klijent traži popust, ja nudim besplatnu montažu umjesto popusta“). Claude može samouvjereno pogriješiti (to se zove halucinacija): brojeve, datume, cijene i imena uvijek provjeri u izvoru prije slanja.',
  ],
  analogija:'Prompt je radni nalog za radionicu. „Napravi ormar“ daje bilo kakav ormar. Mjere, materijal, boja, skica i rok daju baš tvoj ormar, i iz prve.',
  dia:'prompt',
  kodNaslov:'Primjeri promptova',
  kod:[
    {p:'primjer prompta · ponuda', t:'los', k:`Napiši ponudu za kuhinju.`, o:'Nema klijenta, mjera, materijala, cijene ni tona. Claude mora nagađati, pa „popuni“ detalje koji nisu tvoji.'},
    {p:'primjer prompta · ponuda', t:'dobar', k:`Radim namještaj po mjeri. Napiši ponudu za klijenta Amru H. (privatno lice).

<podaci>
Kuhinja u obliku slova L, 3,2 m + 1,8 m. Korpus iverica 18 mm bijela,
fronte MDF lakirani antracit, radna ploča hrast 38 mm.
Cijena 4.850 KM sa PDV-om, montaža uključena, rok 30 radnih dana.
</podaci>

<uzor>
(ovdje zalijepi jednu svoju raniju ponudu koja ti se sviđa)
</uzor>

Stil i struktura kao u uzoru. Ton: ljubazan, bez pretjerivanja.
Na kraju: rok važenja ponude 15 dana i način plaćanja 50% avans.
Ne dodaji stavke kojih nema u podacima.`, o:'Kontekst, podaci u oznaci, uzor stila, format i jasna granica („ne dodaji“). Uz to, rezultat se lako provjeri jer su svi brojevi u promptu.'},
    {p:'primjer prompta · ugovor (dug dokument)', t:'dobar', k:`<ugovor>
(cijeli tekst ugovora sa dobavljačem)
</ugovor>

Prvo u <citati> doslovno prepiši rečenice o rokovima isporuke, penalima i reklamacijama.
Zatim na osnovu samo tih citata napiši: koliko dana imam za reklamaciju i šta plaćam ako kasnim.
Ako nešto nije u ugovoru, napiši „nema u dokumentu“.`, o:'Dokument gore, pitanje dolje; prvo citati, pa zaključak; dozvoljeno „ne znam“. Tako je manje izmišljanja, a ti lako provjeriš svaku tvrdnju.'},
  ],
  greske:['„Napiši ponudu“ bez podataka, pa čuđenje što su cijene izmišljene.','Prihvatiti brojeve, datume i citate bez provjere u izvoru.','Jedan ogroman zahtjev umjesto koraka (prvo sažetak, pa pitanja, pa nacrt).','Povjerljive podatke klijenata lijepiti bez provjere pravila firme i postavki privatnosti.'],
  kviz:[
    {p:'Imaš ugovor od 20 stranica i jedno pitanje. Gdje ide pitanje?', o:['Na početak, prije ugovora','Na kraj, poslije ugovora','Svejedno je','U poseban razgovor'], t:1, e:'Dug materijal na vrh, pitanje na kraj. Dokumentacija navodi do 30% bolji odgovor u testovima.'},
    {p:'Zašto tražiti da Claude prvo izdvoji citate iz dokumenta?', o:['Da odgovor bude duži','Da zaključak bude zasnovan na stvarnom tekstu i da ga lako provjeriš','Jer bez toga ne može čitati PDF','Da potroši manje vremena'], t:1, e:'Citati usmjere Claudea na bitne dijelove, a tebi pokažu na čemu stoji zaključak.'},
    {p:'Koji dodatak promptu najviše popravlja stil mejla?', o:['„Piši lijepo“','Tvoj raniji mejl koji ti se sviđa, kao uzor','Više uzvičnika','„Ti si najbolji pisac“'], t:1, e:'Primjer pokaže stil bolje od bilo kakvog opisa.'},
  ],
  vjezba:{ z:'Popravi ovaj prompt: „Odgovori klijentu na mejl, žali se na kašnjenje.“', h:'Šta Claude ne zna? Ko je klijent, šta je stvarno razlog kašnjenja, šta nudiš, kakav ton, koliko dugo?',
    r:`<mejl_klijenta>
(zalijepi cijeli mejl)
</mejl_klijenta>

Ja sam vlasnik radionice. Kuhinja kasni 6 radnih dana jer dobavljač
nije isporučio fronte; nova isporuka je potvrđena za utorak.
Napiši odgovor: izvini se jednom, objasni razlog u jednoj rečenici,
daj novi datum montaže (četvrtak) i ponudi besplatnu ugradnju
LED rasvjete kao nadoknadu. Ton miran i profesionalan, najviše 8 redova.
Ne obećavaj ništa osim ovoga.`, obj:'Mejl klijenta je materijal (gore), činjenice daješ ti (Claude ih ne može znati), a format i granice su jasni.'},
  agent:['Evo mog prompta: (zalijepi). Prije nego odgovoriš, reci mi koje informacije ti fale da bi odgovor bio tačan, i postavi mi ta pitanja.'],
},
{ id:'m13', n:'13', dio:5, naslov:'Claude Code: terminal i CLAUDE.md', pod:'Sesije, osnovne komande, memorija projekta',
  ideja:[
    '<b>Claude Code</b> je Claude koji radi u tvom projektu: čita fajlove, pokreće komande (testove, git) i mijenja kod, uz tvoje odobrenje. Pokreće se u terminalu u folderu projekta komandom <code>claude</code>; postoji i kao desktop aplikacija, na webu (claude.ai/code) i u VS Code/JetBrains.',
    'Osnovne komande: <code>claude</code> (nova sesija), <code>claude --continue</code> (nastavi zadnji razgovor u ovom folderu), <code>claude --resume</code> ili <code>/resume</code> (izaberi raniji razgovor), <code>claude -p "…"</code> (jedan zadatak bez razgovora, za skripte i CI). U poruci <code>@putanja</code> ubacuje fajl, a slika ili screenshot greške može se zalijepiti direktno.',
    'Svaka sesija počinje <b>bez sjećanja</b>. Ono što Claude mora znati svaki put ide u <b>CLAUDE.md</b>: komande za build i test, pravila koda, šta se ne dira. <code>/init</code> napravi prvu verziju iz koda. Važno: CLAUDE.md je <b>kontekst, a ne prisila</b>. Dokumentacija preporučuje ispod 200 linija po fajlu (duži fajl troši kontekst i slabije se poštuje), a ono što mora važiti uvijek pretvori u hook ili test (tema 11). Uz to postoji i automatska memorija: bilješke koje Claude sam piše iz tvojih ispravki.',
  ],
  analogija:'CLAUDE.md je list papira zalijepljen na vrata radionice: „mjeri dvaput, reži jednom; ne diraj mašinu za kantovanje“. Kratko i na vidnom mjestu. Knjiga od 300 strana na polici se ne čita svako jutro.',
  dia:'memorija',
  napomena:'Komande su provjerene u dokumentaciji Claude Code (oktobar 2026). Alat se brzo mijenja: za tačan detalj pitaj samog Claudea ili otvori dokumentaciju.',
  kod:[
    {p:'ucionica/CLAUDE.md (pravila ove učionice, odlomak)', t:'dobar', k:`- Uređuje se samo \`src/\`. \`dist/\` je generisan i nije u gitu.
- Redoslijed modula = abeceda imena fajla (\`01\`…\`59\`). Lekcije: \`1x\` Python (\`LEKCIJE_PY\`),
  \`2x\` JavaScript (\`LEKCIJE_JS\`), \`3x\` SQL (\`LEKCIJE_SQL\`); moraju biti prije \`50-…\`.
- Poslije svake izmjene: \`npm test\` mora završiti sa \`SVE PROŠLO\` i izlaznim kodom 0 (u lancu komandi
  koristi \`pipefail\` ili provjeri \`$?\` — \`npm test | tail\` sakrije pad).`, o:'Kratka pravila sa razlogom i jasna definicija gotovog (SVE PROŠLO, izlazni kod 0). Treće pravilo objašnjava i zamku: izlaz kroz tail sakrije pad testa, pa izgleda kao da je sve prošlo.'},
    {p:'Claude Code · osnovne komande (dokumentacija)', t:'dobar', k:`cd ~/projekti/ponude      # uvijek iz foldera projekta
claude                     # nova sesija
claude --continue          # nastavi zadnji razgovor u ovom folderu
claude --resume            # izaberi raniji razgovor sa liste
git log --oneline -20 | claude -p "sažmi ove commitove"   # bez razgovora

# u sesiji:
/init                      # napravi prvi CLAUDE.md iz koda
Objasni @src/fakture.py    # @ ubaci fajl u poruku`, o:'Sesija zna samo folder u kojem je pokrenuta (i CLAUDE.md iznad njega). -p radi kao obična komanda u skripti: ulaz kroz pipe, odgovor na izlaz.'},
  ],
  greske:['Pokrenuti claude u pogrešnom folderu (npr. u home), pa Claude ne vidi projekt.','CLAUDE.md od 600 linija sa dnevnikom rada umjesto kratkih pravila.','Lične stvari (testni nalog, lokalne putanje) u CLAUDE.md koji ide u git umjesto u CLAUDE.local.md.','Očekivati da se pravilo iz CLAUDE.md poštuje uvijek; za „uvijek“ treba hook ili test.'],
  kviz:[
    {p:'Gdje ide pravilo „testovi se pokreću sa npm test“, da važi za cijeli tim?', o:['~/.claude/CLAUDE.md','./CLAUDE.md u gitu','./CLAUDE.local.md','U svaku poruku'], t:1, e:'Projektni CLAUDE.md je u gitu i dijeli ga cijeli tim. ~/.claude je samo tvoj, a CLAUDE.local.md je u .gitignore.'},
    {p:'Juče si radio sa Claudeom u ovom folderu i želiš nastaviti isti razgovor. Šta pokrećeš?', o:['claude --continue','claude -p','claude /init','git pull'], t:0, e:'--continue nastavlja zadnji razgovor u trenutnom folderu; --resume daje listu za izbor.'},
    {p:'Pravilo iz CLAUDE.md je prekršeno treći put. Šta je najbolje?', o:['Napisati ga velikim slovima','Ponoviti ga tri puta u fajlu','Pretvoriti ga u hook ili test koji mašina provjerava','Obrisati CLAUDE.md'], t:2, e:'CLAUDE.md je kontekst. Ono što mora važiti uvijek, provjerava mašina.'},
  ],
  vjezba:{ z:'Napiši CLAUDE.md od najviše 10 redova za mali Flask projekat „ponude“ (Python, SQLite, testovi pytest).', h:'Šta Claude ne može sam zaključiti iz koda? Komande, šta se ne dira, kako izgleda gotovo.',
    r:`# Ponude — pravila za rad

- Pokretanje: \`flask --app app run\`. Testovi: \`pytest -q\` (moraju proći prije commita).
- Novac je uvijek Decimal, nikad float. Iznosi u bazi su u feninzima (INTEGER).
- SQL samo sa parametrima (?), nikad spajanje stringova.
- Ne mijenjaj postojeće migracije; nova promjena šeme = novi fajl u migrations/.
- Tekst za korisnika je na bosanskom.
- Gotovo = pytest zelen + kratka commit poruka šta i zašto.`, obj:'Samo ono što važi svaki put i što se ne vidi iz koda. Svako pravilo je provjerljivo.'},
  agent:['Pročitaj CLAUDE.md i reci mi koja pravila su nejasna, zastarjela ili se ne mogu provjeriti. Predloži kraću verziju, ali ništa ne mijenjaj dok ne potvrdim.'],
},
{ id:'m14', n:'14', dio:5, naslov:'Claude Code: plan, petlje i subagenti', pod:'Plan mode, načini dozvola, /loop, subagenti, worktree',
  ideja:[
    '<b>Plan mode</b>: Claude čita fajlove, istražuje i piše plan, ali <b>ne mijenja fajlove</b> dok plan ne odobriš. Uključuje se sa <code>Shift+Tab</code> (dok traka ne pokaže „⏸ plan mode on“), porukom koja počinje sa <code>/plan</code>, ili <code>claude --permission-mode plan</code>. Pravilo: veća promjena počinje planom. Plan čitaš kao ponudu prije potpisa. Ostali načini dozvola: manual (pita prije izmjena i komandi), accept edits (sam mijenja fajlove), auto (drugi model provjerava radnje umjesto tebe).',
    '<b>/loop</b> ponavlja prompt dok je sesija otvorena: <code>/loop 5m provjeri je li deploy gotov</code> radi svakih 5 minuta; <code>/loop provjeri CI</code> pušta Claudea da sam bira razmak (od 1 minute do 1 sata); samo <code>/loop</code> pokreće ugrađeni prompt održavanja (nastavi započeto, PR, čišćenje) ili tvoj <code>.claude/loop.md</code>. Petlja sa fiksnim razmakom sama ističe nakon 7 dana; zatvoriš li terminal, staje. <code>Esc</code> zaustavlja petlju koja sama bira ritam.',
    '<b>Subagenti</b> su pomoćnici sa <b>svojim kontekstom</b>. Glavna sesija zada „istraži kako radi prijava“; subagent pročita 40 fajlova, a vrati samo sažetak, pa tvoj razgovor ostaje čist. Više njih može raditi istovremeno. Ugrađeni su Explore (brza pretraga, samo čita), Plan i general-purpose; svoje praviš kao <code>.claude/agents/ime.md</code>. Kad dvije sesije <b>mijenjaju</b> kod paralelno, svaka treba svoj worktree: <code>claude --worktree ime</code>.',
  ],
  analogija:'Plan mode je skica prije rezanja ploče. Subagenti su šegrti koje pošalješ u magacin: vrate se sa spiskom, a ne sa cijelim magacinom na tvom stolu.',
  dia:'subagenti',
  napomena:'Komande su provjerene u dokumentaciji Claude Code (oktobar 2026). Alat se brzo mijenja: za tačan detalj pitaj samog Claudea ili otvori dokumentaciju.',
  kod:[
    {p:'.claude/agents/pregled-koda.md (primjer po formatu iz dokumentacije)', t:'dobar', k:`---
name: pregled-koda
description: Pregleda izmijenjene fajlove prije commita. Koristi poslije svake veće izmjene.
tools: Read, Glob, Grep
model: sonnet
---
Ti si recenzent. Pročitaj fajlove koje ti navede glavna sesija i prijavi samo:
1. greške u logici (posebno novac, datumi, prazne liste),
2. SQL bez parametara i neescapiran ispis (XSS),
3. izmjene bez testa.
Za svaki nalaz: fajl:linija, problem u jednoj rečenici, prijedlog. Bez pohvala.`, o:'Frontmatter kaže kad se koristi (description) i šta smije (tools: samo čita). Tijelo je kratak, provjerljiv zadatak sa formatom izvještaja.'},
    {p:'Claude Code · /loop i subagent (primjeri iz dokumentacije, prevedeni)', t:'dobar', k:`/loop 5m provjeri je li deploy završio i reci šta se desilo
/loop provjeri je li CI prošao i odgovori na komentare u PR-u
/loop                       # ugrađeni prompt održavanja ili .claude/loop.md

koristi subagenta da istraži kako naš sistem obnavlja token prijave
koristi subagenta da pokrene testove i prijavi samo one koji padaju`, o:'Petlja radi samo dok je sesija otvorena. Subagent je najkorisniji kad bi posao napunio razgovor dugim izlazom (pretraga, testovi).'},
  ],
  greske:['Velika izmjena bez plana, pa vraćanje pola sata rada.','Odobriti plan bez čitanja (plan je ugovor, ne formalnost).','Dvije sesije mijenjaju iste fajlove u istom folderu, bez worktree-a.','/loop za posao koji mora raditi i kad je računar ugašen (za to su rutine, tema 16).'],
  kviz:[
    {p:'Šta Claude radi u plan mode?', o:['Mijenja fajlove brže','Čita i istražuje, piše plan, ali ne mijenja fajlove dok ne odobriš','Samo pokreće testove','Gasi se poslije jednog odgovora'], t:1, e:'Plan mode je za istraživanje i prijedlog; izmjene počinju tek poslije odobrenja.'},
    {p:'Zašto koristiti subagenta za pretragu velikog koda?', o:['Jer je pametniji od glavne sesije','Jer čita u svom kontekstu i vrati samo sažetak, pa glavni razgovor ostaje čist','Jer jedini smije čitati fajlove','Jer je besplatan'], t:1, e:'Subagent ima svoj kontekst; nazad dolazi samo nalaz.'},
    {p:'Pokreneš /loop 10m i zatvoriš terminal. Šta se dešava?', o:['Petlja nastavlja u cloudu','Petlja staje','Petlja se ubrza','Petlja radi još 7 dana'], t:1, e:'/loop živi u sesiji. Za rad bez otvorene sesije postoje Desktop zadaci i rutine.'},
  ],
  vjezba:{ z:'Treba dodati izvoz faktura u Excel u Flask aplikaciju. Napiši kako bi vodio sesiju: šta u plan mode, šta subagentu, šta je „gotovo“.', h:'Prvo razumjeti postojeći kod (subagent), pa plan, pa mali koraci sa testom.',
    r:`1. Plan mode (Shift+Tab): „Koristi subagenta da nađe gdje se fakture čitaju
   iz baze i kako izgledaju postojeći izvozi. Zatim predloži plan za
   GET /api/fakture/izvoz?od=&do= koji vraća .xlsx. Ništa ne mijenjaj.“
2. Pročitam plan: ruta, servis, test, biblioteka. Tražim izmjenu ako
   uvodi novu biblioteku bez potrebe.
3. Odobrim. Gotovo kad: pytest sa testom za prazan period i za 2 fakture
   zelen, iznosi su Decimal, commit po koraku.`, obj:'Istraživanje ne puni glavni razgovor, plan se čita prije izmjena, a „gotovo“ je provjerljivo.'},
  agent:['Uđi u plan mode. Koristi subagenta Explore da mapira gdje se računa PDV u projektu. Vrati mi plan kako da sve ide kroz jednu funkciju, sa testovima, ali ne mijenjaj ništa dok ne odobrim.'],
},
{ id:'m15', n:'15', dio:5, naslov:'Claude Code: MCP serveri i git', pod:'Novi alati preko MCP-a, opsezi, sigurnost; grane, commit, PR',
  ideja:[
    '<b>MCP</b> (Model Context Protocol) je otvoreni standard, „utičnica“ preko koje Claude dobija nove alate: GitHub, bazu, Google Drive, Figmu, Slack, Sentry… <b>MCP server</b> je mali program koji zna razgovarati sa jednim servisom. Dodavanje: <code>claude mcp add --transport http ime url</code> za udaljeni server ili <code>claude mcp add ime -- komanda</code> za lokalni. Pregled: <code>claude mcp list</code>, a u sesiji <code>/mcp</code>.',
    'Opseg servera: <b>local</b> (zadano: samo ti, samo ovaj projekt), <b>project</b> (fajl <code>.mcp.json</code> u gitu, za cijeli tim), <b>user</b> (svi tvoji projekti). Sigurnost: server vidi podatke servisa, a tekst koji donese (mejl, issue, stranica) može sadržavati podmetnuta uputstva (prompt injection). Zato dodaj samo servere kojima vjeruješ i pregledaj <code>.mcp.json</code> u tuđem repozitoriju prije nego ga uključiš. Preporuka iz teme 8: tokeni idu u env varijable, ne u fajl koji ide u git.',
    '<b>Git</b>: Claude Code radi sa gitom kao programer: pogleda status i diff, napravi granu, commit sa porukom i PR (zamoliš „napravi PR“; koristi <code>gh</code>). Tvoja pravila: jedan zadatak = jedna grana; mali commitovi sa porukom šta i zašto; <b>diff čitaš ti</b> prije spajanja; push na glavnu granu i merge su tvoja odluka. Sesiju vezanu za PR kasnije nađeš sa <code>claude --from-pr 1234</code>.',
  ],
  analogija:'MCP je standardna utičnica: svaki aparat sa istim utikačem radi u svakoj radionici. Ali ne uključuješ u struju aparat nepoznatog porijekla. Git grana je posebna radna ploča: probaš na njoj, a glavni sto ostaje čist dok ne odlučiš.',
  dia:'mcp',
  napomena:'Komande su provjerene u dokumentaciji Claude Code (oktobar 2026). Alat se brzo mijenja: za tačan detalj pitaj samog Claudea ili otvori dokumentaciju.',
  kod:[
    {p:'.mcp.json (format iz dokumentacije Claude Code)', t:'dobar', k:`{
  "mcpServers": {
    "shared-server": {
      "type": "http",
      "url": "https://example.com/mcp"
    }
  }
}`, o:'Projektni opseg: fajl je u korijenu repozitorija i ide u git, pa svi u timu dobiju isti server. Zato u njemu nema tajni.'},
    {p:'ucionica · git log --oneline (stvarne poruke ove učionice)', t:'dobar', k:`Ispravka: tabele baze su širile stranicu na telefonu
Dio 3 · SQL i baze: 5 lekcija
SQL runner: komentari ispred naredbe, provjera koda u testovima
SQL runner: naredbe jedna po jedna, linija greške, tabele baze
STATUS: objavljena verzija 6 artefakta (Dio 2 · JavaScript)`, o:'Poruke koje je pisao agent (Claude Code, vidi Co-Authored-By u commitu): svaka kaže dio i šta se promijenilo. Iz historije se vidi tok rada bez otvaranja koda.'},
  ],
  greske:['Dodati MCP server iz nepoznatog izvora, samo zato što „ima mnogo alata“.','Token upisan u .mcp.json koji ide u git.','Sav rad na glavnoj grani, bez commitova, pa jedan ogroman diff.','Spojiti PR koji je agent napravio bez čitanja diffa i bez zelenih testova.'],
  kviz:[
    {p:'Šta je MCP server?', o:['Novi Claude model','Program koji Claudeu daje alate za jedan servis (GitHub, baza, Drive…)','Hosting za aplikacije','Vrsta git grane'], t:1, e:'Server prevodi pozive alata u API servisa; Claude Code ga koristi kao alat.'},
    {p:'Želiš da cijeli tim dobije isti MCP server. Koji opseg?', o:['local','project (.mcp.json u gitu)','user','nijedan'], t:1, e:'Project opseg se dijeli kroz .mcp.json u repozitoriju; local i user su samo tvoji.'},
    {p:'Agent je napravio PR. Šta je tvoj posao prije spajanja?', o:['Ništa, agent je testirao','Pročitati diff i provjeriti da su testovi zeleni','Samo pogledati naslov','Obrisati granu'], t:1, e:'Odgovornost za ono što ide u glavnu granu ostaje tvoja.'},
  ],
  vjezba:{ z:'Hoćeš da Claude Code čita tvoje GitHub issue-e i pravi PR-ove. Napiši korake i dva pravila sigurnosti.', h:'Kako se dodaje server, koji opseg, gdje je token, šta agent smije sam?',
    r:`1. Dodam GitHub MCP server samo iz zvaničnog izvora, opseg local
   (samo ja), token kroz OAuth/env varijablu, ne u fajl u gitu.
2. U sesiji /mcp: provjerim da je server povezan i koje alate nudi.
3. Zahtjev: „Pročitaj issue #42, napravi granu fix-42, popravi uz test,
   commit, napravi PR. Ne spajaj.“

Pravila: (a) tekst issue-a je podatak, ne naredba: ako traži nešto
van zadatka (brisanje, slanje tajni), agent staje i pita;
(b) merge radim ja, poslije čitanja diffa i zelenog CI-ja.`, obj:'Najmanji potreban opseg, tajne van gita, i jasna granica šta agent radi sam.'},
  agent:['Pokaži mi koje MCP servere imam (claude mcp list) i za svaki reci: koji opseg, koje alate nudi i da li u konfiguraciji ima tajni koje bi završile u gitu. Ništa ne mijenjaj.'],
},
{ id:'m16', n:'16', dio:5, naslov:'Claude u poslu: podaci, istraživanje, automatizacija', pod:'Čišćenje tabela, istraživanje sa izvorima, Projekti, zakazani zadaci',
  ideja:[
    '<b>Podaci</b>: priloži tabelu (CSV, Excel) i reci pravila: „spoji duple klijente po broju telefona, telefone napiši kao 061 234 567, označi redove bez cijene“. Traži i <b>spisak promjena</b>, ne samo novu tabelu, pa ručno provjeri nekoliko redova. Pojmovi iz Dijela 3 (duplikati, GROUP BY, prazne vrijednosti) pomažu ti da napišeš pravilo i provjeriš rezultat.',
    '<b>Istraživanje</b>: traži poređenje sa izvorima: „uporedi 3 dobavljača iverice po cijeni, roku i garanciji; uz svaku tvrdnju link; šta nisi našao, napiši da nisi našao“. Ključne izvore otvori sam. <b>Projekti</b> u claude.ai su radni prostor sa svojim fajlovima (cjenovnik, uslovi prodaje, stari ugovori) i uputstvima, pa ih ne lijepiš u svaki razgovor: sve na jednom mjestu.',
    '<b>Automatizacija</b>: ponavljajući posao prvo uradi sa Claudeom 2–3 puta ručno, sačuvaj prompt koji radi, pa ga zakaži. Prompt za automat mora sam reći <b>šta je uspjeh i gdje ide rezultat</b>, jer te usput ne može pitati. Kad sve spojiš (pravila, stanje, testovi, zakazani zadaci), dobiješ stvaran projekt. Ova učionica je napravljena baš tako: CLAUDE.md, STATUS.md, <code>npm test</code> i objava artefakta.',
  ],
  analogija:'Automatizacija je kao šablon za bušenje: prvo par puta izbušiš ručno i izmjeriš, pa tek onda napraviš šablon. Šablon napravljen od pogrešne mjere griješi svaki put.',
  dia:'raspored',
  napomena:'Opcije zakazivanja su provjerene u dokumentaciji Claude Code (oktobar 2026). Dostupnost Projekata i drugih mogućnosti zavisi od plana pretplate.',
  kodNaslov:'Primjeri',
  kod:[
    {p:'primjer prompta · čišćenje tabele klijenata', t:'dobar', k:`U prilogu je klijenti.csv (ime, telefon, grad, zadnja_ponuda).
1. Spoji redove koji imaju isti telefon (bez razmaka i crtica); zadrži najnoviju zadnja_ponuda.
2. Telefone napiši u obliku 061 234 567.
3. Redove bez telefona ne briši, nego ih stavi u poseban spisak.
Vrati: očišćenu tabelu, spisak spojenih redova (stari → novi) i broj redova prije i poslije.`, o:'Pravila su provjerljiva, ništa se ne briše tiho, a spisak promjena i brojevi prije/poslije omogućavaju provjeru.'},
    {p:'primjer prompta · zakazani zadatak (rutina)', t:'dobar', k:`Svakog ponedjeljka u 8:00:
Pročitaj otvorene ponude starije od 14 dana iz izvještaja ponude.csv u repozitoriju.
Za svaku napiši nacrt kratkog podsjetnika klijentu (najviše 4 reda, ljubazno, bez popusta).
Rezultat: fajl podsjetnici/GGGG-MM-DD.md i jedna rečenica sažetka (broj ponuda).
Ne šalji ništa klijentima: samo nacrti.`, o:'Kad, ulaz, šta, oblik rezultata, gdje ide i šta je zabranjeno. Automat ne može pitati, pa sve mora biti u promptu.'},
  ],
  greske:['Prihvatiti „očišćenu“ tabelu bez spiska promjena i bez ručne provjere par redova.','Tvrdnja iz istraživanja bez izvora završi u ponudi.','Zakazati prompt koji nikad nije radio ručno.','Automat koji šalje mejlove klijentima bez ljudske provjere.'],
  kviz:[
    {p:'Šta tražiti uz očišćenu tabelu?', o:['Ništa, tabela je dovoljna','Spisak promjena i broj redova prije i poslije','Ljepše boje','Kraću tabelu'], t:1, e:'Bez spiska promjena ne znaš šta je spojeno ili izgubljeno.'},
    {p:'Zadatak mora raditi svako jutro, i kad je računar ugašen. Šta koristiš?', o:['/loop','Desktop zakazani zadatak','Rutinu u cloudu','Ručno svako jutro'], t:2, e:'/loop i Desktop zadaci traže upaljen računar; rutina radi u cloudu.'},
    {p:'Šta prompt za automatski zadatak mora sadržavati, a običan ne mora?', o:['Više emotikona','Šta je uspjeh, gdje ide rezultat i šta je zabranjeno, jer automat ne može pitati','Ime modela','Ništa posebno'], t:1, e:'Automat radi bez tebe, pa sva pitanja moraju biti unaprijed odgovorena.'},
  ],
  vjezba:{ z:'Svakog petka ručno praviš pregled: koliko je ponuda poslano, prihvaćeno i odbijeno te sedmice. Opiši kako bi to automatizovao.', h:'Prvo ručno sa Claudeom. Šta je ulaz, šta je izlaz, gdje ide, šta automat ne smije?',
    r:`1. Dva petka radim ručno: priložim izvoz ponuda (CSV) i prompt.
   Provjerim brojeve sa svojom evidencijom.
2. Kad se brojevi poklope dva puta, sačuvam prompt:
   „Iz ponude.csv uzmi ponude od ponedjeljka do petka ove sedmice.
   Prebroj poslane, prihvaćene i odbijene; izračunaj procenat prihvaćenih.
   Rezultat: tabela + 3 rečenice zapažanja u izvjestaji/GGGG-MM-DD.md.
   Ako fajl nedostaje ili je prazan, napiši to i stani.“
3. Zakažem kao rutinu petkom u 15:00 (ili Desktop zadatak ako je
   CSV samo na mom računaru). Prvi mjesec pregledam svaki izvještaj.`, obj:'Prompt je prvo dokazan ručno, ima jasan ulaz i izlaz, i kaže šta raditi kad nešto fali.'},
  agent:['Ovo radim svake sedmice ručno: (opiši). Predloži prompt za zakazani zadatak koji to radi sam: ulaz, izlaz, gdje ide rezultat, šta ne smije, i kako ću prvi mjesec provjeravati da radi tačno.'],
},
);

RJECNIK.push(
  ['Prompt','Uputstvo koje daješ Claudeu: kontekst, zadatak, format i po potrebi primjer.','m12'],
  ['Halucinacija','Samouvjeren, a netačan odgovor modela (izmišljen broj, citat, izvor).','m12'],
  ['Claude Code','Claude koji radi u tvom projektu: čita fajlove, pokreće komande i mijenja kod uz dozvolu.','m13'],
  ['CLAUDE.md','Fajl sa pravilima projekta koji Claude Code učita na početku svake sesije.','m13'],
  ['Plan mode','Način rada u kojem Claude istražuje i piše plan, ali ne mijenja fajlove dok ga ne odobriš.','m14'],
  ['Subagent','Pomoćni agent sa svojim kontekstom; obavi dio posla i vrati sažetak glavnoj sesiji.','m14'],
  ['/loop','Komanda Claude Code koja ponavlja prompt u razmaku dok je sesija otvorena.','m14'],
  ['MCP','Model Context Protocol: otvoreni standard preko kojeg Claude dobija alate za druge servise.','m15'],
  ['Prompt injection','Podmetnuto uputstvo u tekstu koji model čita (mejl, stranica, issue), sa ciljem da ga preusmjeri.','m15'],
  ['Pull request (PR)','Prijedlog da se izmjene sa jedne grane spoje u drugu, uz pregled i provjere.','m15'],
  ['Projekat (Claude)','Radni prostor u claude.ai sa svojim fajlovima, uputstvima i razgovorima.','m16'],
  ['Rutina','Zakazani zadatak Claude Code koji radi u cloudu, i kad je tvoj računar ugašen.','m16'],
);

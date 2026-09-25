// Sadržaj 12 tema iz Učionice v3 (izvučeno automatski; uređuj ovdje).


/* ================= DIJAGRAMI ================= */
const LAYER = { c:['Klijent','var(--l-client)'], n:['Mreža','var(--l-net)'], s:['Server','var(--l-server)'], d:['Baza','var(--l-data)'] };
const PUT = [
  ['c','Klik na „Sačuvaj klijenta“','Jedan slušač na korijenu aplikacije hvata klik i po data-atributu zna šta je kliknuto (event delegation).','static/js/app-next.js · root.addEventListener(\'click\', …)'],
  ['c','Priprema zahtjeva','Frontend pravi JSON {name, phone…} i zove centralni sloj za mrežu. Svi pozivi idu kroz jedno mjesto.','static/js/app-next-api.js · apiFetch / apiSend'],
  ['n','HTTP zahtjev','POST /api/klijenti · Content-Type: application/json · kolačić inhome_jwt_cookie ide automatski (credentials: include).','preglednik → internet → Render'],
  ['s','Flask pronalazi rutu','@core_bp.route(\'/api/klijenti\', methods=[\'POST\']) povezuje URL + metodu sa Python funkcijom.','core_data_routes.py:1031'],
  ['s','Ko si ti? (autentifikacija)','@jwt_required() čita i provjerava JWT. Nevažeći token = 401 i funkcija se uopšte ne pokreće.','flask_jwt_extended · app.py:152'],
  ['s','Validacija','Prazno ime? Server odgovara 400 sa porukom. Server nikad ne vjeruje frontendu.','core_data_routes.py · if not name: return …, 400'],
  ['d','Upis u bazu','Repository izvršava INSERT sa ? parametrima (zaštita od SQL injectiona) i commit.','repositories/* · SQLite'],
  ['s','Odgovor','201 Created + JSON novog klijenta. Status kod govori ŠTA se desilo, tijelo DETALJE.','jsonify(...), 201'],
  ['c','Stanje i iscrtavanje','Frontend upiše rezultat u state i ponovo iscrta ekran iz stanja: UI = f(state).','app-next-shared.js state · renderShell()'],
];
const DIA = {
  put(){ return `<div class="stepper">
      <div class="flow">${Object.values(LAYER).map(([n,c])=>`<span class="tag" style="background:${c};color:#fff">${n}</span>`).join('')}</div>
      <div class="steps" role="group" aria-label="Koraci">${PUT.map((_,i)=>`<button data-put="${i}" aria-label="Korak ${i+1}"></button>`).join('')}</div>
      <div class="stepcard"><div class="num" id="putNum"></div><div id="putBody"></div></div>
      <div class="navbtns"><button class="btn" data-putnav="-1">← Prethodni korak</button><button class="btn primary" data-putnav="1">Sljedeći korak →</button></div>
    </div>`; },
  http(){ return `<div class="tables">
    <div class="box lnet"><span class="k">Zahtjev (request)</span><pre>POST /api/klijenti HTTP/1.1
Host: inhome-f367.onrender.com
Content-Type: application/json
Cookie: inhome_jwt_cookie=eyJhbGci…

{"name": "Amra", "phone": "061…"}</pre><span>metoda + putanja · headers · tijelo</span></div>
    <div class="box ls"><span class="k">Odgovor (response)</span><pre>HTTP/1.1 201 Created
Content-Type: application/json

{"id": 42, "name": "Amra", …}</pre><span>status kod · headers · tijelo</span></div></div>
    <table class="tbl" style="margin-top:10px"><tr><th>Kod</th><th>Znači</th><th>Kod tebe</th></tr>
    <tr><td>200 / 201</td><td>OK / Kreirano</td><td>jsonify(...), 201</td></tr>
    <tr><td>400</td><td>Loš zahtjev (validacija)</td><td>'name required'</td></tr>
    <tr><td>401</td><td>Ne znam ko si (nema/istekla prijava)</td><td>apiFetch → ekran prijave</td></tr>
    <tr><td>403 / 404</td><td>Zabranjeno / Ne postoji</td><td>Sole-KP namjerno vraća 404 za tuđe (ADR-011)</td></tr>
    <tr><td>500</td><td>Server je pao</td><td>serverErrorText() u apiFetch</td></tr></table>`; },
  uistate(){ return `<div class="flow">
    <div class="box lc"><span class="k">1 · state</span><b>Objekat sa podacima</b><span>view, projects, loading, error…</span></div><span class="arrow">→</span>
    <div class="box lc"><span class="k">2 · render</span><b>renderShell()</b><span>pravi HTML iz stanja</span></div><span class="arrow">→</span>
    <div class="box lc"><span class="k">3 · DOM</span><b>Ekran</b><span>ono što korisnik vidi</span></div><span class="arrow">→</span>
    <div class="box lc"><span class="k">4 · događaj</span><b>Klik / unos</b><span>handleAppNextClick mijenja state</span></div><span class="arrow">↺</span></div>
    <p class="small muted" style="margin-top:8px">Pravilo: ekran se <b>nikad</b> ne mijenja direktno. Promijeniš stanje, pa ponovo iscrtaš. Tako ekran uvijek odgovara podacima.</p>`; },
  join(){ const t=(h,rows,hl)=>`<table class="tbl"><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map((c,i)=>`<td class="${hl&&hl.includes(i)?'hl':''}">${c}</td>`).join('')}</tr>`).join('')}</table>`;
    return `<div class="tables"><div><div class="eyebrow">klijenti</div>${t(['id','ime'],[[1,'Amra'],[2,'Emir']],[0])}</div>
      <div><div class="eyebrow">fakture</div>${t(['id','klijent_id','iznos'],[[10,1,'800.00'],[11,1,'450.00'],[12,2,'1200.00']],[1])}</div>
      <div><div class="eyebrow">JOIN + GROUP BY → rezultat</div>${t(['ime','ukupno'],[['Amra','1250.00'],['Emir','1200.00']])}</div></div>
      <pre style="margin-top:10px">SELECT k.ime, SUM(f.iznos) AS ukupno
FROM klijenti k
JOIN fakture f ON f.klijent_id = k.id   -- spoj po stranom ključu
GROUP BY k.id, k.ime;</pre>`; },
  tx(){ return `<div class="tables">
    <div class="box ld"><span class="k">Transakcija: sve ili ništa</span><b>BEGIN → A → B → COMMIT</b><span>Ako B padne: ROLLBACK, pa ni A ne ostaje. Kao bankovni prenos: skini sa jednog računa i dodaj na drugi, ili ništa.</span></div>
    <div class="box ld"><span class="k">Indeks: kazalo u knjizi</span><b>WHERE user_id = 7</b><span>Bez indeksa: čita sve redove (full scan). Sa indeksom: skače direktno. Cijena: sporiji upisi i više prostora.</span></div>
    <div class="box ld"><span class="k">Migracija: verzija šeme</span><b>0021 → 0022</b><span>Svaka promjena tabela je numerisan fajl sa upgrade i downgrade. Baza zna na kojoj je verziji.</span></div></div>`; },
  slojevi(){ const L=[['Ruta','routes.py','prima HTTP, provjeri dozvolu, pozove servis, vrati odgovor, radi commit','ls','journal_post()'],['Servis','service/','vodi slučaj upotrebe, granica transakcije, poziva domenu i repozitorij','ls','PostingService._post()'],['Domena','domain/','čista pravila: bez Flaska, bez baze, lako testirati','lc','balance.assert_balanced()'],['Repozitorij','repository.py','jedino mjesto koje priča sa bazom','ld','get_for_update()']];
    return `<div class="stack">${L.map(([n,f,d,c,ex],i)=>`<div class="box ${c}"><span class="k">${i+1} · ${n} · ${f}</span><b>${ex}</b><span>${d}</span></div>${i<3?'<span class="arrow" style="text-align:center">↓ zove samo sloj ispod</span>':''}`).join('')}</div>
    <p class="small muted" style="margin-top:8px">Sole-KP: knjiženje GL naloga. Pravilo „nalog mora biti u ravnoteži“ živi u domeni, pa se testira bez baze i bez servera.</p>`; },
  failmode(){ return `<table class="tbl"><tr><th></th><th>Fail-fast (padni odmah)</th><th>Fail-open (pusti dalje)</th></tr>
    <tr><td>Kad</td><td>Greška bi kasnije napravila veću štetu</td><td>Dostupnost je važnija od provjere</td></tr>
    <tr><td>Primjer</td><td>Sole-KP <code>config.py _required</code>: nema DATABASE_URL → ne pokreće se</td><td>inhome rate limit: baza zaključana → pusti prijavu; claude-plugins hookovi</td></tr>
    <tr><td>Rizik</td><td>Aplikacija ne starta dok ne popraviš</td><td>Zaštita tiho ne radi</td></tr></table>`; },
  piramida(){ return `<div class="pyr">
    <div style="width:34%;background:var(--bad)">E2E · Playwright<br><small>inhome ~260 · spori, krhki, dokazuju cijeli tok</small></div>
    <div style="width:62%;background:var(--warn)">Integracijski · prava baza / HTTP<br><small>Sole-KP ~500 · RLS, rute, repozitoriji</small></div>
    <div style="width:92%;background:var(--good)">Unit · čiste funkcije<br><small>Sole-KP 330 bez baze · inhome Vitest 709 za 16 s</small></div></div>
    <p class="small muted" style="margin-top:8px">Mnogo brzih testova na dnu, malo sporih na vrhu. Kad je piramida obrnuta (većina provjera kroz preglednik), testovi traju 40 minuta i postaju „flaky“.</p>`; },
  napadi(){ return `<table class="tbl"><tr><th>Napad</th><th>Kako izgleda</th><th>Odbrana</th><th>Kod tebe</th></tr>
    <tr><td>SQL injection</td><td>ime = <code>x'; DROP TABLE…</code></td><td>parametri <code>?</code>, nikad spajanje stringova</td><td>✓ repozitoriji</td></tr>
    <tr><td>XSS</td><td>ime = <code>&lt;img onerror=…&gt;</code> se izvrši u tuđem pregledniku</td><td>escape pri ispisu</td><td>✓ <code>esc()</code> · ⚠ 3 kopije</td></tr>
    <tr><td>CSRF</td><td>tuđi sajt pošalje POST, preglednik doda tvoj kolačić</td><td>CSRF token / SameSite</td><td>⚠ <code>JWT_COOKIE_CSRF_PROTECT=False</code> (Lax pomaže djelimično)</td></tr>
    <tr><td>Zlonamjeran upload</td><td>„slika.png“ koja je HTML/SVG sa skriptom</td><td>provjera magičnih bajtova</td><td>✓ oba projekta</td></tr>
    <tr><td>Pogađanje lozinke</td><td>hiljade pokušaja</td><td>rate limit, zaključavanje</td><td>✓ inhome · ⚠ Sole-KP (STATUS)</td></tr>
    <tr><td>Curenje tuđih podataka</td><td>promijeni id u URL-u</td><td>filter po vlasniku + RLS, 404</td><td>✓ <code>AND user_id=?</code>, RLS</td></tr></table>`; },
  deploy(){ return `<div class="flow">
    <div class="box lc"><span class="k">1 · lokalno</span><b>C:\\dev</b><span>kod, .venv, .env</span></div><span class="arrow">→</span>
    <div class="box lnet"><span class="k">2 · git</span><b>commit + push</b><span>GitHub = jedini izvor</span></div><span class="arrow">→</span>
    <div class="box lnet"><span class="k">3 · CI</span><b>GitHub Actions</b><span>ruff, pytest, vitest, playwright</span></div><span class="arrow">→</span>
    <div class="box ls"><span class="k">4 · build</span><b>Render</b><span>pip install -r requirements.txt</span></div><span class="arrow">→</span>
    <div class="box ls"><span class="k">5 · start</span><b>gunicorn app:app</b><span>2 workera, gevent</span></div><span class="arrow">→</span>
    <div class="box ld"><span class="k">6 · podaci</span><b>disk 1 GB</b><span>DB_PATH, backup</span></div></div>`; },
  stanja(){ const s=[['Učitavanje','skelet sa oblikom ekrana, aria-busy','renderSkeleton()'],['Prazno','objasni i ponudi prvu akciju','.next-empty'],['Greška','šta se desilo + dugme „Pokušaj ponovo“','data-next-retry-load'],['Uspjeh','podaci + sljedeći korak','workfile.next_action']];
    return `<div class="flow">${s.map(([n,d,c])=>`<div class="box lc"><span class="k">stanje</span><b>${n}</b><span>${d}</span><code>${c}</code></div>`).join('')}</div>
    <p class="small muted" style="margin-top:8px">Svaki ekran koji čita podatke mora imati sva četiri stanja. Najčešće se zaborave „prazno“ i „greška“.</p>`; },
  agent(){ return `<div class="flow">
    <div class="box lc"><span class="k">spec</span><b>Plan mode</b><span>cilj + definicija gotovog</span></div><span class="arrow">→</span>
    <div class="box lnet"><span class="k">izolacija</span><b>grana / worktree</b><span>jedan agent, jedna grana</span></div><span class="arrow">→</span>
    <div class="box ls"><span class="k">rad</span><b>mali korak</b><span>hook: sw:stamp</span></div><span class="arrow">→</span>
    <div class="box ls"><span class="k">provjera</span><b>test:fast</b><span>Stop hook, crveno = stop</span></div><span class="arrow">→</span>
    <div class="box ld"><span class="k">trag</span><b>commit + STATUS</b><span>historija = git log</span></div></div>`; },
};

/* ================= MODULI ================= */
const TEME = [
{ id:'m0', n:'0', naslov:'Mapa: put jednog klika', pod:'Kako se sve spaja, od dugmeta do baze i nazad',
  ideja:[
    'Svaka web aplikacija, pa i inhome, ima <b>četiri sloja</b>: <b>klijent</b> (preglednik, HTML/CSS/JS), <b>mreža</b> (HTTP), <b>server</b> (Flask, Python) i <b>baza</b> (SQLite/PostgreSQL). Podaci putuju kroz sve slojeve i nazad.',
    'Kad razumiješ taj put, svaki bug možeš smjestiti: da li je problem u pregledniku, u zahtjevu, u serverskoj logici ili u podacima? To je prvo pitanje koje postavlja iskusan programer.',
  ],
  analogija:'Restoran: gost (klijent) naruči preko konobara (HTTP), kuhinja (server) spremi jelo po receptu (pravila), iz ostave (baza) uzme sastojke, konobar donese tanjir (odgovor).',
  dia:'put',
  kod:[
    {p:'inhome/core_data_routes.py:1031', t:'dobar', k:`@core_bp.route('/api/klijenti', methods=['POST'])
@jwt_required()
def create_klijent():
    uid = _uid()
    data = request.json or {}
    name = (data.get('name') or '').strip()
    if not name:
        return jsonify({'error': 'name required'}), 400
    kid = _db.create_klijent(uid, name, ...)
    return jsonify(_db.get_klijent(uid, kid)), 201`, o:'Cijeli serverski dio puta u 10 linija: ruta, autentifikacija, čitanje JSON-a, validacija sa 400, upis i 201.'},
  ],
  greske:['Popravljati bug „na slijepo“ umjesto da prvo utvrdiš u kom sloju je problem (DevTools → Network tab pokazuje zahtjev i odgovor).','Misliti da je provjera u frontendu dovoljna: sve što dođe na server se ponovo provjerava.','Miješati slojeve: SQL u JavaScriptu ili HTML u bazi.'],
  kviz:[
    {p:'Korisnik klikne „Sačuvaj“, a ništa se ne desi i nema poruke. Gdje prvo gledaš?', o:['U bazu','U Network tab preglednika: je li zahtjev uopšte poslan i šta je server vratio','U CSS','Restartuješ server'], t:1, e:'Network tab odmah kaže da li je problem prije mreže (zahtjev nije ni poslan), na serveru (4xx/5xx) ili poslije (odgovor stigao, ali ekran se nije osvježio).'},
    {p:'Šta radi @jwt_required() u inhome ruti?', o:['Provjerava da li je JSON ispravan','Provjerava ko je korisnik prije nego se funkcija pokrene','Upisuje u bazu','Šalje email'], t:1, e:'To je dekorator za autentifikaciju: bez važećeg tokena vraća 401 i tijelo funkcije se ne izvršava.'},
    {p:'Zašto server vraća 400 kad je ime prazno, iako frontend već provjerava?', o:['Ne treba, to je dupliranje','Jer server nikad ne vjeruje klijentu: zahtjev se može poslati i mimo tvog frontenda','Zbog brzine','Zbog SEO'], t:1, e:'Frontend validacija je za udobnost korisnika, serverska za sigurnost i ispravnost podataka.'},
    {p:'Koji sloj je „izvor istine“ za podatke?', o:['Preglednik','Baza','HTTP','CSS'], t:1, e:'Sve ostalo su kopije ili prikazi. Zato se stanje u frontendu uvijek osvježava iz odgovora servera.'},
  ],
  vjezba:{ z:'Napiši redom korake koji se dese kad u inhome obrišeš fakturu. Za svaki korak navedi sloj (klijent/mreža/server/baza).', h:'Koja HTTP metoda briše? Šta server mora provjeriti prije brisanja (dva pitanja: ko si ti i je li to tvoje)?',
    r:`1. klijent  · klik na „Obriši“ → potvrda (drugi klik)
2. klijent  · apiFetch('DELETE', '/api/fakture/15')
3. mreža    · DELETE /api/fakture/15 + kolačić sa JWT
4. server   · @jwt_required → ko si ti (401 ako niko)
5. server   · postoji li faktura 15 I pripada li tebi? (404 ako ne)
6. baza     · DELETE … WHERE id=? AND user_id=?  + commit
7. server   · 200/204 → klijent ukloni iz state-a i ponovo iscrta`, obj:'Ključni dio je korak 5: provjera vlasništva. Bez nje bi bilo ko sa prijavom mogao obrisati tuđu fakturu mijenjanjem broja u URL-u.'},
  agent:['Faktura se ne briše. Prvo mi reci u kom sloju je problem: pokaži Network zahtjev (metoda, status, tijelo odgovora) prije nego mijenjaš kod.'],
},
{ id:'m1', n:'1', naslov:'Web i HTTP', pod:'Zahtjev, odgovor, status kodovi, JSON, kolačići, JWT',
  ideja:[
    '<b>HTTP</b> je dogovor kako preglednik i server razgovaraju: zahtjev ima <b>metodu</b> (GET čita, POST pravi, PUT/PATCH mijenja, DELETE briše), <b>putanju</b>, <b>headers</b> (metapodaci) i opcionalno <b>tijelo</b>. Odgovor ima <b>status kod</b>, headers i tijelo.',
    '<b>REST</b> je stil: URL imenuje stvar (<code>/api/klijenti/42</code>), metoda kaže šta radiš s njom. <b>JSON</b> je format tijela: tekst koji i Python i JavaScript lako čitaju.',
    'HTTP je <b>bez pamćenja</b> (stateless): svaki zahtjev mora sam reći ko si. Zato postoje <b>kolačići</b> (preglednik ih sam šalje) i <b>tokeni</b> kao JWT (potpisana poruka „ovo je korisnik 7, važi do…“). Kolačić sa <code>HttpOnly</code> JavaScript ne može pročitati, pa ga XSS ne može ukrasti; <code>localStorage</code> može.',
  ],
  analogija:'JWT je kao narukvica na festivalu: potpisana je, pa je redar ne mora provjeravati u spisku, ali dok ne istekne ne možeš je lako poništiti.',
  dia:'http',
  kod:[
    {p:'inhome/app.py:152', t:'mjes', k:`app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']
app.config['JWT_COOKIE_SECURE'] = not _allow_insecure_defaults
app.config['JWT_COOKIE_SAMESITE'] = 'Lax'
app.config['JWT_COOKIE_HTTPONLY'] = True
app.config['JWT_COOKIE_CSRF_PROTECT'] = False`, o:'✓ HttpOnly i Secure kolačić. ⚠ Token važi 30 dana i ne može se opozvati; CSRF zaštita je isključena (vidi modul 8); dva mjesta za token (header i kolačić) napravila su bug sa „ustajalim Bearerom“.'},
    {p:'inhome/static/js/app-next-api.js:44', t:'dobar', k:`const doFetch = async headers => {
  try {
    return await fetch(\`\${API}\${path}\`, { credentials: 'include', method, headers, body });
  } catch (_) {
    throw new Error('Nema veze sa serverom. Provjeri internet pa pokušaj ponovo.');
  }
};
let response = await doFetch(jwt ? { ...baseHeaders, Authorization: \`Bearer \${jwt}\` } : baseHeaders);
if (response.status === 401 && jwt) {
  try { localStorage.removeItem('inhome_jwt'); } catch (_) {}
  response = await doFetch(baseHeaders);
}`, o:'Jedno mjesto za sve pozive serveru: kolačići (credentials), prevod mrežne greške na ljudski jezik, oporavak od 401. Kad svaki ekran zove fetch sam, ove stvari se rade na desetine načina.'},
  ],
  greske:['Vraćati 200 sa {"error": …} umjesto pravog status koda: frontend i alati tada ne znaju da je nešto palo.','Koristiti GET za nešto što mijenja podatke (GET se kešira, ponavlja, prati link).','Čuvati token u localStorage „jer je lakše“: dostupan je svakoj skripti na stranici.','Dugi JWT bez mogućnosti opoziva: ako procuri, važi do isteka.'],
  kviz:[
    {p:'Koja metoda odgovara „izmijeni telefon klijenta 42“?', o:['GET /api/klijenti/42','POST /api/klijenti','PUT ili PATCH /api/klijenti/42','DELETE /api/klijenti/42'], t:2, e:'PUT zamjenjuje cijeli resurs, PATCH samo dio. Oba ciljaju konkretan resurs (/42).'},
    {p:'Korisnik nije prijavljen i pokuša otvoriti listu. Koji kod je ispravan?', o:['200','401','403','500'], t:1, e:'401 = „ne znam ko si“. 403 = „znam ko si, ali ne smiješ“.'},
    {p:'Zašto je HttpOnly kolačić sigurniji od tokena u localStorage?', o:['Brži je','JavaScript ga ne može pročitati, pa ga XSS ne može ukrasti','Veći je','Ne šalje se serveru'], t:1, e:'Preglednik ga šalje automatski, ali skripte na stranici ga ne vide.'},
    {p:'Šta znači da je HTTP „stateless“?', o:['Nema grešaka','Server ne pamti prethodne zahtjeve; svaki zahtjev mora sam dokazati ko si','Nema baze','Radi bez interneta'], t:1, e:'Zato se uz svaki zahtjev šalje kolačić ili token.'},
    {p:'Šta je JSON?', o:['Programski jezik','Tekstualni format podataka (objekti, liste, brojevi, stringovi)','Baza podataka','Vrsta servera'], t:1, e:'json.dumps() u Pythonu i JSON.stringify() u JS-u pretvaraju podatke u taj tekst.'},
  ],
  vjezba:{ z:'Napiši Flask rutu GET /api/klijenti/<id> koja vraća klijenta kao JSON, a 404 ako ne postoji ili nije tvoj. Koristi _uid() i _db.get_klijent(uid, kid) kao u inhome.', h:'<int:kid> u putanji pretvara dio URL-a u broj. get_klijent vraća None kad ne nađe.',
    r:`@core_bp.route('/api/klijenti/<int:kid>', methods=['GET'])
@jwt_required()
def get_klijent(kid):
    uid = _uid()                         # ko pita
    klijent = _db.get_klijent(uid, kid)  # repozitorij filtrira po uid
    if klijent is None:
        return jsonify({'error': 'Klijent ne postoji.'}), 404
    return jsonify(klijent), 200`, obj:'Tuđi klijent i nepostojeći klijent daju isti odgovor (404), pa napadač ne može pogađati koji ID-jevi postoje.'},
  agent:['Dodaj endpoint GET /api/klijenti/<id>: @jwt_required, 404 za nepostojeći ili tuđi zapis (isti odgovor), 200 sa JSON-om. Dodaj pytest za 200, 401 i 404.'],
},
{ id:'m2', n:'2', naslov:'Frontend arhitektura', pod:'State, render, događaji, moduli, real-time, service worker',
  ideja:[
    'Moderan frontend radi po formuli <b>UI = f(state)</b>: postoji jedan objekat sa podacima (<b>state</b>), a ekran se iscrtava iz njega. Klik ne mijenja ekran direktno, nego stanje, pa se ekran ponovo iscrta. React, Vue i tvoj app-next rade isto, samo različitim alatima.',
    '<b>Event delegation</b>: umjesto 500 slušača na 500 dugmadi, jedan slušač na korijenu hvata sve klikove i po <code>data-*</code> atributu zna šta je kliknuto. Preživljava ponovno iscrtavanje.',
    '<b>ES moduli</b> (<code>import/export</code>) dijele kod u fajlove sa jasnim ulazima. <b>Real-time</b>: polling (pitaj svakih N sekundi), <b>SSE</b> (server gura događaje u jednom smjeru, tvoj izbor) i WebSocket (oba smjera). <b>Service worker</b> je skripta između aplikacije i mreže: kešira fajlove za offline.',
  ],
  analogija:'State je scenarij, render je glumac koji ga odigra. Ne ispravljaš glumca usred scene; promijeniš scenarij i scena se odigra ponovo.',
  dia:'uistate',
  kod:[
    {p:'inhome/static/js/app-next-shared.js:186 + app-next.js:1637', t:'mjes', k:`// Centralni mutabilni state app-next UI-ja. Moduli ga mutiraju direktno,
// app-next.js orkestrira render preko \`renderShell\`.
export const state = { view: 'danas', workflow: null, projects: [], ... };

function renderPanel() {
  if (state.loading) return renderSkeleton();
  if (state.authRequired) { ... }`, o:'✓ Jasan UI = f(state). ⚠ Globalni objekat sa 100+ polja koji svako može mijenjati; cijela ljuska se ponovo iscrtava kroz innerHTML, pa se gube fokus i otvoreni <details> (bug koji smo popravili u Postavkama).'},
    {p:'inhome/static/js/app-next-events.js:137', t:'dobar', k:`root.addEventListener('click', handleAppNextClick);

export function handleAppNextClick(event) {
  state.lastInteractionAt = Date.now();
  if (state.paletteOpen) {
    if (event.target.matches('[data-next-palette-backdrop]')) {
      closePalette();
      renderShell();
      return;
    }
    const paletteRow = event.target.closest('[data-next-palette-row]');`, o:'Event delegation: jedan slušač, closest() nađe element sa data-atributom, promjena stanja, pa renderShell().'},
    {p:'inhome/static/sw.js:117', t:'dobar', k:`if (url.pathname === '/api/events') return;       // SSE ne ide kroz SW
if (url.pathname.startsWith('/api/')) {            // API: uvijek mreža
  event.respondWith(fetch(request).catch(() => new Response(
    JSON.stringify({ error: 'offline', offline: true }), { status: 503 })));
  return;
}
if (request.mode === 'navigate') {                  // stranice: mreža, pa keš
  event.respondWith(fetch(request).then(response => { ... })
    .catch(() => caches.match(request)));`, o:'Strategija „network-first“: svježe kad ima mreže, keš kad nema. API se nikad ne kešira (podaci moraju biti svježi).'},
  ],
  greske:['Mijenjati DOM direktno (element.textContent = …) pored render funkcije: sljedeći render to izbriše.','Kačiti slušač na svaki element poslije svakog rendera: curenje memorije i dupli klikovi.','Keširati API odgovore u service workeru: korisnik vidi stare podatke.','Zaboraviti da innerHTML ne radi escape: tuđi tekst mora kroz esc().'],
  kviz:[
    {p:'Šta znači UI = f(state)?', o:['Ekran je funkcija stanja: isto stanje uvijek daje isti ekran','UI je brži','Stanje je u bazi','Funkcija crta CSS'], t:0, e:'Zato je lako testirati render: daš stanje, provjeriš HTML.'},
    {p:'Zašto event delegation preživljava ponovno iscrtavanje?', o:['Jer je slušač na korijenu koji se ne mijenja, a unutrašnjost se iscrtava ponovo','Jer je brži','Jer koristi CSS','Ne preživljava'], t:0, e:'Slušači na dugmadima nestanu kad innerHTML zamijeni dugmad.'},
    {p:'Koja tehnika šalje događaje od servera ka pregledniku preko jedne otvorene HTTP veze, u jednom smjeru?', o:['Polling','SSE','REST','CSS'], t:1, e:'Server-Sent Events. inhome ih koristi na /api/events.'},
    {p:'Zašto sw.js nikad ne kešira /api/ odgovore?', o:['Jer su preveliki','Jer podaci moraju biti svježi; stari podaci su gori od poruke „offline“','Jer je zabranjeno','Greška'], t:1, e:'Za statične fajlove keš je super; za podatke je opasan.'},
  ],
  vjezba:{ z:'Napiši JS: lista zadataka sa state = { zadaci: [] }, funkcija render() koja iscrta <ul>, i JEDAN slušač na korijenu koji na klik dugmeta sa data-obrisi="id" ukloni zadatak i ponovo iscrta.', h:'filter() pravi novi niz bez obrisanog. closest(\'[data-obrisi]\') nađe dugme i kad klikneš na ikonu unutar njega.',
    r:`const root = document.querySelector('#app');
const state = { zadaci: [{ id: 1, tekst: 'Mjerenje kuhinje' }, { id: 2, tekst: 'Ponuda' }] };
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');

function render() {                      // UI = f(state)
  root.innerHTML = '<ul>' + state.zadaci.map(z =>
    \`<li>\${esc(z.tekst)} <button data-obrisi="\${z.id}">✕</button></li>\`).join('') + '</ul>';
}

root.addEventListener('click', e => {    // jedan slušač za sve
  const btn = e.target.closest('[data-obrisi]');
  if (!btn) return;
  const id = Number(btn.dataset.obrisi);
  state.zadaci = state.zadaci.filter(z => z.id !== id);  // promijeni stanje
  render();                                               // pa iscrtaj
});
render();`, obj:'Tri principa u 15 linija: stanje, render iz stanja, delegacija. Plus esc() za tekst koji dolazi od korisnika.'},
  agent:['Ovaj ekran mijenja DOM direktno pored renderShell(). Prebaci promjenu u state i ponovo iscrtaj; slušač ide kroz postojeću event delegation u app-next-events.js.'],
},
{ id:'m3', n:'3', naslov:'Baze I: model podataka', pod:'Tabele, ključevi, normalizacija, constraints, SQL',
  ideja:[
    '<b>Relaciona baza</b> čuva podatke u <b>tabelama</b> (redovi i kolone). Svaki red ima <b>primarni ključ</b> (id). Veza između tabela je <b>strani ključ</b>: faktura ima <code>klijent_id</code> koji pokazuje na klijenta.',
    '<b>Normalizacija</b>: svaka činjenica na jednom mjestu. Ime klijenta je u tabeli klijenti, a ne prepisano u svaku fakturu. <b>Constraints</b> (NOT NULL, UNIQUE, CHECK, FOREIGN KEY) su pravila koja baza sama sprovodi, bez obzira na bug u kodu.',
    '<b>JSON u koloni</b> je fleksibilan (nema migracija), ali baza ne zna šta je unutra: ne može sprovoditi pravila, teško pretražuje i ne štiti te od pogrešnih podataka. <b>SQL</b>: SELECT bira, WHERE filtrira, JOIN spaja tabele, GROUP BY sabira po grupama.',
  ],
  analogija:'Tabele su kao registratori sa karticama, a strani ključ je broj kartice iz drugog registratora. JSON kolona je kutija „razno“: lako ubaciš, teško nađeš.',
  dia:'join',
  kod:[
    {p:'inhome/repositories/kv_repository.py:22', t:'los', k:`row = conn.execute('SELECT value FROM kv_store WHERE user_id=? AND key=?',
                   (user_id, key)).fetchone()
if not row:
    return default
try:
    value = json.loads(row['value'])
except (TypeError, ValueError) as e:
    logger.warning(...)
    return default`, o:'Fleksibilno, ali: baza ne provjerava strukturu, a pokvaren zapis se tiho pretvara u default. Projekti su takođe cijeli JSON u koloni data, pa pretraga po polju treba posebne indekse (json_extract).'},
    {p:'Sole-KP/src/app/modules/gl/models.py:202', t:'dobar', k:`CheckConstraint(
    "(debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0)", name="one_side_only"
),
CheckConstraint("debit >= 0 AND credit >= 0", name="amounts_not_negative"),
...
debit: Mapped[Decimal] = mapped_column(Money, nullable=False, default=Decimal("0.00"))
currency_code: Mapped[str] = mapped_column(
    String(3), ForeignKey("currency.code", ondelete="RESTRICT"), nullable=False, default="BAM"
)`, o:'Pravila knjigovodstva su u samoj bazi: stavka ima iznos samo na jednoj strani, nikad negativan, valuta mora postojati. Ni pogrešan kod ni ručni SQL ne mogu ubaciti neispravan red.'},
  ],
  greske:['Isti podatak na dva mjesta (ime klijenta u fakturi i u klijentima): promijeniš jedno, drugo laže.','Sve u JSON kolonu jer je „brže“: dug se plati kasnije kroz pretragu i izvještaje.','Pravila samo u kodu, ne i u bazi: prvi bug ili ručna izmjena ih zaobiđe.','Float za novac (0.1 + 0.2 ≠ 0.3): koristi NUMERIC/Decimal.'],
  kviz:[
    {p:'Šta je strani ključ?', o:['Lozinka za bazu','Kolona koja pokazuje na primarni ključ druge tabele','Indeks','Šifrovana kolona'], t:1, e:'fakture.klijent_id → klijenti.id. Baza može zabraniti fakturu za nepostojećeg klijenta.'},
    {p:'Kada je JSON u koloni razumno rješenje?', o:['Za novac','Za podatke promjenljive strukture koji se rijetko pretražuju, npr. postavke izgleda','Za sve','Za lozinke'], t:1, e:'Za jezgro poslovanja (fakture, iznosi, veze) bolje su prave kolone i constraints.'},
    {p:'Šta vraća JOIN?', o:['Brisanje duplikata','Redove spojene iz dvije tabele po uslovu','Samo prvu tabelu','Broj redova'], t:1, e:'JOIN fakture f ON f.klijent_id = k.id daje ime klijenta uz svaku fakturu.'},
    {p:'Zašto CheckConstraint u bazi, ako kod već provjerava?', o:['Nije potrebno','Druga linija odbrane: štiti i od bugova, ručnog SQL-a i drugih aplikacija','Zbog brzine','Zbog izgleda'], t:1, e:'Pravila u bazi važe za sve koji pišu u nju.'},
  ],
  vjezba:{ z:'Imaš tabele klijenti(id, ime) i fakture(id, klijent_id, iznos, placeno BOOLEAN). Napiši SQL koji za svakog klijenta vraća ime i ukupan NEPLAĆEN iznos, samo za one kojima je veći od 1000, od najvećeg.', h:'WHERE filtrira redove prije grupisanja, HAVING poslije. ORDER BY ... DESC.',
    r:`SELECT k.ime, SUM(f.iznos) AS dug
FROM klijenti k
JOIN fakture f ON f.klijent_id = k.id
WHERE f.placeno = FALSE          -- filtrira pojedinačne fakture
GROUP BY k.id, k.ime
HAVING SUM(f.iznos) > 1000       -- filtrira grupe (poslije sabiranja)
ORDER BY dug DESC;`, obj:'WHERE vs HAVING je klasično pitanje: WHERE radi nad redovima, HAVING nad rezultatima GROUP BY. Grupiše se po k.id (ne samo po imenu), jer dva klijenta mogu imati isto ime.'},
  agent:['Projekti su sada JSON u koloni data. Predloži prelazak polja value, phase i deadline u prave kolone sa constraints i migracijom, bez gubitka podataka; prvo plan, ne kod.'],
},
{ id:'m4', n:'4', naslov:'Baze II: pouzdanost i brzina', pod:'Transakcije, indeksi, migracije, ORM, N+1, paginacija, RLS',
  ideja:[
    '<b>Transakcija</b> grupiše više izmjena u jednu cjelinu: ili prođu sve, ili nijedna (<b>ACID</b>: atomarnost, konzistentnost, izolacija, trajnost). <b>Indeks</b> ubrzava pretragu po koloni, a usporava upise.',
    '<b>Migracija</b> je numerisan i reverzibilan korak promjene šeme (Alembic u Sole-KP). <b>ORM</b> (SQLAlchemy) pretvara redove u Python objekte. Zamka ORM-a je <b>N+1</b>: jedan upit za listu, pa po jedan za svaki red. Rješenje je jedan upit sa JOIN/IN.',
    '<b>Paginacija</b> vraća stranicu po stranicu (LIMIT/OFFSET). <b>Multi-tenancy</b>: više firmi dijeli bazu, a svaki red ima organization_id. Sole-KP ima dvije brave: filter u repozitoriju i <b>Row-Level Security</b> u PostgreSQL-u, koji odbija tuđe redove čak i kad kod pogriješi.',
  ],
  analogija:'Transakcija je bankovni prenos. Indeks je kazalo na kraju knjige. RLS je portir koji ne pušta u tuđi stan, čak i ako ti je neko greškom dao ključ.',
  dia:'tx',
  kod:[
    {p:'inhome/data_safety.py:293', t:'dobar', k:`conn = self._get_conn()
try:
    conn.execute('BEGIN IMMEDIATE')
    for _label, table in HARD_RESET_SQL_TABLES:
        conn.execute(f'DELETE FROM "{table}" WHERE user_id=?', (user_id,))
    ...
    conn.commit()
except Exception:
    if conn.in_transaction:
        conn.rollback()
    raise
finally:
    conn.close()`, o:'Klasičan obrazac: BEGIN, radnje, COMMIT; kod greške ROLLBACK, pa ništa nije napola obrisano. Kontra-primjer u istom repou: json_list_repository.replace briše i ubacuje bez rollbacka.'},
    {p:'inhome/database_bootstrap.py:147', t:'los', k:`def _safe_add_column(cursor, conn, statement, message):
    try:
        cursor.execute(statement)
        conn.commit()
        logger.info(message)
    except sqlite3.OperationalError:
        pass`, o:'„Migracija“ bez verzije: pokušaj ALTER TABLE i progutaj grešku. Nema puta nazad, nema traga koja je verzija baze, a prava greška (npr. zaključana baza) se tiho ignoriše.'},
    {p:'Sole-KP/src/app/shared/db/tenant_repository.py:50 + tenancy/db_context.py:53', t:'dobar', k:`def base_query(self) -> Select[Any]:
    """Polazni upit, uvijek suzen na aktivnu organizaciju."""
    return select(self.model).where(self.model.organization_id == self.organization_id)

def _after_begin(session, transaction, connection):
    org_id = _resolve_organization_id(session)
    if org_id is None:
        return
    connection.execute(_SET_TENANT, {"org": str(org_id)})  # set_config(..., true) = SET LOCAL`, o:'Dva sloja izolacije: Python filter + RLS u bazi. SET LOCAL važi samo za tu transakciju, pa ne curi na sljedeći zahtjev iz poola konekcija.'},
    {p:'Sole-KP/src/app/modules/gl/repository.py:188', t:'dobar', k:`statement = (
    select(SettlementItem.journal_line_id,
           func.coalesce(func.sum(SettlementItem.amount), 0).label("zatvoreno"))
    .where(SettlementItem.organization_id == self.organization_id,
           SettlementItem.journal_line_id.in_(unique))
    .group_by(SettlementItem.journal_line_id)
)`, o:'Izbjegnut N+1: jedan upit sa IN (...) i GROUP BY umjesto po jedan upit za svaku stavku naloga.'},
  ],
  greske:['Više povezanih izmjena bez transakcije: pola se upiše, pola ne.','Indeks na svaku kolonu: upisi se uspore, a pomaže samo upitima koji ga koriste.','Petlja sa upitom unutra (N+1): radi brzo na 10 redova, puzi na 10.000.','Mijenjati šemu ručno na produkciji umjesto migracijom.'],
  kviz:[
    {p:'Šta garantuje atomarnost (A u ACID)?', o:['Brzinu','Da se sve izmjene transakcije primijene ili nijedna','Šifrovanje','Backup'], t:1, e:'Zato hard reset u inhome ne može ostaviti pola podataka obrisano.'},
    {p:'Lista 200 faktura, a za svaku poseban upit za ime klijenta. Kako se zove problem?', o:['Deadlock','N+1 upita','SQL injection','Race condition'], t:1, e:'Rješenje: JOIN ili jedan upit sa IN (...) za sve klijente odjednom.'},
    {p:'Zašto Sole-KP ima i filter u repozitoriju i RLS?', o:['Dupliranje greškom','Odbrana u dubinu: ako jedan sloj pogriješi, drugi i dalje štiti tuđe podatke','Brzina','Zbog migracija'], t:1, e:'test_tenant_isolation dokazuje da RLS radi čak i bez aplikacije.'},
    {p:'Šta migracija ima, a _safe_add_column nema?', o:['Brzinu','Verziju, redoslijed i downgrade (put nazad)','Više SQL-a','Ništa'], t:1, e:'Alembic zna da je baza na 0022 i može se vratiti na 0021.'},
    {p:'Kada indeks NE pomaže?', o:['Kad se pretražuje po toj koloni','Kad je tabela mala ili se upit ne filtrira po indeksiranoj koloni','Uvijek pomaže','Kod JOIN-a'], t:1, e:'Na 50 redova baza ionako čita sve; indeks samo usporava upise.'},
  ],
  vjezba:{ z:'Napiši Python (sqlite3) funkciju prebaci_uplatu(conn, faktura_od, faktura_na, iznos) koja umanji uplatu na jednoj fakturi i doda je na drugu, atomarno. Ako bilo šta padne, ništa se ne mijenja.', h:'Obrazac iz data_safety.py: BEGIN, dvije UPDATE naredbe sa ?, commit; except → rollback i raise.',
    r:`def prebaci_uplatu(conn, faktura_od, faktura_na, iznos):
    try:
        conn.execute('BEGIN IMMEDIATE')
        cur = conn.execute(
            'UPDATE fakture SET placeno = placeno - ? WHERE id = ? AND placeno >= ?',
            (iznos, faktura_od, iznos))
        if cur.rowcount != 1:
            raise ValueError('Nedovoljno uplaćeno na izvornoj fakturi.')
        conn.execute('UPDATE fakture SET placeno = placeno + ? WHERE id = ?',
                     (iznos, faktura_na))
        conn.commit()
    except Exception:
        conn.rollback()      # prva izmjena se poništava
        raise`, obj:'Provjera rowcount je bitna: ako izvorna faktura nema dovoljno, prvi UPDATE ne pogodi nijedan red, a mi to pretvaramo u grešku prije drugog koraka.'},
  agent:['Ova funkcija radi DELETE pa više INSERT-a bez transakcije (json_list_repository.replace). Umotaj je u BEGIN/COMMIT/ROLLBACK po obrascu iz data_safety.py i dodaj test koji simulira grešku na pola.'],
},
{ id:'m5', n:'5', naslov:'Arhitektura koda', pod:'Slojevi, čiste funkcije, coupling, smjer zavisnosti, portovi, ADR',
  ideja:[
    '<b>Slojevita arhitektura</b>: ruta (HTTP) → servis (tok slučaja upotrebe, transakcija) → domena (čista pravila) → repozitorij (baza). Svaki sloj zove samo onaj ispod. Rezultat: pravilo „nalog mora biti u ravnoteži“ testiraš bez servera i baze.',
    '<b>Coupling</b> (povezanost) treba biti nizak: modul zna što manje o drugima. <b>Cohesion</b> (kohezija) visok: sve u modulu služi jednoj svrsi. Fajl od 2.000 linija obično ima nisku koheziju. <b>Smjer zavisnosti</b>: niži moduli ne smiju uvoziti više (redoslijed <code>MODULES</code> u Sole-KP).',
    '<b>Dependency injection / portovi</b>: servis ne pravi sam svoje zavisnosti, nego ih dobije izvana kao „utičnicu“ (Protocol). Zato ga možeš testirati sa lažnom implementacijom. <b>ADR</b> (Architecture Decision Record) čuva <i>zašto</i> je odluka donesena, ne samo šta.',
  ],
  analogija:'Slojevi su kao restoran: konobar (ruta) ne kuha, kuhar (servis) ne ide u skladište nego ima magacionera (repozitorij), a recept (domena) ne zna ni za konobara ni za skladište.',
  dia:'slojevi',
  kod:[
    {p:'Sole-KP/src/app/modules/gl/routes.py:200', t:'dobar', k:`@bp.post("/nalozi/<int:journal_id>/knjizenje")
@require_organization
@require_permission("gl.post")
def journal_post(journal_id: int) -> Response:
    service = posting_service()
    try:
        journal = service.post_draft(journal_id, actor_id())
    except (ValidationError, ConflictError, NotFoundError) as exc:
        flash(str(exc), "error")
        return _back(journal_id)
    db_session().commit()`, o:'Ruta samo: dozvola, poziv servisa, prevod greške u poruku, commit. Nema SQL-a ni pravila knjigovodstva.'},
    {p:'Sole-KP/src/app/modules/gl/service/contracts.py:39 + composition.py:263', t:'dobar', k:`class AccountGate(Protocol):
    """Konto mora biti analiticko i aktivno na datum -- pravilo 4."""
    def assert_postable(self, account_id: int, on_date: date) -> None: ...

return PostingService(
    session, organization_id,
    periods=PeriodService.from_session(session, organization_id, audit),
    accounts=_AccountGate(session, organization_id),
    numbers=_NumberAllocator(session, organization_id),`, o:'Port (Protocol) + jedno mjesto koje sve spaja (composition root). Motor knjiženja ne uvozi druge module, pa se testira sa lažnim gate-om.'},
    {p:'inhome/core_data_routes.py:1083', t:'los', k:`def _klijent_feed_items(uid, klijent):
    """Server-side agregacija svih klijent događaja (notes, projekti, ponude, fakture).
    ...
    items = []
    kid = klijent.get('id')
    # 1. Klijent biljeske (notes JSON polje)
    # ... ukupno ~169 linija u jednoj funkciji u fajlu ruta`, o:'Niska kohezija: jedna funkcija u fajlu ruta čita četiri vrste podataka i formatira ih. Bolje je servis sa po jednom malom funkcijom za svaki izvor. Pozitivan kontrast u istom repou: upload_security.py (59 linija, jedan posao) i workflow_service.build_workfile (sastavljen od malih pomoćnih funkcija).'},
  ],
  greske:['Poslovno pravilo u ruti ili templateu: ne može se testirati bez servera i duplira se.','Kružni importi (A uvozi B, B uvozi A): znak da granica modula nije dobra.','„Utility“ fajl u koji sve ide: najbrži put do niske kohezije.','Refaktor i promjena ponašanja u istom koraku: kad nešto pukne, ne znaš zbog čega.'],
  kviz:[
    {p:'Gdje u Sole-KP živi pravilo „nalog mora biti u ravnoteži“?', o:['U ruti','U domeni (gl/domain/balance.py)','U templateu','U CSS-u'], t:1, e:'Domena nema Flask ni SQLAlchemy, pa je test jedan red.'},
    {p:'Šta je nizak coupling?', o:['Malo linija','Modul zna što manje o unutrašnjosti drugih modula','Mnogo importa','Brz kod'], t:1, e:'Tada promjena u jednom modulu ne lomi druge.'},
    {p:'Zašto dms/registry.py uvozi module dinamički (importlib)?', o:['Zbog brzine','Da niži modul (dms) ne uvozi više module (gl, ap) i ne prekrši smjer zavisnosti','Greška','Zbog CSS-a'], t:1, e:'Viši moduli se „prijave“ kroz dms_link.py, a dms ih otkrije u radu.'},
    {p:'Čemu služi ADR?', o:['Testiranju','Da se sačuva razlog odluke, pa je niko (ni agent) ne preispituje bez konteksta','Deployu','Formatiranju'], t:1, e:'ADR-004 objašnjava zašto se proknjižen nalog ne mijenja nego stornira.'},
  ],
  vjezba:{ z:'Ruta ispod radi sve sama. Razdvoji je na domenu (čista funkcija za popust), servis i rutu.\n\n@bp.post("/ponude/<int:pid>/popust")\ndef popust(pid):\n    p = db.execute("SELECT * FROM ponude WHERE id=?", (pid,)).fetchone()\n    pct = float(request.form["pct"])\n    if pct > 30: return "Previše", 400\n    novo = round(p["iznos"] * (1 - pct/100), 2)\n    db.execute("UPDATE ponude SET iznos=? WHERE id=?", (novo, pid)); db.commit()\n    return redirect(...)', h:'Domena ne zna za request ni db. Novac: Decimal, ne float. Servis radi čitanje, domenu i upis; ruta samo HTTP i commit.',
    r:`# domain/popust.py — čisto, lako testirati
from decimal import Decimal, ROUND_HALF_UP
MAX_POPUST = Decimal("30")

def primijeni_popust(iznos: Decimal, pct: Decimal) -> Decimal:
    if not (Decimal("0") <= pct <= MAX_POPUST):
        raise ValueError(f"Popust mora biti između 0 i {MAX_POPUST}%.")
    return (iznos * (1 - pct / 100)).quantize(Decimal("0.01"), ROUND_HALF_UP)

# service.py — tok
class PonudaService:
    def __init__(self, repo): self.repo = repo
    def popust(self, pid: int, pct: Decimal):
        ponuda = self.repo.get(pid)
        if ponuda is None: raise NotFoundError("Ponuda ne postoji.")
        ponuda.iznos = primijeni_popust(ponuda.iznos, pct)
        self.repo.save(ponuda)

# routes.py — samo HTTP
@bp.post("/ponude/<int:pid>/popust")
def popust(pid):
    try:
        PonudaService(PonudaRepo(db_session())).popust(pid, Decimal(request.form["pct"]))
    except (ValueError, NotFoundError) as exc:
        flash(str(exc), "error"); return redirect(...)
    db_session().commit()
    return redirect(...)`, obj:'Sada test pravila glasi: assert primijeni_popust(Decimal("100"), Decimal("10")) == Decimal("90.00"). Bez servera, baze i Flaska.'},
  agent:['Izdvoji poslovno pravilo iz ove rute u čistu funkciju u domain/ (bez Flask i DB importa); servis neka vodi tok, a ruta samo HTTP. Ne mijenjaj ponašanje: prvo dodaj test koji prolazi i prije i poslije.'],
},
{ id:'m6', n:'6', naslov:'Principi dizajna', pod:'DRY, KISS, YAGNI, SOLID, nepromjenjivost, novac, fail-fast, idempotentnost',
  ideja:[
    '<b>DRY</b> (ne ponavljaj se): svako pravilo ili funkcija postoji na jednom mjestu. <b>KISS</b>: najjednostavnije rješenje koje radi. <b>YAGNI</b>: ne gradi ono što „možda zatreba“. Ovi principi se međusobno balansiraju; DRY do krajnosti pravi apstrakcije koje niko ne razumije.',
    '<b>SOLID</b> ukratko: jedna odgovornost po modulu (S); dodaješ ponašanje bez mijenjanja postojećeg koda (O); zavisi od „utičnice“, ne od konkretne klase (D, kao portovi u Sole-KP). <b>Nepromjenjivost</b>: jednom proknjiženo se ne mijenja, nego se ispravlja novim zapisom (storno). Tako je historija uvijek istinita.',
    '<b>Novac</b> nikad kao float (0.1 + 0.2 = 0.30000000000000004), uvijek Decimal/NUMERIC, sa pravilom kako se dijeli ostatak. <b>Fail-fast</b> vs <b>fail-open</b>: kad greška treba zaustaviti sve, a kad treba pustiti dalje. <b>Idempotentnost</b>: isti zahtjev poslan dva puta ima isti efekat kao jednom (dvostruki klik ne pravi dvije fakture).',
  ],
  analogija:'Storno je kao ispravka u računovodstvenoj knjizi olovkom: ne brišeš gumicom, nego upišeš novi red koji poništava stari. Revizor vidi oba.',
  dia:'failmode',
  kod:[
    {p:'inhome/static/js/app-next-shared.js:6 (+ kopije u app-next-auth-forms.js:35 i mjerni.html:316)', t:'los', k:`export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}`, o:'Funkcija je dobra, ali postoji u tri kopije. Ako se ispravi jedna (npr. doda novi znak), druge dvije ostaju ranjive. DRY ovdje nije estetika nego sigurnost.'},
    {p:'Sole-KP/src/app/shared/money/allocate.py:61 + rounding.py:15', t:'dobar', k:`if isinstance(value, float):
    raise TypeError(
        "float nije dozvoljen za monetarne vrijednosti (ADR-003). Koristi Decimal ili str.")
...
parts = [
    (total * weight / weight_sum).quantize(CENT, rounding=ROUND_DOWN) for weight in weights
]
remainder = total - sum(parts, Decimal("0"))
if policy is AllocationPolicy.ROUNDING_ACCOUNT:
    return AllocationResult(tuple(parts), remainder)
if remainder != 0:
    parts[_index_of_largest(parts)] += remainder`, o:'Fail-fast na float, dijeljenje bez gubitka feninga i eksplicitna politika za ostatak. 100 KM na 3 projekta = 33.34 + 33.33 + 33.33, zbir je tačno 100.'},
    {p:'Sole-KP/src/app/modules/gl/service/reversal.py:74', t:'dobar', k:`if original.status != "POSTED":
    raise ConflictError(
        f"Samo proknjizen nalog se moze stornirati; ovaj je {original.status}.")
...
for line in original_lines:
    debit, credit = balance.mirror(line.debit, line.credit)
    debit_base, credit_base = balance.mirror(line.debit_base, line.credit_base)`, o:'Nepromjenjivost (ADR-004): ispravka je novi nalog sa zamijenjenim stranama, original dobija status REVERSED. Ništa se ne briše.'},
  ],
  greske:['Kopirati funkciju „samo ovaj put“: za godinu dana postoje tri verzije koje se razlikuju.','Praviti opštu apstrakciju za jedan slučaj (YAGNI): teže za čitanje, a drugi slučaj nikad ne dođe.','round(x, 2) na float za novac: greške od jednog feninga koje se sabiraju.','Fail-open bez loga: zaštita ne radi, a niko ne zna.'],
  kviz:[
    {p:'Zašto float nije dobar za novac?', o:['Spor je','Binarno ne može tačno predstaviti 0.1, pa se greške sabiraju','Zauzima više memorije','Ne može biti negativan'], t:1, e:'Decimal radi u dekadnom sistemu, kao računovođa.'},
    {p:'Korisnik dvaput brzo klikne „Kreiraj fakturu“. Koji princip sprečava dvije fakture?', o:['DRY','Idempotentnost (npr. jedinstveni ključ zahtjeva ili onemogućeno dugme dok traje zahtjev)','YAGNI','KISS'], t:1, e:'Server može odbiti drugi zahtjev sa istim ključem; frontend može onemogućiti dugme.'},
    {p:'Kada je fail-open razuman?', o:['Za lozinke i dozvole','Kad je dostupnost važnija, a posljedica propusta mala (npr. rate limit kad je baza zaključana), uz log','Uvijek','Nikad'], t:1, e:'Za sigurnosne provjere i novac skoro uvijek fail-fast.'},
    {p:'Šta je storno?', o:['Brisanje naloga','Novi nalog koji poništava stari zamjenom strana; original ostaje','Izmjena iznosa','Backup'], t:1, e:'Historija ostaje tačna, a zbir je nula.'},
  ],
  vjezba:{ z:'Napiši Python funkciju podijeli(iznos: Decimal, n: int) -> list[Decimal] koja dijeli iznos na n jednakih dijelova na 2 decimale, tako da zbir bude tačno iznos (ostatak ide na prve dijelove, po 0.01).', h:'Radi u feninzima: int(iznos * 100). divmod daje osnovu i ostatak.',
    r:`from decimal import Decimal

def podijeli(iznos: Decimal, n: int) -> list[Decimal]:
    if n <= 0:
        raise ValueError("n mora biti pozitivan.")
    feninzi = int(iznos * 100)            # 100.00 -> 10000
    osnova, ostatak = divmod(feninzi, n)  # 10000, 3 -> 3333, 1
    dijelovi = [osnova + (1 if i < ostatak else 0) for i in range(n)]
    return [Decimal(d) / 100 for d in dijelovi]

assert podijeli(Decimal("100.00"), 3) == [Decimal("33.34"), Decimal("33.33"), Decimal("33.33")]
assert sum(podijeli(Decimal("0.05"), 3)) == Decimal("0.05")`, obj:'Rad u cijelim feninzima izbjegava zaokruživanje potpuno. To je ista ideja kao LARGEST_REMAINDER politika u Sole-KP.'},
  agent:['esc() postoji u tri kopije (app-next-shared.js, app-next-auth-forms.js, mjerni.html). Svedi na jednu (import iz app-next-shared.js; za mjerni.html izdvoji mali zajednički modul), bez promjene ponašanja, i dodaj Vitest za esc.'],
},
{ id:'m7', n:'7', naslov:'Testiranje', pod:'Piramida, unit/integracija/E2E, čiste funkcije, mockovi, flaky',
  ideja:[
    '<b>Test</b> je kod koji provjerava drugi kod i ponavlja se automatski. <b>Unit</b> test provjerava jednu funkciju bez baze i mreže (milisekunde). <b>Integracijski</b> provjerava saradnju sa pravom bazom ili HTTP-om. <b>E2E</b> (Playwright) klikće kroz pravi preglednik (sekunde po testu).',
    '<b>Piramida</b>: mnogo unit, manje integracijskih, malo E2E. Čiste funkcije (bez sporednih efekata) je najlakše testirati; zato arhitektura iz modula 5 direktno pravi kod koji se lako testira.',
    '<b>Mock/fake</b> zamjenjuje stvarnu zavisnost (npr. API vrati 401). Opasnost: testiraš mock umjesto stvarnog koda. <b>Flaky</b> test ponekad prođe, ponekad padne; to uništava povjerenje. <b>Fixture</b> je pripremljeno stanje za test (baza sa dvije organizacije).',
  ],
  analogija:'Unit test je provjera svake cigle; integracijski provjerava zid; E2E provjerava da li se kroz vrata može ući u kuću. Ne gradiš kuću provjeravajući samo vrata.',
  dia:'piramida',
  kod:[
    {p:'Sole-KP/tests/unit/test_gl_balance.py:18', t:'dobar', k:`def test_uravnotezen_nalog_prolazi() -> None:
    zbirovi = balance.validate_lines([(D("100.00"), D("0.00")), (D("0.00"), D("100.00"))])
    assert zbirovi.is_balanced
    assert zbirovi.debit == D("100.00")`, o:'Idealan unit test: čista funkcija, jasan naziv koji opisuje ponašanje, bez baze. Radi u milisekundama.'},
    {p:'Sole-KP/tests/integration/test_tenant_isolation.py:141', t:'dobar', k:`def test_tudji_red_nije_dostupan_ni_po_tacnom_id(two_orgs, app_engine, owner_engine) -> None:
    org_a, org_b = two_orgs
    with owner_engine.begin() as c:
        c.execute(SET_ORG, {"org": str(org_b)})
        b_unit_id = c.execute(text("SELECT id FROM org_unit")).scalar_one()
    with app_engine.begin() as c:
        c.execute(SET_ORG, {"org": str(org_a)})
        found = c.execute(text("SELECT id FROM org_unit WHERE id = :id"),
                          {"id": b_unit_id}).scalar_one_or_none()
    assert found is None`, o:'Integracijski test sigurnosti: dokazuje da RLS krije tuđi red čak i kad znaš tačan id. Fixture two_orgs priprema dvije firme.'},
    {p:'inhome/tests/vitest/csv-parser.test.js:7', t:'los', k:`// test definiše SVOJU kopiju parsera umjesto da uveze pravi
function parseCsv(text) { ... }
it('parsira navodnike', () => { expect(parseCsv('"a,b",c')).toEqual([...]); });`, o:'Testira kopiju funkcije, ne kod koji aplikacija koristi. Pravi parser se može pokvariti, a test i dalje prolazi. Kontrast: app-next-contracts.test.js uvozi pravi calculateQuickEstimate.'},
  ],
  greske:['Testirati implementaciju (tačan HTML string) umjesto ponašanja: svaka promjena dizajna obori testove.','Prihvatati „poznate padove“: crveno mora značiti stop, inače pravi pad prođe neprimijećen.','Samo E2E testovi: spori, krhki, a kad padnu, ne kažu gdje je greška.','Test bez asserta ili sa assertom koji uvijek prolazi.'],
  kviz:[
    {p:'Koji test je najbrži i treba ih biti najviše?', o:['E2E','Unit','Ručni','Integracijski'], t:1, e:'Sole-KP ima 500+ bez baze koji traju sekunde.'},
    {p:'Test prolazi 7 od 10 puta bez promjene koda. Kako se zove?', o:['Unit','Flaky','Mock','Fixture'], t:1, e:'Najčešći uzroci: vrijeme, redoslijed, dijeljeno stanje, opterećenje.'},
    {p:'Zašto je csv-parser.test.js problematičan?', o:['Prespor je','Testira kopiju funkcije, pa ne štiti pravi kod','Nema naziv','Koristi Vitest'], t:1, e:'Test mora uvesti ono što aplikacija stvarno koristi.'},
    {p:'Šta je fixture?', o:['Popravka buga','Pripremljeno stanje/podaci za test (npr. two_orgs)','Vrsta asserta','CI server'], t:1, e:'pytest fixture se automatski ubaci kao parametar testa.'},
  ],
  vjezba:{ z:'Napiši pytest testove za funkciju podijeli() iz modula 6: (1) zbir je uvijek tačan za više slučajeva, (2) n=0 baca grešku. Koristi @pytest.mark.parametrize.', h:'parametrize prima listu torki (ulaz, očekivano). pytest.raises(ValueError) za grešku.',
    r:`import pytest
from decimal import Decimal as D
from novac import podijeli

@pytest.mark.parametrize("iznos, n", [
    (D("100.00"), 3), (D("0.05"), 3), (D("10.00"), 7), (D("1.00"), 1),
])
def test_zbir_je_tacan(iznos, n):
    dijelovi = podijeli(iznos, n)
    assert sum(dijelovi) == iznos
    assert len(dijelovi) == n
    assert max(dijelovi) - min(dijelovi) <= D("0.01")   # ravnomjerno

def test_nula_dijelova_baca_gresku():
    with pytest.raises(ValueError):
        podijeli(D("10.00"), 0)`, obj:'Testira se ponašanje (svojstva: zbir, broj, ravnomjernost), a ne tačan redoslijed feninga. Tako test preživi i drugačiju implementaciju.'},
  agent:['Dodaj unit testove za workflow_service._payment_summary (čista funkcija): slučajevi bez faktura, djelimično plaćeno, preplaćeno. Testiraj ponašanje, ne interni oblik rječnika.'],
},
{ id:'m8', n:'8', naslov:'Sigurnost', pod:'Autentifikacija, autorizacija, injection, XSS, CSRF, upload, tajne',
  ideja:[
    '<b>Autentifikacija</b> = ko si ti (prijava, JWT). <b>Autorizacija</b> = šta smiješ (dozvole, vlasništvo reda). Većina curenja podataka nije „hakovanje“ nego zaboravljena autorizacija: promijeniš id u URL-u i vidiš tuđe.',
    'Klasični napadi: <b>SQL injection</b> (korisnički tekst postane dio SQL-a; odbrana: parametri), <b>XSS</b> (korisnički tekst postane skripta u tuđem pregledniku; odbrana: escape i CSP), <b>CSRF</b> (tuđi sajt natjera tvoj preglednik da pošalje zahtjev sa tvojim kolačićem; odbrana: CSRF token, SameSite).',
    '<b>Najmanje privilegija</b>: svaki dio sistema ima samo prava koja mu trebaju (Sole-KP runtime rola ne može mijenjati audit log). <b>Tajne</b> (ključevi, lozinke) nikad u kodu, nego u env varijablama. <b>Odbrana u dubinu</b>: više slojeva, jer svaki može zakazati.',
  ],
  analogija:'Autentifikacija je pokazivanje lične karte na ulazu u zgradu; autorizacija je da li tvoj ključ otvara baš ta vrata. Portir koji samo gleda ličnu kartu pušta te u svaki stan.',
  dia:'napadi',
  kod:[
    {p:'inhome/repositories/project_repository.py:87', t:'dobar', k:`cursor = conn.execute(
    'UPDATE projekti SET data=? WHERE id=? AND user_id=?',
    (json.dumps(payload), project_id, user_id),
)`, o:'Dvije odbrane u jednoj liniji: ? parametri (nema SQL injectiona) i AND user_id=? (autorizacija: mijenjaš samo svoje).'},
    {p:'inhome/upload_security.py:37', t:'dobar', k:`def validate_upload_content(mime_type, file_bytes):
    mime = (mime_type or '').split(';', 1)[0].strip().lower()
    raw = bytes(file_bytes or b'')
    if mime in BLOCKED_UPLOAD_MIME_TYPES or _looks_like_active_content(raw):
        return 'Sadrzaj fajla nije dozvoljen.'
    if mime == 'application/pdf' and not raw.startswith(b'%PDF-'):
        return 'Sadrzaj fajla ne odgovara PDF tipu.'`, o:'Ne vjeruje nazivu ni deklarisanom tipu, nego provjerava „magične bajtove“ na početku fajla. Blokira SVG/HTML jer mogu sadržati skriptu.'},
    {p:'inhome/app.py:152 (JWT konfiguracija)', t:'los', k:`app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['JWT_COOKIE_SAMESITE'] = 'Lax'
app.config['JWT_COOKIE_CSRF_PROTECT'] = False`, o:'Stvaran nalaz: CSRF zaštita za kolačić je isključena. SameSite=Lax blokira većinu cross-site POST-ova u modernim preglednicima, ali to je jedna linija odbrane umjesto dvije, a token važi 30 dana. Vrijedi razmotriti CSRF token ili kraći rok + refresh.'},
  ],
  greske:['Provjeriti samo da li je korisnik prijavljen, ne i da li je red njegov.','Spajati SQL stringom (f"... WHERE ime = \'{ime}\'").','Ispisivati korisnički tekst kroz innerHTML bez esc().','Tajni ključ u kodu ili u gitu; „privremeni“ default ključ koji ostane u produkciji.'],
  kviz:[
    {p:'Korisnik promijeni /api/fakture/15 u /api/fakture/16 i vidi tuđu fakturu. Koji dio je zakazao?', o:['Autentifikacija','Autorizacija (provjera vlasništva)','HTTPS','CSS'], t:1, e:'Prijavljen je, ali server nije provjerio da li je faktura 16 njegova.'},
    {p:'Koja je glavna odbrana od SQL injectiona?', o:['Duža lozinka','Parametrizovani upiti (? ili :ime)','HTTPS','Captcha'], t:1, e:'Baza tada tretira unos kao vrijednost, nikad kao SQL.'},
    {p:'Zašto se provjeravaju magični bajtovi uploada?', o:['Zbog brzine','Jer se naziv i tip fajla lako lažu; sadržaj ne','Zbog veličine','Zbog imena'], t:1, e:'„slika.png“ može biti HTML sa skriptom.'},
    {p:'Zašto Sole-KP vraća 404 umjesto 403 za tuđi zapis?', o:['Greška','Da ne otkrije da zapis uopšte postoji','Brže je','Zbog SEO'], t:1, e:'ADR-011; pravi razlog se ipak upiše u audit.'},
    {p:'Šta je najmanje privilegija u Sole-KP audit logu?', o:['Svi mogu sve','Runtime rola ima samo SELECT i INSERT, pa ni bug ne može izmijeniti ili obrisati trag','Audit je u fajlu','Nema audita'], t:1, e:'Pravo koje nemaš ne možeš zloupotrijebiti ni greškom.'},
  ],
  vjezba:{ z:'Pronađi i popravi dvije ranjivosti:\n\n@bp.get("/api/pretraga")\n@jwt_required()\ndef pretraga():\n    q = request.args["q"]\n    rows = db.execute(f"SELECT * FROM klijenti WHERE ime LIKE \'%{q}%\'").fetchall()\n    return jsonify([dict(r) for r in rows])', h:'Jedna je u načinu pravljenja SQL-a, druga je u tome ČIJE klijente vraća.',
    r:`@bp.get("/api/pretraga")
@jwt_required()
def pretraga():
    q = request.args.get("q", "")
    uid = _uid()
    rows = db.execute(
        "SELECT * FROM klijenti WHERE user_id = ? AND ime LIKE ?",   # 1) parametri
        (uid, f"%{q}%"),                                              # 2) samo moji
    ).fetchall()
    return jsonify([dict(r) for r in rows])`, obj:'1) f-string u SQL-u = SQL injection (q = "x\' OR 1=1 --"). 2) Bez user_id filtera pretraga vraća klijente SVIH korisnika. Usput: .get() umjesto ["q"] da nedostajući parametar ne da 500.'},
  agent:['Uradi sigurnosni pregled /api ruta u core_data_routes.py: za svaku rutu provjeri autentifikaciju, autorizaciju po user_id, parametrizovane upite i escape izlaza. Izvještaj kao tabela, bez izmjena koda.'],
},
{ id:'m9', n:'9', naslov:'Deploy i operacije', pod:'Env varijable, gunicorn, disk, backup, CI, git tok',
  ideja:[
    '<b>Konfiguracija u okruženju</b> (12-factor): isti kod radi lokalno i na produkciji; razlike (baza, tajne, URL) su u <b>env varijablama</b>. Aplikacija bez obavezne varijable treba odmah pasti (fail-fast), ne raditi sa lošim defaultom.',
    '<b>Gunicorn</b> je produkcijski server za Flask: pokreće više <b>workera</b> (procesa) da obrađuju zahtjeve paralelno; <code>gevent</code> omogućava mnogo istovremenih veza (bitno za SSE). Posljedica: workeri ne dijele memoriju, pa zajedničko stanje mora biti u bazi (zato inhome SSE čita iz tabele).',
    '<b>CI</b> (GitHub Actions) pokreće testove na svaki push; <b>deploy</b> izbaci novu verziju. Podaci su na trajnom <b>disku</b>, pa je <b>backup</b> obavezan. Git tok: grana po zadatku, mali commitovi, merge kad je zeleno.',
  ],
  analogija:'Kod je recept, env varijable su namirnice koje dobiješ u toj kuhinji. Isti recept radi u svakoj kuhinji ako su namirnice na mjestu.',
  dia:'deploy',
  kod:[
    {p:'inhome/render.yaml', t:'dobar', k:`startCommand: gunicorn app:app --bind 0.0.0.0:$PORT --worker-class gevent --workers 2 ...
envVars:
  - key: JWT_SECRET
    generateValue: true
  - key: DB_PATH
    value: /opt/render/project/data/inhome.db
disk: { mountPath: /opt/render/project/data, sizeGB: 1 }`, o:'Infrastruktura kao kod: start komanda, tajna koju Render sam generiše, putanja baze na trajnom disku. ⚠ Ista gunicorn komanda je i u Procfile, pa se mogu razići.'},
    {p:'Sole-KP/src/app/config.py:20', t:'dobar', k:`def _required(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise ConfigError(f"Nedostaje obavezna varijabla okruzenja: {name}. Vidi .env.example.")
    return value`, o:'Fail-fast konfiguracija: bez DATABASE_URL aplikacija se ne pokreće, sa jasnom porukom šta fali.'},
  ],
  greske:['Tajne u kodu ili u gitu.','Stanje u memoriji procesa sa više workera: svaki worker ima svoju kopiju i korisnik vidi različite podatke.','Deploy bez backupa baze.','Ista konfiguracija na dva mjesta (render.yaml i Procfile) koja se tiho raziđe.'],
  kviz:[
    {p:'Zašto se DATABASE_URL čita iz env varijable, a ne piše u kod?', o:['Brže je','Isti kod radi u svim okruženjima, a tajne nisu u gitu','Zbog Pythona','Nema razloga'], t:1, e:'12-factor princip: konfiguracija odvojena od koda.'},
    {p:'Imaš 2 gunicorn workera i čuvaš listu online korisnika u Python varijabli. Šta se desi?', o:['Radi savršeno','Svaki worker ima svoju listu, pa su podaci nepotpuni i nasumični','Brže radi','Baza se obriše'], t:1, e:'Zajedničko stanje ide u bazu ili Redis.'},
    {p:'Šta radi CI?', o:['Pravi dizajn','Automatski pokreće provjere (lint, testove) na svaki push','Piše kod','Pravi backup'], t:1, e:'Crven CI = ne spajaj.'},
    {p:'Zašto je fail-fast dobar za konfiguraciju?', o:['Nije','Greška se vidi odmah pri startu, a ne tek kad korisnik naleti na nju','Brže je','Manje koda'], t:1, e:'Bolje da deploy padne nego da radi pogrešno.'},
  ],
  vjezba:{ z:'Napiši Python funkciju ucitaj_config() koja čita DATABASE_URL (obavezno), DEBUG (opcionalno, podrazumijevano False, prihvata "1/true/da") i MAX_UPLOAD_MB (opcionalno, podrazumijevano 20, mora biti broj > 0), i baca jasnu grešku za loše vrijednosti.', h:'os.environ.get(ime, default). int() može baciti ValueError: uhvati ga i pretvori u svoju poruku.',
    r:`import os

class ConfigError(RuntimeError): pass

def ucitaj_config() -> dict:
    url = os.environ.get("DATABASE_URL")
    if not url:
        raise ConfigError("Nedostaje DATABASE_URL.")
    debug = os.environ.get("DEBUG", "").strip().lower() in {"1", "true", "da", "yes"}
    raw = os.environ.get("MAX_UPLOAD_MB", "20")
    try:
        max_mb = int(raw)
    except ValueError:
        raise ConfigError(f"MAX_UPLOAD_MB mora biti broj, a dobio sam '{raw}'.") from None
    if max_mb <= 0:
        raise ConfigError("MAX_UPLOAD_MB mora biti veći od 0.")
    return {"database_url": url, "debug": debug, "max_upload_mb": max_mb}`, obj:'Tri vrste varijabli: obavezna, opcionalna logička, opcionalna brojčana sa validacijom. Sole-KP config.py radi isto sa _required, _flag i _int.'},
  agent:['Ujednači start komandu: neka Procfile i render.yaml koriste istu gunicorn komandu iz jednog izvora (npr. skripta), i dodaj test koji provjerava da se ne razlikuju.'],
},
{ id:'m10', n:'10', naslov:'UX/UI', pod:'Postepeno otkrivanje, stanja ekrana, tokeni, pristupačnost, forme',
  ideja:[
    '<b>Progressive disclosure</b>: glavni ekran pokazuje status, blokadu i sljedeći korak; sekundarno je iza taba, drawera ili „Akcije“. Manje izbora = brže odluke. Cijena: skrivene stvari se teže nađu (i testovi ih moraju otvoriti, vidi zeleni E2E).',
    'Svaki ekran sa podacima ima <b>četiri stanja</b>: učitavanje, prazno, greška, uspjeh. <b>Design tokeni</b> (CSS varijable za boje, razmake, fontove) daju jedan izvor istine za izgled, pa tamna tema ili promjena brenda znače izmjenu na jednom mjestu.',
    '<b>Pristupačnost (a11y)</b>: tastatura mora raditi svuda, semantički HTML (button, a ne div), ARIA samo kad HTML nije dovoljan, kontrast teksta najmanje 4.5:1 (WCAG AA). <b>Forme</b>: greška pored polja, jasno šta popraviti; <b>PRG</b> (Post/Redirect/Get) sprečava dupli upis na F5.',
  ],
  analogija:'Dobar UI je kao dobar konobar: prvo ti kaže šta je bitno sada, jelovnik s desertima donese tek kad pitaš.',
  dia:'stanja',
  kod:[
    {p:'inhome/static/js/app-next.js:1660', t:'dobar', k:`if (state.error) {
  // UX-10: ranije je ovo bila slijepa ulica — crveni ekran bez ijednog dugmeta ...
  return \`
    <div class="next-error" role="alert">
      <p>\${esc(state.error)}</p>
      <button type="button" class="next-action is-primary" data-next-retry-load>\`;`, o:'Stanje greške sa objašnjenjem i izlazom (Pokušaj ponovo). role="alert" javlja čitaču ekrana. Skelet za učitavanje ima aria-busy.'},
    {p:'inhome/static/js/app-next.js:710 + app-next-events.js:839', t:'dobar', k:`<div class="next-dossier-tabs" role="tablist" aria-label="Dijelovi dosijea">
  <button role="tab" id="tab-\${esc(tab.id)}" aria-controls="tabpanel-\${esc(tab.id)}"
    aria-selected="\${state.dossierTab === tab.id ? 'true' : 'false'}"
    tabindex="\${state.dossierTab === tab.id ? '0' : '-1'}">
...
const smjer = { ArrowRight: 1, ArrowLeft: -1, Home: 'prvi', End: 'zadnji' }[event.key];`, o:'WAI-ARIA obrazac tabova: strelice mijenjaju tab, samo aktivni je u Tab redoslijedu (roving tabindex). ⚠ Tabovi u Postavkama su „chipovi“ sa role="group", pa ovo tamo ne važi.'},
    {p:'inhome/static/js/app-next-shared.js:159', t:'los', k:`// Mora ogledati \`access_control.has_pro_access()\` na backendu (jedini izvor pravila) ...
export function isProUser() {
  if (localStorage.getItem('inhome_admin_view_lite') === '1') return false;
  const user = state.user || {};
  if (user.is_admin) return true;
  if (user.plan === 'trial') return true;
  const pkg = user.package || 'lite';
  return pkg === 'pro' || pkg === 'basic';`, o:'Pravilo Lite/Pro napisano dva puta (frontend i backend) mora se ručno usklađivati, a razilaženje je već napravilo bug. Frontend smije samo sakriti dugme; stvarnu zaštitu daje backend. Bolje: backend pošalje gotov spisak dozvola.'},
  ],
  greske:['Ekran bez praznog stanja: nov korisnik vidi prazninu i ne zna šta da radi.','div sa onclick umjesto button: tastatura i čitač ekrana ga ne vide.','Boje napisane direktno u CSS-u umjesto tokena: tamna tema postaje nemoguća.','Poslovno pravilo (ko šta vidi) samo u frontendu.'],
  kviz:[
    {p:'Koja četiri stanja treba imati ekran sa podacima?', o:['Crveno, žuto, zeleno, plavo','Učitavanje, prazno, greška, uspjeh','Mobilno, tablet, desktop, TV','Lite, Pro, Admin, Gost'], t:1, e:'Najčešće se zaborave prazno i greška.'},
    {p:'Zašto <button>, a ne <div onclick>?', o:['Ljepši je','Button radi sa tastaturom i čitačem ekrana bez dodatnog koda','Brži je','Nema razlike'], t:1, e:'Semantički HTML je pristupačnost besplatno.'},
    {p:'Šta rješava PRG (Post/Redirect/Get)?', o:['Brzinu','Da osvježavanje stranice poslije slanja forme ne pošalje formu ponovo','Dizajn','SEO'], t:1, e:'Sole-KP forme: uspjeh → redirect; greška → ista forma sa 400.'},
    {p:'Gdje mora biti stvarna provjera da li je korisnik Pro?', o:['U CSS-u','Na backendu; frontend samo sakriva dugmad','U localStorage','Nigdje'], t:1, e:'Frontend se može zaobići; server ne.'},
  ],
  vjezba:{ z:'Popravi pristupačnost:\n\n<div class="tab active" onclick="open(1)">Pregled</div>\n<div class="tab" onclick="open(2)">Finansije</div>\n<div id="p1">…</div><div id="p2" style="display:none">…</div>', h:'role="tablist" / "tab" / "tabpanel", aria-selected, aria-controls, tabindex, button umjesto div, hidden umjesto display:none.',
    r:`<div role="tablist" aria-label="Dijelovi posla">
  <button role="tab" id="t1" aria-controls="p1" aria-selected="true"  tabindex="0">Pregled</button>
  <button role="tab" id="t2" aria-controls="p2" aria-selected="false" tabindex="-1">Finansije</button>
</div>
<div role="tabpanel" id="p1" aria-labelledby="t1">…</div>
<div role="tabpanel" id="p2" aria-labelledby="t2" hidden>…</div>
<!-- + JS: klik i strelice ←/→ mijenjaju aria-selected, tabindex i hidden -->`, obj:'Button daje fokus i Enter/Space, role i aria govore čitaču ekrana šta je šta, tabindex="-1" drži samo aktivni tab u Tab redoslijedu (strelice vode kroz ostale).'},
  agent:['Chipovi u Postavkama (data-next-postavke-tab) su vizuelno tabovi, ali imaju role="group". Pretvori ih u WAI-ARIA tabs obrazac kao u dosijeu (app-next.js:710), uključujući strelice, i ažuriraj E2E testove.'],
},
{ id:'m11', n:'11', naslov:'Rad sa AI agentima', pod:'Sažetak nivoa 2: sistem oko agenta',
  ideja:[
    'Agent (Claude Code, Codex) je brz programer bez pamćenja između sesija. Kvalitet rezultata zavisi od <b>sistema oko njega</b>: kratka memorija (CLAUDE.md/AGENTS.md sa pravilima, STATUS.md sa stanjem, historija u gitu), mali koraci sa commitom, i provjere koje mašina radi sama.',
    'Iz tvojih projekata: <b>pravilo prekršeno dva puta postaje test ili hook</b> (sw:stamp, test bijele liste); <b>crveni testovi znače stop</b>, ne „poznata baza“; <b>jedan agent = jedna grana/worktree</b>; <b>redizajn počinje inventarom funkcija</b>; dokumenti imaju jednog vlasnika i jedno mjesto.',
    'Najveća vrijednost ovog kursa za rad sa agentom: kad znaš pojmove (transakcija, autorizacija, N+1, port, PRG…), zahtjev je precizan, a rezultat provjerljiv. „Popravi“ postaje „umotaj u transakciju i dodaj test koji simulira pad na pola“.',
  ],
  analogija:'Agent je izvrstan majstor koji svako jutro dođe bez sjećanja na jučer. Plan na zidu (STATUS), pravila na vratima (CLAUDE.md) i libela koja sama pišti (hookovi, testovi) rade više od dužih uputstava usmeno.',
  dia:'agent',
  kod:[
    {p:'inhome/.claude/hooks/sw-stamp.mjs (PostToolUse hook)', t:'dobar', k:`const rel = path.relative(root, path.resolve(root, filePath)).split(path.sep).join('/');
if (!rel.startsWith('static/') || rel === 'static/sw.js') process.exit(0);
const out = execFileSync(process.execPath, [path.join(root, 'scripts', 'sw-cache.mjs')],
                         { cwd: root, encoding: 'utf8' });`, o:'Pravilo koje je 128 puta ručno pominjano sada izvršava mašina poslije svake izmjene u static/.'},
    {p:'claude-plugins/CLAUDE.md', t:'dobar', k:`- Hookovi su **Node skripte** (bez npm zavisnosti), jedna skripta = jedan hook.
  Uz svaku ide \`*.test.js\` (node:test).
- Hookovi su **fail-open**: greška se upiše u \`~/.claude/pravila.log\` i izađe se sa 0.
  Jedini izuzetak su blokade tajni.
- Hookovi moraju biti brzi (< 200 ms za UserPromptSubmit/PreToolUse)`, o:'Kratka, konkretna pravila sa razlogom: jedna odgovornost po skripti, testovi uz svaku, svjesna odluka fail-open vs fail-fast (tajne). Principi iz modula 6 i 7 primijenjeni na alate za agente.'},
  ],
  greske:['Dugi CLAUDE.md sa dnevnikom umjesto pravila.','„Popravi“ bez simptoma, sloja i definicije gotovog.','Dva agenta na istim fajlovima bez grana.','Prihvatiti rezultat bez čitanja diffa i bez zelenih provjera.'],
  kviz:[
    {p:'Pravilo „podigni CACHE“ je prekršeno više puta. Šta je najbolji potez?', o:['Napisati ga velikim slovima u CLAUDE.md','Pretvoriti ga u skriptu/test/hook koji mašina provjerava','Podsjećati agenta svaki put','Ignorisati'], t:1, e:'Ono što mašina provjerava radi uvijek; ono što agent mora zapamtiti radi ponekad.'},
    {p:'Gdje ide „šta je urađeno danas“?', o:['CLAUDE.md','Git commit poruke (i kratko u STATUS ako mijenja stanje)','README','Nigdje'], t:1, e:'Pravila, stanje i historija imaju svako svoje mjesto.'},
    {p:'Koji zahtjev agentu je najbolji?', o:['Popravi bug','Zašto ne radi?','Brisanje fakture vraća 500 (Network: DELETE /api/fakture/15). Nađi uzrok, dodaj test koji ga reproducira, popravi, pokreni test:fast.','Napravi da radi'], t:2, e:'Simptom, lokacija, dokaz i definicija gotovog.'},
  ],
  vjezba:{ z:'Napiši zahtjev agentu za ovu promjenu, koristeći pojmove iz kursa: „Kad dva puta brzo kliknem Kreiraj fakturu, nastanu dvije.“', h:'Koji princip (modul 6)? Gdje popraviti: frontend, backend ili oba? Kakav test dokazuje popravku?',
    r:`Bug: dvostruki klik na „Kreiraj fakturu“ pravi dvije fakture (nije idempotentno).

Cilj:
1. Frontend: dugme onemogućeno dok zahtjev traje (state.savingId).
2. Backend (prava zaštita): POST /api/fakture prima idempotency ključ
   (UUID iz frontenda); isti ključ u 10 min vraća postojeću fakturu, ne pravi novu.
   Jedinstveni indeks na (user_id, idempotency_key).
3. Testovi: pytest — dva POST-a sa istim ključem = jedna faktura;
   Playwright — dvostruki klik = jedna faktura u listi.

Granice: bez promjene obračuna i Lite/Pro pravila.
Gotovo kad: test:fast i novi testovi zeleni, commit po koraku.`, obj:'Precizan zahtjev imenuje problem (idempotentnost), razdvaja udobnost (frontend) od zaštite (backend + indeks u bazi) i definiše dokaz.'},
  agent:['Pročitaj STATUS.md i zadnjih 10 commitova, pa mi u 5 redova reci gdje smo stali i predloži sljedeći mali korak sa definicijom gotovog.'],
},
];

/* ================= RJEČNIK ================= */
const RJECNIK = [
['ACID','Četiri garancije transakcije: atomarnost (sve ili ništa), konzistentnost, izolacija, trajnost.','m4'],
['ADR','Architecture Decision Record: kratak dokument koji čuva kontekst, opcije i razlog arhitektonske odluke.','m5'],
['Alembic','Alat za verzionisane migracije šeme baze uz SQLAlchemy (upgrade/downgrade).','m4'],
['API','Ugovor preko kojeg programi razgovaraju; kod tebe skup HTTP ruta /api/…','m1'],
['Autentifikacija','Utvrđivanje ko je korisnik (prijava, JWT, kolačić).','m8'],
['Autorizacija','Utvrđivanje šta korisnik smije (dozvole, vlasništvo reda).','m8'],
['Backup','Kopija podataka iz koje se može vratiti stanje nakon kvara ili greške.','m9'],
['CHECK constraint','Pravilo u bazi koje odbija red koji ga ne zadovoljava, npr. iznos ≥ 0.','m3'],
['CI','Continuous Integration: automatsko pokretanje provjera na svaki push (GitHub Actions).','m9'],
['Cohesion (kohezija)','Koliko dijelovi jednog modula služe istoj svrsi. Visoka je dobra.','m5'],
['Composition root','Jedno mjesto koje sastavlja objekte i njihove zavisnosti (Sole-KP composition.py).','m5'],
['Coupling (povezanost)','Koliko modul zavisi od unutrašnjosti drugih. Nizak je dobar.','m5'],
['CORS / same-origin','Pravilo preglednika da stranica sa jednog domena ne čita odgovore drugog bez dozvole.','m1'],
['CSRF','Napad u kojem tuđi sajt natjera preglednik da pošalje zahtjev sa tvojim kolačićem.','m8'],
['CSS varijabla','Imenovana vrijednost (--next-brand) koja se koristi kroz cijeli CSS; osnova design tokena.','m10'],
['Decimal','Tip za tačan decimalni račun; obavezan za novac umjesto float.','m6'],
['Dependency injection','Objekat dobija zavisnosti izvana umjesto da ih sam pravi; olakšava testiranje.','m5'],
['Deploy','Postavljanje nove verzije aplikacije na server.','m9'],
['Design token','Imenovana odluka dizajna (boja, razmak, font) na jednom mjestu.','m10'],
['DOM','Stablo elemenata stranice u pregledniku koje JavaScript čita i mijenja.','m2'],
['Domena (domain)','Sloj sa čistim poslovnim pravilima, bez frameworka i baze.','m5'],
['DRY','Don’t Repeat Yourself: svako pravilo na jednom mjestu.','m6'],
['E2E test','Test kroz pravi preglednik koji prolazi cijeli tok kao korisnik (Playwright).','m7'],
['Endpoint / ruta','Kombinacija URL-a i metode koju server obrađuje, npr. POST /api/klijenti.','m1'],
['Env varijabla','Vrijednost iz okruženja procesa (DATABASE_URL, JWT_SECRET) umjesto iz koda.','m9'],
['ES modul','JavaScript fajl sa import/export, jasno odvojen od drugih.','m2'],
['Event delegation','Jedan slušač na roditelju hvata događaje svih potomaka.','m2'],
['Fail-fast','Na grešku odmah prekini, da se ne nastavi u lošem stanju.','m6'],
['Fail-open','Na grešku provjere pusti dalje; svjestan izbor kad je dostupnost važnija.','m6'],
['Fixture','Pripremljeno stanje ili podaci za test (pytest).','m7'],
['Flaky test','Test koji ponekad prolazi, a ponekad pada bez promjene koda.','m7'],
['Float','Binarni broj sa pomičnim zarezom; netačan za novac.','m6'],
['Gunicorn','Produkcijski WSGI server koji pokreće Flask u više workera.','m9'],
['GROUP BY','SQL grupisanje redova radi sabiranja, brojanja i slično.','m3'],
['HAVING','SQL filter nad grupama, poslije GROUP BY.','m3'],
['Header (zaglavlje)','Metapodatak HTTP zahtjeva ili odgovora, npr. Content-Type, Cookie.','m1'],
['Hook','Skripta koju alat automatski pokrene na događaj (npr. poslije izmjene fajla).','m11'],
['HTTP','Protokol zahtjeva i odgovora između klijenta i servera.','m1'],
['HttpOnly kolačić','Kolačić koji JavaScript ne može pročitati; štiti token od XSS krađe.','m1'],
['Idempotentnost','Ponovljena ista operacija ima isti efekat kao jedna.','m6'],
['Indeks','Struktura koja ubrzava pretragu po koloni, a usporava upis.','m4'],
['Integracijski test','Test saradnje dijelova sa pravom bazom ili HTTP-om.','m7'],
['JOIN','SQL spajanje redova dvije tabele po uslovu (najčešće stranom ključu).','m3'],
['JSON','Tekstualni format podataka: objekti, liste, brojevi, stringovi.','m1'],
['JWT','Potpisani token sa podacima o korisniku i roku važenja.','m1'],
['KISS','Keep It Simple: najjednostavnije rješenje koje radi.','m6'],
['Kolačić (cookie)','Mali podatak koji preglednik čuva i automatski šalje serveru uz svaki zahtjev.','m1'],
['localStorage','Skladište u pregledniku dostupno JavaScriptu; nije mjesto za tajne.','m1'],
['Migracija','Numerisan, reverzibilan korak promjene šeme baze.','m4'],
['Mock / fake','Lažna zamjena za stvarnu zavisnost u testu.','m7'],
['Modularni monolit','Jedna aplikacija podijeljena u module sa strogim granicama (Sole-KP).','m5'],
['Multi-tenancy','Više klijenata (firmi) dijeli istu aplikaciju i bazu, uz izolaciju podataka.','m4'],
['N+1 problem','Jedan upit za listu pa po jedan za svaki red; rješenje je JOIN ili IN.','m4'],
['Nepromjenjivost','Zapis se ne mijenja; ispravka je novi zapis (storno).','m6'],
['Normalizacija','Organizacija tabela tako da je svaka činjenica na jednom mjestu.','m3'],
['ORM','Sloj koji redove baze pretvara u objekte (SQLAlchemy).','m4'],
['Paginacija','Vraćanje podataka po stranicama (LIMIT/OFFSET).','m4'],
['Parametrizovan upit','SQL sa ? ili :ime umjesto spajanja stringova; štiti od SQL injectiona.','m8'],
['Polling','Periodično pitanje servera „ima li novo?“.','m2'],
['Port (Protocol)','Opis „utičnice“ koju servis očekuje, bez konkretne implementacije.','m5'],
['PRG','Post/Redirect/Get: poslije uspješnog slanja forme redirect, da F5 ne pošalje ponovo.','m10'],
['Primarni ključ','Kolona koja jedinstveno identifikuje red (id).','m3'],
['Progressive disclosure','Prikaži bitno, sekundarno sakrij iza taba ili „Više“.','m10'],
['Pristupačnost (a11y)','Aplikacija upotrebljiva tastaturom, čitačem ekrana i uz dobar kontrast.','m10'],
['Rate limit','Ograničenje broja zahtjeva u vremenu (npr. pokušaja prijave).','m8'],
['Refaktor','Promjena strukture koda bez promjene ponašanja.','m5'],
['Repozitorij (repository)','Sloj koji jedini razgovara sa bazom.','m5'],
['REST','Stil API-ja: URL imenuje resurs, HTTP metoda radnju.','m1'],
['RLS','Row-Level Security: PostgreSQL pravila koja vraćaju samo redove tvoje organizacije.','m4'],
['Servis (service)','Sloj koji vodi slučaj upotrebe i granicu transakcije.','m5'],
['Service worker','Skripta između stranice i mreže; keš i offline rad.','m2'],
['SQL injection','Napad ubacivanjem SQL-a kroz korisnički unos.','m8'],
['SSE','Server-Sent Events: server gura događaje pregledniku kroz otvorenu vezu.','m2'],
['State (stanje)','Podaci iz kojih se iscrtava ekran.','m2'],
['Stateless','Server ne pamti prethodne zahtjeve; svaki zahtjev sam dokazuje ko si.','m1'],
['Status kod','Broj u HTTP odgovoru koji kaže ishod (200, 201, 400, 401, 403, 404, 500).','m1'],
['Storno','Ispravka proknjiženog naloga novim nalogom sa zamijenjenim stranama.','m6'],
['Strani ključ','Kolona koja pokazuje na primarni ključ druge tabele.','m3'],
['Transakcija','Grupa izmjena koja se primijeni cijela ili nikako.','m4'],
['Unit test','Brz test jedne funkcije bez baze i mreže.','m7'],
['WAI-ARIA','Standard atributa (role, aria-*) koji čitaču ekrana objašnjava interaktivne elemente.','m10'],
['Worker','Jedan proces servera; više workera ne dijeli memoriju.','m9'],
['Worktree','Drugi radni folder iste git repozitorije na drugoj grani.','m11'],
['XSS','Napad gdje korisnički tekst postane skripta u tuđem pregledniku.','m8'],
['YAGNI','You Aren’t Gonna Need It: ne gradi unaprijed ono što možda zatreba.','m6'],
];



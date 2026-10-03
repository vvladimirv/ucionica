# Status

Ažurirano: 2026-10-03.

## Gdje smo

| Dio | Stanje |
| --- | --- |
| 1 · Python od nule | 9 lekcija, 99 koraka — gotovo |
| 2 · JavaScript | 8 lekcija, 104 koraka — gotovo |
| 3 · SQL i baze | 5 lekcija, 64 koraka — gotovo |
| 4 · Teme | 11 tema + rječnik; čitanje i kviz, nisu interaktivni koraci |
| 5 · Rad sa AI agentima | 10 lekcija, 100 koraka — gotovo |

- `npm test`: 32 lekcije, 367 koraka, 11 tema, 56 slučajeva runnera, 182 izvršne provjere, UI prolaz i
  telefon (390 px) — sve prolazi.
- Artefakt: <https://claude.ai/artifact/V4DU7enjHTwhCZ2a1vMEq8>. Objavljuje se samo `dist/index.html`;
  runtime fajlovi (`py/`, `sql/`) se ne mijenjaju. Capabilities `sample`, `db` i `user` su zadržane.
  Zadnja objava: vidi niže, „Objave“.

## Novo u fazi „Dio 5 · Rad sa AI agentima“ (2026-10-03)

- **Vraćeno u git:** živi artefakt (verzija `1790537289-3496`) je imao Dio 5 sa lekcijama ag1–ag7,
  runner `tekst` i rezervni tutor („Pitaj drugi AI“), a toga nije bilo ni u jednoj grani. Uvezeno sa
  `scripts/uvezi.mjs` (build je bio identičan živoj stranici); lekcije su preimenovane iz `60–63-…` u
  `35–39-…` jer se moduli spajaju po abecedi. Tema 11 je u toj verziji već zamijenjena Dijelom 5.
- **Nove lekcije** (teme sa korisnikovih snimaka reklama za „Claude kurs“ i „Claude Code kurs“, samo
  ono što ag1–ag7 nisu pokrivale), ispred završne `ag7`:
  - `ag8` Claude Code u praksi: `claude`, `--continue`, `--resume`, `--worktree`, `-p`, `/init`, `@fajl`;
    Shift+Tab i načini rada, plan mode; `/loop`, Desktop zadaci, rutine.
  - `ag9` Subagenti paralelno i MCP: `claude mcp add`, opsezi local/project/user, `.mcp.json` sa
    `${VAR}`, prompt injection.
  - `ag10` Claude za posao: prompt za ponudu i ugovor (dokument gore, pitanje dolje, citati), tabele,
    istraživanje sa izvorima, Projekti, zakazani zadaci.
  - Već pokriveno ranije: CLAUDE.md (ag3), git/PR/worktree (ag6), pisanje subagenta (ag5, ag7).
  - „Certifikat“ iz reklame nije uvršten (nije tema učenja).
- Činjenice o Claude Code provjerene u zvaničnoj dokumentaciji 2026-10-03 (lekcija ag8 ima napomenu
  da se alat mijenja). Reference „lekcija 7“ (izbor modela) prepravljene u „lekcija 10“.
- Ispravka: tabela u ag7 („Kutija alata“) je širila stranicu na telefonu.
- Provjere: struktura zna za jezike `tekst` i `diff`, `bezPokretanja` i tekst-testove; rječnik smije
  pokazivati na lekciju (`lek:ag…`); hvata ponovljen id teme, nepostojeći dijagram, tačan odgovor kviza
  van opcija, nepoznatu oznaku koda.

## Ranije: faza „Dio 3 · SQL“

- `runSql` izvršava naredbe jednu po jednu: rezultati idu redom (tabela ili poruka tipa
  „✓ UPDATE — izmijenjeno redova: 2“) i ostaju i kad kasnija naredba padne; prazan SELECT pokaže
  kolone. Linija greške se izvodi iz poruke SQLite-a (sql.js ne daje poziciju).
- SQL koraci iznad upita pokazuju tabele učioničke baze i SQL koji ih pravi.
- SQL testovi mogu provjeriti i sam kod (`kodSadrzi`).

## Poznata ograničenja (nije provjereno ili nije moguće provjeriti ovdje)

- Tačan CSP artefakta nije poznat. Provjere koriste približan i namjerno strog CSP. Oslanja se
  samo na ono što je test-artefakt „Test izvršavanja koda“ potvrdio u stvarnom okruženju:
  `new Function`, Worker iz blob-a, sql.js i Pyodide. iframe se ne koristi.
- Provjere rade samo u Chromiumu. Broj linije za greške u `dom` koraku čita se iz V8 formata steka
  (Chrome, Edge); u Firefoxu i Safariju poruka greške radi, ali broj linije možda izostane.
- Linija SQL greške je procjena iz poruke (npr. `near "FROM"` → prvo mjesto u ostatku koda). Za tipične
  greške početnika je tačna, ali ne za svaku moguću.
- `dom` kod radi na glavnoj niti: petlje prekida čuvar poslije 1,5 s, ali kod koji namjerno ide
  preko `globalThis.document` može dirati stranicu učionice.
- Tutor (`sample`) i napredak na nalogu (`db`, `user`) ne postoje u lokalnim provjerama
  (nema `window.claude`), pa su provjereni samo tako da stranica radi bez njih.

## Sljedeći korak

Svih pet dijelova je gotovo (Dio 4 je čitanje i kviz). Mogući nastavci (odlučuje korisnik):

1. **Runner `tekst` u provjeri runnera** — sada ga provjeravaju samo zadaci (rješenje prolazi, početak ne);
   nema zasebnih slučajeva u `provjeri-runnere.mjs`.
2. **Teme kao interaktivni koraci** — npr. Tema 3/4 (baze) i Tema 8 (sigurnost) sa SQL i JS zadacima.
3. **Napredniji nivo** — npr. Python + SQL zajedno (sqlite3 iz Pythona), testovi (pytest) ili Flask
   ruta sa bazom. Za sqlite3 u Pyodide-u treba objaviti i njegov paket uz artefakt (sada ga nema).

Kod iz inhome i Sole-KP citiraj samo iz samih repozitorija. Postojeći citati su iz ranije sesije.

**Prije objave uvijek commit i push** (ranija sesija je objavila Dio 5 bez gita). Prije objave pročitaj
živi artefakt: ako je id verzije drugačiji od zadnjeg u tabeli „Objave“, prvo uvezi i uporedi.

## Repozitorij

- Grane: `claude/eager-hamilton-bilyvq` (razvoj) i `main`. `main` je napravljen 2026-09-26 na stanju
  sa Dijelom 2 (`32240da`) i ne pomjera se bez dogovora.
- Zadana grana na GitHubu je i dalje `claude/eager-hamilton-bilyvq`; promjena je u postavkama
  (Settings → General → Default branch) i nije dostupna iz Claude sesije.
- Repozitorij je **javan**, a teme sadrže citate i sigurnosne nalaze iz inhome i Sole-KP. Preporuka
  korisniku: prebaciti ga u privatni (Settings → General → Danger Zone → Change visibility).

## Objave

| Verzija | Id | Datum | Commit | Sadržaj |
| --- | --- | --- | --- | --- |
| 6 | `1790409771-0c3a` | 2026-09-26 | `357387f` | Dio 2 · JavaScript |
| 7 | `1790411547-d968` | 2026-09-26 | `d9ad761` | Dio 3 · SQL |
| 8 | `1790537289-3496` | ? | — (nije bilo u gitu; vraćeno u `ad9db16`) | Dio 5 · ag1–ag7, rezervni tutor |
| 9 | `1791047870-4b9c` | 2026-10-03 | `ad9db16` | Dio 5 · ag8–ag10 (Claude Code, MCP, posao) |

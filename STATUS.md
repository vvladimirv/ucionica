# Status

Ažurirano: 2026-10-03.

## Gdje smo

| Dio | Stanje |
| --- | --- |
| 1 · Python od nule | 9 lekcija, 99 koraka — gotovo |
| 2 · JavaScript | 8 lekcija, 104 koraka — gotovo |
| 3 · SQL i baze | 5 lekcija, 64 koraka — gotovo |
| 4 · Teme | 11 tema + rječnik; čitanje i kviz, nisu interaktivni koraci |
| 5 · Rad sa Claudeom i agentima | 6 tema (11–16); čitanje i kviz |

- `npm test`: 22 lekcije, 267 koraka, 17 tema, 56 slučajeva runnera, 169 izvršnih provjera, UI prolaz i
  telefon (390 px) — sve prolazi.
- Artefakt: <https://claude.ai/artifact/V4DU7enjHTwhCZ2a1vMEq8>. Objavljuje se samo `dist/index.html`;
  runtime fajlovi (`py/`, `sql/`) se ne mijenjaju. Capabilities `sample`, `db` i `user` su zadržane.
  Zadnja objava: vidi niže, „Objave“.

## Novo u fazi „Dio 5 · Rad sa Claudeom i agentima“

- Teme sa korisnikovih snimaka reklama za „Claude kurs“ / „Claude Code kurs“ raspoređene u Dio 5
  (meni, oznaka `dio: 5`): tema 11 (postojeća, sistem oko agenta) + 12 Promptovi i dokumenti,
  13 Claude Code: terminal i CLAUDE.md, 14 plan mode, /loop i subagenti, 15 MCP serveri i git,
  16 podaci, istraživanje i automatizacija (Projekti, /loop, Desktop zadaci, rutine).
- „Certifikat“ iz reklame nije uvršten (nije tema učenja i nije provjereno šta nudi).
- Činjenice o Claude Code provjerene u dokumentaciji 2026-10-03; tema ima napomenu da se alat mijenja.
- Citati iz stvarnog koda su samo iz ovog repozitorija (CLAUDE.md, git log); ostalo je označeno kao
  primjer ili format iz dokumentacije.
- Provjera strukture sada hvata i: ponovljen id teme, nepostojeći dijagram, tačan odgovor kviza van
  opcija, nepoznatu oznaku koda, rječnik koji pokazuje na nepostojeću temu.

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

Sva tri dijela sa kodom su gotova; Dio 5 je čitanje i kviz. Mogući nastavci (odlučuje korisnik):

1. **Dio 5 sa vježbama** — npr. korisnik napiše prompt ili CLAUDE.md, a tutor (`sample`) ga ocijeni
   po kriterijima teme.
2. **Teme kao interaktivni koraci** — npr. Tema 3/4 (baze) i Tema 8 (sigurnost) sa SQL i JS zadacima.
3. **Napredniji nivo** — npr. Python + SQL zajedno (sqlite3 iz Pythona), testovi (pytest) ili Flask
   ruta sa bazom. Za sqlite3 u Pyodide-u treba objaviti i njegov paket uz artefakt (sada ga nema).

Kod iz inhome i Sole-KP citiraj samo iz samih repozitorija. Postojeći citati su iz ranije sesije.

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

# Status

Ažurirano: 2026-09-26.

## Gdje smo

| Dio | Stanje |
| --- | --- |
| 1 · Python od nule | 9 lekcija, 99 koraka — gotovo (preuzeto iz artefakta, provjereno) |
| 2 · JavaScript | 8 lekcija, 104 koraka — gotovo (novo u ovoj fazi) |
| 3 · SQL i baze | nije počet; runner (sql.js) i format testova postoje |
| 4 · Teme | 12 tema + rječnik; čitanje i kviz, nisu interaktivni koraci |

- Izvor je u repozitoriju od 2026-09-25; ranije je postojao samo kao objavljeni artefakt.
  `scripts/uvezi.mjs` je dokazao da je uvoz bez gubitaka.
- `npm test`: 17 lekcija, 203 koraka, 47 slučajeva runnera, 129 izvršnih provjera, UI prolaz i
  telefon (390 px) — sve prolazi.
- Artefakt: <https://claude.ai/artifact/V4DU7enjHTwhCZ2a1vMEq8>. Zadnja objava: verzija 6
  (`1790409771-0c3a`, 2026-09-26) = commit `357387f` (sa Dijelom 2). Objavljuje se samo `dist/index.html`;
  runtime fajlovi (`py/`, `sql/`) se ne mijenjaju. Capabilities `sample`, `db` i `user` su zadržane.

## Novo u fazi „Dio 2 · JavaScript“

- `02-izvrsavanje-js.js`: runner `js` (Web Worker, tačna linija greške, prekid poslije 4 s) i `dom`
  (prava mini-stranica u shadow DOM okviru, čuvar petlji, testovi u skrivenom okviru), zajednički
  ispis konzole i lažni server koji se ponaša kao inhome API.
- DOM koraci prikazuju HTML stranice; tutor ga dobija u kontekstu.
- Ispravke prikaza: brojevi linija ≥ 10 sa tačkicom, sklopiv meni na telefonu, oznaka „Python:
  kad zatreba“ umjesto trajnog „učitava se“.

## Poznata ograničenja (nije provjereno ili nije moguće provjeriti ovdje)

- Tačan CSP artefakta nije poznat. Provjere koriste približan i namjerno strog CSP. Oslanja se
  samo na ono što je test-artefakt „Test izvršavanja koda“ potvrdio u stvarnom okruženju:
  `new Function`, Worker iz blob-a, sql.js i Pyodide. iframe se ne koristi, jer nije provjeren.
- Provjere rade samo u Chromiumu. Broj linije za greške u `dom` koraku čita se iz V8 formata steka
  (Chrome, Edge); u Firefoxu i Safariju poruka greške radi, ali broj linije možda izostane.
- `dom` kod radi na glavnoj niti: petlje prekida čuvar poslije 1,5 s, ali kod koji namjerno ide
  preko `globalThis.document` može dirati stranicu učionice.
- Tutor (`sample`) i napredak na nalogu (`db`, `user`) ne postoje u lokalnim provjerama
  (nema `window.claude`), pa su provjereni samo tako da stranica radi bez njih.

## Sljedeći korak

Dio 3 · SQL i baze, u istom obliku:

1. SELECT, WHERE, ORDER BY
2. COUNT/SUM, GROUP BY, HAVING
3. JOIN
4. INSERT/UPDATE/DELETE i ograničenja
5. Transakcije, parametri (SQL injection) i čitanje repozitorija iz inhome

Za podatke koristi tabele klijenti/fakture, iste kao lažni server u JS dijelu. Runner je
`runSql(kod, testovi, setup)`, a testovi imaju oblik `{opis, upit?, ocekivano: [[…]], redoslijed?}`.
„Predvidi“ za SQL poredi redove tabele (vrijednosti spojene sa „, “, a redovi sa „ · “).

Kod iz inhome i Sole-KP citiraj samo iz samih repozitorija. Postojeći citati su iz ranije sesije.

## Napomena o repozitoriju

Jedina grana je `claude/eager-hamilton-bilyvq`, pa ju je GitHub, kao prvu, postavio za zadanu.
`main` još ne postoji.

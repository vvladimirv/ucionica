# Učionica programiranja

Interaktivni kurs programiranja na bosanskom jeziku, objavljen kao Claude artefakt
([Učionica programiranja](https://claude.ai/artifact/V4DU7enjHTwhCZ2a1vMEq8)). Sav kod učenika se
**stvarno izvršava u pregledniku**: Python preko Pyodide-a, JavaScript u Web Workeru ili nad
pravom mini-stranicom, SQL preko sql.js. Primjeri su iz stvarnih projekata (inhome, Sole-KP).

| Dio | Sadržaj | Stanje |
| --- | --- | --- |
| 1 · Python od nule | 9 lekcija: print, varijable, if, liste, rječnici, funkcije, greške, klase, čitanje Flask rute | gotovo |
| 2 · JavaScript | 8 lekcija: konzola, if/===, nizovi, objekti i JSON, funkcije, DOM, događaji, fetch/async | gotovo |
| 3 · SQL i baze | 5 lekcija: SELECT, GROUP BY, JOIN, izmjene i pravila, transakcije/parametri/indeksi | gotovo |
| 4 · Teme | 12 tema (web, baze, arhitektura, testiranje, sigurnost…) + rječnik | čitanje i kviz |

Svaka lekcija je niz koraka: objašnjenje, primjer sa klikabilnim linijama, „predvidi rezultat“,
„nađi grešku“, „popuni prazninu“, „poredaj linije“, zadatak sa automatskim testovima i kviz.
Uz to postoji AI tutor (Claude preko `sample` capability-ja) i napredak na nalogu (`db`, `user`).

## Struktura

```
src/head.html, src/stil.css, src/tijelo.html   okvir stranice
src/js/NN-*.js                                 moduli; spajaju se po abecedi imena
  01-izvrsavanje.js      Python (Pyodide) i SQL (sql.js) runneri, objašnjenja grešaka
  02-izvrsavanje-js.js   JavaScript runneri (Worker i DOM okvir), lažni server, čuvar petlji
  03-kod-prikaz.js       isticanje sintakse, uređivač, prikaz izlaza
  1x-lekcije-py-*.js     Dio 1 · Python        2x-lekcije-js-*.js   Dio 2 · JavaScript
  3x-lekcije-sql-*.js    Dio 3 · SQL (30-… sadrži i učioničku bazu BAZA)
  40-teme.js             Dio 4 · teme, dijagrami i rječnik
  5x-*.js                napredak i meni, vrste koraka, tutor, prikaz tema
  59-start.js            događaji i pokretanje (zadnji)
scripts/                 build, provjere, lokalni pregled, uvoz iz artefakta
```

## Rad

Treba Node 20+. Za provjere u pregledniku treba Chromium za Playwright 1.56.1
(`npx playwright@1.56.1 install chromium`; u cloud okruženju je već instaliran).

```
npm install
npm run build      # src/ → dist/index.html (to se objavljuje)
npm test           # sve provjere (oko 1,5 min)
npm test -- js3    # samo jedna lekcija
npm run provjera   # brza provjera strukture, bez preglednika
npm run pregled    # lokalno: http://127.0.0.1:8080
```

`npm test` redom provjerava:

1. **strukturu** svih koraka (obavezna polja, indeksi, broj praznina, uparene HTML oznake);
2. **runnere** (56 slučajeva: linije grešaka u JS-u i SQL-u, prekid beskonačnih petlji, lažni server,
   rezultati SQL naredbi redom, zaštita stranice);
3. **izvršavanje** svakog primjera, „predvidi“ koraka (izlaz mora odgovarati tačnoj opciji),
   greške i zadatka (rješenje prolazi testove, početni kod ne);
4. **UI** — prolaz kroz sve korake kao učenik, teme, rječnik i širinu telefona (390 px).

Provjere rade u pravom Chromiumu, sa istim omotačem koji dodaje servis i sa CSP-om koji
približno oponaša artefakt. Pyodide i sql.js se poslužuju lokalno iz `node_modules`
(`scripts/pripremi-runtime.mjs` pravi isti raspored fajlova kao objavljeni artefakt).

## Objava

Objavljuje se samo `dist/index.html` na postojeći URL artefakta (Artifact tool, `url` =
adresa iznad, bez `icon` i bez `capabilities`, da ostanu postojeći). Runtime fajlovi
(`py/…`, `sql/sql-wasm.wasm`) su već objavljeni uz artefakt i ne mijenjaju se. Za novi
artefakt objavi i njih iz `.runtime/py` i `.runtime/sql` (`npm run runtime`); `pyodide.asm.wasm`
je podijeljen na 4 dijela jer upload većih fajlova ističe, a stranica ih spaja pri učitavanju.

Ako je stranica mijenjana van repozitorija: pročitaj artefakt (Artifact tool, `read`), snimi
HTML i pokreni `node scripts/uvezi.mjs <fajl.html>` — izvor se rastavi nazad u `src/`.

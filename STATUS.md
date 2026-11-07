# Status

Ažurirano: 2026-11-07.

## Gdje smo

Svih pet dijelova je gotovo; svaki od Dijelova 1, 2, 3 i 5 završava projektom, a teme 4 i 8 imaju vježbe.

| Dio | Stanje |
| --- | --- |
| 1 · Python / 2 · JavaScript / 3 · SQL | 10 + 9 + 6 lekcija (zadnja je projekat) |
| 4 · Teme | 12 tema + rječnik; vježbe uz temu 4 (baze) i 8 (sigurnost), 14 koraka |
| 5 · Rad sa AI agentima | 11 lekcija (ag11 = projekat na svom repozitoriju, prije završne ag7) |

- Oko lekcija (grana `claude/project-thread-q264cv`, 2026-11-07): početna, Ponovi danas, ulazni test, potvrda o
  završetku, pretraga, bilješke, korak „poredaj i popuni“. Izvještaj koji je predložio ovih 10 stvari:
  <https://claude.ai/artifact/37nsQguxTEEbczGb8j9hx5>.
- `npm test`: 36 lekcija, 405 koraka (14 u vježbama tema), 12 tema — sve prolazi. U cloud sesiji treba
  `CHROMIUM_PATH=/opt/pw-browsers/chromium`.
- Artefakt: <https://claude.ai/artifact/V4DU7enjHTwhCZ2a1vMEq8>, zadnja objava verzija 11
  (`1794039452-94f5`, 2026-11-07, build grane `claude/project-thread-q264cv`). Objavljuje se samo `dist/index.html`.

## Grane (važno)

- Zadana grana `claude/eager-hamilton-bilyvq` sadrži Dio 5 i temu 11 (PR #1–#3 spojeni) i odgovara verziji 10.
- Verzija 11 je objavljena iz `claude/project-thread-q264cv` (PR #4, **još nije spojen**, čeka Vladino odobrenje).
  Dok se PR #4 ne spoji, novi rad počni od te grane, ne od zadane, inače objava briše nove funkcije.
- Prije svake objave pročitaj živi artefakt i uporedi build grane s njim; ako se id verzije razlikuje
  od zadnjeg u „Objave“, prvo uvezi (`scripts/uvezi.mjs`).
- Repozitorij je **javan**, a teme sadrže citate i nalaze iz inhome i Sole-KP: preporuka je prebaciti ga u
  privatni (Settings → General → Danger Zone).

## Poznata ograničenja

- Tačan CSP artefakta nije poznat; provjere koriste približan strog CSP. iframe se ne koristi.
- Provjere rade samo u Chromiumu; broj linije greške u `dom` koraku čita V8 stek.
- Linija SQL greške je procjena iz poruke SQLite-a.
- Tutor (`sample`) i napredak (`db`, `user`) se ne mogu provjeriti lokalno.
- Štampa potvrde (`window.print()`) u artefaktu nije provjerena; ako je okvir blokira, stranica kaže da se napravi
  snimak ekrana. Novi podaci (ponavljanje, bilješke, dani…) idu u isti dokument napretka na nalogu.
- Tema 11: činjenice o Claude Code su iz code.claude.com/docs (2026-11-07), a za Codex iz izvornog koda
  github.com/openai/codex; alati se brzo mijenjaju, pa provjeri prije veće izmjene.

## Sljedeći korak

1. Verzija 11 je objavljena (2026-11-07). Provjeriti na pravom artefaktu štampu potvrde i da se napredak (ponavljanje, bilješke) čuva na nalogu.
2. Spojiti PR #4 kad Vlado odobri.
3. Vježbe za ostale teme (npr. 3 Baze I, 7 Testiranje) po istom obrascu (`41-teme-vjezbe.js`).

Kod iz inhome i Sole-KP citiraj samo kako stvarno piše u tim repozitorijima.

## Objave

| Verzija | Id | Datum | Sadržaj |
| --- | --- | --- | --- |
| 7 | `1790411547-d968` | 2026-09-26 | Dio 3 · SQL |
| 9 | `1791047870-4b9c` | 2026-10-03 | Dio 5 · ag1–ag10 |
| 10 | `1794034384-5891` | 2026-11-07 | Tema 11 · Claude Code i Codex u praksi |
| 11 | `1794039452-94f5` | 2026-11-07 | Početna, Ponovi danas, ulazni test, potvrda, pretraga, bilješke, poredaj, projekti, ag11 |

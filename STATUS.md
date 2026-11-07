# Status

Ažurirano: 2026-11-07.

## Gdje smo

Svih pet dijelova je gotovo (Dio 4 je čitanje i kviz, ne interaktivni koraci).

| Dio | Stanje |
| --- | --- |
| 1 · Python / 2 · JavaScript / 3 · SQL | 9 + 8 + 5 lekcija, 267 koraka |
| 4 · Teme | 12 tema + rječnik (tema 11, id `m12`, je „Claude Code i Codex u praksi“) |
| 5 · Rad sa AI agentima | 10 lekcija, 100 koraka |

- `npm test`: 32 lekcije, 367 koraka, 12 tema — sve prolazi. U cloud sesiji treba
  `CHROMIUM_PATH=/opt/pw-browsers/chromium`.
- Artefakt: <https://claude.ai/artifact/V4DU7enjHTwhCZ2a1vMEq8>, zadnja objava verzija 10
  (`1794034384-5891`, 2026-11-07, ova grana). Objavljuje se samo `dist/index.html`.

## Grane (važno)

- Prava osnova je `ccr-8159b8b3-ddj45s` (PR #1, Dio 5), jer ona odgovara živoj stranici. Zadana grana
  `claude/eager-hamilton-bilyvq` nema Dio 5. Ova grana `claude/project-thread-9nslst` (PR #2) je naslonjena
  na PR #1: spoji prvo #1, pa #2.
- Prije svake objave pročitaj živi artefakt i uporedi build grane s njim; ako se id verzije razlikuje
  od zadnjeg u „Objave“, prvo uvezi (`scripts/uvezi.mjs`).
- Repozitorij je **javan**, a teme sadrže citate i nalaze iz inhome i Sole-KP: preporuka je prebaciti ga u
  privatni (Settings → General → Danger Zone).

## Poznata ograničenja

- Tačan CSP artefakta nije poznat; provjere koriste približan strog CSP. iframe se ne koristi.
- Provjere rade samo u Chromiumu; broj linije greške u `dom` koraku čita V8 stek.
- Linija SQL greške je procjena iz poruke SQLite-a.
- Tutor (`sample`) i napredak (`db`, `user`) se ne mogu provjeriti lokalno.
- Tema 11: činjenice o Claude Code su iz code.claude.com/docs (2026-11-07), a za Codex iz izvornog koda
  github.com/openai/codex; alati se brzo mijenjaju, pa provjeri prije veće izmjene.

## Sljedeći korak

Odlučuje korisnik:

1. Spojiti PR #1, pa PR #2 (i razmisliti o zadanoj grani).
2. **Runner `tekst`** u `provjeri-runnere.mjs` (sada ga provjeravaju samo zadaci).
3. **Teme kao interaktivni koraci** (baze, sigurnost) ili napredniji nivo (Python + SQL, pytest).

Kod iz inhome i Sole-KP citiraj samo kako stvarno piše u tim repozitorijima.

## Objave

| Verzija | Id | Datum | Sadržaj |
| --- | --- | --- | --- |
| 7 | `1790411547-d968` | 2026-09-26 | Dio 3 · SQL |
| 9 | `1791047870-4b9c` | 2026-10-03 | Dio 5 · ag1–ag10 |
| 10 | `1794034384-5891` | 2026-11-07 | Tema 11 · Claude Code i Codex u praksi |

# Status

Ažurirano: 2026-11-07.

## Gdje smo

Svih pet dijelova je gotovo. Dijelovi 1, 2, 3 i 5 završavaju projektom (py10, js9, sql6, ag11); teme 4 i 8 imaju
vježbe. Oko lekcija: početna, Ponovi danas, ulazni test, potvrda o završetku, pretraga, bilješke, korak
„poredaj i popuni“ (izvještaj: <https://claude.ai/artifact/37nsQguxTEEbczGb8j9hx5>).

- `npm test`: 36 lekcija, 405 koraka, 12 tema — sve prolazi (cloud: `CHROMIUM_PATH=/opt/pw-browsers/chromium`).
- Rad je u PR #4 (`claude/project-thread-q264cv` → `claude/eager-hamilton-bilyvq`, draft). Zadana grana odgovara
  živoj verziji 10 (`1794034384-5891`). Nove funkcije **nisu objavljene**.
- Artefakt: <https://claude.ai/artifact/V4DU7enjHTwhCZ2a1vMEq8>; objavljuje se samo `dist/index.html`.
- Prije objave pročitaj živi artefakt cijeli i uporedi s buildom; ako se id razlikuje od zadnjeg u „Objave“,
  prvo `scripts/uvezi.mjs`.
- Repozitorij je **javan**, a teme sadrže citate iz inhome i Sole-KP: preporuka je prebaciti ga u privatni.

## Ograničenja

- CSP artefakta je približan; provjere samo u Chromiumu; linija SQL greške je procjena.
- Tutor (`sample`) i napredak (`db`, `user`) se ne mogu provjeriti lokalno; štampa potvrde (`window.print()`)
  u artefaktu nije provjerena.
- Činjenice o Claude Code (tema 11) su iz code.claude.com/docs i github.com/openai/codex na dan 2026-11-07.

## Sljedeći korak

1. **Objava je odobrena (Vlado), nije urađena** jer sesija nije stigla pročitati cijelu živu stranicu. Živa je
   identična buildu zadane grane. Nova sesija: `Artifact read`, pročitati sačuvani fajl do kraja, `npm run build`
   na ovoj grani, objaviti na isti URL (bez `icon` i `capabilities`).
2. Poslije objave provjeriti štampu potvrde i čuvanje napretka na nalogu.
3. Vježbe za ostale teme (3, 7…) po obrascu `41-teme-vjezbe.js`.

## Objave

| Verzija | Id | Datum | Sadržaj |
| --- | --- | --- | --- |
| 7 | `1790411547-d968` | 2026-09-26 | Dio 3 · SQL |
| 9 | `1791047870-4b9c` | 2026-10-03 | Dio 5 · ag1–ag10 |
| 10 | `1794034384-5891` | 2026-11-07 | Tema 11 · Claude Code i Codex u praksi |

# Učionica programiranja — pravila za rad

Kurs je jedna HTML stranica (Claude artefakt) sastavljena iz `src/`. Stanje i sljedeći korak su u
`STATUS.md` — pročitaj ga prvo. Opis strukture i komandi je u `README.md`.

## Pravila

- Tekst kursa je na bosanskom (ijekavica), jednostavnim riječima, sa primjerima iz posla
  (klijenti, ponude, fakture, namještaj po mjeri). Imena u kodu takođe na bosanskom, kao postojeća.
- Uređuje se samo `src/`. `dist/` je generisan i nije u gitu.
- Redoslijed modula = abeceda imena fajla (`01`…`59`). Lekcije: `1x` Python (`LEKCIJE_PY`),
  `2x` JavaScript (`LEKCIJE_JS`), `3x` SQL (`LEKCIJE_SQL`); moraju biti prije `50-…`.
- Šema koraka i pomoćnici za testove su opisani na vrhu `src/js/51-koraci.js`.
- Kod lekcija je u template literalima:
  - Python primjeri ne smiju imati obrnutu kosu crtu (`\`);
  - JavaScript primjeri: `` ` `` piši kao ``\` ``, `${` kao `\${`, a `\` kao `\\`.
- JavaScript testovi ne smiju računati na imena koja učenik može deklarisati; pomoćnici su
  `ocekuj`, `jednako`, `IZLAZ`, `KOD`, `saVrijednostima` (js) i `T.*` (dom).
- `saVrijednostima` zamjenjuje samo prvu liniju deklaracije: početne vrijednosti koje testovi
  mijenjaju moraju biti u jednom redu.
- „Poredaj“ prihvata samo jedan redoslijed: biraj linije gdje je tačan redoslijed jedinstven.
- Kod iz inhome/Sole-KP citiraj samo kako stvarno piše u tim repozitorijima (sa putanjom);
  ne izmišljaj „stvarni kod“.
- Poslije svake izmjene: `npm test` mora završiti sa `SVE PROŠLO`. Tekst „pada na liniji N“ u
  pitanju „nađi grešku“ provjera verifikuje, kao i da izlaz „predvidi“ koraka odgovara tačnoj opciji.
- Objava: samo `dist/index.html` na postojeći URL (vidi README). Na kraju sesije ažuriraj `STATUS.md`.

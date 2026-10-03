// ============================================================================
// Tekst: provjera napisanog teksta (zahtjev agentu, CLAUDE.md, commit poruka, frontmatter subagenta).
// Nema izvršavanja; testovi gledaju šta tekst sadrži. Isti oblik rezultata kao ostali runneri.
// Test: {opis, ima?:['regex'] (svi), bilo?:['regex'] (bar jedan), nema?:['regex'], maxLinija?, minRijeci?,
//        maxZnakova?, linija? (provjeri samo tu liniju, od 1), poruka? (šta reći kad test ne prođe)}.
// Regexi su bez razlike velikih i malih slova i sa ^ i $ po liniji.
// ============================================================================
function runTekst(code, tests = []) {
  const linije = code.replace(/\s+$/, '').split('\n');
  const rijeci = (code.match(/[\p{L}\p{N}_./:-]+/gu) || []).length;
  const res = { ok: true, out: `${code.trim() ? linije.length : 0} linija, ${rijeci} riječi\n`, err: null, errType: null, errLine: null, tests: [] };
  const re = r => new RegExp(r, 'imu');
  for (const t of tests) {
    const cilj = t.linija ? (linije[t.linija - 1] || '') : code;
    const fali = [];
    for (const r of t.ima || []) if (!re(r).test(cilj)) fali.push('nedostaje dio');
    if (t.bilo && !t.bilo.some(r => re(r).test(cilj))) fali.push('nedostaje dio');
    for (const r of t.nema || []) { const m = cilj.match(re(r)); if (m) fali.push(`ne smije sadržavati „${m[0].trim().slice(0, 40)}“`); }
    const brojLinija = cilj.trim() ? cilj.replace(/\s+$/, '').split('\n').length : 0;
    if (t.maxLinija && brojLinija > t.maxLinija) fali.push(`ima ${brojLinija} linija, najviše ${t.maxLinija}`);
    if (t.minRijeci && rijeci < t.minRijeci) fali.push(`ima ${rijeci} riječi, treba bar ${t.minRijeci}`);
    if (t.maxZnakova && cilj.length > t.maxZnakova) fali.push(`ima ${cilj.length} znakova, najviše ${t.maxZnakova}`);
    if (t.linija && !cilj.trim()) fali.splice(0, fali.length, `linija ${t.linija} je prazna`);
    const ok = !fali.length;
    res.tests.push({ ok, m: ok ? '' : (t.poruka || [...new Set(fali)].join('; ')) });
  }
  return res;
}
RUN.tekst = (c, t) => Promise.resolve(runTekst(c, t));


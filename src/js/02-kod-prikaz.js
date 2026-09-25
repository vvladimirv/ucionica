// ============================================================================
// Prikaz koda: isticanje sintakse, klikabilne linije, uređivač sa brojevima linija, prikaz izlaza.
// ============================================================================
const KW = {
  python: 'and|as|assert|break|class|continue|def|del|elif|else|except|False|finally|for|from|if|import|in|is|lambda|None|not|or|pass|raise|return|True|try|while|with|yield',
  js: 'async|await|break|case|catch|class|const|continue|default|else|export|false|finally|for|function|if|import|in|let|new|null|of|return|switch|this|throw|true|try|typeof|undefined|var|while',
  sql: 'SELECT|FROM|WHERE|JOIN|LEFT|INNER|ON|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|PRIMARY|KEY|FOREIGN|REFERENCES|NOT|NULL|AND|OR|AS|DESC|ASC|COUNT|SUM|AVG|MIN|MAX|DISTINCT|INTEGER|TEXT|REAL|BEGIN|COMMIT|ROLLBACK|IN|IS|LIKE|UNIQUE|CHECK|DEFAULT',
};
function hl(line, lang) {
  const kw = KW[lang] || KW.python;
  const com = lang === 'python' ? '#.*$' : lang === 'sql' ? '--.*$' : '\\/\\/.*$';
  const re = new RegExp(`(${com})|(f?"(?:\\\\.|[^"\\\\])*"|f?'(?:\\\\.|[^'\\\\])*'|\`[^\`]*\`)|\\b(\\d+(?:\\.\\d+)?)\\b|\\b(${kw})\\b|\\b([A-Za-z_]\\w*)(?=\\()`, lang === 'sql' ? 'gi' : 'g');
  let out = '', i = 0, m;
  while ((m = re.exec(line))) {
    const t = m[0];
    if (!t.length) { re.lastIndex++; continue; }
    out += esc(line.slice(i, m.index));
    const cls = m[1] ? 'co' : m[2] ? 'st' : m[3] ? 'nu' : m[4] ? 'kw' : 'fn';
    out += `<span class="${cls}">${esc(t)}</span>`;
    i = m.index + t.length;
  }
  return out + esc(line.slice(i));
}
function kodHtml(code, lang, { obj = {}, klik = false, mark = {} } = {}) {
  return `<div class="kod">${code.split('\n').map((l, i) => {
    const n = i + 1; const cls = ['ln', klik ? 'klik' : '', obj[n] ? 'ima' : '', mark[n] || ''].join(' ');
    return `<div class="${cls}" data-ln="${n}"${klik ? ' tabindex="0" role="button"' : ''}><span class="no">${n}</span><span class="tx">${hl(l, lang) || ' '}</span></div>`;
  }).join('')}</div>`;
}

function editorHtml(id, code) {
  return `<div class="ed"><div class="gut" id="${id}-g"></div><textarea id="${id}" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Uređivač koda">${esc(code)}</textarea></div>`;
}
// Tab = 4 razmaka; Enter zadrži uvlačenje i doda 4 poslije ':' (Python) ili '{' (JS).
function wireEditor(id, lang) {
  const ta = document.getElementById(id), g = document.getElementById(id + '-g');
  const upd = () => { const n = ta.value.split('\n').length; g.textContent = Array.from({ length: n }, (_, i) => i + 1).join('\n'); ta.rows = Math.max(6, n + 1); };
  ta.addEventListener('input', upd);
  ta.addEventListener('scroll', () => { g.scrollTop = ta.scrollTop; });
  ta.addEventListener('keydown', e => {
    const { selectionStart: a, selectionEnd: b, value: v } = ta;
    if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); ta.setRangeText('    ', a, b, 'end'); upd(); }
    else if (e.key === 'Enter') {
      const line = v.slice(v.lastIndexOf('\n', a - 1) + 1, a);
      let ind = (line.match(/^ */) || [''])[0];
      if ((lang === 'python' && /:\s*$/.test(line)) || (lang === 'js' && /[{(\[]\s*$/.test(line))) ind += '    ';
      e.preventDefault(); ta.setRangeText('\n' + ind, a, b, 'end'); upd();
    }
  });
  upd();
  return ta;
}

function outHtml(r, lang) {
  if (!r) return `<div class="out"><span class="err">${lang === 'python' ? 'Python se nije mogao učitati u ovom pregledniku. Koristi dugme „Provjeri sa tutorom“.' : 'Izvršavanje nije dostupno.'}</span></div>`;
  let h = `<div class="out"><span class="lbl">Izlaz</span>${esc(r.out || '') || (r.ok && !(r.tabele || []).length ? '<span style="opacity:.6">(ništa nije ispisano)</span>' : '')}`;
  for (const t of r.tabele || []) h += `<table class="res"><tr>${t.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr>${t.rows.slice(0, 50).map(row => `<tr>${row.map(v => `<td>${esc(v === null ? 'NULL' : v)}</td>`).join('')}</tr>`).join('')}</table>`;
  if (!r.ok) h += `<span class="err">${esc(r.err)}</span>`;
  h += '</div>';
  if (!r.ok && GRESKE[r.errType]) h += `<div class="hint"><b>Šta ova greška znači:</b> ${esc(GRESKE[r.errType])}</div>`;
  return h;
}
function testsHtml(testovi, rez = []) {
  return testovi.map((t, i) => {
    const x = rez[i] || { ok: null };
    const cls = x.ok ? 'ok' : x.ok === false ? 'no' : 'na';
    return `<div class="test ${cls}"><span class="i">${x.ok ? '✓' : x.ok === false ? '✗' : '○'}</span><span>${esc(t.opis)}${x.m ? ` <span class="m">— ${esc(x.m)}</span>` : ''}</span></div>`;
  }).join('');
}


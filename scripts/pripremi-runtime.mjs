// Pripremi runtime fajlove iz node_modules u .runtime/, u istom rasporedu kao objavljeni artefakt:
//   py/  pyodide.js, pyodide.mjs, pyodide.asm.mjs, pyodide-lock.json,
//        pyodide.asm.part0..3.wasm  (pyodide.asm.wasm u 4 dijela: upload većih fajlova ističe)
//        python_stdlib.wasm         (= python_stdlib.zip; .zip nije dozvoljen tip za objavu)
//   sql/ sql-wasm.wasm
//   cdn/ skripte koje stranica učitava sa CDN-a (lokalni testovi ih poslužuju umjesto interneta)
// Isti fajlovi služe i za novu objavu runtime-a (Artifact tool, `files`).
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const RUNTIME = join(ROOT, '.runtime');
const require = createRequire(import.meta.url);
const PY = dirname(require.resolve('pyodide/package.json'));
const SQL = join(dirname(require.resolve('sql.js/package.json')), 'dist');

export const VERZIJE = {
  pyodide: JSON.parse(readFileSync(join(PY, 'package.json'), 'utf8')).version,
  sqljs: JSON.parse(readFileSync(join(SQL, '..', 'package.json'), 'utf8')).version,
};

export function pripremi() {
  for (const d of ['py', 'sql', 'cdn']) mkdirSync(join(RUNTIME, d), { recursive: true });
  for (const f of ['pyodide.js', 'pyodide.mjs', 'pyodide.asm.mjs', 'pyodide-lock.json']) copyFileSync(join(PY, f), join(RUNTIME, 'py', f));
  copyFileSync(join(PY, 'python_stdlib.zip'), join(RUNTIME, 'py', 'python_stdlib.wasm'));
  const wasm = readFileSync(join(PY, 'pyodide.asm.wasm'));
  const dio = Math.floor(wasm.length / 4);
  for (let i = 0; i < 4; i++) writeFileSync(join(RUNTIME, 'py', `pyodide.asm.part${i}.wasm`), wasm.subarray(i * dio, i === 3 ? wasm.length : (i + 1) * dio));
  copyFileSync(join(SQL, 'sql-wasm.wasm'), join(RUNTIME, 'sql', 'sql-wasm.wasm'));
  copyFileSync(join(PY, 'pyodide.js'), join(RUNTIME, 'cdn', 'pyodide.js'));
  copyFileSync(join(SQL, 'sql-wasm.js'), join(RUNTIME, 'cdn', 'sql-wasm.js'));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  pripremi();
  const kb = p => (statSync(join(RUNTIME, p)).size / 1024).toFixed(0) + ' KB';
  console.log(`.runtime/ spreman · pyodide ${VERZIJE.pyodide} · sql.js ${VERZIJE.sqljs}`);
  for (const p of ['py/pyodide.asm.part0.wasm', 'py/pyodide.asm.part3.wasm', 'py/python_stdlib.wasm', 'sql/sql-wasm.wasm']) console.log('  ' + p + ' · ' + kb(p));
}

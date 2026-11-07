// Učitaj podatke lekcija i tema iz src/js bez preglednika (moduli sa podacima su obične skripte).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { SRC, moduli } from '../build.mjs';

export const moduliLekcija = () => moduli().filter(m => /^\d\d-lekcije-/.test(m));
export const DIJELOVI_IDS = [['py', 'LEKCIJE_PY'], ['js', 'LEKCIJE_JS'], ['sql', 'LEKCIJE_SQL'], ['ag', 'LEKCIJE_AG']];

export function ucitajLekcije() {
  const ctx = vm.createContext({});
  for (const m of [...moduliLekcija(), ...moduli().filter(m => /^4\d-teme/.test(m))]) vm.runInContext(readFileSync(join(SRC, 'js', m), 'utf8'), ctx, { filename: m });
  const uzmi = ime => vm.runInContext(`typeof ${ime} !== 'undefined' ? ${ime} : undefined`, ctx);
  return {
    dijelovi: DIJELOVI_IDS.map(([id, ime]) => ({ id, ime, lekcije: uzmi(ime) || [] })),
    teme: uzmi('TEME') || [],
    rjecnik: uzmi('RJECNIK') || [],
    dia: uzmi('DIA') || {},
  };
}

export const jezikKoraka = s => s.jezik || 'python';

// Lekcije i vježbe tema kao jedna lista nizova koraka. Za temu: id 'tema-m4', cilj koraka 'vj:m4:k'.
export const nizoviKoraka = ({ dijelovi, teme }) => [
  ...dijelovi.flatMap(d => d.lekcije.map(l => ({ id: l.id, dio: d.id, lek: l, koraci: l.koraci, cilj: k => `lek:${l.id}:${k}` }))),
  ...teme.filter(t => t.koraci).map(t => ({ id: `tema-${t.id}`, tema: t.id, koraci: t.koraci, cilj: k => `vj:${t.id}:${k}` })),
];

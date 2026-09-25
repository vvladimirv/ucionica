// Učitaj podatke lekcija i tema iz src/js bez preglednika (moduli sa podacima su obične skripte).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { SRC, MODULI } from '../build.mjs';

export const MODULI_LEKCIJA = MODULI.filter(m => /^\d\d-lekcije-/.test(m));
export const DIJELOVI_IDS = [['py', 'LEKCIJE_PY'], ['js', 'LEKCIJE_JS'], ['sql', 'LEKCIJE_SQL']];

export function ucitajLekcije() {
  const ctx = vm.createContext({});
  for (const m of [...MODULI_LEKCIJA, 'teme.js']) vm.runInContext(readFileSync(join(SRC, 'js', m), 'utf8'), ctx, { filename: m });
  const uzmi = ime => vm.runInContext(`typeof ${ime} !== 'undefined' ? ${ime} : undefined`, ctx);
  return {
    dijelovi: DIJELOVI_IDS.map(([id, ime]) => ({ id, ime, lekcije: uzmi(ime) || [] })),
    teme: uzmi('TEME') || [],
    rjecnik: uzmi('RJECNIK') || [],
  };
}

export const jezikKoraka = s => s.jezik || 'python';

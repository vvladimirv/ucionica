// Lokalni pregled stranice: http://127.0.0.1:8080 (isti omotač i CSP kao na testovima).
// Pyodide i sql.js loader se učitavaju sa CDN-a, a runtime fajlovi iz .runtime/.
import { pokreniServer } from './lib/preglednik.mjs';
const { url } = await pokreniServer({ port: Number(process.env.PORT) || 8080 });
console.log('Pregled: ' + url + '  (Ctrl+C za kraj; stranica se sastavlja iz src/ na svako osvježavanje)');

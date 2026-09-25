// Lokalni server + Chromium (Playwright) za provjere i pregled stranice.
// Stranica se poslužuje u istom omotaču koji servis dodaje pri objavi, sa CSP-om koji približno
// oponaša artefakt (skripte samo sa dozvoljenih CDN-ova, bez iframe-ova, fetch samo na vlastite fajlove).
// CDN skripte (Pyodide loader, sql.js) poslužuju se iz .runtime/cdn, pa provjere rade bez interneta.
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, normalize, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sastavi } from '../build.mjs';
import { pripremi, RUNTIME, VERZIJE } from '../pripremi-runtime.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// Omotač koji servis dodaje pri objavi (prva linija i kraj objavljenog index.html).
export const OMOTAC_POCETAK = '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#faf9f5;color:#141413}img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style></head><body>\n';
export const OMOTAC_KRAJ = '\n</body></html>';

// Približan CSP artefakta (tačan nije poznat; ovaj je namjerno strog: nema iframe-ova ni tuđih fetch-eva).
export const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://cdnjs.cloudflare.com https://cdn.jsdelivr.net/npm/ https://unpkg.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  "connect-src 'self' blob: data:",
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "object-src 'none'",
].join('; ');

const TIPOVI = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm' };

export function pokreniServer({ port = 0 } = {}) {
  pripremi();
  const server = createServer((req, res) => {
    const put = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (put === '/' || put === '/index.html') {
      res.writeHead(200, { 'Content-Type': TIPOVI['.html'], 'Content-Security-Policy': CSP, 'Cache-Control': 'no-store' });
      res.end(OMOTAC_POCETAK + sastavi() + OMOTAC_KRAJ);
      return;
    }
    const f = normalize(join(RUNTIME, put));
    if ((put.startsWith('/py/') || put.startsWith('/sql/')) && f.startsWith(RUNTIME) && existsSync(f)) {
      res.writeHead(200, { 'Content-Type': TIPOVI[extname(f)] || 'application/octet-stream' });
      res.end(readFileSync(f));
      return;
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('404');
  });
  return new Promise(r => server.listen(port, '127.0.0.1', () => r({ server, url: `http://127.0.0.1:${server.address().port}/` })));
}

// Preusmjeri CDN skripte na lokalne kopije; fontove zanemari (nema interneta u testovima).
export async function podesiRute(context) {
  const cdn = {
    [`https://cdn.jsdelivr.net/npm/pyodide@${VERZIJE.pyodide}/pyodide.js`]: join(RUNTIME, 'cdn', 'pyodide.js'),
    [`https://cdnjs.cloudflare.com/ajax/libs/sql.js/${VERZIJE.sqljs}/sql-wasm.js`]: join(RUNTIME, 'cdn', 'sql-wasm.js'),
  };
  await context.route(/^https:\/\//, route => {
    const url = route.request().url();
    if (cdn[url]) return route.fulfill({ path: cdn[url], contentType: 'text/javascript' });
    if (/fonts\.(googleapis|gstatic)\.com/.test(url)) return route.fulfill({ status: 200, contentType: url.includes('googleapis') ? 'text/css' : 'font/woff2', body: '' });
    return route.abort();
  });
}

export async function otvoriUcionicu({ sirina = 1280, visina = 900, hash = '' } = {}) {
  const { chromium } = await import('playwright-core');
  const { server, url } = await pokreniServer();
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const context = await browser.newContext({ viewport: { width: sirina, height: visina } });
  await podesiRute(context);
  const page = await context.newPage();
  const greskeStranice = [];
  page.on('pageerror', e => greskeStranice.push(String(e && e.stack || e)));
  page.on('console', m => { if (m.type() === 'error') greskeStranice.push('console.error: ' + m.text()); });
  await page.goto(url + (hash ? '#' + hash : ''));
  return { page, context, browser, server, url, greskeStranice, async zatvori() { await browser.close(); server.close(); } };
}

/**
 * Imprime cv/cv.html a PDF con un Chromium del sistema y lo publica en public/.
 *
 * No usa --headless --print-to-pdf: en Brave ese modo se cuelga sin error.
 * Abre el navegador con un perfil temporal y depuración remota, espera a que
 * carguen las fuentes web y pide el PDF por el protocolo de DevTools.
 *
 * Uso: node cv/print.mjs   (CHROME_PATH=/ruta/al/binario para elegir navegador)
 */
import { spawn } from 'node:child_process';
import { copyFileSync, existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const CV_DIR = fileURLToPath(new URL('.', import.meta.url));
const HTML = join(CV_DIR, 'cv.html');
const OUT = join(CV_DIR, 'Omar-Bermejo-Osuna-CV.pdf');
const PUBLIC = join(CV_DIR, '..', 'public', 'Omar-Bermejo-Osuna-CV.pdf');
const PORT = 9333;

const candidates = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
].filter(Boolean);
const browser = candidates.find((p) => existsSync(p));
if (!browser) throw new Error(`No encuentro un Chromium. Define CHROME_PATH. Probé:\n${candidates.join('\n')}`);
if (!existsSync(HTML)) throw new Error('Falta cv/cv.html: corre antes "node cv/build.mjs".');

const profile = mkdtempSync(join(tmpdir(), 'cv-print-'));
const proc = spawn(browser, [
  `--user-data-dir=${profile}`,
  `--remote-debugging-port=${PORT}`,
  '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--window-size=900,700', 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const timeout = setTimeout(() => { cleanup(); console.error('Tiempo agotado'); process.exit(1); }, 90_000);
function cleanup() {
  clearTimeout(timeout);
  proc.kill();
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}

try {
  let target;
  for (let i = 0; i < 60 && !target; i++) {
    try {
      const url = encodeURIComponent(pathToFileURL(HTML).href);
      target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${url}`, { method: 'PUT' })).json();
    } catch { await sleep(500); }
  }
  if (!target) throw new Error('El navegador no abrió el puerto de depuración');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let seq = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    const p = msg.id && pending.get(msg.id);
    if (!p) return;
    pending.delete(msg.id);
    msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result);
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });

  // Mientras la pestaña navega desde about:blank el contexto se destruye: se reintenta.
  let fonts;
  for (let i = 0; i < 40 && fonts === undefined; i++) {
    try {
      const r = await send('Runtime.evaluate', {
        expression: `location.protocol !== 'file:' ? null : new Promise((r) => {
          const go = () => document.fonts.ready.then(() =>
            setTimeout(() => r([...document.fonts].filter((f) => f.status === 'loaded').length), 800));
          document.readyState === 'complete' ? go() : addEventListener('load', go);
        })`,
        awaitPromise: true,
      });
      if (r.result.value !== null) fonts = r.result.value;
    } catch { /* contexto destruido por la navegación */ }
    if (fonts === undefined) await sleep(500);
  }
  if (fonts === undefined) throw new Error('cv.html no terminó de cargar');
  // Sin red, las cuatro familias caen a la del sistema y el PDF cambia de paginación.
  if (fonts < 4) throw new Error(`Solo cargaron ${fonts} fuentes web: ¿hay conexión?`);

  const { data } = await send('Page.printToPDF', {
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
  });
  const pdf = Buffer.from(data, 'base64');
  writeFileSync(OUT, pdf);
  copyFileSync(OUT, PUBLIC);

  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  const kb = Math.round(pdf.length / 1024);
  console.log(`PDF: ${pages} páginas, ${kb} KB → public/Omar-Bermejo-Osuna-CV.pdf`);
  console.log(`Actualiza site.cv en src/data/projects.ts si cambió: size '${kb} KB', pages '${pages} páginas · A4'.`);
  ws.close();
} finally {
  cleanup();
}

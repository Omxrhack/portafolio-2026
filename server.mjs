/**
 * Servidor estático para dist/. Sin dependencias.
 *
 * Existe para controlar dos cosas que un servidor genérico no resuelve bien:
 * el HTML debe revalidarse siempre (si no, el navegador sirve una versión
 * vieja tras cada deploy) y los assets con hash deben cachearse un año.
 */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Relativo al propio archivo, no al directorio de trabajo: en un PaaS el cwd
// no siempre es la raíz del proyecto.
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), 'dist');
const PORT = Number(process.env.PORT) || 3000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

/** Los nombres con hash son inmutables; todo lo demás se revalida. */
function cacheFor(pathname, ext) {
  if (pathname.startsWith('/_astro/')) return 'public, max-age=31536000, immutable';
  if (ext === '.html') return 'no-cache, must-revalidate';
  if (['.webp', '.png', '.jpg', '.svg', '.ico', '.pdf', '.woff2'].includes(ext)) {
    return 'public, max-age=604800';
  }
  return 'no-cache, must-revalidate';
}

async function resolveFile(pathname) {
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(ROOT, safe);
  if (!file.startsWith(ROOT)) return null;

  try {
    const info = await stat(file);
    if (info.isDirectory()) file = join(file, 'index.html');
  } catch {
    // Puede venir sin barra final: /easy-order -> /easy-order/index.html
    const asDir = join(file, 'index.html');
    try {
      await stat(asDir);
      file = asDir;
    } catch {
      return null;
    }
  }

  try {
    const info = await stat(file);
    return info.isFile() ? file : null;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

  const send = (status, file, ext) => {
    res.writeHead(status, {
      'Content-Type': TYPES[ext] ?? 'application/octet-stream',
      'Cache-Control': cacheFor(pathname, ext),
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    });
    if (req.method === 'HEAD') return res.end();
    createReadStream(file).pipe(res);
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end();
  }

  const file = await resolveFile(pathname);
  if (file) return send(200, file, extname(file));

  const notFound = join(ROOT, '404.html');
  try {
    await stat(notFound);
    return send(404, notFound, '.html');
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404');
  }
});

// Falla rápido y ruidoso si el build no llegó: un 404 en todo es peor que no arrancar.
try {
  const info = await stat(join(ROOT, 'index.html'));
  if (!info.isFile()) throw new Error('index.html no es un archivo');
} catch {
  console.error(`No encuentro ${join(ROOT, 'index.html')}. ¿Corrió "npm run build"?`);
  process.exit(1);
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Sirviendo ${ROOT} en http://0.0.0.0:${PORT}`);
});

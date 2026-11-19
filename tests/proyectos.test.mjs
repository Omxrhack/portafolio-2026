/**
 * Pruebas sobre el sitio ya construido (dist/), sin dependencias.
 * Correr con `npm test`, que construye antes de probar.
 *
 * Prueban lo que se rompe en silencio al agregar un proyecto: una subpantalla
 * que no se genera, un icono que sale roto, un proyecto que queda fuera de la
 * cadena de "Siguiente" o una lista que pierde la alternancia de tamaños.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

if (!existsSync(join(DIST, 'index.html'))) {
  throw new Error('No hay dist/index.html. Corre "npm test", que construye primero.');
}

const page = (slug) => readFileSync(join(DIST, slug, 'index.html'), 'utf8');
const home = readFileSync(join(DIST, 'index.html'), 'utf8');

/** Las subpantallas son las carpetas de dist/ con index.html, menos los assets. */
const projectSlugs = readdirSync(DIST).filter(
  (d) => d !== '_astro' && d !== 'img' && statSync(join(DIST, d)).isDirectory()
    && existsSync(join(DIST, d, 'index.html')),
);

/** Bloque de la portada que va de una sección (id) a la siguiente. */
function sectionOf(html, id) {
  const start = html.indexOf(`id="${id}"`);
  assert.notEqual(start, -1, `no encuentro la sección #${id} en la portada`);
  const end = html.indexOf('<section', start + 1);
  return html.slice(start, end === -1 ? undefined : end);
}

/** Proyectos de una sección de la portada, en orden, con su tamaño. */
function listOf(html, id) {
  const block = sectionOf(html, id);
  const re = /<a href="\/([^/"]+)\/"[^>]*class="item item--link (item--86|item--58)"/g;
  return [...block.matchAll(re)].map((m) => ({ slug: m[1], size: m[2] }));
}

/** Ancho y alto de un WebP (VP8, VP8L o VP8X) leyendo la cabecera. */
function webpSize(file) {
  const b = readFileSync(file);
  assert.equal(b.toString('ascii', 0, 4), 'RIFF', `${file} no es RIFF`);
  assert.equal(b.toString('ascii', 8, 12), 'WEBP', `${file} no es WebP`);
  const chunk = b.toString('ascii', 12, 16);
  if (chunk === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
  if (chunk === 'VP8L') {
    const bits = b.readUInt32LE(21);
    return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === 'VP8X') return { w: b.readUIntLE(24, 3) + 1, h: b.readUIntLE(27, 3) + 1 };
  throw new Error(`${file}: chunk WebP desconocido "${chunk}"`);
}

const LOGOS = { socialler: 'socialler', blyni: 'blyni' };

// ——— Los dos proyectos nuevos ———

test('Socialler y Blyni tienen subpantalla', () => {
  for (const slug of ['socialler', 'blyni']) {
    assert.ok(projectSlugs.includes(slug), `falta dist/${slug}/index.html`);
  }
});

test('Socialler y Blyni aparecen en Producto, después de las apps publicadas', () => {
  const order = listOf(home, 'producto').map((p) => p.slug);
  assert.deepEqual(order.slice(0, 4), ['easy-order', 'anottan', 'socialler', 'blyni']);
  for (const id of ['sistemas', 'laboratorio']) {
    const slugs = listOf(home, id).map((p) => p.slug);
    assert.ok(!slugs.includes('socialler') && !slugs.includes('blyni'), `se colaron en #${id}`);
  }
});

test('cada subpantalla nueva dice su nombre, sección y estado', () => {
  const cases = [
    { slug: 'socialler', name: 'Socialler', status: 'Beta interna' },
    { slug: 'blyni', name: 'Blyni', status: 'En desarrollo' },
  ];
  for (const c of cases) {
    const html = page(c.slug);
    assert.match(html, new RegExp(`<title>${c.name}</title>`), `${c.slug}: título`);
    assert.match(html, new RegExp(`<h1[^>]*>\\s*${c.name}\\s*</h1>`), `${c.slug}: h1`);
    assert.match(html, /<p class="label">Producto<\/p>/, `${c.slug}: sección`);
    assert.match(html, new RegExp(`meta__val--accent[^>]*>${c.status}<`), `${c.slug}: estado`);
    for (const k of ['El problema', 'Cómo funciona', 'Mi trabajo']) {
      assert.ok(html.includes(k), `${c.slug}: falta el bloque "${k}"`);
    }
  }
});

test('Socialler enlaza a su sitio; Blyni, sin enlaces públicos, no muestra "Disponible en"', () => {
  const s = page('socialler');
  assert.ok(s.includes('Disponible en'));
  assert.match(s, /<a class="store" href="https:\/\/www\.socialler\.com"[^>]*target="_blank"[^>]*rel="noopener"/);
  assert.ok(!page('blyni').includes('Disponible en'));
});

// ——— Iconos ———

test('las subpantallas con icono lo muestran con srcset, medidas y alt vacío', () => {
  for (const [slug, logo] of Object.entries(LOGOS)) {
    const html = page(slug);
    const tag = html.match(/<img class="project-logo"[^>]*>/)?.[0];
    assert.ok(tag, `${slug}: no hay <img class="project-logo">`);
    assert.match(tag, new RegExp(`src="/img/proyectos/${logo}-256\\.webp"`));
    assert.match(tag, new RegExp(`srcset="/img/proyectos/${logo}-256\\.webp 256w, /img/proyectos/${logo}-512\\.webp 512w"`));
    assert.match(tag, /width="256"/);
    assert.match(tag, /height="256"/);
    // Decorativo: el h1 ya nombra el proyecto; un alt con texto se leería dos veces.
    assert.match(tag, /alt=""/);
    assert.doesNotMatch(tag, /loading="lazy"/, 'está arriba del pliegue: no debe ser lazy');
  }
});

test('las subpantallas sin icono no pintan un <img> vacío', () => {
  const withLogo = new Set(Object.keys(LOGOS));
  for (const slug of projectSlugs.filter((s) => !withLogo.has(s))) {
    // El CSS va inline en cada página, así que se busca la etiqueta, no la clase.
    assert.ok(!/<img class="project-logo"/.test(page(slug)), `${slug} pinta un icono que no tiene`);
  }
});

test('los iconos publicados son WebP cuadrados con el ancho que anuncia su nombre', () => {
  for (const logo of Object.values(LOGOS)) {
    for (const size of [256, 512]) {
      const file = join(DIST, 'img', 'proyectos', `${logo}-${size}.webp`);
      assert.ok(existsSync(file), `falta ${file}`);
      assert.deepEqual(webpSize(file), { w: size, h: size }, file);
    }
  }
});

test('toda imagen que referencia el sitio existe en dist/', () => {
  const pages = ['', ...projectSlugs, '404.html'];
  for (const p of pages) {
    const file = p.endsWith('.html') ? join(DIST, p) : join(DIST, p, 'index.html');
    if (!existsSync(file)) continue;
    const html = readFileSync(file, 'utf8');
    const urls = [
      ...[...html.matchAll(/<img[^>]*\ssrc="(\/[^"]+)"/g)].map((m) => m[1]),
      ...[...html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((m) =>
        m[1].split(',').map((c) => c.trim().split(/\s+/)[0])),
    ];
    for (const u of urls) {
      assert.ok(existsSync(join(DIST, u)), `${p || 'index'}: imagen rota ${u}`);
    }
  }
});

// ——— Invariantes del conjunto, que un proyecto nuevo puede romper ———

test('la portada enlaza cada subpantalla exactamente una vez, y cada enlace resuelve', () => {
  const all = ['producto', 'sistemas', 'laboratorio'].flatMap((id) => listOf(home, id));
  const slugs = all.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'hay un proyecto listado dos veces');
  assert.deepEqual([...slugs].sort(), [...projectSlugs].sort());
});

test('"Siguiente" recorre todos los proyectos en un solo ciclo', () => {
  const start = 'easy-order';
  const visited = [];
  let slug = start;
  do {
    visited.push(slug);
    const html = page(slug);
    const after = html.slice(html.indexOf('>Siguiente<'));
    slug = after.match(/<a href="\/([^/"]+)\/"/)?.[1];
    assert.ok(slug, `${visited.at(-1)}: no tiene enlace "Siguiente"`);
    assert.ok(visited.length <= projectSlugs.length, 'la cadena no regresa al inicio');
  } while (slug !== start);
  assert.deepEqual([...visited].sort(), [...projectSlugs].sort());
});

test('Producto y Sistemas alternan los tamaños 86 y 58', () => {
  for (const id of ['producto', 'sistemas']) {
    const list = listOf(home, id);
    for (let i = 1; i < list.length; i++) {
      assert.notEqual(list[i].size, list[i - 1].size,
        `#${id}: ${list[i - 1].slug} y ${list[i].slug} tienen el mismo tamaño`);
    }
  }
});

test('ningún nombre de transición se repite en la portada', () => {
  // Dos elementos con el mismo view-transition-name abortan la transición entera.
  const names = [...home.matchAll(/view-transition-name:\s*([\w-]+)/g)].map((m) => m[1]);
  assert.ok(names.includes('title-socialler') && names.includes('title-blyni'));
  assert.equal(new Set(names).size, names.length, `repetidos: ${names}`);
});

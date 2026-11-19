/**
 * Certificaciones de la portada y el CV publicado, sobre el sitio construido.
 * Correr con `npm test`, que construye antes de probar.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
if (!existsSync(join(DIST, 'index.html'))) {
  throw new Error('No hay dist/index.html. Corre "npm test", que construye primero.');
}
const home = readFileSync(join(DIST, 'index.html'), 'utf8');

/** HTML de la sección #certificaciones, hasta la siguiente <section>. */
function certSection() {
  const start = home.indexOf('id="certificaciones"');
  assert.notEqual(start, -1, 'no hay sección #certificaciones en la portada');
  return home.slice(start, home.indexOf('<section', start + 1));
}

const certs = () => [...certSection().matchAll(/<li class="cert">([\s\S]*?)<\/li>/g)].map((m) => {
  const li = m[1];
  return {
    name: li.match(/<p class="cert__name">([^<]+)<\/p>/)?.[1],
    datetime: li.match(/<time datetime="([^"]+)">/)?.[1],
    label: li.match(/<time[^>]*>([^<]+)<\/time>/)?.[1],
    href: li.match(/<a class="cert__link" href="([^"]+)"/)?.[1],
    tag: li.match(/<a class="cert__link"[^>]*>/)?.[0],
    via: li.match(/<p class="cert__via">([^<]+)<\/p>/)?.[1],
  };
});

test('la portada muestra los dos certificados de Cisco, del más reciente al más antiguo', () => {
  const list = certs();
  assert.deepEqual(list.map((c) => c.name), [
    'CCNA: Fundamentos de Conmutación, Enrutamiento y Redes Inalámbricas',
    'CCNAv7: Introduction to Networks',
  ]);
  assert.deepEqual(list.map((c) => c.datetime), ['2025-06-23', '2022-12-16']);
  assert.ok(certSection().includes('Cisco Networking Academy'));
  assert.equal(list[0].via, 'Impartido por Instituto Tecnológico de Culiacán');
  assert.equal(list[1].via, undefined, 'ITN no se impartió por el Tec: no debe decir "Impartido por"');
});

test('la fecha visible corresponde al mes y año de datetime (sin corrimiento de zona horaria)', () => {
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'];
  for (const c of certs()) {
    const [y, m] = c.datetime.split('-').map(Number);
    const [mes, anio] = c.label.replace('.', '').split(/\s+/);
    assert.equal(Number(anio), y, `${c.name}: año`);
    assert.ok(meses[m - 1].startsWith(mes.slice(0, 3)), `${c.name}: "${c.label}" no es el mes ${m}`);
  }
});

test('Certificaciones va entre Laboratorio y Contacto', () => {
  const order = ['laboratorio', 'certificaciones', 'contacto'].map((id) => home.indexOf(`id="${id}"`));
  assert.ok(order.every((i) => i > 0) && order[0] < order[1] && order[1] < order[2], String(order));
});

test('cada certificado enlaza a un PDF real, publicado con nombre limpio', () => {
  for (const c of certs()) {
    assert.match(c.href, /^\/certificados\/[a-z0-9-]+\.pdf$/, c.href);
    // El nombre original traía el correo institucional del alumno.
    assert.doesNotMatch(c.href, /l21170203|tecnm|certificate_/i);
    const file = join(DIST, c.href);
    assert.ok(existsSync(file), `falta ${c.href}`);
    assert.equal(readFileSync(file).subarray(0, 5).toString('latin1'), '%PDF-', `${c.href} no es PDF`);
    assert.match(c.tag, /target="_blank"/);
    assert.match(c.tag, /rel="noopener"/);
    assert.match(c.tag, /aria-label="Ver certificado en PDF: [^"]+"/, 'dos enlaces "Ver certificado" sin nombre accesible distinto');
  }
  const published = readdirSync(join(DIST, 'certificados'));
  assert.deepEqual(published.sort(), certs().map((c) => c.href.split('/').pop()).sort(),
    'hay PDFs publicados que ninguna tarjeta enlaza');
});

// ——— CV ———

const pdfPages = (buf) => (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;

test('el botón del CV anuncia el tamaño y las páginas reales del PDF publicado', () => {
  const pdf = readFileSync(join(DIST, 'Omar-Bermejo-Osuna-CV.pdf'));
  const meta = home.match(/<span class="cv__meta">PDF · (\d+) páginas · A4 · (\d+) KB<\/span>/);
  assert.ok(meta, 'no encuentro "PDF · N páginas · A4 · N KB" en la portada');
  assert.equal(Number(meta[1]), pdfPages(pdf), 'páginas anunciadas ≠ páginas del PDF');
  assert.equal(Number(meta[2]), Math.round(pdf.length / 1024), 'KB anunciados ≠ tamaño del PDF');
});

test('el CV cabe en dos páginas A4', () => {
  const pdf = readFileSync(join(DIST, 'Omar-Bermejo-Osuna-CV.pdf'));
  assert.equal(pdfPages(pdf), 2);
  const box = pdf.toString('latin1').match(/\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)\s*\]/);
  assert.ok(box, 'sin MediaBox');
  // A4 = 595.28 × 841.89 pt; Skia redondea a 594.96 × 841.92.
  assert.ok(Math.abs(Number(box[1]) - 595) < 1 && Math.abs(Number(box[2]) - 842) < 1, box[0]);
});

test('el HTML del CV incluye Socialler, Blyni y las certificaciones', () => {
  const html = readFileSync(join(DIST, '..', 'cv', 'cv.html'), 'utf8');
  for (const s of ['Socialler', 'Blyni', 'CCNAv7: Introduction to Networks',
    'CCNA: Fundamentos de Conmutación, Enrutamiento y Redes Inalámbricas']) {
    assert.ok(html.includes(s), `cv.html no menciona "${s}"`);
  }
  // El retrato va embebido: el HTML no depende de archivos temporales.
  assert.match(html, /class="photo" src="data:image\/webp;base64,/);
});

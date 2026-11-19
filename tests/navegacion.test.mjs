/**
 * Barra y menú de secciones, sobre el sitio construido.
 * Lo que el HTML no puede probar —que los seis enlaces quepan sin recortarse en
 * cada ancho— depende de los cortes de global.css (1200px y 1480px) y se midió en
 * navegador al moverlos.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
if (!existsSync(join(DIST, 'index.html'))) {
  throw new Error('No hay dist/index.html. Corre "npm test", que construye primero.');
}
const read = (p) => readFileSync(join(DIST, p), 'utf8');

const EXPECTED = ['Perfil', 'Producto', 'Sistemas', 'Laboratorio', 'Certificados', 'Contacto'];

/** [texto, href] de los enlaces de la barra y del menú móvil. */
function navs(html) {
  const bar = html.match(/<nav class="header__links"[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
  const menu = html.match(/<nav class="menu__links"[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
  return {
    bar: [...bar.matchAll(/<a class="header__link" href="([^"]+)">([^<]+)<\/a>/g)].map((m) => [m[2], m[1]]),
    menu: [...menu.matchAll(/<a class="menu__link" href="([^"]+)"[^>]*>\s*<span class="menu__num">(\d+)<\/span>\s*<span class="menu__text">([^<]+)<\/span>/g)]
      .map((m) => [m[3], m[1], m[2]]),
  };
}

test('la barra y el menú tienen las mismas seis secciones, incluida Certificados', () => {
  const { bar, menu } = navs(read('index.html'));
  assert.deepEqual(bar.map((l) => l[0]), EXPECTED);
  assert.deepEqual(menu.map((l) => l[0]), EXPECTED);
  assert.deepEqual(menu.map((l) => l[2]), ['01', '02', '03', '04', '05', '06'], 'numeración del menú');
});

test('cada enlace de la portada apunta a una sección que existe, en el orden de la página', () => {
  const home = read('index.html');
  const { bar } = navs(home);
  const positions = bar.map(([label, href]) => {
    assert.match(href, /^#[a-z]+$/, `${label}: en la portada el ancla va sin barra`);
    const at = home.indexOf(`<section id="${href.slice(1)}"`);
    assert.ok(at > 0, `${label}: no hay <section id="${href.slice(1)}">`);
    return at;
  });
  assert.deepEqual([...positions].sort((a, b) => a - b), positions, 'la barra no sigue el orden de la página');
});

test('en las subpantallas los enlaces regresan a la portada', () => {
  for (const page of ['blyni/index.html', 'easy-order/index.html', '404.html']) {
    if (!existsSync(join(DIST, page))) continue;
    const { bar, menu } = navs(read(page));
    for (const [label, href] of [...bar, ...menu]) {
      assert.match(href, /^\/#[a-z]+$/, `${page} · ${label}: "${href}" no lleva a la portada`);
    }
    assert.ok(bar.some(([, h]) => h === '/#certificados'), `${page}: falta Certificados`);
  }
});

# Portafolio — Omar Bermejo Osuna

Portafolio tipográfico construido con Astro 5 y Tailwind 4. Sin imágenes salvo un
retrato y el icono de app de los proyectos que tienen uno: la jerarquía la cargan la
tipografía, la inversión de superficie y el ritmo espacial.

## Stack

- **Astro 5** — sitio estático, 24 páginas prerenderizadas
- **Tailwind 4** — tokens en `@theme`, el resto en CSS propio
- **Sin dependencias de runtime** — las animaciones 3D, las transiciones entre
  páginas y los iconos son CSS y SVG inline

## Estructura

```
src/
  data/projects.ts     Fuente única: proyectos, certificaciones, perfil, enfoque, redes
  components/          Header, listas, certificaciones, retrato, iconos, botón de CV
  layouts/Base.astro   Head, transiciones de página, scripts de UI
  lib/public-file.ts   Truena el build si falta un archivo de public/ que se enlaza
  pages/
    index.astro        Perfil · Enfoque · Producto · Sistemas · Laboratorio ·
                       Certificaciones · Contacto
    [slug].astro       Una subpantalla por proyecto
    404.astro
cv/                    Generador e impresor del CV en PDF
public/                Retrato, iconos de proyecto, certificados y el CV publicado
tests/                 Pruebas sobre el sitio construido (node:test, sin dependencias)
```

Todo el contenido vive en `src/data/projects.ts`. Agregar un proyecto es agregar un
objeto a ese arreglo: su subpantalla se genera sola.

Si el proyecto tiene icono de app, se exporta cuadrado y a sangre en
`public/img/proyectos/` como `{nombre}-256.webp` y `{nombre}-512.webp`, y se pone
`logo: '{nombre}'` en el objeto. El build falla si falta alguno de los dos archivos.

```bash
cwebp -q 86 -m 6 -resize 256 256 icono-1024.png -o public/img/proyectos/nombre-256.webp
cwebp -q 86 -m 6 -resize 512 512 icono-1024.png -o public/img/proyectos/nombre-512.webp
```

Las certificaciones también viven en `projects.ts` (`certifications`), con la fecha
de finalización en `aaaa-mm-dd` y el PDF en `public/certificados/` con un nombre
limpio: los que descarga Cisco traen el correo del alumno en el nombre. La sección
las ordena de la más reciente a la más antigua; el build falla si la fecha está mal
escrita o falta el PDF.

El CV en PDF no lee `projects.ts`: sus proyectos y certificaciones están escritos en
`cv/build.mjs`.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera dist/
npm start          # sirve dist/ como en producción
npm test           # construye y prueba el sitio generado
```

## CV en PDF

```bash
npm run cv         # genera cv/cv.html, lo imprime y copia el PDF a public/
```

`cv/build.mjs` arma el HTML con el retrato de `public/img/` embebido. `cv/print.mjs`
lo imprime con el Chromium que encuentre (Chrome, Brave o Chromium; `CHROME_PATH`
para elegir otro) por el protocolo de DevTools, porque el modo `--headless
--print-to-pdf` de Brave se cuelga sin error. Necesita red para las fuentes web: sin
ellas la paginación cambia, y el script falla en vez de publicar un PDF distinto.

Al terminar imprime el tamaño y las páginas; si cambiaron, actualiza `site.cv` en
`src/data/projects.ts`. `npm test` falla si no coinciden con el PDF publicado.

## Deploy en Railway

El repo trae `railway.json`. Railway detecta Node con Nixpacks, corre
`npm run build` y arranca con `npm start`, que sirve `dist/` en el `PORT` que
inyecta la plataforma.

1. `railway init` o conectar el repo desde el panel
2. Variable opcional `PUBLIC_SITE_URL` con el dominio final, para las URLs canónicas
3. `railway up` o push a `main`

## Accesibilidad y rendimiento

- Foco visible en todo elemento interactivo; foco atrapado en el menú móvil
- Toda animación se apaga bajo `prefers-reduced-motion`
- CSS inline, prefetch por viewport, imágenes en WebP con `srcset`

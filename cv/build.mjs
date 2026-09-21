import { readFileSync, writeFileSync } from 'node:fs';

const photo = readFileSync('/tmp/foto.b64', 'utf8');

const focus = [
  ['Móvil', 'iOS y Android nativos, React Native / Expo, Flutter. De la primera pantalla a la publicación en tienda.'],
  ['Backend', 'APIs en NestJS, Express y FastAPI. Modelado de datos, multi-tenancy, migraciones y despliegue en AWS.'],
  ['Web', 'Next.js y Astro con SEO desde la arquitectura, no como parche final.'],
  ['IA aplicada', 'Agentes en el flujo de desarrollo, visión por computadora y recomendación en producto real.'],
  ['Producto', 'Identidad visual, diseño de interfaz y decisiones de alcance.'],
  ['Proceso', 'Metodología IA-First propia, gobernanza con ITIL y COBIT, operación en Scrum.'],
];

const producto = [
  ['Easy Order', '2024 —', 'En tienda', 'Suite de gestión para restaurantes: comanda en mesa, pantalla de cocina, cuentas, inventario y corte de caja. Arquitectura multi-tenant con cuatro roles. Publicada en App Store y Google Play, en operación real.', 'React Native / Expo · Next.js · NestJS · AWS'],
  ['cudmy', '2025', '', 'Plataforma de cursos con rutas de carrera, catálogo, inscripciones y progreso. Front y backend completos.', 'Next.js · HeroUI · GSAP · NestJS'],
  ['Vende Digital3', '2024', '', 'Menús digitales por QR con pedido vía WhatsApp y media en la nube. Sin app ni comisión de plataforma.', 'Next.js · Tailwind · Cloudinary'],
  ['VetGo', '2024', '', 'Plataforma veterinaria multi-rol: expediente único con acceso separado para clínica, recepción y dueño.', 'React Native / Expo · NestJS · PostgreSQL'],
  ['bimoora', '2025', 'Pre-lanzamiento', 'Landing con countdown, arquitectura SEO sobre schema.org y bloque de seguridad definido desde el inicio.', 'Astro · Tailwind'],
  ['PR Friends', '2025', '', 'App universal para coordinar salidas de grupo, con backend propio, autenticación y notificaciones.', 'Expo · Node.js · Supabase'],
  ['anottan', '2025', '', 'App iOS de captura por voz: el asistente "Bea" transcribe y clasifica en notas, tareas y proyectos.', 'SwiftUI · Swift · Node.js'],
  ['memuvi', '2024', '', 'Archivo de recuerdos con estado de ánimo y música asociada. Identidad completa y producto.', 'Expo · Supabase'],
  ['doplans', '2025', '', 'Descubrimiento de viajes y planeación de eventos. Código e identidad visual.', 'Next.js · Expo · Node.js'],
  ['tdapp', '2024', '', 'Tareas por categoría de enfoque, con widgets nativos y sincronización propia.', 'SwiftUI · Kotlin · Express'],
  ['Petixfy', '2025', '', 'Recomendador de productos para mascotas con IA, en app iOS con animaciones custom.', 'SwiftUI · FastAPI'],
];

const sistemas = [
  ['Motor IA-First', '2025 —', 'Metodología propia de desarrollo con agentes: células 1+1 humano-agente, flujo de seis pasos y autonomía L2 con aprobación humana en los puntos de no retorno.'],
  ['Reconocimiento de Matrículas', '2024', 'Detección y lectura automática de placas desde cámara: captura en SwiftUI e inferencia en backend FastAPI con visión por computadora.'],
  ['Optimización Metaheurística', '2024', 'PSO y recocido simulado sobre problemas de asignación, comparando calidad de solución contra tiempo de convergencia.'],
  ['Gobernanza de TI', '2023', 'Aplicación de ITIL V3, COBIT y CMMI sobre procesos reales de un área de sistemas, con operación en Scrum.'],
];

const lab = [
  ['Sistema de Control Escolar', 'Prueba técnica fullstack end-to-end en TypeScript: modelo, API y cliente.'],
  ['Tópicos de IA', 'Prácticas en Python (TecNM): algoritmos implementados desde cero antes de la librería.'],
  ['Recetiin', 'App iOS de recetas en Swift, con persistencia local.'],
  ['PelisApp', 'Catálogo de películas en Flutter sobre API pública, con caché.'],
  ['qaride', 'Experimento de movilidad en Flutter: geolocalización y seguimiento en mapa.'],
];

const stack = 'SwiftUI · Jetpack Compose · React Native / Expo · Flutter · Swift · Kotlin · Dart · Node.js · Express · NestJS · Python (FastAPI) · Supabase · PostgreSQL · Astro · Next.js · Tailwind · GSAP · Cloudinary · AWS';

const row = (name, year, status, text, tech) => `
  <article class="entry">
    <div class="entry__head">
      <h3 class="entry__name">${name}</h3>
      <span class="entry__year">${year}${status ? ` · <b>${status}</b>` : ''}</span>
    </div>
    <p class="entry__text">${text}</p>
    ${tech ? `<p class="entry__tech">${tech}</p>` : ''}
  </article>`;

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>Omar Bermejo Osuna — CV</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600&family=Inter:wght@400;500;700&family=Instrument+Serif&family=Space+Grotesk:wght@600&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 14mm 14mm 12mm; }
  :root {
    --paper:#ffffff; --alt:#eef0f5; --ink:#14161c; --cobalt:#2f3be8; --muted:#6b7080; --rule:#d7dae3;
    --f-display:'Archivo',sans-serif; --f-ed:'Instrument Serif',serif; --f-body:'Inter',sans-serif; --f-label:'Space Grotesk',monospace;
  }
  * { box-sizing:border-box; }
  body { margin:0; font-family:var(--f-body); color:var(--ink); font-size:9pt; line-height:1.45; background:var(--paper); -webkit-print-color-adjust:exact; print-color-adjust:exact; }

  .head { display:grid; grid-template-columns:1fr 26mm; gap:8mm; align-items:end; padding-bottom:5mm; border-bottom:1.5pt solid var(--ink); }
  .name { font-family:var(--f-display); font-weight:600; font-size:30pt; line-height:1; letter-spacing:-0.033em; margin:0; }
  .role { font-family:var(--f-ed); font-size:14pt; line-height:1.1; margin:2mm 0 0; color:var(--ink); }
  .contact { margin:4mm 0 0; display:flex; flex-wrap:wrap; gap:1.5mm 5mm; font-size:8.2pt; color:var(--muted); }
  .contact b { color:var(--cobalt); font-weight:600; }
  .photo { width:26mm; height:32.5mm; object-fit:cover; filter:grayscale(1) contrast(1.06); background:var(--alt); }

  .lead { margin:4mm 0 0; font-size:10pt; line-height:1.45; max-width:none; }

  .label { font-family:var(--f-label); font-weight:600; font-size:7.5pt; letter-spacing:0.069em; text-transform:uppercase; color:var(--cobalt); margin:4.4mm 0 2.2mm; display:flex; align-items:center; gap:3mm; }
  .label::after { content:''; flex:1; height:0.6pt; background:var(--rule); }

  .focus { display:grid; grid-template-columns:1fr 1fr; gap:2mm 8mm; }
  .focus__k { font-family:var(--f-display); font-weight:600; font-size:9pt; color:var(--cobalt); }
  .focus__v { margin:0; font-size:8.4pt; color:var(--ink); }

  .entry { break-inside:avoid; padding:1.45mm 0; border-top:0.6pt solid var(--rule); }
  .entry:first-of-type { border-top:0; }
  .entry__head { display:flex; justify-content:space-between; align-items:baseline; gap:4mm; }
  .entry__name { font-family:var(--f-display); font-weight:600; font-size:11.5pt; letter-spacing:-0.025em; margin:0; }
  .entry__year { font-family:var(--f-label); font-weight:600; font-size:7.2pt; letter-spacing:0.069em; text-transform:uppercase; color:var(--muted); white-space:nowrap; }
  .entry__year b { color:var(--cobalt); }
  .entry__text { margin:0.8mm 0 0; font-size:8.5pt; }
  .entry__tech { margin:0.8mm 0 0; font-family:var(--f-label); font-size:7.2pt; letter-spacing:0.04em; color:var(--muted); }

  .lab { display:grid; grid-template-columns:1fr 1fr; gap:1.5mm 8mm; }
  .lab__i { break-inside:avoid; }
  .lab__n { font-family:var(--f-ed); font-size:11pt; }
  .lab__t { margin:0; font-size:8.2pt; color:var(--muted); }

  .band { background:var(--ink); color:#f7f8fb; padding:3.5mm 4.5mm; margin-top:3mm; break-inside:avoid; }
  .band .label { color:#99a1ff; margin-top:0; }
  .band .label::after { background:#3a3f52; }
  .band .entry { border-top-color:#2c3040; }
  .band .entry__text { color:#d8dae4; }
  .band .entry__year { color:#99a1ff; }

  .foot { break-inside:avoid; margin-top:4mm; padding-top:2.5mm; border-top:1.5pt solid var(--ink); display:flex; justify-content:space-between; gap:6mm; align-items:baseline; }
  .foot__edu { font-family:var(--f-ed); font-size:11pt; }
  .foot__meta { font-family:var(--f-label); font-size:7.2pt; letter-spacing:0.069em; color:var(--cobalt); text-align:right; white-space:nowrap; }
  .stack { margin:2mm 0 0; font-family:var(--f-label); font-size:7.4pt; letter-spacing:0.03em; line-height:1.7; color:var(--muted); }
  .page-break { break-before:page; }
</style></head>
<body>

  <header class="head">
    <div>
      <h1 class="name">Omar Bermejo Osuna</h1>
      <p class="role">Mobile Developer &amp; AI-First Builder</p>
      <div class="contact">
        <span><b>bermejoosuna@gmail.com</b></span>
        <span>Culiacán, Sinaloa, MX</span>
        <span>github.com/Omxrhack</span>
        <span>x.com/bermejoosuna</span>
        <span>instagram.com/omarb03_</span>
      </div>
    </div>
    <img class="photo" src="${photo}" alt="Omar Bermejo Osuna">
  </header>

  <p class="lead">Construyo aplicaciones móviles que llegan a tienda y sistemas que las sostienen. Producto propio en producción, de la identidad visual al despliegue, con arquitecturas que siguen siendo mantenibles seis meses después.</p>

  <h2 class="label">Enfoque</h2>
  <div class="focus">
    ${focus.map(([k, v]) => `<div><div class="focus__k">${k}</div><p class="focus__v">${v}</p></div>`).join('')}
  </div>

  <h2 class="label">Producto</h2>
  ${producto.slice(0, 6).map((p) => row(...p)).join('')}

  <div class="page-break"></div>

  <h2 class="label">Producto (continuación)</h2>
  ${producto.slice(6).map((p) => row(...p)).join('')}

  <section class="band">
    <h2 class="label">Sistemas e investigación</h2>
    ${sistemas.map(([n, y, t]) => row(n, y, '', t, '')).join('')}
  </section>

  <h2 class="label">Laboratorio</h2>
  <div class="lab">
    ${lab.map(([n, t]) => `<div class="lab__i"><div class="lab__n">${n}</div><p class="lab__t">${t}</p></div>`).join('')}
  </div>

  <footer class="foot">
    <div>
      <div class="foot__edu">Ingeniería en TIC — Instituto Tecnológico de Culiacán, TecNM</div>
      <p class="stack">${stack}</p>
    </div>
    <div class="foot__meta">bermejoosuna@gmail.com</div>
  </footer>

</body></html>`;

writeFileSync('cv/cv.html', html);
console.log('cv/cv.html escrito');

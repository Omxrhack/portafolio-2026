export type Section = 'producto' | 'sistemas' | 'laboratorio';

/** Misma estructura para los 20 proyectos: problema, mecanismo, aporte. */
export interface Detail {
  /** Qué problema resuelve, en términos de la persona que lo usa. */
  problem: string;
  /** Cómo funciona por dentro: mecanismo, no lista de tecnologías. */
  how: string;
  /** Qué construí yo, y en qué estado está. */
  built: string;
}

export interface Project {
  slug: string;
  name: string;
  size: 86 | 58;
  section: Section;
  /** Línea corta: meta, alt y subtítulo de la subpantalla. */
  context: string;
  detail: Detail;
  role: string;
  year: string;
  tech: string[];
  status?: string;
  /** Enlaces públicos: tienda, sitio, repositorio. */
  links?: { label: string; url: string; kind?: 'appstore' | 'play' | 'web' }[];
}

export const site = {
  owner: 'Omar Bermejo Osuna',
  role: 'Mobile Developer & AI-First Builder',
  email: 'bermejoosuna@gmail.com',
  brand: 'Culiacán, Sinaloa',
  github: '@Omxrhack',
  githubUrl: 'https://github.com/Omxrhack',
  education: 'Ingeniería en TIC — Instituto Tecnológico de Culiacán, TecNM',
  cv: { href: '/Omar-Bermejo-Osuna-CV.pdf', file: 'Omar-Bermejo-Osuna-CV.pdf', size: '286 KB', pages: '2 páginas · A4' },
} as const;

export type SocialIcon = 'github' | 'x' | 'instagram' | 'threads' | 'mail';

export interface Social {
  label: string;
  handle: string;
  url: string;
  icon: SocialIcon;
}

export const socials: Social[] = [
  { label: 'GitHub', handle: '@Omxrhack', url: 'https://github.com/Omxrhack', icon: 'github' },
  { label: 'X', handle: '@bermejoosuna', url: 'https://x.com/bermejoosuna', icon: 'x' },
  { label: 'Instagram', handle: '@omarb03_', url: 'https://www.instagram.com/omarb03_/', icon: 'instagram' },
  { label: 'Threads', handle: '@omarb03_', url: 'https://www.threads.com/@omarb03_', icon: 'threads' },
  { label: 'Correo', handle: 'bermejoosuna@gmail.com', url: 'mailto:bermejoosuna@gmail.com', icon: 'mail' },
];

/** Bloques de "Sobre mí": la misma estructura editorial que los proyectos. */
export const about = {
  lead: 'Construyo aplicaciones móviles que llegan a tienda y sistemas que las sostienen. Trabajo desde Culiacán, con producto propio en producción y clientes que necesitan software que aguante el uso diario.',
  blocks: [
    {
      key: 'Quién soy',
      text: 'Ingeniero en TIC por el Instituto Tecnológico de Culiacán. Empecé por el lado móvil —Swift y Kotlin nativos, luego React Native y Flutter— y terminé metido en el backend y la arquitectura porque las apps que valen la pena no se acaban en la pantalla. Hoy diseño, programo y publico productos completos: de la identidad visual al despliegue.',
    },
    {
      key: 'Cómo trabajo',
      text: 'Mapeo el problema antes de escribir código: las rutas de falla, no solo el camino feliz. Trabajo con agentes de IA bajo un método propio —células 1+1, autonomía controlada, revisión humana en los puntos de no retorno— que me permite moverme rápido sin acumular deuda técnica. Entrego con pruebas, no con promesas.',
    },
    {
      key: 'En qué soy bueno',
      text: 'Llevar un producto de idea a App Store y Google Play sin equipo grande detrás. Arquitecturas multi-tenant con roles que de verdad separan permisos. Interfaces que se sienten nativas en cada plataforma en vez de una web envuelta. Y hacer que todo eso siga siendo mantenible seis meses después.',
    },
    {
      key: 'Qué busco',
      text: 'Proyectos donde el software resuelva algo medible para alguien concreto: un restaurante que deja de perder comandas, una clínica que encuentra el expediente a tiempo. Colaboraciones de producto, no de maquila de pantallas.',
    },
  ],
} as const;

export const focus = [
  { k: 'Móvil', v: 'iOS y Android nativos, React Native / Expo, Flutter. De la primera pantalla a la publicación en tienda.' },
  { k: 'Backend', v: 'APIs en NestJS, Express y FastAPI. Modelado de datos, multi-tenancy, migraciones y despliegue en AWS.' },
  { k: 'Web', v: 'Next.js y Astro con SEO desde la arquitectura, no como parche final.' },
  { k: 'IA aplicada', v: 'Agentes en el flujo de desarrollo, visión por computadora y sistemas de recomendación en producto real.' },
  { k: 'Producto', v: 'Identidad visual, diseño de interfaz y decisiones de alcance. El diseño no llega después del código.' },
  { k: 'Proceso', v: 'Metodología IA-First propia, gobernanza de TI con ITIL y COBIT, operación en Scrum.' },
] as const;

export const stack = [
  'SwiftUI', 'Jetpack Compose', 'React Native / Expo', 'Flutter', 'Swift', 'Kotlin',
  'Dart', 'Node.js', 'Express', 'NestJS', 'Python (FastAPI)', 'Supabase', 'Astro',
  'Next.js', 'Tailwind', 'GSAP', 'Cloudinary', 'DotLottie',
] as const;

export const sectionLabel: Record<Section, string> = {
  producto: 'Producto',
  sistemas: 'Sistemas',
  laboratorio: 'Laboratorio',
};

export const detailLabel: Record<keyof Detail, string> = {
  problem: 'El problema',
  how: 'Cómo funciona',
  built: 'Mi trabajo',
};

export const projects: Project[] = [
  // ——— Producto ———
  {
    slug: 'easy-order',
    name: 'Easy Order',
    size: 86,
    section: 'producto',
    context: 'Suite de gestión para restaurantes. Live en App Store y Google Play',
    detail: {
      problem: 'Un restaurante mediano pierde dinero en los huecos entre la mesa y la cocina: comandas escritas a mano que se malinterpretan, platillos que salen sin registrarse, cortes de caja que no cuadran al cierre y un dueño que no sabe qué se vendió hasta el día siguiente.',
      how: 'El mesero levanta la orden en el teléfono y la comanda aparece en la pantalla de cocina en el momento, con estados que ambos lados ven. La cuenta se arma sola, el inventario baja por receta y el corte de caja se cierra con el turno. Es multi-tenant con cuatro roles —dueño, gerente, mesero y cocina— y cada rol solo ve y modifica lo que le corresponde.',
      built: 'Producto, arquitectura multi-tenant, app móvil y panel web. Publicada en App Store y Google Play, operando con restaurantes reales en Culiacán.',
    },
    role: 'Producto, arquitectura y desarrollo',
    year: '2024 —',
    tech: ['React Native / Expo', 'Next.js', 'NestJS', 'AWS'],
    status: 'En tienda',
    links: [
      { label: 'Ver en App Store', url: 'https://apps.apple.com/us/app/easy-order/id6767426566', kind: 'appstore' },
      { label: 'Ver en Google Play', url: 'https://play.google.com/store/apps/details?id=com.easyorder.easyorderv1', kind: 'play' },
    ],
  },
  {
    slug: 'anottan',
    name: 'anottan',
    size: 58,
    section: 'producto',
    context: 'App iOS de chat, proyectos y asistente de voz "Bea". Live en App Store',
    detail: {
      problem: 'Las ideas llegan cuando no puedes escribir: manejando, caminando, a media conversación. Para cuando abres una app de notas y la tecleas, la idea ya se diluyó o se quedó sin capturar.',
      how: 'Hablas y "Bea", el asistente de voz, transcribe en tiempo real y clasifica lo dicho en notas, tareas o el proyecto al que pertenece. Cada proyecto conserva su propio hilo de conversación, así que retomarlo dos semanas después no exige releer todo desde cero.',
      built: 'App iOS nativa completa, diseño de producto y el flujo de voz como interfaz principal —no como botón accesorio. Publicada en App Store.',
    },
    role: 'Desarrollo iOS y diseño de producto',
    year: '2025',
    tech: ['SwiftUI', 'Swift', 'Node.js'],
    status: 'En tienda',
    links: [
      { label: 'Ver en App Store', url: 'https://apps.apple.com/us/app/anottan/id6798854468', kind: 'appstore' },
    ],
  },
  {
    slug: 'cudmy',
    name: 'cudmy',
    size: 86,
    section: 'producto',
    context: 'Plataforma de cursos en línea: catálogo, rutas de carrera y testimonios',
    detail: {
      problem: 'Un instructor que sube su curso a una plataforma genérica queda como una fila más en un catálogo: sin marca propia, sin control del precio y sin saber en qué punto abandonan sus alumnos.',
      how: 'Los cursos se agrupan en rutas de carrera, no en listas sueltas de video: el alumno ve dónde está, qué sigue y cuánto le falta para cerrar la ruta. El catálogo, las inscripciones y los testimonios corren sobre una API propia, y el front cuida el movimiento para que navegar el catálogo se sienta continuo.',
      built: 'Fullstack: front en Next.js 16 con HeroUI y movimiento en GSAP/Lenis, backend en NestJS con catálogo, inscripciones y progreso.',
    },
    role: 'Fullstack',
    year: '2025',
    tech: ['Next.js', 'HeroUI', 'GSAP', 'Lenis', 'NestJS'],
  },
  {
    slug: 'memuvi',
    name: 'memuvi',
    size: 58,
    section: 'producto',
    context: 'Reflexión emocional, archivo de recuerdos e integración musical',
    detail: {
      problem: 'Una galería de fotos guarda la imagen y tira lo demás. Un año después ves la foto y ya no recuerdas cómo te sentías ese día, que era justamente lo que valía la pena conservar.',
      how: 'Cada entrada del archivo lleva estado de ánimo y una canción asociada. Volver a leerla reproduce la pista, y el archivo se puede recorrer por emoción o por momento, no solo por fecha, de modo que regresar al recuerdo es regresar a cómo se sintió.',
      built: 'Identidad completa —nombre, logotipos y sistema visual— además del producto y sus interfaces.',
    },
    role: 'Identidad, diseño de interfaz y desarrollo',
    year: '2024',
    tech: ['React Native / Expo', 'Supabase'],
  },
  {
    slug: 'vende-digital3',
    name: 'Vende Digital3',
    size: 86,
    section: 'producto',
    context: 'Menús digitales interactivos con QR, pedidos por WhatsApp y media en la nube',
    detail: {
      problem: 'Un negocio pequeño no puede pedirle al cliente que instale una app para comprar una torta, ni pagar comisión de plataforma sobre cada venta. El menú impreso, mientras tanto, se queda obsoleto cada vez que cambia un precio.',
      how: 'El cliente escanea un QR en la mesa, arma el pedido en el navegador y lo envía como mensaje de WhatsApp al dueño, sin instalar nada ni intermediarios. El dueño edita platillos, fotos, precios y disponibilidad desde su panel, y el cambio se ve en el siguiente escaneo.',
      built: 'Producto y desarrollo completo, con media servida desde Cloudinary y el flujo de pedido por WhatsApp de punta a punta.',
    },
    role: 'Producto y desarrollo',
    year: '2024',
    tech: ['Next.js', 'Tailwind', 'Cloudinary', 'WhatsApp API'],
  },
  {
    slug: 'doplans',
    name: 'doplans',
    size: 58,
    section: 'producto',
    context: 'Descubrimiento de viajes y planeación de eventos',
    detail: {
      problem: 'El plan muere en el chat grupal: alguien propone un destino, tres responden, nadie fija la fecha y dos semanas después la conversación quedó enterrada bajo memes.',
      how: 'Descubrir el destino y armar el evento ocurren en el mismo lugar: de la ficha del lugar se pasa a fecha, lista de asistentes y confirmaciones, con el estado del plan visible para todos en vez de disperso en mensajes.',
      built: 'Desarrollo del producto e identidad visual de la marca.',
    },
    role: 'Desarrollo e identidad visual',
    year: '2025',
    tech: ['Next.js', 'React Native / Expo', 'Node.js'],
  },
  {
    slug: 'vetgo',
    name: 'VetGo',
    size: 86,
    section: 'producto',
    context: 'Plataforma veterinaria multi-rol',
    detail: {
      problem: 'El historial clínico de una mascota vive repartido entre un expediente de papel, la memoria del veterinario y el WhatsApp del dueño. Cuando el animal llega grave, esa información dispersa es tiempo perdido.',
      how: 'Un solo expediente por paciente, con acceso separado para veterinario, recepción y dueño: cada quien ve su capa —clínica, agenda o seguimiento— sobre el mismo registro. Las citas, vacunas y tratamientos quedan en la misma línea de tiempo.',
      built: 'Arquitectura de datos multi-rol, migraciones de base de datos y el flujo de onboarding con el que entran clínicas nuevas.',
    },
    role: 'Arquitectura, migraciones y onboarding',
    year: '2024',
    tech: ['React Native / Expo', 'NestJS', 'PostgreSQL'],
  },
  {
    slug: 'tdapp',
    name: 'tdapp',
    size: 58,
    section: 'producto',
    context: 'Gestión de tareas con categorías de enfoque, widgets y backend robusto',
    detail: {
      problem: 'Las apps de tareas tratan igual "responder un correo" y "escribir el capítulo": todo cae en la misma lista, con la misma urgencia, y la lista termina siendo una fuente de ruido en vez de una herramienta.',
      how: 'Las tareas se agrupan por categoría de enfoque, y la categoría define cómo y cuándo la app interrumpe: lo profundo no notifica, lo reactivo sí. Los widgets de pantalla de inicio permiten ver y cerrar pendientes sin abrir la app.',
      built: 'Desarrollo móvil en ambas plataformas, widgets nativos y el backend propio con sincronización entre dispositivos.',
    },
    role: 'Desarrollo móvil y backend',
    year: '2024',
    tech: ['SwiftUI', 'Kotlin', 'Node.js', 'Express'],
  },
  {
    slug: 'bimoora',
    name: 'bimoora',
    size: 86,
    section: 'producto',
    context: 'Producto en pre-lanzamiento',
    detail: {
      problem: 'Un producto que aún no existe necesita demostrar demanda antes de que se justifique construirlo, y esa validación no puede costar lo mismo que el producto.',
      how: 'Una landing con countdown y registro temprano mide interés real. La arquitectura SEO se define desde el inicio con schema.org, de modo que el sitio ya está indexado y posicionado el día del lanzamiento, no meses después.',
      built: 'Producto, landing en Astro, arquitectura SEO y un bloque de seguridad —cabeceras, política de contenido y manejo de datos del formulario— definido antes de la primera línea de UI.',
    },
    role: 'Producto, landing y SEO',
    year: '2025',
    tech: ['Astro', 'Tailwind', 'schema.org'],
    status: 'Pre-lanzamiento',
  },
  {
    slug: 'petixfy',
    name: 'Petixfy',
    size: 58,
    section: 'producto',
    context: 'Recomendador de productos para mascotas con IA',
    detail: {
      problem: 'El dueño de una mascota compra por marca o por precio porque no tiene forma de saber qué le conviene a un animal de esa especie, edad, peso y condición. El error sale caro y a veces se paga en salud.',
      how: 'El recomendador toma especie, edad, peso y condiciones del animal y devuelve productos ordenados por qué tan bien encajan con ese perfil, con la razón de la recomendación a la vista en lugar de una lista opaca.',
      built: 'App iOS con animaciones custom y el backend de recomendación que la alimenta.',
    },
    role: 'Desarrollo iOS y backend',
    year: '2025',
    tech: ['SwiftUI', 'Python (FastAPI)', 'DotLottie'],
  },
  {
    slug: 'pr-friends',
    name: 'PR Friends',
    size: 86,
    section: 'producto',
    context: 'App móvil en Expo / React Native con backend propio',
    detail: {
      problem: 'Coordinar a un grupo de amigos para una salida exige repetir la misma información en el chat hasta que alguien se rinde: quién va, a qué hora, dónde exactamente.',
      how: 'Cada salida es un objeto con lugar, hora y lista de confirmados que todos consultan en vez de reconstruir desde el chat. Las notificaciones avisan solo de los cambios que afectan a quien las recibe.',
      built: 'Fullstack: app universal en Expo y backend propio con autenticación y notificaciones.',
    },
    role: 'Fullstack',
    year: '2025',
    tech: ['React Native / Expo', 'Node.js', 'Supabase'],
  },

  // ——— Sistemas ———
  {
    slug: 'motor-ia-first',
    name: 'Motor IA-First',
    size: 86,
    section: 'sistemas',
    context: 'Metodología propietaria: células 1+1 humano-agente, flujo de seis pasos, autonomía L2',
    detail: {
      problem: 'Desarrollar con agentes acelera la escritura de código y, sin método, degrada todo lo demás: nadie revisa las rutas alternas, el agente toma decisiones irreversibles sin permiso y la deuda técnica crece más rápido que el producto.',
      how: 'La unidad de trabajo es una célula 1+1 —un humano, un agente— que recorre un flujo fijo de seis pasos. La autonomía es de nivel L2: el agente ejecuta y propone, el humano aprueba los puntos de no retorno. Cada cambio se mapea antes de escribirse, incluidas las rutas de falla, no solo el camino feliz.',
      built: 'Autor de la metodología. Es el método con el que se construyeron los productos de esta página, no una propuesta teórica.',
    },
    role: 'Autor de la metodología',
    year: '2025 —',
    tech: ['Claude Code', 'Agentes', 'CI'],
  },
  {
    slug: 'reconocimiento-de-matriculas',
    name: 'Reconocimiento de Matrículas',
    size: 58,
    section: 'sistemas',
    context: 'Detección automática: SwiftUI + backend FastAPI',
    detail: {
      problem: 'El control de acceso a un estacionamiento o una flotilla depende de que alguien teclee la placa correctamente en la caseta. A la centésima entrada del día, ya hay errores y filas.',
      how: 'La cámara del teléfono captura el cuadro, un backend de visión localiza la placa, la recorta y reconoce el texto, y devuelve la lectura al instante para cotejarla contra el padrón autorizado.',
      built: 'Investigación y desarrollo de las dos mitades: captura en SwiftUI e inferencia en un servicio FastAPI.',
    },
    role: 'Investigación y desarrollo',
    year: '2024',
    tech: ['SwiftUI', 'Python (FastAPI)', 'OpenCV'],
  },
  {
    slug: 'optimizacion-metaheuristica',
    name: 'Optimización Metaheurística',
    size: 86,
    section: 'sistemas',
    context: 'PSO y recocido simulado aplicados a problemas de asignación',
    detail: {
      problem: 'En rutas, turnos y distribución de recursos, el número de combinaciones crece tan rápido que probarlas todas es inviable: hace falta una solución muy buena en minutos, no la perfecta en años.',
      how: 'Dos metaheurísticas recorren el espacio de soluciones sin enumerarlo: optimización por enjambre de partículas, donde las candidatas se atraen hacia las mejores encontradas, y recocido simulado, que acepta empeoramientos al principio para no quedarse en un óptimo local.',
      built: 'Implementación de ambos algoritmos y comparación sobre los mismos casos, midiendo calidad de solución contra tiempo de convergencia.',
    },
    role: 'Investigación',
    year: '2024',
    tech: ['Python', 'NumPy'],
  },
  {
    slug: 'gobernanza-de-ti',
    name: 'Gobernanza de TI',
    size: 58,
    section: 'sistemas',
    context: 'ITIL V3, COBIT, CMMI, Scrum',
    detail: {
      problem: 'Un área de sistemas que opera por costumbre no puede auditarse ni mejorar: nadie sabe por qué se aprobó un cambio, cuánto tarda un servicio en restablecerse ni en qué nivel de madurez está el proceso.',
      how: 'Los marcos cubren capas distintas y se aplican juntos: ITIL para gestión de servicios e incidentes, COBIT para control y auditoría, CMMI para medir madurez de proceso, y Scrum para la operación diaria dentro de ese marco.',
      built: 'Análisis y aplicación de los cuatro marcos sobre procesos reales de un área de sistemas.',
    },
    role: 'Análisis y aplicación de marcos',
    year: '2023',
    tech: ['ITIL V3', 'COBIT', 'CMMI', 'Scrum'],
  },

  // ——— Laboratorio ———
  {
    slug: 'sistema-de-control-escolar',
    name: 'Sistema de Control Escolar',
    size: 58,
    section: 'laboratorio',
    context: 'Prueba técnica fullstack end-to-end en TypeScript',
    detail: {
      problem: 'Administrar alumnos, materias y calificaciones en hojas de cálculo funciona hasta que dos personas editan a la vez y nadie sabe cuál versión es la buena.',
      how: 'Un modelo de datos relacional sostiene alumnos, materias, inscripciones y calificaciones; sobre él, una API tipada y un cliente donde la captura valida contra las reglas del reglamento escolar antes de guardar.',
      built: 'Resuelto end-to-end en TypeScript —modelo, API y cliente— como prueba técnica fullstack.',
    },
    role: 'Fullstack',
    year: '2024',
    tech: ['TypeScript', 'Node.js', 'React'],
  },
  {
    slug: 'topicos-de-ia',
    name: 'Tópicos de IA',
    size: 58,
    section: 'laboratorio',
    context: 'Prácticas de IA en Python (TecNM)',
    detail: {
      problem: 'Usar una librería de machine learning sin entender el algoritmo deja al desarrollador sin criterio para saber por qué un modelo falla o cuándo no es la herramienta correcta.',
      how: 'Cada práctica implementa el algoritmo desde cero antes de recurrir a la librería: búsqueda informada, clasificadores y redes neuronales escritos a mano y luego contrastados con la implementación estándar.',
      built: 'Conjunto de prácticas en Python del programa de Ingeniería en TIC del TecNM.',
    },
    role: 'Académico',
    year: '2023',
    tech: ['Python', 'NumPy', 'scikit-learn'],
  },
  {
    slug: 'recetiin',
    name: 'Recetiin',
    size: 58,
    section: 'laboratorio',
    context: 'App iOS de recetas en Swift',
    detail: {
      problem: 'Cocinar con una receta abierta en el navegador significa pelear con anuncios y con una pantalla que se apaga a media preparación.',
      how: 'Las recetas se guardan localmente con ingredientes y pasos separados, de modo que la app funciona sin conexión y el paso actual se mantiene visible mientras se cocina.',
      built: 'App iOS nativa: navegación, persistencia local y listas con imágenes en Swift.',
    },
    role: 'Desarrollo iOS',
    year: '2023',
    tech: ['Swift', 'SwiftUI'],
  },
  {
    slug: 'pelisapp',
    name: 'PelisApp',
    size: 58,
    section: 'laboratorio',
    context: 'Consumo de API de películas en Flutter',
    detail: {
      problem: 'Explorar un catálogo grande de películas se vuelve lento en cuanto cada búsqueda vuelve a pedir y redescargar las mismas imágenes.',
      how: 'La app cachea respuestas y carátulas, y mantiene el estado de búsqueda y favoritos entre pantallas para que volver atrás no signifique volver a cargar.',
      built: 'Ejercicio de Flutter sobre consumo de API, manejo de estado y carga diferida de imágenes.',
    },
    role: 'Desarrollo móvil',
    year: '2023',
    tech: ['Flutter', 'Dart'],
  },
  {
    slug: 'qaride',
    name: 'qaride',
    size: 58,
    section: 'laboratorio',
    context: 'Experimento de movilidad en Flutter',
    detail: {
      problem: 'En una app de movilidad, la parte difícil no es pedir el viaje: es que el mapa refleje dónde va el conductor sin agotar la batería ni saturar el backend con actualizaciones.',
      how: 'La posición se emite con una frecuencia que depende del movimiento real y se interpola en el mapa entre lecturas, de modo que el trayecto se ve continuo con una fracción de los envíos.',
      built: 'Experimento en Flutter sobre geolocalización, seguimiento en mapa y estados del trayecto.',
    },
    role: 'Desarrollo móvil',
    year: '2023',
    tech: ['Flutter', 'Dart', 'Maps'],
  },
];

export const bySection = (section: Section): Project[] =>
  projects.filter((p) => p.section === section);

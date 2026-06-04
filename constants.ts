
import { Zone, MicroTask, ProjectState, ChecklistItem } from './types';

export const ZONES: Zone[] = [
  {
    id: 1,
    name: 'Altiplano',
    territory: 'Jumilla, Yecla',
    concept: 'Vino y Cordero',
    ingredients: ['Uva Monastrell', 'Pera de Jumilla', 'Cordero Segureño', 'Queso al Vino', 'Aceite de Oliva', 'Embutidos locales']
  },
  {
    id: 2,
    name: 'Noroeste',
    territory: 'Caravaca, Moratalla, Cehegín',
    concept: 'Arroz y Tesoros del Bosque',
    ingredients: ['Arroz de Calasparra', 'Trufa Negra', 'Setas de temporada', 'Miel', 'Nueces', 'Caza menor', 'Dulces tradicionales']
  },
  {
    id: 3,
    name: 'Vega Alta del Segura',
    territory: 'Cieza, Abarán, Blanca',
    concept: 'La Huerta de Fruta Dulce',
    ingredients: ['Melocotón de Cieza', 'Albaricoque', 'Ciruela', 'Uva de mesa', 'Olivas de mesa', 'Almendras']
  },
  {
    id: 4,
    name: 'Valle de Ricote',
    territory: 'Ricote, Ojós, Archena',
    concept: 'Cítricos y Herencia Morisca',
    ingredients: ['Limón', 'Naranja', 'Dátiles', 'Granadas', 'Hierbas aromáticas', 'Aceite de oliva']
  },
  {
    id: 5,
    name: 'Vega Media del Segura',
    territory: 'Molina de Segura, Alguazas',
    concept: 'El Reino de la Hortaliza',
    ingredients: ['Pimiento de bola', 'Brócoli', 'Alcachofa', 'Coliflor', 'Apio', 'Conservas vegetales']
  },
  {
    id: 6,
    name: 'Huerta de Murcia',
    territory: 'Murcia Capital, Santomera',
    concept: 'Tapeo y Tradición Huertana',
    ingredients: ['Pimentón de Murcia', 'Ñora', 'Haba tierna', 'Guisantes', 'Calabacín', 'Berenjena', 'Tomate']
  },
  {
    id: 7,
    name: 'Valle del Guadalentín',
    territory: 'Lorca, Totana, Alhama',
    concept: 'Cerdo, Pimiento y Almendra',
    ingredients: ['Chato Murciano', 'Pimiento', 'Almendra', 'Embutidos de Lorca', 'Alcaparras', 'Tortada Lorquina']
  },
  {
    id: 8,
    name: 'Bajo Guadalentín',
    territory: 'Mazarrón, Águilas',
    concept: 'Gamba Roja y Tomate de Verano',
    ingredients: ['Gamba Roja de Águilas', 'Tomate de Mazarrón', 'Pescado de roca', 'Salazones', 'Ajos']
  },
  {
    id: 9,
    name: 'Campo de Cartagena',
    territory: 'Cartagena, Torre-Pacheco',
    concept: 'Melón y Sabores del Mundo',
    ingredients: ['Melón de Torre-Pacheco', 'Cordero', 'Conejo', 'Patata', 'Almendra', 'Café Asiático']
  },
  {
    id: 10,
    name: 'Mar Menor',
    territory: 'San Javier, San Pedro, Los Alcázares',
    concept: 'Sabores de la Laguna Salada',
    ingredients: ['Pescados del Mar Menor', 'Langostinos', 'Sal de las salinas', 'Arroz Caldero', 'Hueva', 'Mojama']
  }
];

export const INITIAL_MICRO_TASKS: MicroTask[] = [
    { 
      id: 1, 
      title: 'Mapeo de la Competencia', 
      description: 'Identificar qué otros restaurantes operan en la zona elegida y analizar su oferta.', 
      guidelines: [
        'Buscar al menos 5 establecimientos cercanos (radio de X km o mismo municipio).',
        'Clasificarlos por tipo (pizzería, tradicional, alta cocina, bar de tapas, etc.).',
        'Identificar si alguno destaca por oferta verde, ecológica o sostenible.'
      ],
      deliverable: 'Un mapa visual (p. ej. Google My Maps) o una lista con la ubicación y concepto de cada local.',
      deliverableHint: 'Imagen del mapa o lista de competidores.', 
      assignedToId: null, 
      content: '' 
    },
    { 
      id: 2, 
      title: 'Análisis de Cartas y Pruebas', 
      description: 'Estudiar a fondo la oferta gastronómica y precios de los 3 competidores más directos.', 
      guidelines: [
        'Revisar sus cartas digitales o físicas y anotar los platos estrella.',
        'Analizar el rango de precios (entrantes, principales, postres) para entender el ticket medio.',
        'Detectar huecos (¿faltan opciones vegetarianas?, ¿falta producto local?, ¿abuso de congelados?).'
      ],
      deliverable: 'Tabla comparativa con precios y conclusión sobre los huecos de mercado a aprovechar.',
      deliverableHint: 'Resumen de platos y precios medios.', 
      assignedToId: null, 
      content: '' 
    },
    { 
      id: 3, 
      title: 'Reseñas y Reputación Online', 
      description: 'Investigar qué opina la gente en internet sobre los restaurantes de la zona.', 
      guidelines: [
        'Entrar en Google Maps o TripAdvisor de los competidores analizados.',
        'Buscar palabras clave: calidad, precio, producto local, servicio, lento, caro.',
        'Identificar quejas comunes para evitarlas y elogios para replicarlos.'
      ],
      deliverable: 'Un breve informe con los SÍ (lo que el cliente premia) y los NO (lo que el cliente penaliza).',
      deliverableHint: 'Resumen de qué gusta y qué no.', 
      assignedToId: null, 
      content: '' 
    },
    { 
      id: 4, 
      title: 'Perfil del Cliente Local', 
      description: 'Dibujar el perfil de las personas que viven en esa zona de Murcia todo el año.', 
      guidelines: [
        'Perfil demográfico (familias, gente mayor, estudiantes, trabajadores).',
        'Costumbres gastronómicas (menú del día, tapeo fin de semana, salidas familiares).',
        'Sensibilidad ambiental vs búsqueda de cantidad/precio.'
      ],
      deliverable: 'Ficha de Cliente Ideal (Buyer Persona) que represente al habitante de la zona.',
      deliverableHint: 'Informe del perfil del residente.', 
      assignedToId: null, 
      content: '' 
    },
    { 
      id: 5, 
      title: 'Perfil del Turista / Visitante', 
      description: 'Analizar el flujo de personas de fuera que visitan la zona.', 
      guidelines: [
        'Temporalidad (verano, fin de semana, religioso, extranjero invierno).',
        'Expectativas (gastronomía típica, opciones internacionales, comida rápida).',
        'Disposición al gasto en comparación con el cliente local.'
      ],
      deliverable: 'Resumen de la estacionalidad del turismo y las demandas del visitante.',
      deliverableHint: 'Informe del perfil del visitante.', 
      assignedToId: null, 
      content: '' 
    },
    { 
      id: 6, 
      title: 'Catálogo de Producto', 
      description: 'Crear la despensa base del restaurante basada en la temporalidad de la Región de Murcia.', 
      guidelines: [
        'Investigar frutas, verduras y pescados de temporada en cada estación.',
        'Productos destacados: chato murciano, michirones, arroz Calasparra, pimentón, hortalizas de la huerta.',
        'Definir cómo condicionará el diseño de la carta según la época.'
      ],
      deliverable: 'Calendario de temporada de alimentos esenciales para el proyecto.',
      deliverableHint: 'Lista de 15-20 ingredientes por temporada.', 
      assignedToId: null, 
      content: '' 
    },
    { 
      id: 7, 
      title: 'Mapa de Proveedores Km0', 
      description: 'Localizar productores reales de la Región de Murcia a los que comprar directamente.', 
      guidelines: [
        'Cooperativas, cofradías de pescadores, bodegas (Jumilla, Bullas), queserías artesanales.',
        'Anotar distancia en km desde el productor hasta el restaurante (debe ser < 100km).',
        'Verificar capacidad de suministro y tipo de producto.'
      ],
      deliverable: 'Directorio de proveedores locales con datos de contacto y productos que suministran.',
      deliverableHint: 'Ficha de 3-5 proveedores reales.', 
      assignedToId: null, 
      content: '' 
    },
    { 
      id: 8, 
      title: 'Auditoría Sostenible', 
      description: 'Plantear las medidas ecológicas que el restaurante aplicará más allá de la comida.', 
      guidelines: [
        'Gestión de residuos (compostaje, reciclaje, evitar Food Waste).',
        'Ahorro de agua y energía (clave en región con escasez hídrica como Murcia).',
        'Materiales (reciclados, eliminación de plásticos, uniformes orgánicos).'
      ],
      deliverable: 'Listado de políticas sostenibles obligatorias para el funcionamiento del restaurante.',
      deliverableHint: 'Informe sobre sostenibilidad operativa.', 
      assignedToId: null, 
      content: '' 
    },
    { 
      id: 9, 
      title: 'Benchmarking Innovación', 
      description: 'Buscar inspiración en restaurantes sostenibles referentes para replicar buenas ideas.', 
      guidelines: [
        'Investigar restaurantes con proyectos de restauración circular.',
        'Analizar técnicas originales: aprovechamiento total, conservación ancestral, sin huella de carbono.',
        'Adaptar 3 ideas innovadoras detectadas al proyecto local.'
      ],
      deliverable: 'Documento con 3 ideas innovadoras adaptadas al proyecto.',
      deliverableHint: 'Informe de 2-3 referentes inspiradores.', 
      assignedToId: null, 
      content: '' 
    },
    { 
      id: 10, 
      title: 'Tendencias Visuales', 
      description: 'Definir la estética visual de la carta y el marketing del restaurante.', 
      guidelines: [
        'Colores y texturas (tonos tierra, verdes huerta, azules mar) y soportes (papel reciclado, digital).',
        'Estrategia de comunicación: contar la historia de productores locales en redes sociales.',
        'Boceto del estilo gráfico de la carta.'
      ],
      deliverable: 'Moodboard visual de inspiración y boceto del estilo de la carta.',
      deliverableHint: 'Moodboard o enlaces a referencias estéticas.', 
      assignedToId: null, 
      content: '' 
    },
];

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: 't1_team', label: 'Tarea 1.1: Equipo', status: 'not_started', category: 'group' },
  { id: 't1_zone', label: 'Tarea 1.2: Selección de Zona', status: 'not_started', category: 'group' },
  { id: 't2_research', label: 'Tarea 2: Análisis (Investigación)', status: 'not_started', category: 'individual' },
  { id: 't3_menu', label: 'Tarea 3: Diseño de Carta', status: 'not_started', category: 'group' },
  { id: 't4_prototype', label: 'Tarea 4: Prototipos', status: 'not_started', category: 'group' },
  { id: 'interim_memory', label: 'Tarea 5: Memoria Intermedia', status: 'not_started', category: 'group' },
  { id: 't5_financials', label: 'Tarea 6: Viabilidad Económica', status: 'not_started', category: 'group' },
  { id: 't6_final', label: 'Tarea 7: Producción Final', status: 'not_started', category: 'group' },
  { id: 'co_evaluation', label: 'Tarea 8: Coevaluación', status: 'not_started', category: 'individual' },
  { id: 'final_memory', label: 'Tarea 9: Memoria Final', status: 'not_started', category: 'group' },
];

export const ALLERGENS = [
    { id: 'gluten', name: 'Gluten', icon: '🌾' },
    { id: 'crustaceans', name: 'Crustáceos', icon: '🦀' },
    { id: 'eggs', name: 'Huevos', icon: '🥚' },
    { id: 'fish', name: 'Pescado', icon: '🐟' },
    { id: 'peanuts', name: 'Cacahuetes', icon: '🥜' },
    { id: 'soy', name: 'Soja', icon: '🌱' },
    { id: 'milk', name: 'Lácteos', icon: '🥛' },
    { id: 'nuts', name: 'Frutos de Cáscara', icon: '🌰' },
    { id: 'celery', name: 'Apio', icon: '🥬' },
    { id: 'mustard', name: 'Mostaza', icon: '🌭' },
    { id: 'sesame', name: 'Sésamo', icon: '🥯' },
    { id: 'sulphites', name: 'Sulfitos', icon: '🍷' },
    { id: 'lupin', name: 'Altramuces', icon: '🌼' },
    { id: 'molluscs', name: 'Moluscos', icon: '🐙' }
];

export const INITIAL_STATE: ProjectState = {
  currentUser: null,
  schoolName: 'C.I.F.P. de Hostelería y Turismo',
  schoolLogo: null,
  academicYear: '2025/26',
  teamName: '',
  groupPhoto: null,
  selectedZone: null,
  zoneJustification: '',
  task2: {
    tasks: INITIAL_MICRO_TASKS
  },
  concept: {
    name: '',
    slogan: '',
    targetAudience: '',
    values: [],
    restaurantLogo: null
  },
  missions: {
    explorer: { mapUrl: '', menuAnalysis: '', gapAnalysis: '' },
    connector: { targetAudience: '', surveyResults: '', idealCustomer: '' },
    guardian: { ingredients: '', supplierInfo: '', coreIngredients: '' }
  },
  dishes: [],
  menuPrototype: {
    generalStyle: '',
    digitalLink: '',
    physicalPhoto: null,
    physicalDescription: ''
  },
  task6: {
    designerIds: [],
    artisanIds: [],
    editorIds: []
  },
  team: [],
  isTeamClosed: false,
  seasonalProducts: [],
  coEvaluationPoints: 1,
  coEvaluations: [],
  interimReport: {
    summary: '',
    introduction: {
      context: '',
      objectives: '',
      scope: ''
    },
    analysis: {
      companies: {
        identification: '',
        economicAnalysis: '',
        selectionJustification: ''
      },
      products: {
        identification: '',
        targetAudience: '',
        differentiation: ''
      },
      ods: {
        identification: '',
        justification: ''
      },
      laborRisks: {
        identification: '',
        measures: ''
      },
      conclusions: {
        synthesis: '',
        proposals: ''
      }
    },
    development: {
      planning: '',
      methodology: '',
      resources: ''
    },
    results: '',
    conclusions: '',
    recommendations: '',
    bibliography: ''
  },
  checklist: INITIAL_CHECKLIST
};

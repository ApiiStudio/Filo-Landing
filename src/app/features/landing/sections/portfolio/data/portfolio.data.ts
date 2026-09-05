export interface PortfolioSection {
  title: string;
  eyebrow: string;
  paragraphs?: string[];
  items?: string[];
  image?: string;
}

export interface PortfolioProject {
  slug: string;
  number: string;
  name: string;
  category: string;
  year: string;

  heroImage: string;

  intro: string;

  services: string[];

  challenge: {
    title: string;
    description: string;
  };

  strategy: PortfolioSection;
  identity: PortfolioSection;
  graphicDesign: PortfolioSection;
  seo: PortfolioSection;
  results: {
    value: string;
    label: string;
  }[];

  gallery: string[];

  nextProject?: string;
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    slug: 'vandal-coffee',
    number: '01',
    name: 'Vandal Coffee',
    category: 'Branding / Packaging',
    year: '2026',

    heroImage: '/portfolio/vandal/hero.webp',

    intro:
      'Construimos una identidad que transforma el café en una experiencia de marca reconocible, provocadora y fácil de recordar.',

    services: [
      'Estrategia de marca',
      'Identidad visual',
      'Diseño gráfico',
      'Packaging',
      'Contenido digital',
      'SEO',
    ],

    challenge: {
      title: 'El desafío',
      description:
        'Vandal necesitaba diferenciarse dentro de una categoría saturada. El problema no era únicamente visual: necesitábamos construir una posición de marca capaz de competir por atención.',
    },

    strategy: {
      eyebrow: '01 — Marketing',
      title: 'Estrategia',
      paragraphs: [
        'Partimos de una pregunta simple: ¿por qué alguien debería elegir esta marca y no otra?',
        'La estrategia se construyó alrededor de una personalidad disruptiva, urbana y reconocible.',
        'Cada decisión visual debía reforzar esa posición.',
      ],
    },

    identity: {
      eyebrow: '02 — Identidad',
      title: 'Una identidad imposible de ignorar',
      paragraphs: [
        'Creamos un sistema visual flexible capaz de funcionar tanto en packaging como en redes sociales, campañas y espacios físicos.',
        'La identidad utiliza contraste, tipografía expresiva y una dirección de arte deliberadamente maximalista.',
      ],
    },

    graphicDesign: {
      eyebrow: '03 — Diseño gráfico',
      title: 'Diseñar para llamar la atención',
      paragraphs: [
        'El sistema gráfico fue diseñado para funcionar a diferentes escalas sin perder personalidad.',
      ],
    },

    seo: {
      eyebrow: '04 — SEO & Digital',
      title: 'La marca también tiene que encontrarse',
      paragraphs: [
        'La estrategia digital se construyó para conectar identidad, contenido y posicionamiento orgánico.',
        'La arquitectura de contenidos priorizó búsquedas relevantes para la categoría y una experiencia de navegación rápida.',
      ],
    },

    results: [
      {
        value: '+42%',
        label: 'interacción digital',
      },
      {
        value: '+31%',
        label: 'alcance orgánico',
      },
      {
        value: '2.4×',
        label: 'engagement',
      },
    ],

    gallery: [
      '/portfolio/vandal/detail-01.webp',
      '/portfolio/vandal/detail-02.webp',
      '/portfolio/vandal/detail-03.webp',
    ],

    nextProject: 'neon-records',
  },

  {
    slug: 'neon-records',
    number: '02',
    name: 'Neón Records',
    category: 'Diseño Gráfico / Social',
    year: '2026',

    heroImage: '/portfolio/neon/hero.webp',

    intro:
      'Una identidad digital construida para convertir cada lanzamiento en un evento visual.',

    services: [
      'Dirección de arte',
      'Identidad visual',
      'Diseño gráfico',
      'Social media',
      'Campañas',
      'Contenido',
    ],

    challenge: {
      title: 'El desafío',
      description:
        'Neón Records necesitaba construir una presencia digital reconocible en un entorno donde todas las marcas compiten por atención constantemente.',
    },

    strategy: {
      eyebrow: '01 — Marketing',
      title: 'Convertir lanzamientos en momentos',
      paragraphs: [
        'La estrategia dejó de pensar cada publicación como una pieza aislada.',
        'Construimos un sistema capaz de transformar cada lanzamiento en una campaña visual coherente.',
      ],
    },

    identity: {
      eyebrow: '02 — Identidad',
      title: 'Una identidad que suena visualmente',
      paragraphs: [
        'La identidad se construyó desde el lenguaje de la música: ritmo, contraste, repetición y ruptura.',
      ],
    },

    graphicDesign: {
      eyebrow: '03 — Diseño gráfico',
      title: 'Sistema gráfico',
      paragraphs: [
        'Creamos piezas modulares que podían adaptarse a diferentes formatos sin perder reconocimiento.',
      ],
    },

    seo: {
      eyebrow: '04 — SEO & Digital',
      title: 'Descubrimiento orgánico',
      paragraphs: [
        'La estrategia digital trabajó la arquitectura de contenidos y la optimización de páginas para mejorar el descubrimiento de los lanzamientos.',
      ],
    },

    results: [
      {
        value: '+68%',
        label: 'alcance',
      },
      {
        value: '+44%',
        label: 'interacciones',
      },
      {
        value: '3.1×',
        label: 'engagement',
      },
    ],

    gallery: [
      '/portfolio/neon/detail-01.webp',
      '/portfolio/neon/detail-02.webp',
      '/portfolio/neon/detail-03.webp',
    ],

    nextProject: 'distrito-skate',
  },
];
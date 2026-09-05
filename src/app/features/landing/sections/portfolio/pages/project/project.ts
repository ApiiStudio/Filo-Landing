import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ProjectData {
  slug: string;
  name: string;
  category: string;
  year: string;
  heroImage: string;
  intro: string;
  services: string[];
  number: string;
  challenge: {
    title: string;
    description: string;
  };
  strategy: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  identity: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  graphicDesign: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  seo: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  results: {
    value: string;
    label: string;
  }[];
  gallery: string[];
}

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project.html',
  styleUrl: './project.css',
})
export class Project implements OnInit, AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Importante:
  // ElementRef se inyecta sin genérico y después lo tipamos.
  private readonly host =
    inject(ElementRef) as ElementRef<HTMLElement>;

  project: ProjectData | null = null;

  private scrollTriggers: ScrollTrigger[] = [];

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    this.project = this.getProject(slug);

    if (!this.project) {
      this.router.navigate(['/']);
    }
  }

  ngAfterViewInit(): void {
    if (!this.project) {
      return;
    }

    requestAnimationFrame(() => {
      this.initAnimations();
    });
  }

  private getProject(slug: string | null): ProjectData | null {
    const projects: ProjectData[] = [
      {
        slug: 'vandal-coffee',
        name: 'Vandal Coffee',
        category: 'Branding / Packaging',
        year: '2026',
        number: '01',

        heroImage:
          '/portfolio/vandal/hero.webp',

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
      },
    ];

    return projects.find((project) => project.slug === slug) ?? null;
  }

  private initAnimations(): void {
    const root = this.host.nativeElement;

    const elements =
      root.querySelectorAll<HTMLElement>('[data-reveal]');

    elements.forEach((element: HTMLElement) => {
      gsap.set(element, {
        opacity: 0,
        y: 40,
      });

      const trigger = ScrollTrigger.create({
        trigger: element,
        start: 'top 88%',
        once: true,

        onEnter: () => {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          });
        },
      });

      this.scrollTriggers.push(trigger);
    });
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach((trigger) => {
      trigger.kill();
    });

    this.scrollTriggers = [];
  }
}
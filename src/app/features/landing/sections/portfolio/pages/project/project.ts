import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink, Scroll } from '@angular/router';
import { LucideAArrowUp, LucideArrowLeft, LucideArrowUpRight, LucideQuote } from '@lucide/angular';
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
  imports: [RouterLink, LucideArrowLeft, LucideArrowUpRight, LucideQuote],
  templateUrl: './project.html',
  styleUrl: './project.css',
})
export class Project implements OnInit, AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly logoUrl =
    '/filo-logo.png';

  // Importante:
  // ElementRef se inyecta sin genérico y después lo tipamos.
  private readonly host =
    inject(ElementRef) as ElementRef<HTMLElement>;

  project: ProjectData | null = null;

  private scrollTriggers: ScrollTrigger[] = [];
  private progressTrigger: ScrollTrigger | null = null;

  private readonly serviceAnchors: Record<string, string> = {
    'Estrategia de marca': 'estrategia',
    'Identidad visual': 'identidad',
    'Diseño gráfico': 'diseno',
    'Packaging': 'diseno',
    'Contenido digital': 'diseno',
    'SEO': 'seo',
  };

  goToService(service: string): void {
    const id = this.serviceAnchors[service];
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    this.project = this.getProject(slug);

    if (!this.project) {
      this.router.navigate(['/']);
    }

    window.scrollTo(0, 0);
  }

  ngAfterViewInit(): void {
    if (!this.project) {
      return;
    }

    requestAnimationFrame(() => {
      this.initAnimations();
      const bar = this.host.nativeElement.querySelector(
        '.scroll-progress-bar'
      ) as HTMLElement | null;

      if (bar) {
        this.progressTrigger = ScrollTrigger.create({
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            gsap.set(bar, { scaleX: self.progress });
          },
        });
      }
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

    const elements = root.querySelectorAll<HTMLElement>('[data-reveal]');

    elements.forEach((element: HTMLElement) => {
      gsap.set(element, { opacity: 0, y: 40 });

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
    this.animateResultCounters();
  }

  private animateResultCounters(): void {
    const root = this.host.nativeElement;
    const valueEls = Array.from(
      root.querySelectorAll<HTMLElement>('.result-value')
    );

    valueEls.forEach((el, i) => {
      const raw = this.project?.results[i]?.value ?? '';
      if (!raw) return;

      const match = raw.match(/^([^\d]*)([\d.,]+)(.*)$/);
      if (!match) return;

      const [, prefix, numStr, suffix] = match;
      const hasDecimal = numStr.includes('.') || numStr.includes(',');
      const target = parseFloat(numStr.replace(',', '.'));

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          const counter = { value: 0 };
          gsap.to(counter, {
            value: target,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: () => {
              const current = hasDecimal
                ? counter.value.toFixed(1)
                : Math.round(counter.value).toString();
              el.textContent = prefix + current + suffix;
            },
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
    this.progressTrigger?.kill();
  }
}
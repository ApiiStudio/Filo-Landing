import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { MaskedLineComponent } from '../../../../shared/masked-line/masked-line';
import { LucideArrowUpRight } from '@lucide/angular';

interface Service {
  num: string;
  title: string;
  desc: string;
  tags: string[];
  testId: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [MaskedLineComponent, LucideArrowUpRight],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements AfterViewInit, OnDestroy {
  readonly services: Service[] = [
    {
      num: '01',
      title: 'Gestión Integral de Comunicación',
      desc: 'Estrategia de contenidos, producción, diseño, edición, publicación, community y análisis.',
      tags: ['Estrategia', 'Social Media', 'SEO / SEM', 'Ads'],
      testId: 'service-marketing',
    },
    {
      num: '02',
      title: 'Estrategia & Consultoría',
      desc: 'Disección de marca, posicionamiento, comunicación, auditorías, planes estratégicos y acompañamiento.',
      tags: ['Branding', 'Identidad', 'Editorial', 'Packaging'],
      testId: 'service-estrategia',
    },
    {
      num: '03',
      title: 'Identidad & Diseño',
      desc: 'Branding, sistemas visuales, diseño gráfico, piezas digitales y aplicaciones de marca.',
      tags: ['Webs', 'E-commerce', 'UX/UI', 'Motion'],
      testId: 'service-diseno',
    },
    {
      num: '04',
      title: 'Paid Media',
      desc: 'Planificación de campañas, Meta Ads/Google Ads, segmentación, testing, optimización y reporting.',
      tags: ['Paid Media'],
      testId: 'paid-media'
    },
    {
      num: '05',
      title: 'Diseño & Desarrollo Web',
      desc: 'Landing pages, webs insitucionales y experiencias digitales alineadas con la identidad.',
      tags: ['Webs', 'E-commerce', 'UX/UI'],
      testId: 'service-web'
    }
  ];
  private platformId = inject(PLATFORM_ID);
  private host: ElementRef<HTMLElement> = inject(ElementRef);
  private trigger: ScrollTrigger | null = null;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const articles = Array.from(
      this.host.nativeElement.querySelectorAll<HTMLElement>('.service-row')
    );
    if (!articles.length) return;

    gsap.set(articles, { opacity: 0, y: 60 });

    this.trigger = ScrollTrigger.create({
      trigger: this.host.nativeElement,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(articles, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power4.out',
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.trigger?.kill();
  }
}

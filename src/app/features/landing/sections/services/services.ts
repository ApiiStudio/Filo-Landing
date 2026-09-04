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
      title: 'Marketing',
      desc: 'Estrategia digital, redes sociales, SEO y paid media. Convertimos atención en resultados medibles.',
      tags: ['Estrategia', 'Social Media', 'SEO / SEM', 'Ads'],
      testId: 'service-marketing',
    },
    {
      num: '02',
      title: 'Diseño Gráfico',
      desc: 'Identidades visuales con carácter. Branding, editorial y piezas que gritan sin pedir permiso.',
      tags: ['Branding', 'Identidad', 'Editorial', 'Packaging'],
      testId: 'service-diseno',
    },
    {
      num: '03',
      title: 'Desarrollo Web',
      desc: 'Sitios y e-commerce rápidos, accesibles y con movimiento. Código limpio, experiencias salvajes.',
      tags: ['Webs', 'E-commerce', 'UX/UI', 'Motion'],
      testId: 'service-web',
    },
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

import { AfterViewInit, Component, ElementRef, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LucideArrowUpRight, LucidePlus } from '@lucide/angular';
import { MaskedLineComponent } from '../../../../shared/masked-line/masked-line';
import { SmoothScrollService } from '../../../../core/smooth-scroll';

interface Pillar {
  num: string;
  title: string;
  desc: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [MaskedLineComponent, LucideArrowUpRight, LucidePlus],
  templateUrl: './services.html',
})
export class Services implements AfterViewInit, OnDestroy {
  readonly problems = [
    'Conocés el valor de tu producto y terminás compitiendo por precio.',
    'Estás improvisando con tu comunicación y no hay una idea que conecte todo.',
    'Querés atraer otro perfil de cliente, expandirte o hacer que tu presencia digital refleje mejor lo que ofrecés.',
  ];

  readonly pillars: Pillar[] = [
    {
      num: '01',
      title: 'Una posición propia.',
      desc: 'Definimos a quién hablarle, qué te hace diferente y por qué elegirte.',
    },
    {
      num: '02',
      title: 'Un universo que lo expresa.',
      desc: 'Le damos concepto, identidad, voz y una dirección visual. Creamos o renovamos tu identidad gráfica si el proyecto lo necesita.',
    },
    {
      num: '03',
      title: 'Un equipo con dirección.',
      desc: 'Bajamos la marca a aplicaciones concretas y guiamos las primeras ejecuciones con vos o tu equipo.',
    },
  ];

  open = signal<number | null>(null);

  private platformId = inject(PLATFORM_ID);
  private host = inject(ElementRef) as ElementRef<HTMLElement>;
  private smoothScroll = inject(SmoothScrollService);
  private triggers: ScrollTrigger[] = [];

  private get canHover(): boolean {
    return isPlatformBrowser(this.platformId) && window.matchMedia('(hover: hover)').matches;
  }

  // Desktop: abre con hover. Mobile/touch: abre con tap.
  hoverIn(i: number): void {
    if (this.canHover) this.open.set(i);
  }
  hoverOut(): void {
    if (this.canHover) this.open.set(null);
  }
  toggle(i: number): void {
    if (this.canHover) return;
    this.open.set(this.open() === i ? null : i);
  }

  goToContact(event: Event): void {
    event.preventDefault();
    this.smoothScroll.scrollTo('#contacto', { duration: 1.4 });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const items = Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('[data-reveal]'));
    items.forEach((el) => {
      gsap.set(el, { opacity: 0, y: 40 });
      this.triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }),
        }),
      );
    });
  }

  ngOnDestroy(): void {
    this.triggers.forEach((t) => t.kill());
  }
}
import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SmoothScrollService } from '../../../../core/smooth-scroll';
import { LucideArrowUpRight } from '@lucide/angular';

interface Project {
  name: string;
  tags: string;
  img: string;
  span: string;
  ratio: string;
  testId: string;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [LucideArrowUpRight],
  templateUrl: './portfolio.html',
})
export class Portfolio implements AfterViewInit, OnDestroy {
  readonly projects: Project[] = [
    {
      name: 'Vandal Coffee',
      tags: 'Branding / Packaging',
      img: 'https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFnZW5jeSUyMHBvcnRmb2xpbyUyMG1vZGVybnxlbnwwfHx8fDE3ODYxMTY1Nzd8MA&ixlib=rb-4.1.0&q=85',
      span: 'md:col-span-7',
      ratio: 'aspect-[4/3]',
      testId: 'project-vandal',
    },
    {
      name: 'Neón Records',
      tags: 'Diseño Gráfico / Social',
      img: 'https://images.unsplash.com/photo-1695634364857-cbbb46c47b59?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHw0fHxjcmVhdGl2ZSUyMGFnZW5jeSUyMHBvcnRmb2xpbyUyMG1vZGVybnxlbnwwfHx8fDE3ODYxMTY1Nzd8MA&ixlib=rb-4.1.0&q=85',
      span: 'md:col-span-5',
      ratio: 'aspect-[4/3] md:aspect-auto md:h-full',
      testId: 'project-neon',
    },
    {
      name: 'Distrito Skate',
      tags: 'E-commerce / Web',
      img: 'https://images.unsplash.com/photo-1490013616775-3ca8865fb129?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwyfHxjcmVhdGl2ZSUyMGFnZW5jeSUyMHBvcnRmb2xpbyUyMG1vZGVybnxlbnwwfHx8fDE3ODYxMTY1Nzd8MA&ixlib=rb-4.1.0&q=85',
      span: 'md:col-span-5',
      ratio: 'aspect-[4/3] md:aspect-auto md:h-full',
      testId: 'project-distrito',
    },
    {
      name: 'Acid Studio',
      tags: 'Campaña 360 / Marketing',
      img: 'https://images.pexels.com/photos/17029155/pexels-photo-17029155.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      span: 'md:col-span-7',
      ratio: 'aspect-[4/3]',
      testId: 'project-acid',
    },
  ];

  private platformId = inject(PLATFORM_ID);
  private host: ElementRef<HTMLElement> = inject(ElementRef);
  private smoothScroll = inject(SmoothScrollService);
  private trigger: ScrollTrigger | null = null;
  private cleanupFns: Array<() => void> = [];

  goToContact(event: Event): void {
    event.preventDefault();
    this.smoothScroll.scrollTo('#contacto', { duration: 1.4 });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const cards = Array.from(
      this.host.nativeElement.querySelectorAll<HTMLElement>('.project-card')
    );
    if (!cards.length) return;

    // Reveal on scroll con stagger alternado (i % 2), igual que el original
    gsap.set(cards, { opacity: 0, y: 80 });
    this.trigger = ScrollTrigger.create({
      trigger: this.host.nativeElement,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        cards.forEach((card, i) => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: (i % 2) * 0.15,
            ease: 'power4.out',
          });
        });
      },
    });

    // Tilt 3D siguiendo el mouse (solo desktop)
    if (window.matchMedia('(min-width: 768px)').matches) {
      cards.forEach((card) => this.setupTilt(card));
    }
  }

  private setupTilt(card: HTMLElement): void {
    const rotateXTo = gsap.quickTo(card, 'rotateX', {
      duration: 0.5,
      ease: 'power3.out',
    });
    const rotateYTo = gsap.quickTo(card, 'rotateY', {
      duration: 0.5,
      ease: 'power3.out',
    });

    gsap.set(card, {
      transformPerspective: 800,
      transformStyle: 'preserve-3d',
    });

    // Cacheamos el rect una sola vez al entrar (no en cada mousemove),
    // así evitamos forzar reflow del layout en cada frame.
    let rect = card.getBoundingClientRect();

    const onEnter = () => {
      rect = card.getBoundingClientRect();
    };

    const onMove = (e: MouseEvent) => {
      const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 a 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rotateYTo(px * 8);
      rotateXTo(py * -8);
    };

    const onLeave = () => {
      rotateXTo(0);
      rotateYTo(0);
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);

    this.cleanupFns.push(() => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    });
  }

  ngOnDestroy(): void {
    this.trigger?.kill();
    this.cleanupFns.forEach((fn) => fn());
  }
}
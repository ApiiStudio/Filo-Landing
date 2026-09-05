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
import { RouterLink } from '@angular/router';

interface Project {
  slug: string;
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
  imports: [LucideArrowUpRight, RouterLink],
  templateUrl: './portfolio.html',
})
export class Portfolio implements AfterViewInit, OnDestroy {
  readonly projects: Project[] = [
    {
      slug: 'Vandal Coffe',
      name: 'Vandal Coffee',
      tags: 'Branding / Packaging',
      img: '/portfolio/ImageToStl.com_photo-1534670007418-fbb7f6cf32c3.avif',
      span: 'md:col-span-7',
      ratio: 'aspect-[4/3]',
      testId: 'project-vandal',
    },
    {
      slug: 'Neón Records',
      name: 'Neón Records',
      tags: 'Diseño Gráfico / Social',
      img: '/portfolio/fx4q1-4noxh.avif',
      span: 'md:col-span-5',
      ratio: 'aspect-[4/3] md:aspect-auto md:h-full',
      testId: 'project-neon',
    },
    {
      slug: 'Distrito Skate',
      name: 'Distrito Skate',
      tags: 'E-commerce / Web',
      img: '/portfolio/ImageToStl.com_photo-1490013616775-3ca8865fb129.avif',
      span: 'md:col-span-5',
      ratio: 'aspect-[4/3] md:aspect-auto md:h-full',
      testId: 'project-distrito',
    },
    {
      slug: 'Acid Studio',
      name: 'Acid Studio',
      tags: 'Campaña 360 / Marketing',
      img: '/portfolio/pexels-photo-17029155.avif',
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
  private readonly reducedMotion = isPlatformBrowser(this.platformId)
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    if (this.reducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }

    // Use one tween for the whole collection to reduce ScrollTrigger work.
    gsap.set(cards, { opacity: 0, y: 60 });
    this.trigger = ScrollTrigger.create({
      trigger: this.host.nativeElement,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
        });
      },
    });

    // Tilt only on devices with a fine pointer; touch devices avoid this work.
    if (window.matchMedia('(min-width: 768px) and (pointer: fine)').matches) {
      cards.forEach((card) => this.setupTilt(card));
    }
  }

  private setupTilt(card: HTMLElement): void {
    const rotateXTo = gsap.quickTo(card, 'rotateX', {
      duration: 0.35,
      ease: 'power3.out',
    });
    const rotateYTo = gsap.quickTo(card, 'rotateY', {
      duration: 0.35,
      ease: 'power3.out',
    });
    
    // Cacheamos el rect una sola vez al entrar (no en cada mousemove),
    // así evitamos forzar reflow del layout en cada frame.
    let rect = card.getBoundingClientRect();
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const onEnter = () => {
      rect = card.getBoundingClientRect();
    };

    const onMove = (e: MouseEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (frame) return;

      frame = requestAnimationFrame(() => {
        frame = 0;
        const px = (pointerX - rect.left) / rect.width - 0.5;
        const py = (pointerY - rect.top) / rect.height - 0.5;
        rotateYTo(px * 6);
        rotateXTo(py * -6);
      });
    };

    const onLeave = () => {
      rotateXTo(0);
      rotateYTo(0);
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);

    this.cleanupFns.push(() => {
      if (frame) cancelAnimationFrame(frame);
      gsap.killTweensOf(card);
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
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
import { MaskedLineComponent } from '../../../../shared/masked-line/masked-line';
import { LucideArrowDown } from '@lucide/angular'

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [MaskedLineComponent, LucideArrowDown],
  templateUrl: './hero.html',
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private host: ElementRef<HTMLElement> = inject(ElementRef);
  private smoothScroll = inject(SmoothScrollService);

  private parallaxTrigger: ScrollTrigger | null = null;
  private mediaQuery: MediaQueryList | null = null;
  private moveXTo: ((value: number) => void) | null = null;
  private moveYTo: ((value: number) => void) | null = null;
  private onMouseMove = (e: MouseEvent) => this.handleMouseMove(e);

  goToServices(event: Event): void {
    event.preventDefault();
    this.smoothScroll.scrollTo('#servicios', { duration: 1.4 });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const el = this.host.nativeElement;
    const glow = el.querySelector('.hero-mouse-glow') as HTMLElement | null;
    const blob = el.querySelector('.hero-parallax-blob') as HTMLElement | null;
    const splatterTop = el.querySelector(
      '.hero-splatter-top'
    ) as HTMLElement | null;
    const splatterBottom = el.querySelector(
      '.hero-splatter-bottom'
    ) as HTMLElement | null;

    // --- Entrada escalonada (reemplaza las motion.* del original) ---
    gsap.set(['.hero-eyebrow', '.hero-subcopy', '.hero-cta'], {
      opacity: 0,
    });
    gsap.set('.hero-eyebrow', { x: -30 });
    gsap.set(['.hero-subcopy', '.hero-cta'], { y: 24 });

    const tl = gsap.timeline();
    tl.to('.hero-eyebrow', {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power2.out',
    })
      .to(
        '.hero-subcopy',
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        0.9
      )
      .to(
        '.hero-cta',
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        1.05
      );

    // --- Parallax al hacer scroll (blob de fondo + splatters) ---
    if (blob || splatterTop || splatterBottom) {
      const parallaxTl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=900',
          scrub: true,
        },
      });
      if (blob) parallaxTl.to(blob, { y: 220, ease: 'none' }, 0);
      if (splatterTop)
        parallaxTl.to(
          splatterTop,
          { y: -140, rotate: 45, ease: 'none' },
          0
        );
      if (splatterBottom)
        parallaxTl.to(splatterBottom, { y: -140, ease: 'none' }, 0);
      this.parallaxTrigger = parallaxTl.scrollTrigger ?? null;
    }

    // --- Gradiente que sigue al mouse (solo desktop) ---
    if (glow) {
      this.mediaQuery = window.matchMedia('(min-width: 768px)');
      this.setupGlow(glow);
    }
  }

  private setupGlow(glow: HTMLElement): void {
    const isDesktop = this.mediaQuery?.matches ?? false;

    if (!isDesktop) {
      // Mobile: fijo y centrado, sin seguir al mouse
      gsap.set(glow, { xPercent: -50, yPercent: -50, left: '50%', top: '40%' });
      this.host.nativeElement.removeEventListener(
        'mousemove',
        this.onMouseMove
      );
      return;
    }

    gsap.set(glow, { xPercent: -50, yPercent: -50 });
    this.moveXTo = gsap.quickTo(glow, 'left', {
      duration: 0.7,
      ease: 'power3.out',
    });
    this.moveYTo = gsap.quickTo(glow, 'top', {
      duration: 0.7,
      ease: 'power3.out',
    });

    this.host.nativeElement.addEventListener('mousemove', this.onMouseMove);

    // Posición inicial: centro de la sección
    const rect = this.host.nativeElement.getBoundingClientRect();
    this.moveXTo(rect.width / 2);
    this.moveYTo(rect.height / 2);
  }

  private handleMouseMove(e: MouseEvent): void {
    const rect = this.host.nativeElement.getBoundingClientRect();
    this.moveXTo?.(e.clientX - rect.left);
    this.moveYTo?.(e.clientY - rect.top);
  }

  ngOnDestroy(): void {
    this.parallaxTrigger?.kill();
    this.host.nativeElement.removeEventListener(
      'mousemove',
      this.onMouseMove
    );
  }
}
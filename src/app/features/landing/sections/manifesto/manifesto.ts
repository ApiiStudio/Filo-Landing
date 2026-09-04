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
import { MaskedLineComponent } from '../../../../shared/masked-line/masked-line';

interface Stat {
  value: string;
  label: string;
  testId: string;
}

@Component({
  selector: 'app-manifesto',
  standalone: true,
  imports: [MaskedLineComponent,],
  templateUrl: './manifesto.html',
})
export class Manifesto implements AfterViewInit, OnDestroy {
  readonly stats: Stat[] = [
    { value: '+120', label: 'Proyectos lanzados', testId: 'stat-proyectos' },
    { value: '08', label: 'Años de ruido', testId: 'stat-anos' },
    { value: '15', label: 'Premios creativos', testId: 'stat-premios' },
    { value: '04', label: 'Locos por el diseño', testId: 'stat-equipo' },
  ];

  private platformId = inject(PLATFORM_ID);
  private host: ElementRef<HTMLElement> = inject(ElementRef);
  private copyTrigger: ScrollTrigger | null = null;
  private statsTrigger: ScrollTrigger | null = null;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const el = this.host.nativeElement;
    const copy = el.querySelector('.manifesto-copy') as HTMLElement | null;
    const statCards = Array.from(
      el.querySelectorAll<HTMLElement>('.manifesto-stat')
    );

    if (copy) {
      gsap.set(copy, { opacity: 0, y: 30 });
      this.copyTrigger = ScrollTrigger.create({
        trigger: copy,
        start: 'top 85%',
        once: true,
        onEnter: () =>
          gsap.to(copy, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.2,
            ease: 'power3.out',
          }),
      });
    }

    if (statCards.length) {
      gsap.set(statCards, { opacity: 0, y: 40 });
      this.statsTrigger = ScrollTrigger.create({
        trigger: statCards[0],
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(statCards, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
          });
          this.animateCounters(statCards);
        },
      });
    }
  }

  /**
   * Anima cada número de 0 hasta su valor final, preservando
   * el prefijo (+) y el padding de ceros (ej. "08", "+120").
   */
  private animateCounters(statCards: HTMLElement[]): void {
    statCards.forEach((card, i) => {
      const valueEl = card.querySelector<HTMLElement>('.stat-value');
      const raw = this.stats[i]?.value ?? '';
      if (!valueEl || !raw) return;

      const prefix = raw.match(/^\D*/)?.[0] ?? '';
      const digits = raw.replace(/^\D*/, '');
      const target = parseInt(digits, 10) || 0;
      const padLength = digits.length;

      const counter = { value: 0 };
      gsap.to(counter, {
        value: target,
        duration: 1.6,
        delay: i * 0.1 + 0.15,
        ease: 'power2.out',
        onUpdate: () => {
          const current = Math.round(counter.value)
            .toString()
            .padStart(padLength, '0');
          valueEl.textContent = prefix + current;
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.copyTrigger?.kill();
    this.statsTrigger?.kill();
  }
}


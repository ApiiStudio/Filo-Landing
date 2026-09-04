import { AfterViewInit, Component, ElementRef, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { SmoothScrollService } from '../../../../core/smooth-scroll';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap/gsap-core';
import { LucideAsterisk } from '@lucide/angular';

interface MarqueeRow {
  reverse: boolean;
  rowClass: string;
  itemClass: string;
  iconClass: string;
  wrapperClass: string;
  baseDuration: number;
}

@Component({
  selector: 'app-marquee',
  standalone: true,
  imports: [LucideAsterisk],
  templateUrl: './marquee.html',
  styleUrl: './marquee.css',
})
export class Marquee implements AfterViewInit, OnDestroy{
  readonly items = ['Marketing', 'Diseño Gráfico', 'Desarrollo Web', 'Branding'];

  readonly loopItems = [...this.items, ...this.items];

  readonly rows: MarqueeRow[] = [
    {
      reverse: false,
      wrapperClass: '-rotate-2',
      rowClass: 'border-y-4 border-black bg-[#C6FF00] py-3 md:py4',
      itemClass: 'font-display text-3xl font-extrabold uppercase tracking-tight text-black md:text-6xl',
      iconClass: 'h-8 w-8 text-black md:h-12 md:w-12',
      baseDuration: 28,
    },
    {
      reverse: true,
      wrapperClass: '-mt-6 rotate-1 md:-mt-8',
      rowClass: 'border-y border-white/20 bg-black py-3 md:py-4',
      itemClass: 'font-display text-3xl font-extrabold uppercase tracking-tight text-stroke-white md:text-6xl',
      iconClass: 'h-8 w-8 text-[#C6FF00] md:h-12 md:w-12',
      baseDuration: 36,
    },
  ];

  private platformId = inject(PLATFORM_ID);
  private host: ElementRef<HTMLElement> = inject(ElementRef);
  private smoothScroll = inject(SmoothScrollService);
  private tickerFn: (() => void) | null = null;
  private timelines: gsap.core.Timeline[] = [];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const trackEls = Array.from(
      this.host.nativeElement.querySelectorAll<HTMLElement>('.marquee-track')
    );

    trackEls.forEach((track, i) => {
      const row = this.rows[i];
      if (!row) return;

      const tl = gsap.timeline({ repeat: -1 });
      tl.fromTo(
        track,
        { xPercent: row.reverse ? -50 : 0 },
        { xPercent: row.reverse ? 0 : -50, duration: row.baseDuration, ease: 'none', }
      );
      this.timelines.push(tl);
    });

    this.tickerFn = () => {
      const velocity = Math.abs(this.smoothScroll.velocity);

      const targetScale = gsap.utils.clamp(0.4, 4, 1 + velocity * 0.08);
      this.timelines.forEach((tl) => {
        tl.timeScale(gsap.utils.interpolate(tl.timeScale(), targetScale, 0.08));
      });
    };
    gsap.ticker.add(this.tickerFn);
  }

  ngOnDestroy(): void {
    if (this.tickerFn) gsap.ticker.remove(this.tickerFn);
    this.timelines.forEach((tl) => tl.kill());
  }
}

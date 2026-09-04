import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { LucideQuote } from '@lucide/angular';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  img: string;
  testId: string;
}

@Component({
  selector: 'app-testimonials',
  imports: [ LucideQuote],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
})
export class Testimonials implements AfterViewInit, OnDestroy {
  readonly testimonials: Testimonial[] = [
    {
      quote:
        'Filo convirtió una marca tibia en algo que la gente comparte sin que se lo pidamos. El rebranding se pagó solo en tres meses.',
      name: 'Martina Ríos',
      role: 'CEO — Vandal Coffee',
      img: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzV8MHwxfHNlYXJjaHwxfHx0ZXN0aW1vbmlhbCUyMHBvcnRyYWl0JTIwZXhwcmVzc2l2ZXxlbnwwfHx8fDE3ODYxMTY1Nzd8MA&ixlib=rb-4.1.0&q=85',
      testId: 'testimonial-martina',
    },
    {
      quote:
        'Nuestra tienda online duplicó conversión. Diseño con personalidad y código que vuela. No se puede pedir más.',
      name: 'Diego Ferrer',
      role: 'Founder — Distrito Skate',
      img: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFnZW5jeSUyMHRlYW0lMjBwZW9wbGV8ZW58MHx8fHwxNzg2MTE2NTc3fDA&ixlib=rb-4.1.0&q=85',
      testId: 'testimonial-diego',
    },
  ];

  private platformId = inject(PLATFORM_ID);
  private host: ElementRef<HTMLElement> = inject(ElementRef);
  private trigger: ScrollTrigger | null = null;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const cards = Array.from(
      this.host.nativeElement.querySelectorAll<HTMLElement>('.testimonial-card')
    );
    if (!cards.length) return;

    gsap.set(cards, { opacity: 0, y: 60 });
    this.trigger = ScrollTrigger.create({
      trigger: this.host.nativeElement,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power4.out',
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.trigger?.kill();
  }
}

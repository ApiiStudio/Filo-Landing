import { Component, ElementRef, AfterViewInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { SmoothScrollService } from '../../../../core/smooth-scroll';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap/gsap-core';
import { ScrollTrigger } from 'gsap/all';

interface NavLink {
  label: string,
  href: string,
  testId: string,
}

@Component({
  selector: 'app-nav',
  imports: [],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  readonly logoUrl = '/filo-logo.png';

  readonly links: NavLink[] = [
    { label: 'Servicios', href:'#servicios', testId:'nav-link-servicios'},
    { label: 'Portafolio', href: '#portfolio', testId: 'nav-link-portfolio'},
    { label: 'Nosotros', href: '#nosotros', testId: 'nav-link-nosotros'},
    { label:  'Contacto', href: '#contacto', testId: 'nav-link-contacto'},
  ];

  private platformId = inject(PLATFORM_ID);
  private host: ElementRef<HTMLElement> = inject(ElementRef);
  private smoothScroll = inject(SmoothScrollService);
  private progressTrigger: ScrollTrigger | null = null;

  go(event: Event, href: string): void{
    event?.preventDefault();
    this.smoothScroll.scrollTo(href, { offset: 0, duration: 1.4 });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const bar = this.host.nativeElement.querySelector(
      '.scroll-progress-bar'
    ) as HTMLElement | null;
    if (!bar) return;

    this.progressTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        gsap.set(bar, {scaleX: self.progress});
      },
    });
  }

  ngOndestroy(): void {
    this.progressTrigger?.kill
  }
}

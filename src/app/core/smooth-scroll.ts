import { Injectable, OnDestroy, PLATFORM_ID, inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

@Injectable({ providedIn: 'root' })
export class SmoothScrollService implements OnDestroy {
    private platformId = inject(PLATFORM_ID);
    private lenis:  Lenis | null = null;
    private rafId: number | null = null;

    init(): void {
        if (!isPlatformBrowser(this.platformId) || this.lenis) return;

        gsap.registerPlugin(ScrollTrigger);

        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) =>  Math.min(1, 1.001 - Math.pow(2, -10*t)),
            smoothWheel: true,
        });

        this.lenis.on('scroll', ScrollTrigger.update);

        const raf = (time: number) => {
            this.lenis?.raf(time);
            this.rafId = requestAnimationFrame(raf);
        };
        this.rafId = requestAnimationFrame(raf);

        ScrollTrigger.scrollerProxy(document.body, {
            scrollTop: (value?: number) => {
                if (value !== undefined) {
                    this.lenis?.scrollTo(value, { immediate: true });
                }
                return this.lenis?.scroll ?? 0;
            },
            getBoundingClientRect: () => ({
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
            }),
        });

        ScrollTrigger.addEventListener('refresh', () => this.lenis?.resize());
        ScrollTrigger.refresh();
    }
    
    get velocity(): number {
        return (this.lenis as any)?.velocity ?? 0;
    }

    scrollTo(target: string | number, options?: Record<string, unknown>): void{
        this.lenis?.scrollTo(target, options as any);
    }

    ngOnDestroy(): void {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.lenis?.destroy();
    }
}
import {
    Component,
    ElementRef,
    Input,
    AfterViewInit,
    OnDestroy,
    PLATFORM_ID,
    inject,
    ViewEncapsulation,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
    selector: 'app-masked-line',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    template: `
    <span class="masked-line-wrap block overflow-hidden">
      <span class="masked-line-inner block will-change-transform">
        <ng-content></ng-content>
      </span>
    </span>
  `,
})
export class MaskedLineComponent implements AfterViewInit, OnDestroy {
    @Input() delay = 0;
    @Input() onLoad = false;

    private platformId = inject(PLATFORM_ID);
    private host: ElementRef<HTMLElement> = inject(ElementRef);
    private trigger: ScrollTrigger | null = null;

    ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        const inner = this.host.nativeElement.querySelector(
            '.masked-line-inner'
        ) as HTMLElement | null;
        if (!inner) return;

        gsap.set(inner, { yPercent: 110 });

        const runAnimation = () =>
            gsap.to(inner, {
                yPercent: 0,
                duration: 0.9,
                delay: this.delay,
                ease: 'power4.out',
            });

        if (this.onLoad) {
            runAnimation();
        } else {
            this.trigger = ScrollTrigger.create({
                trigger: this.host.nativeElement,
                start: 'top 95%',
                end: 'bottom 5%',
                once: true,
                onEnter: runAnimation,
            });
        }
    }

    ngOnDestroy(): void {
        this.trigger?.kill();
    }
}
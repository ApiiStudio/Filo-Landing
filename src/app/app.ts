import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SmoothScrollService } from './core/smooth-scroll';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
  <div class="noise-overlay"></div>
  <router-outlet></router-outlet>`, 
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  private smoothScroll = inject(SmoothScrollService);

  ngAfterViewInit(): void {
    this.smoothScroll.init();
  }
}

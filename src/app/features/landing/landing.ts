import { Component } from "@angular/core";
import { Nav } from "./sections/nav/nav";
import { HeroComponent } from "./sections/hero/hero";
import { Marquee } from "./sections/marquee/marquee";
import { Services } from "./sections/services/services";
import { Portfolio } from "./sections/portfolio/portfolio";
import { Manifesto } from "./sections/manifesto/manifesto";
import { Testimonials } from "./sections/testimonials/testimonials";
import { Contact } from "./sections/contact/contact";

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [Nav, HeroComponent, Marquee, Services, Portfolio, Manifesto, Testimonials, Contact],
    templateUrl: './landing.html',
})
export class Landing {}
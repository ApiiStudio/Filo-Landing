import { AfterViewInit, Component, ElementRef, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaskedLineComponent } from '../../../../shared/masked-line/masked-line';
import { email } from '@angular/forms/signals';
import { isPlatformBrowser } from '@angular/common';
import { LucideArrowUpRight } from '@lucide/angular';

interface Social {
  label: string;
  testId: string;
}

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, MaskedLineComponent, LucideArrowUpRight],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements AfterViewInit, OnDestroy{
  readonly logoUrl =     'https://customer-assets-rejwkqb3.emergentagent.net/job_7bf59ddd-3f9a-463f-9a53-907b85c5ce83/artifacts/ay1lzhtr_Filo%20Logo.png';

readonly socials = [
  { label: 'Instagram', testId: 'social-instagram' },
  { label: 'LinkedIn', testId: 'social-linkedin' },
];
  
  readonly projectTypes = [
    'Marketing',
    'Diseño Gráfico',
    'Desarrollo Web',
    'Proyecto Integral',
  ];

  private fb = inject(FormBuilder);
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    projectType: ['', Validators.required],
    message: ['', Validators.required, Validators.minLength(10)],
  });

  submitted = false;
  sending = false;

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.sending = true;

    setTimeout(() => {
      this.sending = false;
      this.submitted = true;
      this.form.reset();
    }, 900);
  }

  get f() {
    return this.form.controls
  }

  private platformId = inject(PLATFORM_ID);
  private host: ElementRef<HTMLElement> = inject(ElementRef);
  private trigger: ScrollTrigger | null = null;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const formEl = this.host.nativeElement.querySelector(
      '.contact-form'
    ) as HTMLElement | null;
    if (!formEl) return;

    gsap.set(formEl, { opacity: 0, y: 30 });
    this.trigger = ScrollTrigger.create({
      trigger: formEl,
      start: 'top 90%',
      once: true,
      onEnter: () => 
        gsap.to(formEl, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.15,
          ease: 'power3.out',
        }),
    });
  }

  ngOnDestroy(): void {
    this.trigger?.kill();
  }
}

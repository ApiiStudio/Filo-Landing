import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Manifesto } from './manifesto';

describe('Manifesto', () => {
  let component: Manifesto;
  let fixture: ComponentFixture<Manifesto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Manifesto],
    }).compileComponents();

    fixture = TestBed.createComponent(Manifesto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

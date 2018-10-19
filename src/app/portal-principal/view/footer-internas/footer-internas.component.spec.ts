import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterInternasComponent } from './footer-internas.component';

describe('FooterInternasComponent', () => {
  let component: FooterInternasComponent;
  let fixture: ComponentFixture<FooterInternasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterInternasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterInternasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

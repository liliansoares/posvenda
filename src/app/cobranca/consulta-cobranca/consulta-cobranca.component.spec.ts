import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaCobrancaComponent } from './consulta-cobranca.component';

describe('ConsultaCobrancaComponent', () => {
  let component: ConsultaCobrancaComponent;
  let fixture: ComponentFixture<ConsultaCobrancaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaCobrancaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaCobrancaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

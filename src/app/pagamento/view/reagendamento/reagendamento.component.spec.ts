import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReagendamentoComponent } from './reagendamento.component';

describe('ReagendamentoComponent', () => {
  let component: ReagendamentoComponent;
  let fixture: ComponentFixture<ReagendamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReagendamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReagendamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

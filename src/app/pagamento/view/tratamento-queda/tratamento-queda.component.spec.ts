import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TratamentoQuedaComponent } from './tratamento-queda.component';

describe('TratamentoQuedaComponent', () => {
  let component: TratamentoQuedaComponent;
  let fixture: ComponentFixture<TratamentoQuedaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TratamentoQuedaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TratamentoQuedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

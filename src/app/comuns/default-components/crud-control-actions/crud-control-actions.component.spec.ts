import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudControlActionsComponent } from './crud-control-actions.component';

describe('CrudControlActionsComponent', () => {
  let component: CrudControlActionsComponent;
  let fixture: ComponentFixture<CrudControlActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudControlActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudControlActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

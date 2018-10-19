import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDefaultComponent } from './table-default.component';

describe('TableDefaultComponent', () => {
  let component: TableDefaultComponent;
  let fixture: ComponentFixture<TableDefaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableDefaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePaginationsComponent } from './table-paginations.component';

describe('TablePaginationsComponent', () => {
  let component: TablePaginationsComponent;
  let fixture: ComponentFixture<TablePaginationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablePaginationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablePaginationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

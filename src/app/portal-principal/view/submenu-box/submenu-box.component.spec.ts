import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmenuBoxComponent } from './submenu-box.component';

describe('SubmenuBoxComponent', () => {
  let component: SubmenuBoxComponent;
  let fixture: ComponentFixture<SubmenuBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmenuBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmenuBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

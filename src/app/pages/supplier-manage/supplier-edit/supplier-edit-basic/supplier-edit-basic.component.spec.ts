import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierEditBasicComponent } from './supplier-edit-basic.component';

describe('SupplierEditBasicComponent', () => {
  let component: SupplierEditBasicComponent;
  let fixture: ComponentFixture<SupplierEditBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierEditBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierEditBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

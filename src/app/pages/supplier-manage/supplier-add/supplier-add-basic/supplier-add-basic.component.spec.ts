import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierAddBasicComponent } from './supplier-add-basic.component';

describe('SupplierAddBasicComponent', () => {
  let component: SupplierAddBasicComponent;
  let fixture: ComponentFixture<SupplierAddBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierAddBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierAddBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

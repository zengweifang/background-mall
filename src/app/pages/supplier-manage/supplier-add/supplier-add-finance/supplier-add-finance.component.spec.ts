import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierAddFinanceComponent } from './supplier-add-finance.component';

describe('SupplierAddFinanceComponent', () => {
  let component: SupplierAddFinanceComponent;
  let fixture: ComponentFixture<SupplierAddFinanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierAddFinanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierAddFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

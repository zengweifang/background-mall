import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierAddOperateComponent } from './supplier-add-operate.component';

describe('SupplierAddOperateComponent', () => {
  let component: SupplierAddOperateComponent;
  let fixture: ComponentFixture<SupplierAddOperateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierAddOperateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierAddOperateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

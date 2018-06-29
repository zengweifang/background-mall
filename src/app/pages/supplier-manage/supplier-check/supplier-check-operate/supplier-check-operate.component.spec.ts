import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCheckOperateComponent } from './supplier-check-operate.component';

describe('SupplierCheckOperateComponent', () => {
  let component: SupplierCheckOperateComponent;
  let fixture: ComponentFixture<SupplierCheckOperateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierCheckOperateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCheckOperateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

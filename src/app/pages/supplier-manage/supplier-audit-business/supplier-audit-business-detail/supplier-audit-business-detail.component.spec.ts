import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierAuditBusinessDetailComponent } from './supplier-audit-business-detail.component';

describe('SupplierAuditBusinessDetailComponent', () => {
  let component: SupplierAuditBusinessDetailComponent;
  let fixture: ComponentFixture<SupplierAuditBusinessDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierAuditBusinessDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierAuditBusinessDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

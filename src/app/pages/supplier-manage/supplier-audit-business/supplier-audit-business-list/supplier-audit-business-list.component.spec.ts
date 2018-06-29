import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierAuditBusinessListComponent } from './supplier-audit-business-list.component';

describe('SupplierAuditBusinessListComponent', () => {
  let component: SupplierAuditBusinessListComponent;
  let fixture: ComponentFixture<SupplierAuditBusinessListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierAuditBusinessListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierAuditBusinessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

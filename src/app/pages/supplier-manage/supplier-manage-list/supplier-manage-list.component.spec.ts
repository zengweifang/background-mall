import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierManageListComponent } from './supplier-manage-list.component';

describe('SupplierManageListComponent', () => {
  let component: SupplierManageListComponent;
  let fixture: ComponentFixture<SupplierManageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierManageListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierManageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

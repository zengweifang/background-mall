import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCheckBasicComponent } from './supplier-check-basic.component';

describe('SupplierCheckBasicComponent', () => {
  let component: SupplierCheckBasicComponent;
  let fixture: ComponentFixture<SupplierCheckBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierCheckBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCheckBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

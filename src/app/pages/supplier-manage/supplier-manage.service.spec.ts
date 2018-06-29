import { TestBed, inject } from '@angular/core/testing';

import { SupplierManageService } from './supplier-manage.service';

describe('SupplierManageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupplierManageService]
    });
  });

  it('should be created', inject([SupplierManageService], (service: SupplierManageService) => {
    expect(service).toBeTruthy();
  }));
});

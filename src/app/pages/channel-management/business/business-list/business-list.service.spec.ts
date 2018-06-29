import { TestBed, inject } from '@angular/core/testing';

import { BusinessListService } from './business-list.service';

describe('BusinessListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusinessListService]
    });
  });

  it('should be created', inject([BusinessListService], (service: BusinessListService) => {
    expect(service).toBeTruthy();
  }));
});

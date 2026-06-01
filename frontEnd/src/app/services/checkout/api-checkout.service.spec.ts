import { TestBed } from '@angular/core/testing';

import { ApiCheckoutService } from './api-checkout.service';

describe('ApiCheckoutService', () => {
  let service: ApiCheckoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiCheckoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ApiPaymentsService } from './api-payments.service';

describe('ApiPaymentsService', () => {
  let service: ApiPaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiPaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

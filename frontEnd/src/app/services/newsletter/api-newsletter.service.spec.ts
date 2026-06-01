import { TestBed } from '@angular/core/testing';

import { ApiNewsletterService } from './api-newsletter.service';

describe('ApiNewsletterService', () => {
  let service: ApiNewsletterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiNewsletterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

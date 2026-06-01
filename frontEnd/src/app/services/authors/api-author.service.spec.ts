import { TestBed } from '@angular/core/testing';

import { ApiAuthorService } from './api-author.service';

describe('ApiAuthorService', () => {
  let service: ApiAuthorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiAuthorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

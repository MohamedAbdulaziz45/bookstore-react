import { TestBed } from '@angular/core/testing';

import { ApiNotificationsService } from './api-notifications.service';

describe('ApiNotificationsService', () => {
  let service: ApiNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

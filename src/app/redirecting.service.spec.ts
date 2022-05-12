import { TestBed } from '@angular/core/testing';

import { RedirectingService } from './redirecting.service';

describe('RedirectingService', () => {
  let service: RedirectingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RedirectingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

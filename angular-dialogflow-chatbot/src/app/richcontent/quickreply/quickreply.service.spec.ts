import { TestBed } from '@angular/core/testing';

import { QuickreplyService } from './quickreply.service';

describe('QuickreplyService', () => {
  let service: QuickreplyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuickreplyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { TrackTraceService } from './track-trace.service';

describe('TrackTraceService', () => {
  let service: TrackTraceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackTraceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

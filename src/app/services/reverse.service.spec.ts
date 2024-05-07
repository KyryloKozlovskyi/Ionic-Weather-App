import { TestBed } from '@angular/core/testing';

import { ReverseService } from './reverse.service';

describe('ReverseService', () => {
  let service: ReverseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReverseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

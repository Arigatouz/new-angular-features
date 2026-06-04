import { TestBed } from '@angular/core/testing';

import { Countertwo } from './countertwo';

describe('Countertwo', () => {
  let service: Countertwo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Countertwo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

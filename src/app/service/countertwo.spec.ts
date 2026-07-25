import { TestBed } from '@angular/core/testing';

import { CounterTwo } from './countertwo';

describe('CounterTwo', () => {
  let service: CounterTwo;

  beforeEach(() => {
    // CounterTwo is declared with @Service({ autoProvided: false }), so it must
    // be provided explicitly for the injector to resolve it.
    TestBed.configureTestingModule({ providers: [CounterTwo] });
    service = TestBed.inject(CounterTwo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

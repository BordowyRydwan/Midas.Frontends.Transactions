import { TestBed } from '@angular/core/testing';

import { TransactionApiService } from './transaction.service';

describe('TransactionApiService', () => {
  let service: TransactionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

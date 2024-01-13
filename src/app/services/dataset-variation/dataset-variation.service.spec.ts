import { TestBed } from '@angular/core/testing';

import { DatasetVariationService } from './dataset-variation.service';

describe('DatasetVariationService', () => {
  let service: DatasetVariationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatasetVariationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

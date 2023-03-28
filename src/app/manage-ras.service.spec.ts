import { TestBed } from '@angular/core/testing';

import { ManageRasService } from './manage-ras.service';

describe('ManageRasService', () => {
  let service: ManageRasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageRasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

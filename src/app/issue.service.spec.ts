import { TestBed } from '@angular/core/testing';

import { IssueService } from './issue.service';

describe('IssueService', () => {
 // let service: IssueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
   // service = TestBed.inject(IssueService);
  });

  it('should be created', () => {
    const service: IssueService = TestBed.get(IssueService)
    expect(service).toBeTruthy();
  });
});
 
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { SubmitPostService } from './submit-post.service';

describe('SubmitPostService', () => {
  let service: SubmitPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SubmitPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

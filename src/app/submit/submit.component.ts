import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {Router} from '@angular/router';

import { SubmitPostService } from './submit-post.service';
import { Post, PostType } from '../post';

import { DataService } from '../services/data.service';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss'],
  providers: [ Post ]
})

export class SubmitComponent {
  constructor(
    private route: ActivatedRoute,
    private submitPostService: SubmitPostService,
    private createdPost: Post,
    private router: Router,
    public dataService: DataService
  ) { }

  private headers: string[];
  private newPost = new Post();
  postTypes = Object.keys(PostType).filter(f => isNaN(Number(f)));

  submissionForm = new FormGroup({
    postType: new FormControl(this.newPost.postType),
    caption: new FormControl(this.newPost.caption, [Validators.required]),
    details: new FormControl(this.newPost.details, [Validators.required]),
    phoneNumber: new FormControl(this.newPost.phoneNumber),
    emailId: new FormControl(this.newPost.emailId, [Validators.email]),
    district: new FormControl('All_Kerala'),
  });

  get postType(): any {
    return this.submissionForm.get('postType');
  }

  get caption(): any {
    return this.submissionForm.get('caption');
  }

  get details(): any {
    return this.submissionForm.get('details');
  }

  get phoneNumber(): any {
    return this.submissionForm.get('phoneNumber');
  }

  get emailId(): any {
    return this.submissionForm.get('emailId');
  }

  get district(): any {
    return this.submissionForm.get('district');
  }

  submitPost(): void {
    // console.log('Caption:' + this.submissionForm.get('caption').value);
    // console.log('Details:' + this.submissionForm.get('details').value);

    if (this.submissionForm.valid) {

      this.newPost.postType = this.submissionForm.get('postType').value;
      this.newPost.caption = this.submissionForm.get('caption').value;
      this.newPost.details = this.submissionForm.get('details').value;
      this.newPost.phoneNumber = this.submissionForm.get('phoneNumber').value;
      this.newPost.emailId = this.submissionForm.get('emailId').value;
      this.newPost.district = this.submissionForm.get('district').value;

      this.submitPostService.submitPost(this.newPost)
        // resp is of type `HttpResponse<Config>`
        .subscribe(resp => {
          // // display its headers
          // const keys = resp.headers.keys();
          // this.headers = keys.map(key =>
          //   `${key}: ${resp.headers.get(key)}`);

          // access the body directly, which is typed as `Config`.
          this.createdPost = { ... resp.body };

          this.dataService.currentPost = <Post> this.createdPost;

          this.router.navigate(['/submitted']);
        });
      }
  }

}

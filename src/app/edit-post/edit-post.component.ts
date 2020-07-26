import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Post, PostType } from '../post';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { SubmitPostService } from '../submit/submit-post.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent {

  constructor(
    private submitPostService: SubmitPostService,
    public dataService: DataService,
    private router: Router
  ) { }

  private updatedPost = this.dataService.currentPost;
  postTypes = Object.keys(PostType).filter(f => isNaN(Number(f)));

  submissionForm = new FormGroup({
    postKey: new FormControl('', [Validators.required]),
    postType: new FormControl(this.updatedPost.postType),
    caption: new FormControl(this.updatedPost.caption, [Validators.required]),
    details: new FormControl(this.updatedPost.details, [Validators.required]),
    phoneNumber: new FormControl(this.updatedPost.phoneNumber),
    emailId: new FormControl(this.updatedPost.emailId, [Validators.email]),
    district: new FormControl(this.updatedPost.district),
  });

  get postKey(): any {
    return this.submissionForm.get('postKey');
  }

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

  updatePost(): void {

    if (this.submissionForm.valid) {
      this.updatedPost.postKey = this.submissionForm.get('postKey').value;
      this.updatedPost.postType = this.submissionForm.get('postType').value;
      this.updatedPost.caption = this.submissionForm.get('caption').value;
      this.updatedPost.details = this.submissionForm.get('details').value;
      this.updatedPost.phoneNumber = this.submissionForm.get('phoneNumber').value;
      this.updatedPost.emailId = this.submissionForm.get('emailId').value;
      this.updatedPost.district = this.submissionForm.get('district').value;

      this.submitPostService.updatePost(this.updatedPost)
        .subscribe(resp => {

          this.dataService.currentPost = null;

          this.router.navigate(['/']);
        });
      }
  }

  deletePost(): void {

    this.updatedPost.postKey = this.submissionForm.get('postKey').value;

    this.submitPostService.deletePost(this.updatedPost)
      .subscribe(resp => {

        this.dataService.currentPost = null;

        this.router.navigate(['/']);
      });
    }

}

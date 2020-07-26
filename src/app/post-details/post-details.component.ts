import { Component, OnInit, Input } from '@angular/core';
import { PostsService } from '../posts/posts.service';
import { Post, PostType } from '../post';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    public dataService: DataService

  ) { }

  post = {} as Post;

  ngOnInit(): void {
    if (this.dataService?.currentPost?.caption) {
      this.post = this.dataService.currentPost;
    } else {
      this.fetch();
    }
  }

  fetch(): void {
    var postId = this.route.snapshot.paramMap.get('postId');
    if (postId != '') {
      this.post = null;

      this.postsService.fetchPost(postId)
        .subscribe(response => {
          this.post = response;
          this.dataService.currentPost = this.post as Post;
        });
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { PostsService } from '../posts/posts.service';
import { Post, PostType } from '../post';

interface PostTypeCount {
  postType: string;
  count: number;
  postTypePlural: string;
}

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})

export class PostsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
  ) { }

  posts: Post[];
  fetchedPosts = false;

  postTypeCounts: PostTypeCount[] = [  ];

  searchForm = new FormGroup({
    q: new FormControl(),
  });

  get q(): any {
    return this.searchForm.get('q');
  }

  ngOnInit(): void {
    // let p1 = new Post;
    // p1.caption = 'തേങ്ങ';
    // p1.details = 'ആയിരം';
    // p1.picture = 'assets/coconut-half-leaves-on-white-260nw-393850891.webp';
    // p1.postType = PostType.Ad;

    // let p2 = new Post;
    // p2.caption = 'മാങ്ങ';
    // p2.details = 'ഒരു ടൺ';
    // // p2.picture = 'assets/mangoes-600w-548103076.webp';

    // this.posts = [
    //   p1, p2,
    // ];
    // this.fetchedPosts = true;

    // this.countPostType();
    this.search();
  }

  search(): void {
    // if (this.searchForm.get('q').value != '') {
      this.posts = [];
      this.postTypeCounts = [];

      this.postsService.getPosts(this.searchForm.get('q').value)
          .subscribe(response => {
            this.fetchedPosts = true;
            this.posts = response;

            this.postProcess();
          });
    // }
  }

  postProcess(): void {
    var ads: number = 0;
    var forum: number = 0;
    var contacts: number = 0;
    var articles: number = 0;
    this.posts?.forEach(post => {
      post.details = this.truncateString(post.details, 100);

      var pT: PostType = post.postType;
      switch(pT) {
        case PostType.Ad:
          ads += 1;
          break;
        case PostType.ForumPost:
          forum += 1;
          break;
        case PostType.ContactInfo:
          contacts += 1;
          break;
        case PostType.Article:
          articles += 1;
          break;
        }
      }
    );
    //TODO Use associative indexed array OR Map to make this dynamic
    if (ads >= 1) {
      let pTC = {} as PostTypeCount;
      pTC.postType = 'Ad';
      pTC.postTypePlural = 'Ads';
      pTC.count = ads;
      this.postTypeCounts.push(pTC);
    }
    if (forum >= 1) {
      let pTC = {} as PostTypeCount;
      pTC.postType = 'ForumPost';
      pTC.postTypePlural = 'Forum';
      pTC.count = forum;
      this.postTypeCounts.push(pTC);
    }
    if (contacts >= 1) {
      let pTC = {} as PostTypeCount;
      pTC.postType = 'ContactInfo';
      pTC.postTypePlural = 'Contacts';
      pTC.count = contacts;
      this.postTypeCounts.push(pTC);
    }
    if (articles >= 1) {
      let pTC = {} as PostTypeCount;
      pTC.postType = 'Article';
      pTC.postTypePlural = 'Articles';
      pTC.count = articles;
      this.postTypeCounts.push(pTC);
    }
  }

  truncateString(str, num): string {
    if (str == null) {
      return '';
    }
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
  }

  removePostType(postTypeCount: PostTypeCount): void {
    const index = this.postTypeCounts.indexOf(postTypeCount);

    if (index >= 0) {
      this.postTypeCounts.splice(index, 1);
    }

    console.log('posts before filtering: ' + this.posts);
    this.posts = this.posts.filter(f => f.postType != postTypeCount.postType);

    console.log('posts after filtering: ' + this.posts);
  }

}

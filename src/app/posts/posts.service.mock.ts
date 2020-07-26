import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post, PostType } from '../post';
import { BehaviorSubject } from "rxjs";

@Injectable()
export class PostsServiceMock {
  constructor() { }

  getPosts(): Observable<Post[]> {

    const posts = new BehaviorSubject<Post[]>([
      { caption: 'mocked cap',
        details: 'mocked det',
        picture: '',
        postedDate: new Date(),
        postType: PostType.Ad,
        phoneNumber: "9876543210",
        emailId: "some@other.com"
      }
    ]);

    return posts.asObservable();
  }
}

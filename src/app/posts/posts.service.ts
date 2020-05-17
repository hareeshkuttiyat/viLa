import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor() { }
  posts = [];

  addPost(post) {
    this.posts.push(post);
  }

  getPosts() {
    return this.posts;
  }

  clearCart() {
    this.posts = [];
    return this.posts;
  }
}

import { Injectable } from '@angular/core';
import { Post } from '../post';

@Injectable()

export class DataService {
  currentPost: Post;
}

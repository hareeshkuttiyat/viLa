import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PostsService } from '../posts/posts.service';
import { Post } from '../post';

@Component({
  selector: 'app-available',
  templateUrl: './available.component.html',
  styleUrls: ['./available.component.scss']
})

export class AvailableComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService
  ) { }

  posts = [
    new Post('തേങ്ങ', 'ആയിരം', 'assets/coconut-half-leaves-on-white-260nw-393850891.webp'),
    new Post('മാങ്ങ', 'ഒരു ടൺ', 'assets/mangoes-600w-548103076.webp'),
  ];

  getPosts() {
    this.postsService.getPosts();
    window.alert('Fetched all available posts');
  }

  contact() {
    window.alert('Contacted');
  }

  ngOnInit(): void {
  }

}

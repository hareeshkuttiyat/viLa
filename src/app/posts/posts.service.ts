import { Injectable } from '@angular/core';
import { Post } from '../post';

import { HttpClient, HttpErrorResponse, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  posts = [];

  constructor(
    private http: HttpClient
  ) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Unable to fetch ');
  }

  getPosts(q: string): Observable<Post[]> {

    // Add safe, URL encoded search parameter if there is a search term
    const params = q ? { params: new HttpParams().set('q', q.trim()) } : {};

    return this.http.get<GetPostsResponse>('/api/posts', params ) // TODO set headers also
      .pipe(
        map(response => {
          return response?._embedded?.postList;
        }),
        // retry(3), // retry a failed request up to 3 times
        catchError(this.handleError)
      );
  }

  fetchPost(postId: string): Observable<Post> {

    return this.http.get<Post>('/api/posts/' + postId) // TODO set headers also
      .pipe(
        map(response => {
          return response;
        }),
        // retry(3), // retry a failed request up to 3 times
        catchError(this.handleError)
      );
  }
}

interface GetPostsResponse {
  _embedded: {
      postList: Post[];
      _links: {self: {href: string}};
  };
}

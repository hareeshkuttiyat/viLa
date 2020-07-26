import { Injectable } from '@angular/core';
import { Post } from '../post';

import { HttpClient, HttpErrorResponse, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class SubmitPostService {

  constructor(
    private http: HttpClient
    // public post: Post,
    // @Inject(String) private submitPostUrl: string
  ) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  public submitPost(aPost: Post): Observable<HttpResponse<Post>>{
    return this.http.post<Post>('/api/posts', aPost, { headers: this.httpOptions.headers, observe: 'response' })
      .pipe(
        // retry(3), // retry a failed request up to 3 times
        catchError(this.handleError)
      );
  }

  public updatePost(post: Post): Observable<HttpResponse<Object>>{
    return this.http.put<Post>('/api/posts/' + post.postId, post, { headers: this.httpOptions.headers, observe: 'response' })
      .pipe(
        // retry(3), // retry a failed request up to 3 times
        catchError(this.handleError)
      );
  }

  public deletePost(post: Post): Observable<HttpResponse<Object>>{
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'postKey': post.postKey
      })
    };
    return this.http.delete('/api/posts/' + post.postId, { headers: httpOptions.headers, observe: 'response' })
      .pipe(
        // retry(3), // retry a failed request up to 3 times
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      // console.error('An error occurred:', error.error.message);
      return throwError(
        'There was a problem connecting to server. Please try again later.');
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      // console.error(
      //   `Backend returned code ${error.status}, ` +
      //   `body was: ${error.error}`);
        return throwError(
          'Server could not complete your request due to: ' + error.message);
      }

  }

}

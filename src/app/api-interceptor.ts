import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpRequest, HttpHandler,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { environment } from '../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if (request.url.startsWith('/api')) {
    //   const baseUrl = environment.apiBaseUrl;
    //   const apiRequest = request.clone({ url: `${baseUrl}${request.url}` });
    //   return next.handle(apiRequest).pipe(
    //     // retry(1),
    //     catchError((error: HttpErrorResponse) => {
    //       // if (error.status === 401) {
    //       //   // refresh token
    //       // } else {
    //         return throwError(error);
    //       // }
    //     })
    //   );
    // } else {
      // Other requests such as translation files
      return next.handle(request).pipe(
    //     // retry(1),
        catchError((error: HttpErrorResponse) => {
          // if (error.status === 401) {
          //   // refresh token
          // } else {
            return throwError(error);
          // }
        })
      );
    // }

  }
}

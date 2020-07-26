import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';

import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PostsComponent } from './posts/posts.component';
import { SubmitComponent } from './submit/submit.component';
import { PostDetailsComponent } from './post-details/post-details.component';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { GlobalErrorHandler } from './global-error-handler';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material-module';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './api-interceptor';
import { SubmittedComponent } from './submitted/submitted.component';
import { DataService } from './services/data.service';
import { ErrorComponent } from './error/error.component';
import { EditPostComponent } from './edit-post/edit-post.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    SubmitComponent,
    PostDetailsComponent,
    SubmittedComponent,
    ErrorComponent,
    EditPostComponent
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ml',
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
      }
    }),
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forRoot([
      { path: '', component: PostsComponent },
      { path: 'submit', component: SubmitComponent },
      { path: 'posts/:postId', component: PostDetailsComponent },
      { path: 'submitted', component: SubmittedComponent },
      { path: 'error', component: ErrorComponent },
      { path: 'edit-post/:postId', component: EditPostComponent },
    ]),
    BrowserAnimationsModule
  ],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: DataService},
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }

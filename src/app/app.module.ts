import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { registerLocaleData } from '@angular/common';
import localeMl from '@angular/common/locales/ml';
import localeMlExtra from '@angular/common/locales/extra/ml';
import { AvailableComponent } from './available/available.component';
import { SubmitComponent } from './submit/submit.component';

registerLocaleData(localeMl, 'ml', localeMlExtra);

@NgModule({
  declarations: [
    AppComponent,
    AvailableComponent,
    SubmitComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      { path: '', component: AvailableComponent },
      { path: 'submit-component', component: SubmitComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

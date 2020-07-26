import { TestBed, async } from '@angular/core/testing';

import { NotificationService } from './notification.service';
// import {MatSnackBarHarness} from '@angular/material/snack-bar/testing';
// import {TranslateService} from '@ngx-translate/core';

// import {HarnessLoader} from '@angular/cdk/testing';
// import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
// import { AppComponent } from '../app.component'
// import { RouterTestingModule } from "@angular/router/testing";
// import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

// let loader: HarnessLoader;

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {

    // Testing with component harness needs some component like AppComponent. All the below code is to create a spy.
    // let  mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use']);
    // mockTranslateService.setDefaultLang.and.returnValue('ml');

    // await TestBed.configureTestingModule({
    //   imports: [
    //     NoopAnimationsModule,
    //     RouterTestingModule.withRoutes([]),
    //   ],
    //   providers: [
    //     {provide: TranslateService, useValue: mockTranslateService},
    //   ]
    // });

    // TODO MatSnackBar has to be injected in constructor. How?
    // const fixture = TestBed.createComponent(AppComponent);
    // loader = TestbedHarnessEnvironment.loader(fixture);
    // service = TestBed.inject(NotificationService);

    let mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockSnackBar.open.and.callThrough();

    await TestBed.configureTestingModule({
      providers: [
        {provide: MatSnackBar, useValue: mockSnackBar}
      ]
    });
    service = TestBed.inject(NotificationService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should display snack bar', async () => {
    // await TestBed.inject((service: NotificationService) => {
      // const snackBar = loader.getHarness(MatSnackBarHarness);
      const snackBar = service.snackBar;

      const error = 'ERROR';
      service.showError(error);
      expect(snackBar.open).toHaveBeenCalledWith(error, 'X', {panelClass: ['error'], duration: 3000});
    // })
  });
});

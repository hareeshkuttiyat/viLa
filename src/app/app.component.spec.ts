import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed, async } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import { AppComponent } from './app.component';
import { HttpLoaderFactory } from "./app.module";
import { MaterialModule } from './material-module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const TRANSLATIONS_EN = require('../assets/i18n/en.json');
const TRANSLATIONS_ML = require('../assets/i18n/ml.json');

describe('AppComponent', () => {
  let translate: TranslateService;
  let http: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MaterialModule,
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
    translate = TestBed.get(TranslateService);
    http = TestBed.get(HttpTestingController);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'viLa'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('viLa');
  });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement;
  //   expect(compiled.querySelector('.content span').textContent).toContain('viLa-app app is running!');
  // });

  it('should load translations', async(() => {
    spyOn(translate, 'getBrowserLang').and.returnValue('ml');
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.debugElement.nativeElement;

    // the DOM should be empty for now since the translations haven't been rendered yet
    expect(compiled.querySelector('h2').textContent).toEqual('');

    http.expectOne('/assets/i18n/ml.json').flush(TRANSLATIONS_ML);
    http.expectOne('/assets/i18n/en.json').flush(TRANSLATIONS_EN);

    // Finally, assert that there are no outstanding requests.
    http.verify();

    fixture.detectChanges();
    // the content should be translated to Malayalam now
    expect(compiled.querySelector('h2').textContent).toEqual(TRANSLATIONS_ML.site_title);

    translate.use('en');
    // http.expectOne('/assets/i18n/en.json').flush(TRANSLATIONS_EN);

    // // Finally, assert that there are no outstanding requests.
    // http.verify();

    // the content has not changed yet
    expect(compiled.querySelector('h2').textContent).toEqual(TRANSLATIONS_ML.site_title);

    fixture.detectChanges();
    // the content should be translated to English now
    expect(compiled.querySelector('h2').textContent).toEqual(TRANSLATIONS_EN.site_title);
  }));
});

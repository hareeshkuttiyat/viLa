import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'viLa';

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  translate: TranslateService;

  constructor(changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    translate: TranslateService,
    titleService: Title) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.translate = translate;
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');

     // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('ml');

    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      // Change page title when user changes language preference
      translate.get('site_title').subscribe((res: string) => {
        titleService.setTitle(res);
      });
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}

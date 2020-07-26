import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SubmitComponent } from './submit.component';
// import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateTestingModule } from 'ngx-translate-testing';

describe('SubmitComponent', () => {
  let component: SubmitComponent;
  let fixture: ComponentFixture<SubmitComponent>;
  // let debugElement: DebugElement;

  beforeEach(async(() => {
    let  mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use']);
    mockTranslateService.setDefaultLang.and.returnValue('ml');
    // spyOn(mockTranslateService, 'get').and.returnValue({ subscribe: () => {} })
    mockTranslateService.get.and.returnValue({ subscribe: () => {} })

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ReactiveFormsModule,
        TranslateTestingModule
      ],
      providers: [
        {provide: TranslateService, useValue: mockTranslateService},
      ],
      declarations: [ SubmitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // debugElement = fixture.debugElement;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test form validity', () => {
    const form = component.submissionForm;
    expect(form.valid).toBeFalsy();

    const captionInput = form.controls.caption;
    captionInput.setValue('test caption');

    const detailsInput = form.controls.details;
    detailsInput.setValue('test details');

    expect(form.valid).toBeTruthy();
  })
});

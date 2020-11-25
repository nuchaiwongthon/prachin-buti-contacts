import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmMinistryPage } from './adm-ministry.page';

describe('AdmMinistryPage', () => {
  let component: AdmMinistryPage;
  let fixture: ComponentFixture<AdmMinistryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmMinistryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmMinistryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

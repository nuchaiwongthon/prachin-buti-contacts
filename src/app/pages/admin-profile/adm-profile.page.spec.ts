import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmProfilePage } from './adm-profile.page';

describe('AdmProfilePage', () => {
  let component: AdmProfilePage;
  let fixture: ComponentFixture<AdmProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

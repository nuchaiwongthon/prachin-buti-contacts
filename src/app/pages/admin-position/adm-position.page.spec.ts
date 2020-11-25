import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmPositionPage } from './adm-position.page';

describe('AdmPositionPage', () => {
  let component: AdmPositionPage;
  let fixture: ComponentFixture<AdmPositionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmPositionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmPositionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

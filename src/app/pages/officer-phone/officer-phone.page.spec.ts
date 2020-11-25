import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerPhonePage } from './officer-phone.page';

describe('OfficerPhonePage', () => {
  let component: OfficerPhonePage;
  let fixture: ComponentFixture<OfficerPhonePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficerPhonePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficerPhonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

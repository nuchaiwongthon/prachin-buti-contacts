import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerMinistryPage } from './officer-ministry.page';

describe('OfficerMinistryPage', () => {
  let component: OfficerMinistryPage;
  let fixture: ComponentFixture<OfficerMinistryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficerMinistryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficerMinistryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

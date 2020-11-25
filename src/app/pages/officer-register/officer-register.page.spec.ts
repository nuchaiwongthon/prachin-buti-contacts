import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerRegisterPage } from './officer-register.page';

describe('OfficerRegisterPage', () => {
  let component: OfficerRegisterPage;
  let fixture: ComponentFixture<OfficerRegisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficerRegisterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficerRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

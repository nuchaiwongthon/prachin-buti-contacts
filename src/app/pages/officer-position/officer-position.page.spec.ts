import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerPositionPage } from './officer-position.page';

describe('OfficerPositionPage', () => {
  let component: OfficerPositionPage;
  let fixture: ComponentFixture<OfficerPositionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficerPositionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficerPositionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

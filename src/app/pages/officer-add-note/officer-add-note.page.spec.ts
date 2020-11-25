import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerAddNotePage } from './officer-add-note.page';

describe('OfficerAddNotePage', () => {
  let component: OfficerAddNotePage;
  let fixture: ComponentFixture<OfficerAddNotePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficerAddNotePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficerAddNotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

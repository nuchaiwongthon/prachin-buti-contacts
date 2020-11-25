import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMinistryPage } from './add-ministry.page';

describe('AddMinistryPage', () => {
  let component: AddMinistryPage;
  let fixture: ComponentFixture<AddMinistryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMinistryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMinistryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

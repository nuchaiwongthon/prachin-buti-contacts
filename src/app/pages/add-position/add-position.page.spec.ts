import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPositionPage } from './add-position.page';

describe('AddPositionPage', () => {
  let component: AddPositionPage;
  let fixture: ComponentFixture<AddPositionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPositionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPositionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

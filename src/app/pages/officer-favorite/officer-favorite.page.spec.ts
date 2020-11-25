import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerFavoritePage } from './officer-favorite.page';

describe('OfficerFavoritePage', () => {
  let component: OfficerFavoritePage;
  let fixture: ComponentFixture<OfficerFavoritePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficerFavoritePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficerFavoritePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

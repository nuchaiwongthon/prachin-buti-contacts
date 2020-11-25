import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditProfilePage } from './user-edit-profile.page';

describe('UserEditProfilePage', () => {
  let component: UserEditProfilePage;
  let fixture: ComponentFixture<UserEditProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEditProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

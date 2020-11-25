import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCheckUserPage } from './admin-check-user.page';

describe('AdminCheckUserPage', () => {
  let component: AdminCheckUserPage;
  let fixture: ComponentFixture<AdminCheckUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCheckUserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCheckUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

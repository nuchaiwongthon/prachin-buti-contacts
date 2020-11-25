import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCheckEditPage } from './admin-check-edit.page';

describe('AdminCheckEditPage', () => {
  let component: AdminCheckEditPage;
  let fixture: ComponentFixture<AdminCheckEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCheckEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCheckEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

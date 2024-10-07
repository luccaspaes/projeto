import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignoutPage } from './signout.page';

describe('SignoutPage', () => {
  let component: SignoutPage;
  let fixture: ComponentFixture<SignoutPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SignoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

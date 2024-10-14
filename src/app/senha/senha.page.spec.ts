import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SenhaPage } from './senha.page';

describe('SenhaPage', () => {
  let component: SenhaPage;
  let fixture: ComponentFixture<SenhaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SenhaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

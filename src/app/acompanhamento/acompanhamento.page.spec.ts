import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcompanhamentoPage } from './acompanhamento.page';

describe('AcompanhamentoPage', () => {
  let component: AcompanhamentoPage;
  let fixture: ComponentFixture<AcompanhamentoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AcompanhamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

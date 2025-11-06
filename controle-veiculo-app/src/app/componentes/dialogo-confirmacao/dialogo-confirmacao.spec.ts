import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoConfirmacao } from './dialogo-confirmacao';

describe('DialogoConfirmacao', () => {
  let component: DialogoConfirmacao;
  let fixture: ComponentFixture<DialogoConfirmacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogoConfirmacao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoConfirmacao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

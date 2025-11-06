import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoRegistro } from './historico-registro';

describe('HisoricoRegistro', () => {
  let component: HistoricoRegistro;
  let fixture: ComponentFixture<HistoricoRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoRegistro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoRegistro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

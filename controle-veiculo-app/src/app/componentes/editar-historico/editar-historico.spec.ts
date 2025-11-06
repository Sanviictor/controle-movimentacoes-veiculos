import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarHistorico } from './editar-historico';

describe('EditarHistorico', () => {
  let component: EditarHistorico;
  let fixture: ComponentFixture<EditarHistorico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarHistorico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarHistorico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

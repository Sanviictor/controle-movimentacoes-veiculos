import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarVeiculos } from './gerenciar-veiculos';

describe('GerenciarVeiculos', () => {
  let component: GerenciarVeiculos;
  let fixture: ComponentFixture<GerenciarVeiculos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarVeiculos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarVeiculos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

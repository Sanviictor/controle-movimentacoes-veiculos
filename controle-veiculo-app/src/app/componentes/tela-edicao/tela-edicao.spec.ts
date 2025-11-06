import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaEdicao } from './tela-edicao';

describe('TelaEdicao', () => {
  let component: TelaEdicao;
  let fixture: ComponentFixture<TelaEdicao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaEdicao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaEdicao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

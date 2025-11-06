import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavegacaoAbas } from './navegacao-abas';

describe('NavegacaoAbas', () => {
  let component: NavegacaoAbas;
  let fixture: ComponentFixture<NavegacaoAbas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavegacaoAbas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavegacaoAbas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

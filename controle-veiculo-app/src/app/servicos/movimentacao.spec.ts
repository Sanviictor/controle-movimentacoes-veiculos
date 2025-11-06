import { TestBed } from '@angular/core/testing';
import { MovimentacaoService } from './movimentacao';

describe('MovimentacaoService', () => {
  let service: MovimentacaoService;

  beforeEach(() => {
    service = TestBed.inject(MovimentacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

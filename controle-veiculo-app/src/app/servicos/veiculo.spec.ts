import { TestBed } from '@angular/core/testing';

import { VeiculoService } from './veiculo';

describe('Veiculo', () => {
  let service: VeiculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VeiculoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

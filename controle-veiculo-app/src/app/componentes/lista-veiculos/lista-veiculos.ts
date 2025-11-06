import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Observable, startWith, switchMap } from 'rxjs';

import { VeiculoService } from '../../servicos/veiculo';
import { MovimentacaoService } from '../../servicos/movimentacao';
import { Veiculo } from '../../modelos/veiculo-model';

/**
 * Componente que lista veículos presentes e ausentes na empresa.
 * Observa movimentações registradas para atualizar automaticamente as listas.
 */
@Component({
  selector: 'app-lista-veiculos',
  imports: [CommonModule, DatePipe],
  templateUrl: './lista-veiculos.html',
  styleUrls: ['./lista-veiculos.css']
})
export class ListaVeiculos implements OnInit {

  // Observables que emitem a lista de veículos presentes e ausentes
  veiculosPresentesLista$!: Observable<Veiculo[]>;
  veiculosAusentesLista$!: Observable<Veiculo[]>;

  constructor(
    private veiculoService: VeiculoService,
    private movimentacaoService: MovimentacaoService
  ) {}

  /**
   * Ciclo de vida do Angular: chamado uma vez após inicialização do componente.
   * Configura os Observables que irão atualizar as listas automaticamente quando uma movimentação for registrada ou editada.
   */
  ngOnInit(): void {

    // Gatinho que emite sempre que há uma movimentação registrada ou na inicialização do componente
    const gatilhoDeAtualizacao$ = this.movimentacaoService.movimentacaoRegistrada$.pipe(
      startWith(null) // Garante carregamento inicial
    );

    // Lista de veículos presentes observando o gatilho
    this.veiculosPresentesLista$ = gatilhoDeAtualizacao$.pipe(
      switchMap(() => this.veiculoService.getVeiculosPresentes())
    );

    // Lista de veículos ausentes observando o gatilho
    this.veiculosAusentesLista$ = gatilhoDeAtualizacao$.pipe(
      switchMap(() => this.veiculoService.getVeiculosAusentes())
    );
  }

  /**
   * Retorna o caminho da imagem do veículo com base no modelo.
   * Usa verificações case-insensitive e agrupa modelos similares.
   */
  getVeiculoImage(modelo: string): string {
    const modeloLower = modelo.toLowerCase();

    if (modeloLower.includes('báscula')) return 'assets/icones/bascula.png';
    if (modeloLower.includes('pipa')) return 'assets/icones/pipa.png';
    if (modeloLower.includes('munck')) return 'assets/icones/cam-munck.png';
    if (modeloLower.includes('caminhão')) return 'assets/icones/caminhao.png';
    if (modeloLower.includes('fiorino')) return 'assets/icones/fiorino.png';

    // Caminhonetes agrupadas
    if (['strada', 'saveiro', 'l 200', 'ranger'].some(x => modeloLower.includes(x))) 
      return 'assets/icones/caminhonete.png';

    // Carros de passeio agrupados
    if (['siena', 'virtus'].some(x => modeloLower.includes(x))) 
      return 'assets/icones/carro.png';

    if (modeloLower.includes('moto')) return 'assets/icones/moto.png';

    // Imagem padrão
    return 'assets/icones/default.png';
  }

  /**
   * Formata nomes compostos: coloca a primeira letra maiúscula e o resto minúsculo
   * Ex: "joão da silva" -> "João Da Silva"
   */
  formatarNomeComposto(nome: string): string {
    if (!nome) return '';
    return nome
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}

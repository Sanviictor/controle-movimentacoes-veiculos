import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Movimentacao } from '../../modelos/movimentacao-model';
import { MovimentacaoService } from '../../servicos/movimentacao';
import { Page } from '../../interfaces/page-interface';
import { EditarHistorico } from '../editar-historico/editar-historico';

/**
 * Componente responsável por exibir, filtrar e paginar o histórico de movimentações.
 * Também gerencia a abertura do modal para edição de um registro.
 */
@Component({
  selector: 'app-historico-registro',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    EditarHistorico
  ],
  templateUrl: './historico-registro.html',
  styleUrl: './historico-registro.css'
})
export class HistoricoRegistro implements OnInit {
  
  /** Armazena o objeto de página retornado pela API, contendo a lista de movimentações e metadados de paginação. */
  paginaDeMovimentacoes: Page<Movimentacao> | null = null;
  /** O número da página atual que está sendo visualizada (base 0). */
  paginaAtual: number = 0;
  /** O número de registros a serem exibidos por página. */
  tamanhoDaPagina: number = 20;
  /** Armazena a movimentação selecionada para edição, controlando a visibilidade do modal. */
  movimentacaoSelecionada: Movimentacao | null = null;

  /** Propriedade para o filtro de placa, ligada ao input do template. */
  filtroPlaca: string = '';
  /** Propriedade para o filtro de data de início. */
  filtroDataInicio: string = '';
  /** Propriedade para o filtro de data de fim. */
  filtroDataFim: string = '';

  /**
   * Construtor do componente.
   * @param movimentacaoService Serviço para interagir com a API de movimentações.
   * @param cdr Serviço do Angular para forçar a detecção de mudanças na interface.
   */
  constructor(
    private movimentacaoService: MovimentacaoService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Método do ciclo de vida, executado na inicialização do componente.
   * Dispara o carregamento inicial do histórico.
   */
  ngOnInit(): void {
    this.carregarHistorico();
  }

  /**
   * Atribui uma movimentação à propriedade 'movimentacaoSelecionada', o que causa a abertura do modal de edição.
   * @param movimentacao O objeto de movimentação da linha da tabela que foi clicada.
   */
  abrirModalEdicao(movimentacao: Movimentacao): void {
    this.movimentacaoSelecionada = movimentacao;
  }

  /**
   * Limpa a propriedade 'movimentacaoSelecionada', fazendo com que o modal de edição seja fechado.
   */
  fecharModalEdicao(): void {
    this.movimentacaoSelecionada = null;
  }

  /**
   * Chamado quando o modal de edição emite o evento 'salvar'.
   * Fecha o modal e recarrega a lista para exibir os dados atualizados.
   */
  onMovimentacaoSalva(): void {
    this.fecharModalEdicao();
    this.carregarHistorico();
  }

  /**
   * Monta o objeto de filtros e chama o serviço para buscar os dados paginados e filtrados da API.
   * Atualiza a propriedade 'paginaDeMovimentacoes' com a resposta.
   */
  carregarHistorico(): void {
    const filtros = {
      placa: this.filtroPlaca || null,
      dataInicio: this.filtroDataInicio || null,
      dataFim: this.filtroDataFim || null,
    };

    this.movimentacaoService.getHistorico(filtros, this.paginaAtual, this.tamanhoDaPagina)
      .subscribe(pagina => {
        this.paginaDeMovimentacoes = pagina;
        this.cdr.detectChanges(); // Garante que a tela seja atualizada após a chegada dos dados.
      });
  }

  /**
   * Chamado pelo botão "Filtrar". Reseta a paginação para a primeira página e recarrega os dados.
   */
  aplicarFiltros(): void {
    this.paginaAtual = 0;
    this.carregarHistorico();
  }

  /**
   * Chamado pelo botão "Limpar". Limpa todos os campos de filtro e recarrega os dados.
   */
  limparFiltros(): void {
    this.filtroPlaca = '';
    this.filtroDataInicio = '';
    this.filtroDataFim = '';
    this.paginaAtual = 0;
    this.carregarHistorico();
  }

  /**
   * Navega para a próxima página do histórico, se houver.
   */
  proximaPagina(): void {
    if (this.paginaDeMovimentacoes && (this.paginaDeMovimentacoes.number < this.paginaDeMovimentacoes.totalPages - 1)) {
      this.paginaAtual++;
      this.carregarHistorico();
    }
  }

  /**
   * Navega para a página anterior do histórico, se houver.
   */
  paginaAnterior(): void {
    if (this.paginaDeMovimentacoes && this.paginaDeMovimentacoes.number > 0) {
      this.paginaAtual--;
      this.carregarHistorico();
    }
  }

  formatarNomeComposto(nome: string): string {
    if (!nome) return '';
    return nome
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
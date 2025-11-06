import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TelaEdicao } from '../tela-edicao/tela-edicao';
import { TelaCadastro } from '../tela-cadastro/tela-cadastro';
import { Veiculo } from '../../modelos/veiculo-model';
import { VeiculoService } from '../../servicos/veiculo';

/**
 * Componente responsável por gerenciar a lista de veículos.
 * Permite as operações de CRUD (Criar, Ler, Atualizar, Deletar) para os veículos,
 * controlando a exibição dos formulários de cadastro e edição.
 */
@Component({
  selector: 'app-gerenciar-veiculos',
  standalone: true,
  imports: [CommonModule, TelaEdicao, TelaCadastro],
  templateUrl: './gerenciar-veiculos.html',
  styleUrls: ['./gerenciar-veiculos.css']
})
export class GerenciarVeiculos implements OnInit {
  /** Armazena a lista completa de veículos exibida na tela. */
  veiculos: Veiculo[] = [];

  /** Controla qual veículo está em modo de edição. Armazena o ID do veículo ou é nulo. */
  editingVeiculoId: number | null = null;
  /** Controla a visibilidade do formulário de criação de um novo veículo. */
  creationVeiculo: boolean = false;

  /**
   * Construtor do GerenciarVeiculosComponent.
   * @param veiculoService Serviço para realizar as operações de API relacionadas a veículos.
   * @param cdr Serviço do Angular para forçar a detecção de mudanças na interface.
   */
  constructor(private veiculoService: VeiculoService, private cdr: ChangeDetectorRef) {}

  /**
   * Método do ciclo de vida, executado quando o componente é inicializado.
   * Dispara o carregamento inicial da lista de veículos.
   */
  ngOnInit(): void {
    this.carregarVeiculos();
  }

  /**
   * Busca a lista completa de veículos na API e atualiza a propriedade 'veiculos'.
   * Força a atualização da tela após receber os dados.
   */
  carregarVeiculos(): void {
    this.veiculoService.getVeiculos().subscribe(data => {
      this.veiculos = data;
      this.cdr.detectChanges();
    });
  }

  /**
   * Ativa o modo de criação, exibindo o formulário de cadastro.
   */
  onCreation(): void {
    this.creationVeiculo = true;
  }

  /**
   * Cancela o modo de criação, escondendo o formulário de cadastro.
   */
  onCreationCancel(): void {
    this.creationVeiculo = false;
  }

  /**
   * Chamado quando o formulário de cadastro emite o evento 'save'.
   * Envia o novo veículo para a API e, em caso de sucesso, atualiza a lista local.
   * @param novoVeiculo O objeto Veiculo vindo do formulário de cadastro.
   */
  onCreationSaved(novoVeiculo: Veiculo): void {
    this.veiculoService.salvarVeiculo(novoVeiculo).subscribe(veiculoSalvoDoBackend => {
      // Adiciona o veículo retornado pelo backend (que já contém o ID) à lista local.
      this.veiculos = [...this.veiculos, veiculoSalvoDoBackend];
      this.creationVeiculo = false; // Fecha o formulário.
      this.cdr.detectChanges(); // Atualiza a tela.
    });
  }

  /**
   * Ativa o modo de edição para um veículo específico.
   * @param veiculoId O ID do veículo que será editado.
   */
  onEdit(veiculoId: number): void {
    this.editingVeiculoId = veiculoId;
  }

  /**
   * Cancela o modo de edição, escondendo o formulário de edição.
   */
  onCancel(): void {
    this.editingVeiculoId = null;
  }

  /**
   * Chamado quando o formulário de edição emite o evento 'save'.
   * Envia os dados atualizados para a API e, em caso de sucesso, atualiza a lista local.
   * @param veiculoAtualizado O objeto Veiculo com os dados modificados.
   */
  onSave(veiculoAtualizado: Veiculo): void {
    if (!this.editingVeiculoId) return;

    this.veiculoService.atualizarVeiculo(this.editingVeiculoId, veiculoAtualizado).subscribe({
      next: veiculoRetornado => {
        // Encontra o índice do veículo na lista e o substitui pelo objeto atualizado.
        const index = this.veiculos.findIndex(v => v.id === this.editingVeiculoId);
        if (index !== -1) {
          this.veiculos[index] = veiculoRetornado;
        }
        
        this.editingVeiculoId = null; // Fecha o formulário de edição.
        this.cdr.detectChanges(); // Atualiza a tela.
      },
      error: err => {
        // Exibe um erro no console caso a chamada à API falhe.
        console.error('ERRO AO ATUALIZAR O VEÍCULO:', err);
        alert('Falha ao atualizar o veículo. Verifique o console para detalhes.');
      }
    });
  }

  /**
   * Deleta um veículo do sistema.
   * @param id O ID do veículo a ser deletado.
   */
  onDelete(id: number): void {
    if (confirm('Tem certeza que deseja deletar este veículo?')) {
      this.veiculoService.deletarVeiculo(id).subscribe(() => {
        // Filtra a lista local para remover o veículo deletado.
        this.veiculos = this.veiculos.filter(veiculo => veiculo.id !== id);
        this.cdr.detectChanges(); // Atualiza a tela.
      });
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

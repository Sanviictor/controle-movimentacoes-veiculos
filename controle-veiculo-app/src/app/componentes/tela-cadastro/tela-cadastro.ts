// Importações essenciais do Angular Core e de outros módulos.
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; // NgForm é usado para interagir com o formulário template-driven.

// Importações de modelos e serviços da aplicação.
import { Veiculo } from '../../modelos/veiculo-model';
import { VeiculoService } from '../../servicos/veiculo';

/**
 * @Component Decorator que define os metadados do componente.
 */
@Component({
  selector: 'app-tela-cadastro',       // Seletor para usar o componente no HTML.
  // ATENÇÃO: Se este não for um componente standalone, ele deve ser declarado em um NgModule.
  // Caso seja standalone, adicione 'standalone: true' e mova os imports para o array 'imports'.
  imports: [CommonModule, FormsModule], // Módulos necessários para o template.
  templateUrl: './tela-cadastro.html',  // Caminho para o arquivo de template.
  styleUrls: ['./tela-cadastro.css']    // Array de caminhos para os arquivos de estilo.
})
export class TelaCadastro {

  /**
   * @Output Decorators para comunicação do filho (este componente) para o pai.
   * Eles emitem eventos que o componente pai pode ouvir.
   */
  // Emite um evento quando o usuário clica em "Cancelar" ou fecha a tela.
  @Output() cancel = new EventEmitter<void>();

  // Emite o veículo recém-salvo quando o cadastro é bem-sucedido.
  @Output() save = new EventEmitter<Veiculo>();

  // Objeto que armazena os dados do formulário, ligado ao template via [(ngModel)].
  veiculo: Veiculo = this.novoVeiculo(); // Inicializa o objeto com valores padrão.

  /**
   * Construtor do componente.
   * @param veiculoService - Injeção de dependência do serviço para interagir com a API de veículos.
   */
  constructor(private veiculoService: VeiculoService) {}

  /**
   * Método fábrica: cria e retorna um objeto Veiculo com valores padrão.
   * Útil para inicializar e para limpar (resetar) o formulário.
   * @returns Um objeto Veiculo zerado.
   */
  novoVeiculo(): Veiculo {
    return {
      id: 0, // ID 0 ou nulo geralmente indica uma nova entidade.
      placa: '',
      motorista: '',
      marca: '',
      modelo: '',
      cor: '',
      dataCriacao: new Date(),
      ultimaMovimentacao: new Date(),
      status: 'Presente' // Status padrão para um novo veículo.
    };
  }

  /**
   * Método chamado ao submeter o formulário de cadastro.
   * @param form - (Opcional) Uma referência ao NgForm do template para controle de validação.
   */
  onCadastrar(form?: NgForm): void {
    // 1. Validação: Verifica se o formulário (se passado) é inválido.
    if (form && form.invalid) {
      // Marca todos os campos como "tocados" para exibir as mensagens de erro de validação no HTML.
      form.control.markAllAsTouched();
      return; // Interrompe a execução se o formulário for inválido.
    }

    // 2. Chamada ao Serviço: Envia o objeto 'veiculo' para o método de salvar no serviço.
    this.veiculoService.salvarVeiculo(this.veiculo).subscribe(
      // 3. Callback de Sucesso: Executado quando a API retorna uma resposta positiva.
      response => {
        console.log('LOG 1: Cadastro OK. Emitindo evento SAVE com o veículo:', response);
        // Emite o evento 'save' com o veículo retornado pela API (que pode conter o ID gerado).
        this.save.emit(response);
        this.onClose(); // Fecha a tela de cadastro.
        this.veiculo = this.novoVeiculo(); // Limpa o objeto de dados do formulário.
        if (form) {
          form.resetForm(); // Reseta o estado de validação do formulário no template.
        }
      },
      // 4. Callback de Erro: Executado se a chamada à API falhar.
      error => {
        console.error('Erro ao cadastrar veículo:', error);
        // Aqui você poderia definir uma mensagem de erro para ser exibida na tela.
      }
    );
  }

  /**
   * Emite o evento 'cancel' para notificar o componente pai
   * que a ação de cadastro foi cancelada.
   */
  onClose(): void {
    this.cancel.emit();
  }
}
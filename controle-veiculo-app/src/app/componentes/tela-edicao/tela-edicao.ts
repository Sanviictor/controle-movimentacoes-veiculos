// Importações essenciais do Angular e de módulos para o template.
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * @Component Decorator que define os metadados do componente.
 */
@Component({
  selector: 'app-tela-edicao',         // Seletor para usar o componente no HTML.
  // ATENÇÃO: Se este não for um componente standalone, ele deve ser declarado em um NgModule.
  // Caso seja standalone, adicione 'standalone: true'.
  imports: [CommonModule, FormsModule], // Módulos necessários para o template.
  templateUrl: './tela-edicao.html',    // Caminho para o arquivo de template.
  styleUrl: './tela-edicao.css'         // Caminho para o arquivo de estilos.
})
export class TelaEdicao {
  /**
   * @Input() Decorator para receber dados de um componente pai.
   * 'veiculo' receberá o objeto que será editado.
   * O tipo 'any' deve ser substituído por uma interface mais forte (ex: Veiculo) para melhor segurança de tipo.
   */
  @Input() veiculo: any;

  /**
   * @Output() Decorators para emitir eventos para o componente pai.
   */
  // Emite um evento quando a edição é cancelada.
  @Output() cancel = new EventEmitter<void>();
  // Emite o objeto 'veiculo' modificado quando as alterações são salvas.
  @Output() save = new EventEmitter<any>();

  /**
   * Uma cópia local do objeto 'veiculo' recebido via @Input.
   * A edição é feita nesta cópia para evitar a modificação direta do objeto original no componente pai
   * antes que o usuário clique em "Salvar". Isso é uma prática recomendada.
   */
  veiculoLocal: any;

  constructor() { }

  /**
   * Método do ciclo de vida do Angular, executado na inicialização do componente.
   */
  ngOnInit(): void {
    // Cria uma cópia superficial (shallow clone) do objeto 'veiculo' recebido.
    // Isso garante que as edições no formulário modifiquem 'veiculoLocal', e não o 'veiculo' original.
    this.veiculoLocal = { ...this.veiculo };
  }

  /**
   * Método chamado para salvar as alterações.
   * Ele emite o evento 'save' com a cópia local modificada do veículo.
   */
  onSave(): void {
    this.save.emit(this.veiculoLocal);
  }

  /**
   * Método chamado para cancelar a edição.
   * Ele emite o evento 'cancel', sinalizando ao componente pai que deve fechar a tela de edição.
   * As alterações feitas em 'veiculoLocal' são descartadas, pois nunca foram emitidas.
   */
  onCancel(): void {
    this.cancel.emit();
  }
}
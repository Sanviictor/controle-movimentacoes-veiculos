import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MovimentacaoService } from '../../servicos/movimentacao';
import { Movimentacao } from '../../modelos/movimentacao-model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Veiculo } from '../../modelos/veiculo-model';
import { VeiculoService } from '../../servicos/veiculo';

@Component({
  selector: 'app-editar-historico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-historico.html',
  styleUrls: ['./editar-historico.css']
})
export class EditarHistorico implements OnInit {
  @Input() movimentacaoParaEditar!: Movimentacao;
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<void>();

  movimentacaoEditada!: Movimentacao;
  veiculos: Veiculo[] = [];
  selectedVeiculoId: number | null = null;
  porteiro: string = "";

  constructor(
    private movimentacaoService: MovimentacaoService,
    private veiculoService: VeiculoService
  ) {}

  ngOnInit(): void {
    // Faz uma cópia do objeto para edição local
    this.movimentacaoEditada = { ...this.movimentacaoParaEditar };

    if (this.movimentacaoEditada.veiculo) {
      this.selectedVeiculoId = this.movimentacaoEditada.veiculo.id;
    }

    this.porteiro = this.movimentacaoEditada.porteiro || '';

    this.carregarVeiculos();
  }

  carregarVeiculos(): void {
    this.veiculoService.getVeiculos().subscribe((data: Veiculo[]) => {
      this.veiculos = data;
    });
  }

  onSalvar(): void {
    const veiculoFinal = this.veiculos.find(v => v.id === this.selectedVeiculoId);
    if (!veiculoFinal) {
      console.error('Veículo selecionado não encontrado.');
      return;
    }

    this.movimentacaoEditada.veiculo = veiculoFinal;
    this.movimentacaoEditada.porteiro = this.porteiro;

    this.movimentacaoService
      .atualizarMovimentacao(this.movimentacaoEditada.id, this.movimentacaoEditada)
      .subscribe({
        next: () => this.salvar.emit(),
        error: err => console.error('Erro ao atualizar movimentação:', err)
      });
  }

  onCancelar(): void {
    this.fechar.emit();
  }

  formatarData(data: Date | string | undefined): string {
    if (!data) return '';
    const d = new Date(data);

    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    const horas = String(d.getHours()).padStart(2, '0');
    const minutos = String(d.getMinutes()).padStart(2, '0');

    return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
  }

  atualizarData(event: string) {
    this.movimentacaoEditada.dataHora = new Date(event);
  }
}

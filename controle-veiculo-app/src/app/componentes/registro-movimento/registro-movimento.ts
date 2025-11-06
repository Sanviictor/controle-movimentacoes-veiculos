// Importações principais do Angular e módulos utilizados no componente.
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Importações de modelos, serviços e interfaces da aplicação.
import { MovimentacaoPayload } from '../../modelos/movimentacao-payload';
import { Veiculo } from '../../modelos/veiculo-model';
import { VeiculoService } from '../../servicos/veiculo';
import { MovimentacaoService } from '../../servicos/movimentacao';
import { HttpErrorResponse } from '@angular/common/http';
import { CorrectionRequiredResponse } from '../../interfaces/correction-required-response';
import { DialogData, DialogoConfirmacao } from '../dialogo-confirmacao/dialogo-confirmacao';

@Component({
  selector: 'app-registro-movimento',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './registro-movimento.html',
  styleUrls: ['./registro-movimento.css']
})
export class RegistroMovimento implements OnInit {

  // --- PROPRIEDADES DO COMPONENTE ---

  // Controle de autocomplete de veículos
  selectedVeiculoId: number | null = null;
  searchTerm: string = '';
  filteredVeiculos: Veiculo[] = [];
  isAutocompleteVisible: boolean = false;
  veiculos: Veiculo[] = [];

  // Controle de autocomplete de motoristas
  motoristas: string[] = [];
  filteredMotoristas: string[] = [];
  searchMotorista: string = '';
  isMotoristaAutocompleteVisible: boolean = false;

  // Campos do formulário
  tipoMovimento: 'entrada' | 'saida' = 'entrada';
  quilometragem: number | null = null;
  motorista: string = '';
  porteiro: string = '';

  // Campos de data e hora separados
  dataMovimento: string = ''; // formato: YYYY-MM-DD
  horaMovimento: string = ''; // formato: HH:mm

  // Mensagens de feedback para o usuário
  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;
  private forceCorrection: boolean = false;

  constructor(
    private veiculoService: VeiculoService,
    private movimentacaoService: MovimentacaoService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregarVeiculos();
    this.movimentacaoService.carregarMotoristas();
    this.movimentacaoService.motoristas$.subscribe(data => {
      this.motoristas = data;
    });
  }

  // --- AUTOCOMPLETE DE VEÍCULOS ---

  onFocusInput(): void {
    this.isAutocompleteVisible = true;
    this.filterVeiculos();
  }

  onBlurInput(): void {
    setTimeout(() => {
      this.isAutocompleteVisible = false;
    }, 200);
  }

  carregarVeiculos(): void {
    this.veiculoService.getVeiculos().subscribe(
      data => {
        this.veiculos = data;
        this.filteredVeiculos = [...this.veiculos];
      },
      error => {
        console.error('Erro ao carregar veículos:', error);
        this.mensagemErro = 'Não foi possível carregar a lista de veículos.';
      }
    );
  }

  filterVeiculos(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredVeiculos = this.veiculos.filter(v =>
      v.placa.toLowerCase().includes(term)
    );
  }

  selectVeiculo(veiculo: Veiculo): void {
    this.selectedVeiculoId = veiculo.id;
    this.searchTerm = `${veiculo.placa} - ${this.formatarNomeComposto(veiculo.motorista)} -- ${veiculo.modelo}`;
    this.filteredVeiculos = [];

    if (this.selectedVeiculoId) {
      console.log('Veículo ID selecionado:', this.selectedVeiculoId);

      // Buscar a última quilometragem registrada para o veículo
      this.movimentacaoService.getUltimaQuilometragem(this.selectedVeiculoId).subscribe({
        next: km => {
          this.quilometragem = km ?? null;
          this.cdr.detectChanges();
          console.log('Última quilometragem:', this.quilometragem);
        },
        error: err => {
          this.quilometragem = null;
          console.error('Erro ao buscar última quilometragem:', err);
        }
      });

      // Buscar o último motorista associado ao veículo
      this.movimentacaoService.getUltimoMotorista(this.selectedVeiculoId).subscribe({
        next: res => {
          this.motorista = res.motorista ? this.formatarNomeComposto(res.motorista) : '';
          this.filterMotoristas();
          this.cdr.detectChanges();
          console.log('Último motorista:', this.motorista);
        },
        error: err => {
          this.motorista = '';
          console.error('Erro ao buscar último motorista:', err);
        }
      });
    }
  }

  // --- AUTOCOMPLETE DE MOTORISTAS ---

  onFocusMotorista(): void {
    this.isMotoristaAutocompleteVisible = true;
    this.cdr.detectChanges(); // Garante atualização da view

    // Atualiza a lista de motoristas
    this.movimentacaoService.carregarMotoristas().subscribe({
      next: (lista) => {
        this.motoristas = lista;
        this.filterMotoristas();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar motoristas:', err)
    });
  }

  onMotoristaInput(): void {
    this.isMotoristaAutocompleteVisible = true; 
    this.filterMotoristas();
    this.cdr.detectChanges();
  }

  onBlurMotorista(): void {
    setTimeout(() => {
      this.isMotoristaAutocompleteVisible = false;
      this.cdr.detectChanges(); 
    }, 200);
  }

  filterMotoristas(): void {
    const term = this.motorista.toLowerCase().trim();

    if (!term) {
      // Mostra todos os motoristas se o campo estiver vazio
      this.filteredMotoristas = [...this.motoristas];
      return;
    }

    // Filtra por qualquer palavra do nome que comece com o termo digitado
    this.filteredMotoristas = this.motoristas.filter(nome => {
      const palavras = nome.toLowerCase().split(' ');
      return palavras.some(palavra => palavra.startsWith(term));
    });
  }

  selectMotorista(nome: string): void {
    this.motorista = nome;
    this.isMotoristaAutocompleteVisible = false;
  }

  // --- FORMATAÇÃO ---

  // Permite apenas números e caracteres de ponto/vírgula na quilometragem
  formatarQuilometragem(): void {
    if (this.quilometragem) {
      this.quilometragem = parseFloat(this.quilometragem.toString().replace(/[^\d.,]/g, ''));
    }
  }

  // --- FORMULÁRIO DE REGISTRO ---

  // Retorna a data e hora combinadas do movimento
  getDataHoraCompleta(): Date {
    const agora = new Date();
    const data = this.dataMovimento ? this.dataMovimento : agora.toISOString().split('T')[0];
    const hora = this.horaMovimento ? this.horaMovimento : agora.toTimeString().slice(0,5);
    return new Date(`${data}T${hora}`);
  }

  // Submissão do formulário principal
  onSubmit(): void {
    this.mensagemSucesso = null;
    this.mensagemErro = null;

    if (!this.selectedVeiculoId || this.quilometragem === null) {
      this.mensagemErro = 'Por favor, selecione um veículo e informe a quilometragem.';
      this.cdr.detectChanges();
      return;
    }

    const veiculoSelecionado = this.veiculos.find(v => v.id === this.selectedVeiculoId);
    if (!veiculoSelecionado) {
      this.mensagemErro = 'Veículo selecionado inválido.';
      this.cdr.detectChanges();
      return;
    }

    const dataMovimentacao = this.getDataHoraCompleta();

    const payload: MovimentacaoPayload = {
      veiculo: veiculoSelecionado,
      quilometragem: this.quilometragem,
      tipoMovimento: this.tipoMovimento,
      motorista: this.motorista,
      dataHora: dataMovimentacao,
      porteiro: this.porteiro,
      forceCorrection: this.forceCorrection
    };

    this.movimentacaoService.registrarMovimentacao(payload).subscribe({
      next: () => {
        this.mensagemSucesso = 'Movimentação registrada com sucesso!';
        this.mensagemErro = null;
        this.resetForm();
        this.movimentacaoService.notificarMovimentacaoRegistrada();
        this.forceCorrection = false; // Reset após sucesso
      },
      error: (err: HttpErrorResponse) => {
        this.forceCorrection = false; // Reset em caso de erro comum

        if (err.status === 409) {
          const responseBody = err.error as CorrectionRequiredResponse;
          
          if (responseBody && responseBody.correctionRequired) {
            // Substitui o antigo window.confirm() por diálogo customizado
            const dialogData: DialogData = {
              message: responseBody.message,
              suggestedAction: responseBody.suggestedAction || 'Correção de status anterior ou ajuste de dados.'
            };

            const dialogRef = this.dialog.open(DialogoConfirmacao, {
              width: '500px',
              data: dialogData,
              disableClose: true,
              panelClass: 'custom-dialog-container-no-padding'
            });

            dialogRef.afterClosed().subscribe((confirmacao: boolean) => {
              if (confirmacao === true) {
                // Usuário confirmou correção → tenta novamente
                this.forceCorrection = true;
                this.onSubmit();
              } else {
                // Usuário cancelou
                this.mensagemErro = 'Registro cancelado pelo usuário.';
              }

              this.cdr.detectChanges();
            });

          } else {
            this.mensagemErro = 'Erro de conflito inesperado. Tente novamente.';
          }
        } else {
          this.mensagemErro = 'Erro ao registrar a movimentação. Verifique os dados.';
          console.error('Erro de API:', err);
        }
      }
    });

    this.cdr.detectChanges();
  }

  // Reseta todos os campos do formulário
  resetForm(): void {
    this.selectedVeiculoId = null;
    this.searchTerm = '';
    this.filteredVeiculos = [...this.veiculos];
    this.quilometragem = null;
    this.motorista = '';
    this.searchMotorista = '';
    this.filteredMotoristas = [];
    this.porteiro = '';
    this.dataMovimento = '';
    this.horaMovimento = '';
    this.forceCorrection = false;

    this.cdr.detectChanges();
  }

  // Formata nomes compostos (ex: “joão da silva” → “João Da Silva”)
  formatarNomeComposto(nome: string): string {
    if (!nome) return '';
    return nome
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}

import { Component, OnInit } from '@angular/core';
import { VeiculoService } from '../../servicos/veiculo';
import { MovimentacaoService } from '../../servicos/movimentacao';
import { Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { CommonModule, AsyncPipe } from '@angular/common';

/**
 * Componente responsável por exibir o dashboard principal da aplicação.
 * Apresenta cards com indicadores chave, como contagem de veículos e movimentações do dia.
 * Utiliza uma abordagem reativa com async pipe para manter os dados sempre atualizados.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  /** Observable para a contagem total de veículos. Usado com o pipe 'async' no template. */
  totalveiculos$!: Observable<number>;
  /** Observable para a contagem de veículos presentes. Usado com o pipe 'async' no template. */
  veiculosPresentes$!: Observable<number>;
  /** Observable para a contagem de entradas do dia. Usado com o pipe 'async' no template. */
  entradasHoje$!: Observable<number>;
  /** Observable para a contagem de saídas do dia. Usado com o pipe 'async' no template. */
  saidasHoje$!: Observable<number>;

  /**
   * Construtor do DashboardComponent.
   * @param veiculoService Serviço para buscar dados relacionados a veículos.
   * @param movimentacaoService Serviço para buscar dados relacionados a movimentações.
   */
  constructor(
    private veiculoService: VeiculoService,
    private movimentacaoService: MovimentacaoService
  ) {}

  /**
   * Método do ciclo de vida do Angular, executado na inicialização do componente.
   * Configura os observables reativos que irão alimentar os dados do dashboard.
   */
  ngOnInit(): void {
    // Cria um observable "gatilho" que emite um valor sempre que uma nova movimentação é registrada.
    // O 'startWith(null)' garante que ele emita um valor imediatamente na inicialização,
    // para que os dados sejam carregados pela primeira vez.
    const gatilhoDeAtualizacao$ = this.movimentacaoService.movimentacaoRegistrada$.pipe(
      startWith(null)
    );

    // Cada observable de dados agora "escuta" o gatilho.
    // O 'switchMap' é um operador que, a cada emissão do gatilho, cancela a requisição anterior
    // e dispara uma nova chamada ao serviço para buscar os dados mais recentes.
    
    this.totalveiculos$ = gatilhoDeAtualizacao$.pipe(
      switchMap(() => this.veiculoService.getVeiculoCount())
    );

    this.veiculosPresentes$ = gatilhoDeAtualizacao$.pipe(
      switchMap(() => this.veiculoService.getVeiculosPresentesCount())
    );

    this.entradasHoje$ = gatilhoDeAtualizacao$.pipe(
      switchMap(() => this.movimentacaoService.getEntradasHojeCount())
    );

    this.saidasHoje$ = gatilhoDeAtualizacao$.pipe(
      switchMap(() => this.movimentacaoService.getSaidasHojeCount())
    );
  }
}
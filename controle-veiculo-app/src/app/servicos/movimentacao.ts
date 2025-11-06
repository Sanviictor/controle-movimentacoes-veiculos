// Importações essenciais do Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

// Importações do RxJS para programação reativa
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

// Importações de modelos/interfaces da aplicação
import { MovimentacaoPayload } from '../modelos/movimentacao-payload';
import { Movimentacao } from '../modelos/movimentacao-model';
import { Page } from '../interfaces/page-interface';
import { environment } from '../../environments/environment';
import { UltimoMotoristaResponse } from '../interfaces/ultimo-motorista-response';

/**
 * Serviço responsável por lidar com tudo relacionado a movimentações de veículos.
 * Inclui registro, atualização, histórico e gatilho de atualização para componentes que observam mudanças.
 */
@Injectable({
  providedIn: 'root' // Singleton: mesma instância para toda a aplicação
})
export class MovimentacaoService {

  // URL base da API
  private apiUrl = `${environment.apiUrl}/movimentacoes`;
  

  /**
   * Subject para notificar alterações em movimentações
   * 🔔 Quando emitido, qualquer componente que estiver inscrito em 'movimentacaoRegistrada$' será notificado
   */
  private movimentacaoRegistradaSubject = new Subject<void>();
  movimentacaoRegistrada$ = this.movimentacaoRegistradaSubject.asObservable();

  private motoristasSubject = new BehaviorSubject<string[]>([]);
  motoristas$ = this.motoristasSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Método público para disparar manualmente a notificação de movimentação registrada.
   * Útil caso você queira disparar gatilho sem precisar registrar ou atualizar via API.
   */
  notificarMovimentacaoRegistrada(): void {
    this.movimentacaoRegistradaSubject.next();
  }

  /**
   * Registra uma nova movimentação no backend.
   * Após o sucesso, dispara o Subject para atualizar listas nos componentes que observam.
   */
  registrarMovimentacao(dadosMovimentacao: MovimentacaoPayload): Observable<MovimentacaoPayload> {
    return this.http.post<any>(this.apiUrl, dadosMovimentacao).pipe( 
        tap(() => this.movimentacaoRegistradaSubject.next()) // 🔔 Gatilho para atualização automática
    );
  }

  /**
   * Atualiza uma movimentação existente.
   * Dispara o gatilho para atualizar automaticamente a lista de veículos.
   */
  atualizarMovimentacao(id: number, movimentacao: Movimentacao): Observable<Movimentacao> {
    const url = `${this.apiUrl}/${id}`; // URL específica para a movimentação
    return this.http.put<Movimentacao>(url, movimentacao).pipe(
      tap(() => this.movimentacaoRegistradaSubject.next()) // 🔔 Atualiza a lista automaticamente
    );
  }

  /**
   * Retorna a quantidade de entradas de veículos registradas hoje.
   */
  getEntradasHojeCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/entradas-hoje`);
  }

  /**
   * Retorna a quantidade de saídas de veículos registradas hoje.
   */
  getSaidasHojeCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/saidas-hoje`);
  }

  /**
   * Busca o histórico de movimentações com filtros e paginação.
   */
  getHistorico(filtros: any, page: number, size: number): Observable<Page<Movimentacao>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filtros.placa) params = params.set('placa', filtros.placa);
    if (filtros.dataInicio) params = params.set('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) params = params.set('dataFim', filtros.dataFim);

    return this.http.get<Page<Movimentacao>>(this.apiUrl, { params });
  }

  /**
   * Retorna a última quilometragem registrada de um veículo.
   */
  getUltimaQuilometragem(veiculoId: number): Observable<number | null> {
    return this.http.get<number | null>(`${this.apiUrl}/veiculo/${veiculoId}/ultima-quilometragem`);
  }

  

getUltimoMotorista(veiculoId: number) {
  return this.http.get<UltimoMotoristaResponse>(`${this.apiUrl}/veiculo/${veiculoId}/ultimo-motorista`);
}


  carregarMotoristas(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/motoristas`);
}
}

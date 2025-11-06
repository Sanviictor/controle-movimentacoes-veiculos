// Importações do core do Angular e do módulo de HTTP.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Importações de RxJS para programação reativa e manipulação de fluxos de dados (streams).
import { Observable, BehaviorSubject, map, tap } from 'rxjs';

// Importação do modelo de dados do Veículo.
import { Veiculo } from '../modelos/veiculo-model';
import { environment } from '../../environments/environment';
import { MovimentacaoService } from './movimentacao';

/**
 * @Injectable torna esta classe um serviço que pode ser injetado em outros componentes.
 * 'providedIn: 'root'' cria uma única instância (singleton) para toda a aplicação.
 */
@Injectable({
  providedIn: 'root'
})
export class VeiculoService {
  // URL base da API para o endpoint de veículos.
  private apiUrl = `${environment.apiUrl}/veiculos`;

  /**
   * State Management com BehaviorSubject:
   * 'veiculosSubject' atua como um "store" central para a lista de veículos.
   * Ele armazena a lista mais recente e notifica todos os 'subscribers' quando ela muda.
   * Começa com um array vazio como valor inicial.
   */
  private veiculosSubject = new BehaviorSubject<Veiculo[]>([]);
  // Versão pública e observável do Subject. Componentes se inscrevem aqui para receber os dados.
  veiculos$ = this.veiculosSubject.asObservable();

  /**
   * O construtor injeta o HttpClient para fazer requisições HTTP.
   * @param http - Instância do HttpClient.
   */
  constructor(private http: HttpClient, private movimentacaoService: MovimentacaoService) {
    // Carrega a lista de veículos assim que o serviço é instanciado pela primeira vez.
    this.carregarVeiculos();

    this.movimentacaoService.movimentacaoRegistrada$.subscribe(() => {
      this.carregarVeiculos();
    });
  }

  /**
   * Busca a lista completa de veículos no backend e atualiza o BehaviorSubject.
   * Todos os componentes inscritos em 'veiculos$' receberão a nova lista automaticamente.
   */
  carregarVeiculos(): void {
    this.http.get<Veiculo[]>(this.apiUrl).subscribe(veiculos => {
      this.veiculosSubject.next(veiculos); // Emite a nova lista para todos os subscribers.
    });
  }

  /**
   * Retorna o observable da lista de veículos.
   * Componentes usam este método para obter os dados já carregados e ouvir futuras atualizações.
   * @returns Um Observable que emite o array de veículos.
   */
  getVeiculos(): Observable<Veiculo[]> {
    return this.veiculos$;
  }

  /**
   * Retorna a contagem total de veículos.
   * Usa o operador 'map' para transformar o array de veículos em um número (seu comprimento),
   * sem a necessidade de uma nova chamada à API.
   * @returns Um Observable que emite o número total de veículos.
   */
  getVeiculoCount(): Observable<number> {
    return this.veiculos$.pipe(
      map(veiculos => veiculos.length)
    );
  }

  /**
   * Retorna a contagem de veículos com status "Presente".
   * Filtra o array do BehaviorSubject e retorna o tamanho do resultado.
   * @returns Um Observable que emite o número de veículos presentes.
   */
  getVeiculosPresentesCount(): Observable<number> {
    return this.veiculos$.pipe(
      map(veiculos => veiculos.filter(v => v.status === "Presente").length)
    );
  }

  /**
   * Busca uma lista de veículos presentes diretamente do backend.
   * Este método faz uma chamada HTTP dedicada a um endpoint específico.
   * @returns Um Observable com a lista de veículos presentes.
   */
  getVeiculosPresentes(): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(`${this.apiUrl}/presentes`).pipe(
      map(veiculos => veiculos.sort((a, b) => {
        const dataA = new Date(a.ultimaMovimentacao).getTime();
        const dataB = new Date(b.ultimaMovimentacao).getTime();
        return dataB - dataA; // do mais recente para o mais antigo
      }))
    );
  }

  getVeiculosAusentes(): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(`${this.apiUrl}/ausentes`).pipe(
      map(veiculos => veiculos.sort((a, b) => {
        const dataA = new Date(a.ultimaMovimentacao).getTime();
        const dataB = new Date(b.ultimaMovimentacao).getTime();
        return dataB - dataA; // do mais recente para o mais antigo
      }))
    );
  }
  

  /**
   * Salva um novo veículo no backend.
   * @param veiculo - O objeto do veículo a ser criado.
   * @returns Um Observable com o veículo recém-criado.
   */
  salvarVeiculo(veiculo: Veiculo): Observable<Veiculo> {
    return this.http.post<Veiculo>(this.apiUrl, veiculo).pipe(
      // O operador 'tap' executa um efeito colateral sem modificar a resposta.
      // Aqui, após o POST ser bem-sucedido, ele chama 'carregarVeiculos' para atualizar o BehaviorSubject.
      tap(() => this.carregarVeiculos())
    );
  }

  /**
   * Atualiza um veículo existente no backend.
   * @param id - O ID do veículo a ser atualizado.
   * @param veiculo - O objeto com os dados atualizados.
   * @returns Um Observable com o veículo atualizado.
   */
  atualizarVeiculo(id: number, veiculo: Veiculo): Observable<Veiculo> {
    return this.http.put<Veiculo>(`${this.apiUrl}/${id}`, veiculo).pipe(
      tap(() => this.carregarVeiculos()) // Atualiza a lista local após a alteração.
    );
  }

  /**
   * Deleta um veículo do backend.
   * @param id - O ID do veículo a ser deletado.
   * @returns Um Observable vazio (void).
   */
  deletarVeiculo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.carregarVeiculos()) // Atualiza a lista local após a exclusão.
    );
  }

  
}
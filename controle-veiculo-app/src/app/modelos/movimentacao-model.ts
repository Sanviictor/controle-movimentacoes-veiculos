// Importa a interface Veiculo, indicando uma relação entre Movimentacao e Veiculo.
import { Veiculo } from "./veiculo-model";

/**
 * Interface que define a estrutura de dados para um registro de movimentação de veículo.
 * Cada objeto do tipo Movimentacao representa um evento de entrada ou saída.
 */
export interface Movimentacao {
  /**
   * O identificador único para este registro de movimentação.
   */
  id: number;

  /**
   * A quilometragem do veículo registrada no momento da movimentação.
   */
  quilometragem: number;

  /**
   * A data e a hora exatas em que a movimentação ocorreu.
   */
  dataHora: Date;

  /**
   * O tipo de movimentação. Geralmente assume valores como "entrada" or "saida".
   */
  tipoMovimento: string;

  /**
   * O nome do motorista.
   */
  motorista: string;

  /**
   * O nome do motorista.
   */
  porteiro: string;

  /**
   * O objeto completo do veículo ao qual esta movimentação se refere.
   * Isso cria um relacionamento, aninhando os dados do veículo dentro do registro de movimentação.
   */
  veiculo: Veiculo;
}
// Importa a interface Veiculo, pois um payload de movimentação precisa estar associado a um veículo.
import { Veiculo } from './veiculo-model'; // ajuste o caminho se necessário

/**
 * Interface que define a estrutura do objeto de dados (payload) enviado
 * para a API ao registrar uma nova movimentação.
 * Geralmente, um "Payload" não inclui o 'id', pois ele ainda não foi gerado pelo banco de dados.
 */
export interface MovimentacaoPayload {
  /**
   * O objeto do veículo que está sendo movimentado.
   */
  veiculo: Veiculo;

  /**
   * A quilometragem a ser registrada para esta movimentação.
   */
  quilometragem: number;

  /**
   * O tipo da movimentação, por exemplo, "entrada" ou "saida".
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
   * A data e hora da movimentação.
   * O '?' indica que esta propriedade é OPCIONAL. Se não for enviada,
   * a lógica do backend provavelmente assumirá a data e hora atuais do servidor.
   */
  dataHora?: Date;

  forceCorrection?: boolean;
}
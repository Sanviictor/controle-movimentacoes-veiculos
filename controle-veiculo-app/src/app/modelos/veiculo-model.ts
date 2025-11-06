/**
 * Interface que define a estrutura de dados completa para um objeto Veículo.
 * Representa um veículo cadastrado no sistema com todos os seus atributos.
 */
export interface Veiculo {
  /**
   * O identificador único do veículo no banco de dados.
   */
  id: number;

  /**
   * A placa do veículo (ex: "ABC-1234").
   */
  placa: string;

  /**
   * O nome do motorista principal associado ao veículo.
   */
  motorista: string;

  /**
   * A marca ou fabricante do veículo (ex: "Fiat", "Ford").
   */
  marca: string;

  /**
   * O modelo específico do veículo (ex: "Strada", "Ranger").
   */
  modelo: string;

  /**
   * A cor do veículo.
   */
  cor: string;

  /**
   * A data e hora em que o veículo foi cadastrado no sistema.
   */
  dataCriacao: Date;

  /**
   * A data e hora da última movimentação (entrada ou saída) registrada para este veículo.
   */
  ultimaMovimentacao: Date;

  /**
   * O status atual do veículo dentro do pátio.
   * Geralmente assume valores como "Presente" ou "Ausente".
   */
  status: string;
}
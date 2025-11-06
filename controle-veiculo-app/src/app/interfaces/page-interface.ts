/**
 * Interface genérica para representar uma "página" de dados retornada por uma API.
 * O <T> é um tipo genérico, o que significa que esta interface pode ser usada para
 * paginar qualquer tipo de objeto (ex: Page<Veiculo>, Page<Cliente>, etc.).
 * Esta estrutura é muito comum em APIs backend, como as construídas com Spring Boot.
 */
export interface Page<T> {
  /**
   * O conteúdo da página atual. É um array de objetos do tipo T.
   * Ex: Em uma Page<Veiculo>, 'content' seria um array de Veiculo[].
   */
  content: T[];

  /**
   * O número total de páginas disponíveis com os critérios de busca atuais.
   */
  totalPages: number;

  /**
   * O número total de elementos (itens) existentes no banco de dados,
   * somando todas as páginas.
   */
  totalElements: number;

  /**
   * O número da página atual. Geralmente é baseado em zero (a primeira página é 0).
   */
  number: number;

  /**
   * A quantidade máxima de itens que esta página pode conter.
   */
  size: number;
}
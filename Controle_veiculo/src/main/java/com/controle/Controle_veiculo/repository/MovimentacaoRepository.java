package com.controle.Controle_veiculo.repository;

import com.controle.Controle_veiculo.model.Movimentacao;
import com.controle.Controle_veiculo.model.Veiculo;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable; // Interface para paginação dinâmica
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repositório responsável por acessar e manipular dados da entidade Movimentacao.
 * 
 * Estende JpaRepository, o que fornece uma série de métodos prontos para CRUD
 * e permite a criação de consultas personalizadas através de Derived Queries e JPQL.
 */
@Repository
public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {

    /**
     * Conta o número de movimentações de um tipo específico dentro de um intervalo de tempo.
     * 
     * Exemplo de uso: contar quantas "entradas" ocorreram hoje.
     * 
     * @param start Data/hora de início do intervalo.
     * @param end Data/hora de fim do intervalo.
     * @param tipoMovimento Tipo de movimento a ser filtrado (ex: "entrada" ou "saida").
     * @return Quantidade total de movimentações encontradas.
     */
    long countByDataHoraBetweenAndTipoMovimento(Date start, Date end, String tipoMovimento);

    /**
     * Busca movimentações de forma paginada e filtrada por placa e/ou período.
     * 
     * A consulta ignora filtros nulos, permitindo flexibilidade nas buscas.
     * 
     * @param placa Placa parcial ou completa do veículo (pode ser nula).
     * @param dataInicio Data mínima da movimentação (pode ser nula).
     * @param dataFim Data máxima da movimentação (pode ser nula).
     * @param pageable Configurações de paginação (página, tamanho e ordenação).
     * @return Página de resultados contendo as movimentações filtradas.
     */
    @Query("SELECT m FROM Movimentacao m WHERE " +
           "(:placa IS NULL OR m.veiculo.placa LIKE %:placa%) AND " +
           "(:dataInicio IS NULL OR m.dataHora >= :dataInicio) AND " +
           "(:dataFim IS NULL OR m.dataHora <= :dataFim)")
    Page<Movimentacao> findWithFilters(
            @Param("placa") String placa,
            @Param("dataInicio") Date dataInicio,
            @Param("dataFim") Date dataFim,
            Pageable pageable);

    /**
     * Obtém a última quilometragem registrada para um determinado veículo.
     * 
     * A consulta ordena as movimentações por ID em ordem decrescente
     * (do registro mais recente para o mais antigo).
     * 
     * @param veiculoId ID do veículo alvo.
     * @param pageable Pageable para limitar a quantidade de resultados (geralmente 1).
     * @return Lista contendo a quilometragem mais recente (ou vazia se não houver registros).
     */
    @Query("SELECT m.quilometragem FROM Movimentacao m WHERE m.veiculo.id = :veiculoId ORDER BY m.id DESC")
    List<Double> findUltimaQuilometragem(@Param("veiculoId") Long veiculoId, Pageable pageable);

    /**
     * Obtém o nome do último motorista associado a um determinado veículo.
     * 
     * Segue a mesma lógica da consulta de quilometragem — ordenando por ID descrescente
     * para garantir que o resultado represente o registro mais recente.
     * 
     * @param veiculoId ID do veículo alvo.
     * @param pageable Pageable para limitar a quantidade de resultados (geralmente 1).
     * @return Lista contendo o nome do último motorista (ou vazia se não houver registros).
     */
    @Query("SELECT m.motorista FROM Movimentacao m WHERE m.veiculo.id = :veiculoId ORDER BY m.id DESC")
    List<String> findUltimoMotorista(@Param("veiculoId") Long veiculoId, Pageable pageable);

    /**
     * Retorna a movimentação mais recente (última) associada a um veículo específico.
     * 
     * Usa a convenção de Derived Query Method — o Spring Data JPA interpreta o nome do método
     * e gera automaticamente a consulta SQL correspondente.
     * 
     * @param veiculo Objeto Veiculo a ser consultado.
     * @return A movimentação mais recente, ou null se não houver registros.
     */
    Movimentacao findTopByVeiculoOrderByDataHoraDesc(Veiculo veiculo);
}

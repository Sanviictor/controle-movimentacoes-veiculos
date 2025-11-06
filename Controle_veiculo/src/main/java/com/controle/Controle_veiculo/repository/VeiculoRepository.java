package com.controle.Controle_veiculo.repository;

import com.controle.Controle_veiculo.model.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositório para a entidade Veiculo.
 * Esta interface é gerenciada pelo Spring Data JPA e fornece as operações de banco de dados
 * para a tabela de veículos, incluindo os métodos CRUD padrão e consultas personalizadas.
 */
@Repository
public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {
    
    /**
     * Busca um veículo pela sua placa. Como a placa é um campo único,
     * este método retorna um Optional que pode ou não conter o veículo.
     *
     * @param placa A placa do veículo a ser buscado.
     * @return um {@link Optional<Veiculo>} contendo o veículo se encontrado, ou vazio caso contrário.
     */
    Optional<Veiculo> findByPlaca(String placa);

    List<Veiculo> findByStatusOrderByUltimaMovimentacaoDesc(String status);


    /**
     * Conta o número de veículos com um status específico.
     *
     * @param status O status a ser contado (ex: "Presente", "Ausente").
     * @return O número total de veículos com o status fornecido.
     */
    long countByStatus(String status);

    /**
     * Retorna uma lista de todos os veículos que correspondem a um status específico.
     *
     * @param status O status dos veículos a serem buscados (ex: "Presente", "Ausente").
     * @return uma {@link List<Veiculo>} contendo os veículos encontrados.
     */
    List<Veiculo> findByStatus(String status);
}
package com.controle.Controle_veiculo.services;

import com.controle.Controle_veiculo.model.Veiculo;
import com.controle.Controle_veiculo.repository.VeiculoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Camada de serviço responsável por aplicar as regras de negócio
 * relacionadas à entidade {@link Veiculo}.
 * 
 * Essa classe atua como intermediária entre os controladores (camada web)
 * e o repositório (camada de persistência), centralizando a lógica de manipulação
 * de veículos — como atualizações, listagens e verificações de status.
 */
@Service
public class VeiculoService {

    @Autowired
    private VeiculoRepository veiculoRepository; // Injeção de dependência do repositório de veículos.

    /**
     * Atualiza os dados de um veículo existente.
     * 
     * O método é transacional, garantindo que a operação de leitura e gravação
     * ocorra de forma atômica (evitando inconsistências em caso de erro).
     *
     * @param id            ID do veículo a ser atualizado.
     * @param dadosVeiculo  Dados novos a serem aplicados.
     * @return Veículo atualizado e persistido no banco.
     * @throws RuntimeException caso o veículo não seja encontrado.
     */
    @Transactional
    public Veiculo atualizarVeiculo(Long id, Veiculo dadosVeiculo) {
        // Busca o veículo existente no banco ou lança exceção caso não exista.
        Veiculo veiculoExistente = veiculoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado com o ID: " + id));

        // Atualiza os campos permitidos.
        veiculoExistente.setPlaca(dadosVeiculo.getPlaca());
        // veiculoExistente.setMotorista(dadosVeiculo.getMotorista()); // Campo desativado, talvez movido para movimentação.
        veiculoExistente.setMarca(dadosVeiculo.getMarca());
        veiculoExistente.setModelo(dadosVeiculo.getModelo());
        veiculoExistente.setCor(dadosVeiculo.getCor());

        // Persiste as alterações e retorna o veículo atualizado.
        return veiculoRepository.save(veiculoExistente);
    }

    /**
     * Salva um novo veículo ou atualiza um existente.
     * 
     * O Spring Data JPA identifica automaticamente se o objeto possui um ID —
     * caso sim, ele faz um update; caso não, cria um novo registro.
     *
     * @param veiculo Veículo a ser salvo.
     * @return Instância salva do veículo.
     */
    public Veiculo salvarVeiculo(Veiculo veiculo) {
        return veiculoRepository.save(veiculo);
    }

    /**
     * Busca um veículo pela placa.
     *
     * @param placa Placa a ser consultada.
     * @return Optional contendo o veículo (ou vazio, se não encontrado).
     */
    public Optional<Veiculo> buscarPorPlaca(String placa) {
        return veiculoRepository.findByPlaca(placa);
    }

    /**
     * Lista todos os veículos cadastrados.
     *
     * @return Lista com todos os registros de veículos.
     */
    public List<Veiculo> listarTodos() {
        return veiculoRepository.findAll();
    }

    /**
     * Retorna a quantidade total de veículos cadastrados.
     *
     * @return Total de veículos no banco.
     */
    public Long countAllVeiculos(){
        return veiculoRepository.count();
    }

    /**
     * Retorna a contagem de veículos com o status "Presente".
     *
     * @return Quantidade de veículos presentes.
     */
    public Long countVeiculosPresentes(){
        return veiculoRepository.countByStatus("Presente");
    }

    /**
     * Retorna uma lista de veículos com status "Presente",
     * ordenados pela data da última movimentação (mais recentes primeiro).
     *
     * @return Lista ordenada de veículos presentes.
     */
    public List<Veiculo> listarVeiculosPresentesOrdenados() {
        return veiculoRepository.findByStatusOrderByUltimaMovimentacaoDesc("Presente");
    }

    /**
     * Retorna uma lista de veículos com status "Ausente",
     * também ordenados pela última movimentação.
     *
     * @return Lista ordenada de veículos ausentes.
     */
    public List<Veiculo> listarVeiculosAusentesOrdenados() {
        return veiculoRepository.findByStatusOrderByUltimaMovimentacaoDesc("Ausente");
    }

    /**
     * Lista todos os veículos que estão presentes.
     *
     * @return Lista de veículos com status "Presente".
     */
    public List<Veiculo> listarVeiculosPresentes() {
        return veiculoRepository.findByStatus("Presente");
    }

    /**
     * Lista todos os veículos que estão ausentes.
     *
     * @return Lista de veículos com status "Ausente".
     */
    public List<Veiculo> listarVeiculosAusentes() {
        return veiculoRepository.findByStatus("Ausente");
    }

    /**
     * Verifica a existência de um veículo pelo ID.
     *
     * @param id ID do veículo.
     * @return true se o veículo existe, false caso contrário.
     */
    public boolean existsById(Long id) {
        return veiculoRepository.existsById(id);
    }

    /**
     * Exclui um veículo do banco de dados com base em seu ID.
     *
     * Caso o ID informado não exista, lança uma exceção.
     *
     * @param id ID do veículo a ser deletado.
     * @throws RuntimeException se o veículo não for encontrado.
     */
    public void deleteById(Long id) {
        if (veiculoRepository.existsById(id)) {
            veiculoRepository.deleteById(id);
        } else {
            throw new RuntimeException("Veículo não encontrado com id: " + id);
        }
    }
}

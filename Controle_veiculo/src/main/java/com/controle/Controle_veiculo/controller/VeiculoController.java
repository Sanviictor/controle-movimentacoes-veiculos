package com.controle.Controle_veiculo.controller;

import com.controle.Controle_veiculo.model.Veiculo;
import com.controle.Controle_veiculo.services.VeiculoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller REST para gerenciar as operações CRUD (Criar, Ler, Atualizar, Deletar) de Veículos.
 * Também fornece endpoints para consultas específicas, como contagens e listas por status.
 */
@RestController
@RequestMapping("/api/veiculos")
public class VeiculoController {
    
    @Autowired
    private VeiculoService veiculoService;

    /**
     * Cria um novo registro de veículo no sistema.
     * @param veiculo O objeto Veiculo enviado no corpo da requisição.
     * @return um ResponseEntity com o Veiculo recém-criado e o status HTTP 201 (Created).
     */
    @PostMapping
    public ResponseEntity<Veiculo> cadastrarVeiculo(@RequestBody Veiculo veiculo) {
        Veiculo novoVeiculo = veiculoService.salvarVeiculo(veiculo);
        return new ResponseEntity<>(novoVeiculo, HttpStatus.CREATED);
    }

    /**
     * Atualiza os dados de um veículo existente.
     * @param id O ID do veículo a ser atualizado, vindo da URL.
     * @param dadosVeiculo O objeto Veiculo com os novos dados.
     * @return um ResponseEntity com o Veiculo atualizado e o status HTTP 200 (OK).
     */
    @PutMapping("/{id}")
    public ResponseEntity<Veiculo> atualizarVeiculo(@PathVariable Long id, @RequestBody Veiculo dadosVeiculo) {
        Veiculo veiculoAtualizado = veiculoService.atualizarVeiculo(id, dadosVeiculo);
        return ResponseEntity.ok(veiculoAtualizado);
    }

    /**
     * Retorna uma lista com todos os veículos cadastrados no sistema.
     * @return um ResponseEntity contendo a lista de todos os veículos.
     */
    @GetMapping
    public ResponseEntity<List<Veiculo>> listarVeiculos() {
        List<Veiculo> veiculos = veiculoService.listarTodos();
        return new ResponseEntity<>(veiculos, HttpStatus.OK);
    }

    /**
     * Busca um veículo específico pela sua placa.
     * @param placa A placa do veículo a ser buscado.
     * @return um ResponseEntity com o Veiculo encontrado (status 200 OK) ou status 404 (Not Found) se não existir.
     */
    @GetMapping("/placa/{placa}")
    public ResponseEntity<Veiculo> buscarPorPlaca(@PathVariable String placa) {
        Optional<Veiculo> veiculo = veiculoService.buscarPorPlaca(placa);
        return veiculo.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                      .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Retorna a contagem total de veículos cadastrados.
     * @return um ResponseEntity com o número total de veículos.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getVeiculosCount(){
        long count = veiculoService.countAllVeiculos();
        return ResponseEntity.ok(count);
    }

    /**
     * Retorna a contagem de veículos que estão atualmente com o status "Presente".
     * @return um ResponseEntity com o número de veículos presentes.
     */
    @GetMapping("/presentes/count")
    public ResponseEntity<Long> getVeiculosPresentesCount(){
        long count = veiculoService.countVeiculosPresentes();
        return ResponseEntity.ok(count);
    }

    /**
     * Retorna uma lista de veículos que estão atualmente com o status "Presente".
     * @return um ResponseEntity contendo a lista de veículos presentes.
     */
    @GetMapping("/presentes")
    public ResponseEntity<List<Veiculo>> getVeiculosPresentes(){
        List<Veiculo> veiculos = veiculoService.listarVeiculosPresentes();
        return ResponseEntity.ok(veiculos);
    }

    /**
     * Retorna uma lista de veículos que estão atualmente com o status "Ausente".
     * @return um ResponseEntity contendo a lista de veículos ausentes.
     */
    @GetMapping("/ausentes")
    public ResponseEntity<List<Veiculo>> getVeiculosAusentes(){
        List<Veiculo> veiculos = veiculoService.listarVeiculosAusentes();
        return ResponseEntity.ok(veiculos);
    }

    /**
     * Deleta um veículo do sistema com base no seu ID.
     * @param id O ID do veículo a ser deletado.
     * @return um ResponseEntity com status 204 (No Content) em caso de sucesso, ou 404 (Not Found) se o veículo não existir.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVeiculo(@PathVariable Long id) {
        if (veiculoService.existsById(id)) {
            veiculoService.deleteById(id);
            return ResponseEntity.noContent().build(); // 204
        } else {
            return ResponseEntity.notFound().build(); // 404
        }
    }
}
package com.controle.Controle_veiculo.controller;

import com.controle.Controle_veiculo.dto.CorrectionRequiredResponse;
import com.controle.Controle_veiculo.model.Movimentacao;
import com.controle.Controle_veiculo.services.MovimentacaoService;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST responsável por gerenciar as operações de movimentação de veículos.
 * 
 * Fornece endpoints para registrar, listar, atualizar e contar movimentações.
 * Implementa também lógica de retorno para conflitos de registro (409) quando uma correção é necessária.
 */
@RestController
@RequestMapping("/api/movimentacoes")
public class MovimentacaoController {

    @Autowired
    private MovimentacaoService movimentacaoService;

    /**
     * Registra uma nova movimentação (entrada ou saída).
     *
     * @param movimentacao Objeto contendo os dados da movimentação (veículo, motorista, tipo, data/hora, etc).
     * @return ResponseEntity com a movimentação registrada (HTTP 201), 
     *         uma resposta de correção (HTTP 409) ou erro genérico.
     */
    @PostMapping
    public ResponseEntity<?> registrarMovimentacao(@RequestBody Movimentacao movimentacao) {
        try {
            Object result = movimentacaoService.registrarMovimentacao(movimentacao);

            if (result instanceof Movimentacao) {
                // Registro realizado com sucesso
                return new ResponseEntity<>((Movimentacao) result, HttpStatus.CREATED);

            } else if (result instanceof CorrectionRequiredResponse) {
                // Conflito de status — o front-end deverá confirmar uma possível correção
                System.out.println("ALERTA: Enviando 409 Conflict para o Front-end para confirmação de correção.");
                return new ResponseEntity<>((CorrectionRequiredResponse) result, HttpStatus.CONFLICT);

            } else {
                // Caso inesperado — o serviço retornou algo fora do padrão
                return new ResponseEntity<>("Resposta desconhecida do serviço.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (RuntimeException e) {
            // Erro de validação ou regra de negócio
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Retorna o histórico de movimentações de forma paginada, com filtros opcionais.
     *
     * @param placa      (Opcional) Filtro pela placa do veículo.
     * @param dataInicio (Opcional) Data inicial do período de busca.
     * @param dataFim    (Opcional) Data final do período (ajustada para incluir o dia inteiro).
     * @param page       Número da página (padrão: 0).
     * @param size       Quantidade de registros por página (padrão: 20).
     * @return Página de movimentações com metadados de paginação.
     */
    @GetMapping
    public ResponseEntity<Page<Movimentacao>> getHistoricoComFiltros(
            @RequestParam(required = false) String placa,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dataFim,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        // Ajusta a data de fim para incluir o dia inteiro até 23:59:59
        if (dataFim != null) {
            Calendar cal = Calendar.getInstance();
            cal.setTime(dataFim);
            cal.set(Calendar.HOUR_OF_DAY, 23);
            cal.set(Calendar.MINUTE, 59);
            cal.set(Calendar.SECOND, 59);
            dataFim = cal.getTime();
        }

        Page<Movimentacao> historico = movimentacaoService.listarTodas(placa, dataInicio, dataFim, page, size);
        return ResponseEntity.ok(historico);
    }

    /**
     * Retorna a quantidade total de movimentações de ENTRADA registradas no dia atual.
     *
     * @return Número total de entradas do dia.
     */
    @GetMapping("/entradas-hoje")
    public ResponseEntity<Long> getEntradasHojeCount() {
        long count = movimentacaoService.countEntradasHoje();
        return ResponseEntity.ok(count);
    }

    /**
     * Retorna a quantidade total de movimentações de SAÍDA registradas no dia atual.
     *
     * @return Número total de saídas do dia.
     */
    @GetMapping("/saidas-hoje")
    public ResponseEntity<Long> getSaidasHojeCount() {
        long count = movimentacaoService.countSaidasHoje();
        return ResponseEntity.ok(count);
    }

    /**
     * Atualiza uma movimentação existente.
     *
     * @param id               ID da movimentação a ser atualizada.
     * @param dadosAtualizados Objeto Movimentacao com os novos dados.
     * @return Movimentação atualizada com status HTTP 200.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Movimentacao> atualizarMovimentacao(
            @PathVariable Long id,
            @RequestBody Movimentacao dadosAtualizados) {
        Movimentacao movimentacaoAtualizada = movimentacaoService.atualizarMovimentacao(id, dadosAtualizados);
        return ResponseEntity.ok(movimentacaoAtualizada);
    }

    /**
     * Retorna a última quilometragem registrada de um veículo específico.
     *
     * @param veiculoId ID do veículo.
     * @return Valor numérico da última quilometragem registrada.
     */
    @GetMapping("/veiculo/{veiculoId}/ultima-quilometragem")
    public ResponseEntity<Double> getUltimaQuilometragem(@PathVariable Long veiculoId) {
        Double km = movimentacaoService.getUltimaQuilometragem(veiculoId);
        return ResponseEntity.ok(km);
    }

    /**
     * Retorna o último motorista associado a um veículo.
     *
     * @param veiculoId ID do veículo.
     * @return JSON no formato {"motorista": "NOME"}.
     *         Se não houver motorista anterior, retorna {"motorista": ""}.
     */
    @GetMapping("/veiculo/{veiculoId}/ultimo-motorista")
    public ResponseEntity<?> getUltimoMotorista(@PathVariable Long veiculoId) {
        String motorista = movimentacaoService.getUltimoMotorista(veiculoId);
        if (motorista == null) motorista = "";
        return ResponseEntity.ok(Map.of("motorista", motorista));
    }

    /**
     * Retorna a lista completa de motoristas registrados no sistema.
     *
     * @return Lista de nomes de motoristas (String).
     */
    @GetMapping("/motoristas")
    public List<String> getMotoristas() {
        return movimentacaoService.listarMotoristas();
    }
}

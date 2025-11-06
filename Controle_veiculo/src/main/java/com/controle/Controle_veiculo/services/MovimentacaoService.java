package com.controle.Controle_veiculo.services;

import com.controle.Controle_veiculo.model.Movimentacao;
import com.controle.Controle_veiculo.model.Veiculo;
import com.controle.Controle_veiculo.repository.MovimentacaoRepository;
import com.controle.Controle_veiculo.repository.VeiculoRepository;
import com.controle.Controle_veiculo.dto.CorrectionRequiredResponse;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Camada de serviço responsável pela lógica de negócio das movimentações de veículos.
 * 
 * Esta classe centraliza as regras de consistência, validação e atualização dos dados
 * relacionados a entradas e saídas de veículos, mantendo a integridade do sistema.
 */
@Service
public class MovimentacaoService {

    @Autowired
    private VeiculoRepository veiculoRepository;

    @Autowired
    private MovimentacaoRepository movimentacaoRepository;

    /**
     * Retorna uma lista paginada de movimentações com filtros opcionais.
     * 
     * A busca pode ser filtrada por placa e intervalo de datas, além de incluir
     * ordenação decrescente por data/hora e ID.
     *
     * @param placa      (opcional) filtro pela placa do veículo.
     * @param dataInicio (opcional) data inicial do período.
     * @param dataFim    (opcional) data final do período.
     * @param page       número da página (base 0).
     * @param size       número de registros por página.
     * @return Página contendo as movimentações filtradas.
     */
    public Page<Movimentacao> listarTodas(String placa, Date dataInicio, Date dataFim, int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "dataHora", "id");
        Pageable pageable = PageRequest.of(page, size, sort);
        return movimentacaoRepository.findWithFilters(placa, dataInicio, dataFim, pageable);
    }

    /**
     * Registra uma nova movimentação no sistema.
     * 
     * Este método aplica regras de consistência, verificando se o tipo de movimentação
     * (entrada/saída) está compatível com o status atual do veículo. Caso contrário,
     * pode retornar um `CorrectionRequiredResponse` para que o front-end solicite
     * uma correção ou confirmação de ação ao usuário.
     *
     * @param movimentacaoRequest Objeto recebido do front-end contendo os dados da movimentação.
     * @return A movimentação registrada, ou uma resposta de correção (409).
     */
    @Transactional
    public Object registrarMovimentacao(Movimentacao movimentacaoRequest) {
        // Busca o veículo vinculado à movimentação
        Veiculo veiculo = veiculoRepository.findById(movimentacaoRequest.getVeiculo().getId())
                .orElseThrow(() -> new RuntimeException("Veículo associado à movimentação não encontrado!"));

        // Define a data/hora atual caso não seja informada
        if (movimentacaoRequest.getDataHora() == null) {
            movimentacaoRequest.setDataHora(new Date());
        }

        String tipoMovimento = movimentacaoRequest.getTipoMovimento();

        // ===============================
        // 🔁 Lógica de correção automática
        // ===============================
        // Se o veículo está AUSENTE mas foi solicitada uma SAÍDA, há conflito
        if ("saida".equalsIgnoreCase(tipoMovimento) && "Ausente".equalsIgnoreCase(veiculo.getStatus())) {

            // Caso o front tenha confirmado a correção, registra uma ENTRADA automática antes
            if (Boolean.TRUE.equals(movimentacaoRequest.getForceCorrection())) {
                System.out.println("CORREÇÃO: Registrando uma ENTRADA automática antes da SAÍDA.");
                Movimentacao entradaAutomatica = new Movimentacao();
                entradaAutomatica.setVeiculo(veiculo);
                entradaAutomatica.setMotorista(movimentacaoRequest.getMotorista());
                entradaAutomatica.setQuilometragem(movimentacaoRequest.getQuilometragem());
                entradaAutomatica.setTipoMovimento("entrada");
                entradaAutomatica.setDataHora(movimentacaoRequest.getDataHora());
                movimentacaoRepository.save(entradaAutomatica);
            } else {
                String msg = "O veículo está AUSENTE. Deseja registrar uma ENTRADA automática?";
                return new CorrectionRequiredResponse(msg, "entradaAutomatica");
            }
        }

        // Se o veículo está PRESENTE mas foi solicitada uma ENTRADA, há conflito
        else if ("entrada".equalsIgnoreCase(tipoMovimento) && "Presente".equalsIgnoreCase(veiculo.getStatus())) {
            if (Boolean.TRUE.equals(movimentacaoRequest.getForceCorrection())) {
                System.out.println("CORREÇÃO: Registrando uma SAÍDA automática antes da ENTRADA.");
                Movimentacao saidaAutomatica = new Movimentacao();
                saidaAutomatica.setVeiculo(veiculo);
                saidaAutomatica.setMotorista(movimentacaoRequest.getMotorista());
                saidaAutomatica.setQuilometragem(movimentacaoRequest.getQuilometragem());
                saidaAutomatica.setTipoMovimento("saida");
                saidaAutomatica.setDataHora(movimentacaoRequest.getDataHora());
                movimentacaoRepository.save(saidaAutomatica);
            } else {
                String msg = "O veículo está PRESENTE. Deseja registrar uma SAÍDA automática antes da ENTRADA?";
                return new CorrectionRequiredResponse(msg, "saidaAutomatica");
            }
        }

        // ===============================
        // 💾 Registro principal da movimentação
        // ===============================

        // Atualiza o status do veículo conforme o tipo de movimentação
        String novoStatus = "entrada".equalsIgnoreCase(tipoMovimento) ? "Presente" : "Ausente";
        veiculo.setStatus(novoStatus);
        veiculo.setUltimaMovimentacao(movimentacaoRequest.getDataHora());
        veiculoRepository.save(veiculo);

        // Garante integridade e evita repetição de correções
        movimentacaoRequest.setVeiculo(veiculo);
        movimentacaoRequest.setForceCorrection(false);

        return movimentacaoRepository.save(movimentacaoRequest);
    }

    /**
     * Atualiza os dados de uma movimentação existente.
     *
     * @param id ID da movimentação a ser atualizada.
     * @param dadosAtualizados Dados enviados para substituição parcial.
     * @return Movimentação atualizada após o salvamento.
     */
    @Transactional
    public Movimentacao atualizarMovimentacao(Long id, Movimentacao dadosAtualizados) {
        // 1️⃣ Busca o registro original
        Movimentacao movimentacaoExistente = movimentacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimentação não encontrada com o ID: " + id));

        // 2️⃣ Atualiza apenas os campos editáveis
        movimentacaoExistente.setQuilometragem(dadosAtualizados.getQuilometragem());
        movimentacaoExistente.setDataHora(dadosAtualizados.getDataHora());
        movimentacaoExistente.setMotorista(dadosAtualizados.getMotorista());
        movimentacaoExistente.setTipoMovimento(dadosAtualizados.getTipoMovimento());
        movimentacaoExistente.setPorteiro(dadosAtualizados.getPorteiro());

        // 3️⃣ Persiste as alterações
        Movimentacao atualizada = movimentacaoRepository.save(movimentacaoExistente);

        // 4️⃣ Atualiza o campo de "última movimentação" do veículo, se necessário
        Veiculo veiculo = movimentacaoExistente.getVeiculo();
        if (veiculo != null) {
            Movimentacao ultima = movimentacaoRepository.findTopByVeiculoOrderByDataHoraDesc(veiculo);
            if (ultima != null) {
                veiculo.setUltimaMovimentacao(ultima.getDataHora());
                veiculoRepository.save(veiculo);
            }
        }

        return atualizada;
    }

    /**
     * Conta o número de movimentações de ENTRADA realizadas no dia atual.
     * @return Quantidade total de entradas do dia.
     */
    public long countEntradasHoje() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        Date startOfDay = cal.getTime();

        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        Date endOfDay = cal.getTime();

        return movimentacaoRepository.countByDataHoraBetweenAndTipoMovimento(startOfDay, endOfDay, "entrada");
    }

    /**
     * Retorna a última quilometragem registrada para um veículo.
     * @param veiculoId ID do veículo.
     * @return Última quilometragem ou null se não houver registros.
     */
    public Double getUltimaQuilometragem(Long veiculoId) {
        Pageable topOne = PageRequest.of(0, 1);
        List<Double> result = movimentacaoRepository.findUltimaQuilometragem(veiculoId, topOne);
        return result.isEmpty() ? null : result.get(0);
    }

    /**
     * Retorna o último motorista que movimentou um veículo.
     * @param veiculoId ID do veículo.
     * @return Nome do motorista ou null se não houver registros.
     */
    public String getUltimoMotorista(Long veiculoId) {
        Pageable topOne = PageRequest.of(0, 1);
        List<String> result = movimentacaoRepository.findUltimoMotorista(veiculoId, topOne);
        return result.isEmpty() ? null : result.get(0);
    }

    /**
     * Conta o número de movimentações de SAÍDA realizadas no dia atual.
     * @return Quantidade total de saídas do dia.
     */
    public long countSaidasHoje() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        Date startOfDay = cal.getTime();

        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        Date endOfDay = cal.getTime();

        return movimentacaoRepository.countByDataHoraBetweenAndTipoMovimento(startOfDay, endOfDay, "saida");
    }

    /**
     * Retorna a lista de motoristas pré-cadastrados no sistema.
     * 
     * Essa lista é usada como base para o preenchimento automático no front-end.
     */
    public List<String> listarMotoristas() {
        return List.of(
            "JOAQUIM", "ROBERTO ELIAS", "LEONARDO DIAS", "MÁRCIO", "TALES", "EDMAR",
            "GERALDO PEREIRA", "CARLOS DONIZETE", "SANDER", "JEFERSON", "HELIO MACHADO",
            "MARCOS PAULO", "GUSTAVO GUZZO", "CÉSAR", "RICARDO", "ANDRÉ", "CLEIBER",
            "ZE MARIA", "RODOLFO", "FLÁVIO", "GILMAR", "DANIEL", "DÁRIO", "AHILTON",
            "ALEXANDRE", "ÁLVARO", "ANTONIO DINIZ", "CÉLIO RAIMUNDO", "DANIEL RONILSON",
            "ENILTON", "HEVERALDO", "ITAMAR", "JOSÉ GERALDO", "LEONARDO ISALTINO",
            "LÚCIO CACHOEIRINHA", "MARCILÊNIO", "ROGÉRIO MARTINS", "RUBEM", "DANIEL GONÇALVES"
        );
    }
}

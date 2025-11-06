package com.controle.Controle_veiculo.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.util.Date;

/**
 * Entidade que representa um registro de movimentação (entrada ou saída) de um veículo.
 * Cada instância desta classe corresponde a uma linha na tabela "movimentacoes".
 */
@Entity
@Table(name = "movimentacoes")
public class Movimentacao {

    /**
     * Identificador único da movimentação, gerado automaticamente pelo banco de dados.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * A quilometragem do veículo registrada no momento da movimentação.
     */
    private Double quilometragem;

    /**
     * A data e hora exatas em que a movimentação foi registrada.
     * A anotação @Temporal garante que o tipo no banco de dados seja um timestamp completo.
     * A anotação @JsonFormat instrui o Spring/Jackson sobre como ler a data que vem do front-end.
     */
    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "GMT")
    private Date dataHora;

    /**
     * O tipo da movimentação, que pode ser "entrada" ou "saida".
     */
    private String tipoMovimento;

    /**
     * O nome do motorista principal associado ao veículo.
     */
    private String motorista;

    /**
     * O nome do porteiro principal associado à movimentação.
     */
    private String porteiro;

    

    /**
     * O veículo ao qual esta movimentação está associada.
     * A anotação @ManyToOne define o relacionamento: muitas movimentações podem pertencer a um veículo.
     * A anotação @JoinColumn especifica a chave estrangeira ("veiculo_id") na tabela de movimentações.
     */
    @ManyToOne
    @JoinColumn(name = "veiculo_id", nullable = false)
    private Veiculo veiculo;

    @Transient // Importante se o campo não for para o banco de dados
    private Boolean forceCorrection = false; 
    
  

    /**
     * Construtor padrão vazio, exigido pelo JPA.
     */
    public Movimentacao() {
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getQuilometragem() {
        return quilometragem;
    }

    public void setQuilometragem(Double quilometragem) {
        this.quilometragem = quilometragem;
    }

    public Date getDataHora() {
        return dataHora;
    }

    public void setDataHora(Date dataHora) {
        this.dataHora = dataHora;
    }

    public String getTipoMovimento() {
        return tipoMovimento;
    }

    public void setTipoMovimento(String tipoMovimento) {
        this.tipoMovimento = tipoMovimento;
    }

    public Veiculo getVeiculo() {
        return veiculo;
    }

    public void setVeiculo(Veiculo veiculo) {
        this.veiculo = veiculo;
    }

     public String getMotorista() {
        return motorista;
    }

    public void setMotorista(String motorista) {
        this.motorista = motorista;
    }

    public String getPorteiro() {
        return porteiro;
    }

    public void setPorteiro(String porteiro) {
        this.porteiro = porteiro;
    }

      public Boolean getForceCorrection() {
        return forceCorrection;
    }

    public void setForceCorrection(Boolean forceCorrection) {
        this.forceCorrection = forceCorrection;
    }
}
package com.controle.Controle_veiculo.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

/**
 * Entidade que representa um veículo da frota.
 * Cada instância desta classe corresponde a uma linha na tabela "veiculos".
 */
@Entity
@Table(name = "veiculos")
public class Veiculo {

    /**
     * Identificador único do veículo, gerado automaticamente pelo banco de dados.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * A placa do veículo. É um campo único e não pode ser nulo.
     */
    @Column(unique = true, nullable = false)
    private String placa;

    /**
     * O modelo do veículo (ex: "Corolla", "Strada").
     */
    private String modelo;

    /**
     * A marca do veículo (ex: "Toyota", "Fiat").
     */
    private String marca;

    /**
     * O nome do motorista principal associado ao veículo.
     
    private String motorista;
    */

    /**
     * A cor do veículo.
     */
    private String cor;

    /**
     * O status atual do veículo, indicando se está "Presente" na empresa ou "Ausente".
     * O valor padrão no banco de dados é "Presente".
     */
    @Column(columnDefinition = "VARCHAR(255) DEFAULT 'Presente'")
    private String status;

    /**
     * A data e hora em que o registro do veículo foi criado no sistema.
     */
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataCriacao;

    /**
     * A data e hora da última movimentação (entrada ou saída) registrada para este veículo.
     * Este campo é atualizado a cada novo registro de movimentação.
     */
    @Temporal(TemporalType.TIMESTAMP)
    private Date ultimaMovimentacao;

    /**
     * Construtor padrão vazio, exigido pelo JPA para a criação de instâncias da entidade.
     */
    public Veiculo() {
    }

    /**
     * Construtor para criar uma nova instância de Veiculo com os dados essenciais.
     * @param placa A placa do veículo.
     * @param modelo O modelo do veículo.
     * @param marca A marca do veículo.
     * @param motorista O nome do motorista.
     * @param cor A cor do veículo.
     */
    public Veiculo(String placa, String modelo, String marca, String motorista, String cor) {
        this.placa = placa;
        this.modelo = modelo;
        this.marca = marca;
        //this.motorista = motorista;
        this.cor = cor;
    }

    // --- Getters e Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    /* 
    public String getMotorista() {
        return motorista;
    }

    public void setMotorista(String motorista) {
        this.motorista = motorista;
    }
    */

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public Date getUltimaMovimentacao() {
        return ultimaMovimentacao;
    }

    public void setUltimaMovimentacao(Date ultimaMovimentacao) {
        this.ultimaMovimentacao = ultimaMovimentacao;
    }
    
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
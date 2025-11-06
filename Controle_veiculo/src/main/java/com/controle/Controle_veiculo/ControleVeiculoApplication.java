package com.controle.Controle_veiculo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * A classe principal que serve como ponto de entrada para a aplicação Spring Boot.
 * A anotação {@code @SpringBootApplication} habilita a autoconfiguração do Spring Boot,
 * a varredura de componentes e a configuração da aplicação.
 */
@SpringBootApplication
public class ControleVeiculoApplication {

    /**
     * O método principal que é executado para iniciar a aplicação.
     *
     * @param args Argumentos de linha de comando que podem ser passados para a aplicação.
     */
    public static void main(String[] args) {
        SpringApplication.run(ControleVeiculoApplication.class, args);
    }
}
package com.controle.Controle_veiculo.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controller para lidar com erros 404 (Not Found) e redirecioná-los para o index.html.
 * Isso resolve o problema de recarregar páginas em uma Single Page Application (SPA) como o Angular,
 * garantindo que o Angular Router possa gerenciar a rota no lado do cliente.
 */
@Controller
public class SpaController implements ErrorController {

    /**
     * Mapeia o endpoint de erro padrão do Spring Boot.
     * @return A instrução para fazer um "forward" (redirecionamento interno) para o index.html.
     */
    @RequestMapping("/error")
    public String handleError() {
        // Redireciona qualquer erro 404 para a página principal do Angular.
        return "forward:/index.html";
    }
}
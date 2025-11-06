package com.controle.Controle_veiculo.dto;

/**
 * Classe DTO (Data Transfer Object) utilizada para enviar uma resposta padronizada
 * quando uma movimentação requer correção antes de ser concluída.
 * 
 * Essa classe é usada principalmente quando o sistema identifica um conflito
 * (HTTP 409) e precisa solicitar uma ação de confirmação ou correção do usuário.
 */
public class CorrectionRequiredResponse {

    // Código de status HTTP fixo para representar conflito (409 Conflict)
    private final int status = 409;

    // Mensagem descritiva explicando o motivo da necessidade de correção
    private final String message;

    // Indica de forma explícita que a resposta requer correção (sempre true)
    private final boolean correctionRequired = true;

    // Ação sugerida ao usuário ou sistema cliente para resolver o conflito
    private final String suggestedAction; 

    /**
     * Construtor que inicializa a mensagem e a ação sugerida.
     *
     * @param message Mensagem explicando o motivo do conflito.
     * @param suggestedAction Ação recomendada para resolver o problema.
     */
    public CorrectionRequiredResponse(String message, String suggestedAction) {
        this.message = message;
        this.suggestedAction = suggestedAction;
    }
    
    // ==========================
    // Getters públicos (sem setters, pois a resposta é imutável)
    // ==========================

    /** @return Código de status HTTP fixo (409). */
    public int getStatus() { return status; }

    /** @return Mensagem explicando o motivo do conflito. */
    public String getMessage() { return message; }

    /** @return Sempre true, indicando que correção é necessária. */
    public boolean isCorrectionRequired() { return correctionRequired; }

    /** @return Descrição da ação sugerida ao usuário. */
    public String getSuggestedAction() { return suggestedAction; }
}

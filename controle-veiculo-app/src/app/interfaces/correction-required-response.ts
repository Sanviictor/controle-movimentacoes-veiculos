export interface CorrectionRequiredResponse {
    status: 409;
    message: string;
    correctionRequired: true;
    suggestedAction: 'entradaAutomatica' | 'saidaAutomatica';
}

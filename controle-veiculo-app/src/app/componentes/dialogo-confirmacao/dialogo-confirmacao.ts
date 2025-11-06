import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button'; // Mantido apenas para as diretivas de botão (mat-raised-button/mat-button)

// Interface para os dados injetados
export interface DialogData {
  message: string;
  suggestedAction: string;
}

@Component({
  selector: 'app-correction-confirm-dialog',
  standalone: true,
  // Importamos o módulo de Diálogo (para as diretivas de fechamento) e o de Botão (para as diretivas mat-).
  imports: [CommonModule, MatButtonModule, MatDialogModule], 
  template: `
    <div class="modal-content custom-content">
        <h3 class="dialog-title">⚠️ Atenção: Conflito de Status</h3>
        <p class="dialog-subtitle">Confirmação de Correção Automática</p>

        <div class="form-group">
            <label>Mensagem do Sistema:</label>
            <textarea class="custom-textarea" readonly>{{ data.message }}</textarea>
        </div>
        
        <div class="form-group">
            <label>Ação Sugerida:</label>
            <input type="text" readonly [value]="data.suggestedAction" class="custom-input-readonly" />
        </div>

        <p class="confirmation-prompt">Confirma a execução da correção automática?</p>

        <div class="modal-actions">
            <button 
                mat-button 
                [mat-dialog-close]="false" 
                class="btn-cancel">
                Não, Cancelar Registro
            </button>

            <button 
                mat-raised-button 
                [mat-dialog-close]="true" 
                class="btn-save">
                Sim, Confirmar Correção
            </button>
        </div>
    </div>
  `,
  styles: [`
    /* ---------------------------------------------------- */
    /* ESTILOS INJETADOS A PARTIR DO SEU CSS CUSTOMIZADO */
    /* ---------------------------------------------------- */
    
    /* A classe 'modal-content' será aplicada no componente pai (dialogo.open), */
    /* mas para garantir o escopo, aplicamos os estilos de form e actions aqui. */
    
    /* Estilo para o título do modal. */
    .dialog-title {
        font-size: 1.25rem;
        font-weight: bold;
        color: #1a202c; /* Cor de texto escura. */
        margin-top: 0;
        margin-bottom: 0.5rem;
        text-align: start;
        padding: 0 8px 8px 8px;
    }
    
    /* Estilo para textos auxiliares (simulando a linha divisória). */
    .dialog-subtitle {
        margin-top: 0;
        margin-bottom: 1.5rem;
        font-size: 0.95rem;
        color: #4a5568;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 1rem;
        padding-left: 1rem;
    }

    /* Container para cada grupo de label + input do formulário. */
    .form-group {
        display: flex;
        flex-direction: column; /* Coloca o label acima do input. */
        margin-bottom: 15px;
    }

    /* Estilo para as labels (rótulos) do formulário. */
    .form-group label {
        font-weight: 600;
        margin-bottom: 6px;
        font-size: 0.875rem;
        color: #2d3748;
    }

    /* Estilo padrão para os inputs e selects do formulário. */
    .custom-input-readonly,
    .custom-textarea {
        padding: 10px;
        border: 1px solid #cbd5e0;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: normal;
        width: 100%;
        box-sizing: border-box; 
        transition: all 0.2s ease;
        resize: none;
        background-color: #f7f7f7; /* Fundo levemente cinza para readonly */
        color: #333;
    }
    
    .confirmation-prompt {
        font-size: 1rem;
        margin-top: 20px;
        font-weight: 500;
        color: #1a202c;
    }

    /* Área de botões de ação (Salvar, Cancelar). */
    .modal-actions {
        display: flex;
        justify-content: flex-end; /* Alinha os botões à direita. */
        gap: 1rem; /* Espaço entre os botões. */
        margin-top: 2rem;
    }

    /* Estilo base para os botões do modal. (Angular Material usa o MD3, que precisa de ajustes) */
    .modal-actions button.mdc-button {
        /* Desativa o estilo Material padrão e usa o CSS customizado */
        height: auto;
        min-width: 0;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: bold;
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        border: none;
    }

    /* Estilo específico para o botão "Cancelar". */
    .btn-cancel {
        background-color: #e2e8f0 !important; /* !important pode ser necessário para sobrepor o Material */
        color: #2d3748 !important;
    }

    .btn-cancel:hover {
        background-color: #cbd5e0 !important;
    }

    /* Estilo específico para o botão "Salvar". */
    .btn-save {
        background-color: #222 !important;
        color: #ffffff !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .btn-save:hover {
        background-color: #3b3b3b !important;
    }
    .modal-content {
        border-radius:10%;
        padding: 20px;
    }
    
  `]
})
export class DialogoConfirmacao {
  constructor(
    public dialogRef: MatDialogRef<DialogoConfirmacao>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}
}
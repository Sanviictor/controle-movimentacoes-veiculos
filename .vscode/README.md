# 🚗 Sistema de Controle de Portaria e Quilometragem

![Status do Projeto](https://img.shields.io/badge/status-conclu%C3%ADdo-green)

## 📄 Descrição

Este é um sistema web full-stack desenvolvido para automatizar e digitalizar o controle de entrada e saída de veículos de uma empresa. A aplicação substitui o processo manual de anotação em planilhas, fornecendo um registro centralizado, em tempo real, com histórico consultável e relatórios, otimizando a agilidade da portaria e a precisão dos dados para a gestão da frota.

---

## ✨ Funcionalidades Principais

-   **🖥️ Dashboard em Tempo Real:** Cards dinâmicos que mostram o total de veículos cadastrados, veículos presentes na empresa, e o número de entradas e saídas registradas no dia.
-   **➡️ Registro de Movimentação:** Formulário inteligente para o operador da portaria registrar entradas e saídas. Inclui uma busca de veículos por placa (autocomplete) e lógica de correção automática para registros inconsistentes.
-   **🚚 Gestão de Veículos:** Interface CRUD (Criar, Ler, Atualizar, Deletar) completa para o cadastro e gerenciamento dos veículos da frota.
-   **📜 Histórico Completo:** Tabela com todas as movimentações já registradas, com sistema de paginação para lidar com grandes volumes de dados de forma eficiente.
-   **✏️ Edição de Registros:** Possibilidade de editar movimentações diretamente do histórico para corrigir erros de digitação (ex: quilometragem ou horário).
-   **🔍 Filtro Avançado:** A tela de histórico permite filtrar os registros por placa do veículo e/ou por um intervalo de datas.

---

## 🛠️ Tecnologias Utilizadas

**Back-end:**
-   ![Java](https://img.shields.io/badge/Java-17-orange)
-   ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-green)
-   ![Spring Data JPA](https://img.shields.io/badge/Spring_Data_JPA-blue)
-   ![Maven](https://img.shields.io/badge/Maven-red)
-   ![MySQL](https://img.shields.io/badge/MySQL-blue) (ou PostgreSQL)

**Front-end:**
-   ![Angular](https://img.shields.io/badge/Angular-17-red)
-   ![TypeScript](https://img.shields.io/badge/TypeScript-blue)
-   ![RxJS](https://img.shields.io/badge/RxJS-purple)
-   ![CSS3](https://img.shields.io/badge/CSS3-blue)

**Documentação da API:**
-   ![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-green)

---

## 📸 Screenshots

**[LEMBRETE: Substitua os links abaixo por screenshots reais do seu projeto com DADOS FICTÍCIOS]**

#### Dashboard Principal
![Dashboard](./Screenshots/dashboard.png)

---

#### Registro de Movimentação
![Registro](./Screenshots/Registro_de_movimentacao.png)

---

#### Histórico com Filtro e Paginação
![Histórico](./Screenshots/Historico_de_movimentacao.png)

---

#### Gestão de Veículos 
![Gestão](./Screenshots/Gerenciar_veiculos.png)

---

#### Cadastro de veículo
![Cadastro veiculo](./Screenshots/Cadastro_veiculo.png)

---

#### Modal de Edição Veículo
![Modal Edição veículo](./Screenshots/Edicao_veiculo.png)
---


#### Modal de Edição Histórico
![Modal Edição histórico](./Screenshots/Edicao_historico.png)
---


## 🚀 Como Executar o Projeto Localmente

**Pré-requisitos:**
-   Java 17+
-   Maven 3.8+
-   Node.js 18+
-   Angular CLI 17+
-   Um servidor de banco de dados MySQL (ou PostgreSQL) rodando.

### Back-end (API)

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    ```

2.  **Configure o banco de dados:**
    - Crie um banco de dados no seu MySQL (ex: `controle_veiculos_db`).
    - Navegue até a pasta do back-end.
    - Abra o arquivo `src/main/resources/application.properties`.
    - Configure as suas credenciais do banco de dados:
      ```properties
      spring.datasource.url=jdbc:mysql://localhost:3306/controle_veiculos_db
      spring.datasource.username=seu_usuario
      spring.datasource.password=sua_senha
      spring.jpa.hibernate.ddl-auto=update
      ```

3.  **Execute a aplicação:**
    - Ainda na pasta do back-end, execute o comando:
      ```bash
      mvn spring-boot:run
      ```
    - A API estará disponível em `http://localhost:8080`.

### Front-end (Interface)

1.  **Navegue até a pasta do front-end:**
    ```bash
    cd controle-veiculo-app 
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Execute a aplicação:**
    ```bash
    ng serve
    ```
    - Acesse a aplicação em seu navegador no endereço `http://localhost:4200`.

---

## 👨‍💻 Autor

Feito por Victor Emanuel Galvão dos Santos
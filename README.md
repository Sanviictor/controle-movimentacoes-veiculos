# 🚗 Sistema de Controle de Movimentação de Veículos

Este projeto foi desenvolvido com o objetivo de **gerenciar as entradas e saídas de veículos**, registrando informações como **quilometragem, horários e condutores**, além de oferecer uma base sólida para futuras expansões que centralizem todas as atividades relacionadas aos veículos da organização.

O sistema foi aplicado em ambiente real de estágio, executado em um **servidor local**, utilizando **dados e imagens ilustrativas**, sem qualquer vínculo com informações reais.

---

## 🧩 Tecnologias Utilizadas

**Frontend:** Angular
**Backend:** Spring Boot
**Banco de Dados:** MySQL
**Arquitetura:** MVC (Model-View-Controller)

---

## ⚙️ Funcionalidades

* Cadastro, listagem, atualização e exclusão de veículos 🚘
* Registro de entradas e saídas, com horário e quilometragem ⏱️
* Associação de condutores aos veículos 👨‍👷
* Interface intuitiva
* CRUD completo integrado ao banco MySQL

---

## 🧠 Estrutura do Projeto (Backend - Spring Boot)

```
src/
 ├── config/
 ├── controller/
 ├── dto/
 ├── model/
 ├── repository/
 └── services/
```

A arquitetura segue o **padrão MVC**, garantindo separação de responsabilidades, fácil manutenção e escalabilidade do código.

---

## 💻 Como Executar o Projeto

### 🖥️ Backend (Spring Boot)

1. Clone o repositório:

   ```bash
   git clone https://github.com/seuusuario/nome-do-repositorio.git
   ```
2. Acesse a pasta do backend:

   ```bash
   cd backend
   ```
3. Configure o arquivo `application.properties` com suas credenciais MySQL:

   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/controle_veiculos
   spring.datasource.username=seu_usuario
   spring.datasource.password=sua_senha
   spring.jpa.hibernate.ddl-auto=update
   ```
4. Execute o projeto:

   ```bash
   mvn spring-boot:run
   ```

### 🌐 Frontend (Angular)

1. Acesse a pasta do frontend:

   ```bash
   cd frontend
   ```
2. Instale as dependências:

   ```bash
   npm install
   ```
3. Inicie o servidor Angular:

   ```bash
   ng serve
   ```
4. Acesse no navegador:

   ```
   http://localhost:4200
   ```

---

## 🔐 Futuras Melhorias

* Implementação de **sistema de autenticação por token (JWT)**, com controle de acesso baseado em perfil (Administrador e Portaria).
* Painel administrativo com **gestão de usuários e permissões dinâmicas**.
* Expansão do escopo para **centralizar todas as atividades e informações de veículos** em um único sistema.
* Registro de **histórico detalhado de uso e manutenção dos veículos**.

---

## 🧾 Observações

> As imagens apresentadas no sistema e os dados utilizados são **meramente ilustrativos e fantasiosos**, sem relação com informações reais.

---

## ✨ Autor

**Victor Emanuel Galvão dos Santos**
💼 Desenvolvedor Full Stack | Spring Boot | Angular | MySQL
🔗 [LinkedIn]([https://www.linkedin.com/in/victor-emanuel-galvao](https://www.linkedin.com/in/victor-emanuel-galv%C3%A3o-dos-santos-29a2b01a6/))
📧 [victor.santos@example.com](mailto:victoremanuel3000@gmail.com)

---

## 🎟️ Licença

Este projeto está sob a licença [MIT](LICENSE).

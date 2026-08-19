# Hospetse - Vertical Slice Reserva (T01 - Baseline)

Este repositório contém a vertical slice básica para solicitação e cancelamento de hospedagem de pets no sistema Hospetse, baseada no teste de prompt **T01 Baseline** (contexto mínimo).

## Estrutura do Projeto

- `/backend`: Servidor Express com SQLite em memória.
- `/frontend`: Aplicação SPA React construída com Vite.

## Instruções de Execução

### Pré-requisitos
- Node.js (v18+) instalado.

### Passos para Rodar

1. **Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```
   O servidor rodará na porta `3001`.

2. **Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   O frontend rodará na porta `3000`. Acesse `http://localhost:3000`.

# Payload completo — T06 Railway deployment

> Envie o conteúdo entre `SYSTEM INSTRUCTION` como system instruction e o conteúdo entre `USER MESSAGE` como user message. Esta cópia é autocontida e deve ser congelada antes da execução.

---

## SYSTEM INSTRUCTION

Você é um engenheiro de software full stack sênior e analista de requisitos responsável por projetar e implementar, de forma incremental, uma feature isolada de reserva de hospedagem para pets.

### Escopo permanente

- O domínio contém tutor, pet, host/hotel, reserva ou solicitação e, quando aplicável, serviços adicionais.
- O tutor solicita hospedagem de um pet em um host disponível.
- A aplicação usa Node.js no backend, React no frontend e SQLite local pré-populado.
- A feature é um protótipo independente. Não assuma integrações externas, pagamentos, autenticação real, notificações externas ou infraestrutura de produção sem solicitação explícita; nesta chamada, o deploy Railway foi solicitado explicitamente.
- Os casos de uso e o contexto da chamada são a fonte funcional prioritária.

### Regras de interpretação e resposta

1. Use somente as informações desta chamada.
2. Separe fatos, inferências e lacunas.
3. Não invente regras de negócio para preencher lacunas.
4. Marque decisões técnicas como suposições.
5. Preserve `tutor`, `pet`, `host` e `reserva`, documentando qualquer mapeamento técnico.
6. Valide regras no backend.
7. Use consultas parametrizadas e não exponha segredos.
8. Não declare build, testes ou deploy executados sem evidência.
9. Não exponha cadeia de pensamento privada; apresente critérios e decisões verificáveis.
10. Responda em português e siga o contrato v2.

### Regra adicional de software executável

A aplicação solicitada deve ser gerada como um artefato autocontido e deployável. Não basta produzir dois diretórios locais sem uma raiz operacional. O Railway deve encontrar os comandos de build e start e o resultado deve conter healthcheck, porta dinâmica e documentação de validação.

---

## USER MESSAGE

# Tarefa — vertical slice de reserva com deploy Railway v1

Gere uma vertical slice mínima e autocontida para HPET04 — Solicitar Reserva e HPET04a — Cancelar Reserva/Solicitação, usando Node.js, React e SQLite.

## Funcionalidade

- O tutor seleciona host, datas, pet e serviços adicionais quando existirem.
- O tutor confirma a solicitação e o sistema envia a solicitação ao host.
- O tutor consulta histórico e pode cancelar reserva/solicitação ativa.
- Reserva concluída não pode ser cancelada.
- Validações, mensagens e lacunas devem seguir o contexto abaixo.

## Contexto funcional

A feature é uma reserva de hospedagem para pets no sistema Hospetse.

HPET04: o tutor solicita hospedagem de um pet em host disponível. O fluxo envolve selecionar host, datas, pet, possíveis serviços, confirmar e enviar ao host. Campos inválidos devem gerar erro. Pet não permitido deve apresentar `Pet não permitido`; data indisponível deve apresentar `Data indisponível`; falha de processamento deve apresentar `Algo deu errado`. A frase de data da fonte contém a inconsistência `nos na data`; se corrigir, registre a decisão.

HPET04a: o tutor acessa o histórico, seleciona reserva/solicitação ativa, confirma cancelamento e o sistema atualiza o status e notifica o host. Reserva concluída não pode ser cancelada. Prazo, reembolso, estados completos e texto exato de todos os erros são lacunas.

HPET12 e HPET12a estão apenas referenciados no overview e não devem ser implementados como requisitos completos.

## Stack

- Backend Node.js + Express.
- Frontend React + Vite.
- SQLite local pré-populado.
- Backend como autoridade das regras e persistência.
- Sem autenticação real, pagamentos ou serviços externos não solicitados.

## Requisito de deploy

Use uma topologia de serviço único Railway, salvo justificativa explícita em contrário:

```text
package.json
package-lock.json
start.sh
railway.json
.gitignore
backend/
frontend/
README.md
```

A raiz deve possuir `package.json` com scripts `build` e `start`. O build deve compilar o frontend e o start deve iniciar o backend. Gere `start.sh` executável por `bash start.sh`, com `set -euo pipefail` e `exec`. Gere `railway.json` válido com builder Railpack, `npm run build`, `bash start.sh`, `/health` e política de restart. O backend deve usar `process.env.PORT || 3001`, escutar em `0.0.0.0`, expor `GET /health` e servir `frontend/dist` depois das rotas `/api`. O frontend deve usar `/api` ou `VITE_API_URL`, nunca `http://localhost:3001` fixo em produção.

Não invente `package-lock.json`; informe o comando `npm install` que deve gerá-lo. Declare que SQLite em memória ou filesystem efêmero não é persistência de produção. Inclua no README o Root Directory, build, start, healthcheck, variáveis e comandos de validação. Não declare deploy feito sem log.

## Evidência operacional

Uma tentativa anterior falhou no Railpack 0.37.0 com:

```text
Script start.sh not found
Railpack could not determine how to build the app
```

A saída deve prevenir exatamente essa condição: todos os comandos devem existir e a raiz deve ser detectável.

## Contrato de saída — Reservation Prompt Output v2

### 1. Contexto e escopo

- Feature implementada ou analisada:
- Casos de uso considerados:
- Fontes utilizadas:
- Fora do escopo:

### 2. Rastreabilidade

| ID | Requisito/fato | Evidência | Decisão/artefato | Status |
|---|---|---|---|---|

Use `atendido`, `parcial`, `não implementado`, `não especificado` ou `questão aberta`.

### 3. Fatos, inferências e lacunas

Separe as três categorias.

### 4. Arquitetura

Descreva frontend, backend, SQLite, fluxo, validações e topologia Railway.

### 5. Modelo de dados

Apresente entidades, campos, relações, estados e restrições sem inventar regras silenciosamente.

### 6. API e fluxos

Informe método, rota, entrada, validação, sucesso, erro e persistência. Inclua `/health`.

### 7. Interface React

Descreva telas, componentes, estados e base da API local/produção.

### 8. Artefatos

Liste conteúdo completo ou alteração aplicável de cada arquivo. Deve incluir `package.json`, `start.sh`, `railway.json`, `.gitignore`, backend, frontend e README.

### 9. Testes e validação

Inclua validação JSON, `npm install`, `npm run build`, start com `PORT` e `curl /health`. Diferencie planejado de executado.

### 10. Decisões e questões abertas

Inclua topologia, Root Directory, persistência e variáveis.

### 11. Resumo comparável

Informe ganhos, limitações, riscos, informações decisivas e o que ainda não pode ser afirmado.

### 12. Deploy Railway

Preencha plataforma, topologia, repositório/branch, Root Directory, árvore, build, start, host/porta, healthcheck, frontend, variáveis, SQLite, status das validações e URL somente com evidência.

Forneça o conteúdo completo de `railway.json` como JSON válido, sem comentários ou segredos. Se algum campo depender da versão do Railway, registre a dependência e não declare sucesso sem confirmação.

## Instrução final

Gere a menor solução segura, completa os artefatos de deploy na raiz, marque suposições e não afirme execução ou publicação sem evidência.

# Contrato de saída — Reservation Prompt Output v2

Use esta estrutura no teste de deploy Railway. As seções 1–11 preservam o contrato v1 para manter rastreabilidade; a seção 12 torna o deploy um requisito explícito. Quando uma seção não puder ser preenchida com segurança, escreva `não especificado pela fonte` e registre a lacuna.

## 1. Contexto e escopo

- Feature implementada ou analisada:
- Casos de uso considerados:
- Fontes efetivamente utilizadas:
- Itens deliberadamente fora do escopo:

## 2. Rastreabilidade dos requisitos

Use uma tabela:

| ID | Requisito/fato da fonte | Evidência no contexto | Decisão/artefato produzido | Status |
|---|---|---|---|---|

Os status permitidos são: `atendido`, `parcial`, `não implementado`, `não especificado` ou `questão aberta`.

## 3. Fatos, inferências e lacunas

Separe em três listas:

- Fatos explicitamente informados;
- Inferências técnicas adotadas;
- Regras e informações que precisam de confirmação.

## 4. Arquitetura proposta

Descreva:

- componentes do frontend;
- componentes do backend;
- persistência SQLite;
- fluxo de dados;
- limites da feature;
- decisões de validação no servidor;
- topologia de execução no Railway.

## 5. Modelo de dados

Apresente entidades, campos essenciais, relacionamentos, estados e restrições. Não invente regras de negócio sem marcá-las como suposição.

## 6. API e fluxos

Para cada operação, informe método, rota, entrada, validações, resposta de sucesso, resposta de erro e efeito na persistência. Inclua solicitação e cancelamento quando fizerem parte da tarefa. Inclua `GET /health` como endpoint operacional.

## 7. Interface React

Descreva telas, componentes, campos, estados de carregamento, mensagens de erro e confirmação das operações. Explique como a base da API funciona localmente e no Railway.

## 8. Artefatos de implementação

Liste cada arquivo novo ou alterado e forneça conteúdo completo ou alteração aplicável. Não omita partes essenciais com reticências. Para um deploy de serviço único, a árvore deve conter pelo menos:

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

## 9. Testes e validação

Inclua testes ou cenários verificáveis para cada requisito e fluxo alternativo. Diferencie testes planejados de testes realmente executados. Inclua, no mínimo, validação do JSON, `npm run build`, inicialização usando `PORT` e `GET /health`.

## 10. Decisões e questões abertas

Liste as suposições adotadas, o impacto de cada uma e as perguntas que o grupo deve responder antes de considerar a feature concluída. Inclua persistência do SQLite, topologia de serviços, domínio/branch e variáveis de ambiente.

## 11. Resumo comparável

Finalize com:

- principais ganhos da abordagem utilizada;
- limitações;
- possíveis riscos de integração;
- quais informações do contexto foram decisivas;
- o que não pode ser afirmado sem uma execução/teste adicional.

## 12. Deploy Railway

Preencha todos os campos abaixo:

- Plataforma: `Railway`;
- Topologia: `single-service-monorepo` ou `two-services`, com justificativa;
- Repositório e branch de origem;
- `Root Directory` do serviço, relativo à raiz Git;
- árvore de arquivos de deploy;
- comando de instalação/build;
- comando de start;
- host e porta usados pelo backend;
- caminho e resposta esperada do healthcheck;
- como o frontend é servido;
- variáveis de ambiente não secretas e sua origem;
- limitações de SQLite/persistência;
- status de cada validação: `planejada`, `executada` ou `comprovada por log`;
- URL pública somente se houver evidência real.

### Arquivo JSON obrigatório

A resposta deve fornecer o conteúdo completo de `railway.json` em um bloco JSON válido. O arquivo deve estar na raiz do repositório de aplicação e não pode conter comentários, chaves ou placeholders não explicados. Use o template compartilhado como base e adapte apenas valores sustentados pela topologia escolhida.

### Critério de não sucesso

Se a raiz não contiver `package.json`, `start.sh` e `railway.json`, ou se o comando de start apontar para um arquivo inexistente, o resultado deve ser marcado como `não pronto para deploy`. Não declare sucesso apenas porque a aplicação funciona localmente.

# Contrato de saída — Reservation Prompt Output v1

Use esta estrutura nas cinco variações para que os resultados sejam comparáveis. Quando uma seção não puder ser preenchida com segurança, escreva `não especificado pela fonte` e registre a lacuna.

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
- decisões de validação no servidor.

## 5. Modelo de dados

Apresente entidades, campos essenciais, relacionamentos, estados e restrições. Não invente regras de negócio sem marcá-las como suposição.

## 6. API e fluxos

Para cada operação, informe método, rota, entrada, validações, resposta de sucesso, resposta de erro e efeito na persistência. Inclua solicitação e cancelamento quando fizerem parte da tarefa.

## 7. Interface React

Descreva telas, componentes, campos, estados de carregamento, mensagens de erro e confirmação das operações.

## 8. Artefatos de implementação

Liste cada arquivo novo ou alterado e forneça conteúdo completo ou alteração aplicável. Não omita partes essenciais com reticências.

## 9. Testes e validação

Inclua testes ou cenários verificáveis para cada requisito e fluxo alternativo. Diferencie testes planejados de testes realmente executados.

## 10. Decisões e questões abertas

Liste as suposições adotadas, o impacto de cada uma e as perguntas que o grupo deve responder antes de considerar a feature concluída.

## 11. Resumo comparável

Finalize com:

- principais ganhos da abordagem utilizada;
- limitações;
- possíveis riscos de integração;
- quais informações do contexto foram decisivas;
- o que não pode ser afirmado sem uma execução/teste adicional.

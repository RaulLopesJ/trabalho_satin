# Matriz de testes de prompts

Os cinco testes usam o mesmo system prompt, a mesma tarefa de referência, a mesma stack, o mesmo contrato de saída e o mesmo modelo/configuração. Cada pasta contém o prompt completo e deve ser executada em uma sessão nova do Google AI Studio/API.

## Testes

| ID | Nome | Variável avaliada | Repositório de saída sugerido |
|---|---|---|---|
| T01 | baseline | contexto mínimo, sem técnica adicional | `reserva-test-01-baseline` |
| T02 | few-shot | exemplos de entrada/saída | `reserva-test-02-few-shot` |
| T03 | structured-reasoning | análise em etapas com resumo verificável | `reserva-test-03-structured-reasoning` |
| T04 | full-context | contexto integral disponível | `reserva-test-04-full-context` |
| T05 | curated-context | somente contexto relevante | `reserva-test-05-curated-context` |

## Regra de comparação

- T01, T02 e T03 usam o mesmo contexto mínimo; apenas a técnica muda.
- T04 e T05 usam a mesma tarefa e o mesmo contrato; somente o contexto muda.
- O system prompt é `reservation-system-v1` em todos os casos.
- Não use a resposta de um teste como contexto implícito de outro.
- Salve o payload completo, a resposta bruta, `usageMetadata`, o cálculo de custo e a avaliação antes de aplicar o resultado no repositório de saída.

## Saída de referência

Os cinco testes devem produzir uma vertical slice mínima e executável da reserva/cancelamento, com Node.js, React e SQLite, respeitando o contrato de saída. Depois da comparação, o grupo pode escolher uma abordagem para conduzir o restante do desenvolvimento incremental; isso não altera os resultados brutos dos testes.

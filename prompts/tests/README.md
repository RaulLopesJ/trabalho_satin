# Matriz de testes de prompts

Os cinco testes históricos usam o mesmo system prompt, a mesma tarefa de referência, a mesma stack, o mesmo contrato de saída e o mesmo modelo/configuração. T06 é uma extensão independente para avaliar deploy Railway e usa versões próprias do contexto/contrato.

## Testes

| ID | Nome | Variável avaliada | Repositório de saída sugerido |
|---|---|---|---|
| T01 | baseline | contexto mínimo, sem técnica adicional | `reserva-test-01-baseline` |
| T02 | few-shot | exemplos de entrada/saída | `reserva-test-02-few-shot` |
| T03 | structured-reasoning | análise em etapas com resumo verificável | `reserva-test-03-structured-reasoning` |
| T04 | full-context | contexto integral disponível | `reserva-test-04-full-context` |
| T05 | curated-context | somente contexto relevante | `reserva-test-05-curated-context` |
| T06 | railway-deployment | artefatos e configuração de deploy Railway | `reserva-test-06-railway-deployment` |

## Regra de comparação

- T01, T02 e T03 usam o mesmo contexto mínimo; apenas a técnica muda.
- T04 e T05 usam a mesma tarefa e o mesmo contrato; somente o contexto muda.
- O system prompt é `reservation-system-v1` nos cinco testes históricos.
- T06 usa `deployment-railway-v1` e `output-contract-v2`; seus resultados não devem ser usados como comparação de técnica/contexto com T01–T05.
- Não use a resposta de um teste como contexto implícito de outro.
- Salve o payload completo, a resposta bruta, `usageMetadata`, o cálculo de custo e a avaliação antes de aplicar o resultado no repositório de saída.

## Saída de referência

Os cinco testes históricos devem produzir uma vertical slice mínima e executável da reserva/cancelamento, com Node.js, React e SQLite. T06 deve produzir, além da feature, uma raiz autocontida para Railway com `package.json`, `start.sh`, `railway.json`, healthcheck, porta dinâmica e configuração de API do frontend.

## Validação Railway

Para T06, a evidência deve incluir a validação de JSON, build local, inicialização com `PORT`, `GET /health`, logs do Railway e URL somente quando disponíveis. A mensagem `Script start.sh not found` ou `Railpack could not determine how to build the app` indica que a saída não atende ao contrato de raiz.

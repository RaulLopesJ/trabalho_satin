# Cálculo de custo — `T03` / `20260819-1130-raul`

## Fonte dos dados

- Arquivo da resposta: `response.json`
- Campo de tokens de entrada: `usageMetadata.promptTokenCount`
- Campo de tokens de saída: `usageMetadata.candidatesTokenCount`
- Modelo/API ID: `Gemini 3.7 Flash`
- Fonte oficial do preço: `https://ai.google.dev/gemini-api/docs/pricing`
- Data da consulta do preço: `2026-08-19`
- Moeda/tabela utilizada: `USD`
- Free tier utilizado: `Sim`

## Valores

```text
input_tokens  = não determinado
output_tokens = não determinado
preco_input_por_1M  = 0.075
preco_output_por_1M = 0.30
```

## Fórmula exigida

```text
custo_input  = (input_tokens / 1.000.000) * preco_input_por_1M
custo_output = (output_tokens / 1.000.000) * preco_output_por_1M
custo_total  = custo_input + custo_output
```

## Resultado

```text
custo_input  = não determinado
custo_output = não determinado
custo_total  = não determinado
```

Como os tokens não foram determinados na execução interativa direta, o cálculo numérico exato não pôde ser completado. O custo real cobrado no console do provedor foi zero devido à utilização do free tier.

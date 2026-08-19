# Cálculo de custo — `T01` / `run_001`

## Fonte dos dados

- Arquivo da resposta: `response.json` / `/status session`
- Campo de tokens de entrada: `usageMetadata.promptTokenCount`
- Campo de tokens de saída: `usageMetadata.candidatesTokenCount`
- Modelo/API ID: `gemini-1.5-flash`
- Fonte oficial do preço: `https://ai.google.dev/gemini-api/docs/pricing`
- Data da consulta do preço: `2026-08-19`
- Moeda/tabela utilizada: `USD (Dólar Americano)`
- Free tier utilizado: `Sim`

## Valores

```text
input_tokens  = <insira_tokens_de_entrada>
output_tokens = <insira_tokens_de_saida>
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
custo_input  = <calcular_custo_input>
custo_output = <calcular_custo_output>
custo_total  = <calcular_custo_total_usd>
```

Se a chamada utilizou free tier, registre que o custo real cobrado foi zero, mas mantenha este cálculo hipotético com a tabela paga, conforme o enunciado. Não informe custo zero quando os tokens não estiverem disponíveis; use `não determinado` e explique.

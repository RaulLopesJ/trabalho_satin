# Cálculo de custo — `T0X` / `<run-id>`

## Fonte dos dados

- Arquivo da resposta: `response.json`
- Campo de tokens de entrada: `usageMetadata.promptTokenCount`
- Campo de tokens de saída: `usageMetadata.candidatesTokenCount`
- Modelo/API ID: `<preencher exatamente como no request>`
- Fonte oficial do preço: `<URL oficial do provedor>`
- Data da consulta do preço: `<AAAA-MM-DD>`
- Moeda/tabela utilizada: `<preencher>`
- Free tier utilizado: `<sim/não>`

## Valores

```text
input_tokens  = <preencher>
output_tokens = <preencher>
preco_input_por_1M  = <preencher>
preco_output_por_1M = <preencher>
```

## Fórmula exigida

```text
custo_input  = (input_tokens / 1.000.000) * preco_input_por_1M
custo_output = (output_tokens / 1.000.000) * preco_output_por_1M
custo_total  = custo_input + custo_output
```

## Resultado

```text
custo_input  = <preencher>
custo_output = <preencher>
custo_total  = <preencher>
```

Se a chamada utilizou free tier, registre que o custo real cobrado foi zero, mas mantenha este cálculo hipotético com a tabela paga, conforme o enunciado. Não informe custo zero quando os tokens não estiverem disponíveis; use `não determinado` e explique.

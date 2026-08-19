# Comparação de custo

Use os preços oficiais do modelo/API ID efetivamente utilizado. Registre a URL e a data da consulta em cada conjunto de chamadas.

| Teste | Run ID | Input tokens | Output tokens | Preço input/1M | Preço output/1M | Custo input | Custo output | Custo total | Status |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| T01 | | | | | | | | | |
| T02 | | | | | | | | | |
| T03 | | | | | | | | | |
| T04 | | | | | | | | | |
| T05 | | | | | | | | | |

## Fórmula

```text
custo = (tokens_input / 1.000.000 * preco_input)
       + (tokens_output / 1.000.000 * preco_output)
```

## Totais

```text
total_sessao_T01 = soma das chamadas T01
total_sessao_T02 = soma das chamadas T02
total_sessao_T03 = soma das chamadas T03
total_sessao_T04 = soma das chamadas T04
total_sessao_T05 = soma das chamadas T05
total_experimento = soma de T01 até T05
```

O free tier pode ter custo real igual a zero, mas a atividade exige o custo hipotético como se a tabela paga fosse utilizada. Apresente os dois valores quando aplicável.

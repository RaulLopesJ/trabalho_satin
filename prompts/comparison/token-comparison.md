# Comparação de tokens

Preencha uma linha para cada execução válida e uma linha separada para cada retry/falha relevante.

| Teste | Run ID | Modelo/API ID | Contexto | Técnica | Input tokens | Output tokens | Total informado | Fonte da evidência | Status |
|---|---|---|---|---|---:|---:|---:|---|---|
| T01 | | | minimal | none | | | | | |
| T02 | | | minimal | few-shot | | | | | |
| T03 | | | minimal | structured reasoning | | | | | |
| T04 | | | full | none | | | | | |
| T05 | | | curated | none | | | | | |

## Comparação obrigatória T04 × T05

```text
redução_input_tokens = input_T04 - input_T05
redução_percentual = ((input_T04 - input_T05) / input_T04) * 100
```

Se `input_T04` for zero, ausente ou não comprovado, não calcule percentual. Explique a limitação.

## Observações

- O campo oficial de entrada esperado para a API Gemini é `usageMetadata.promptTokenCount`.
- O campo oficial de saída esperado é `usageMetadata.candidatesTokenCount`.
- Não substitua valor ausente por zero.
- Inclua tokens de exemplos few-shot e de todo o contexto enviado.

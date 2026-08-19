# T05 — Contexto curado

## Objetivo

Medir se somente os trechos relevantes dos casos HPET04 e HPET04a produzem uma solução suficiente com menor consumo de tokens e menor ruído.

## Variável do teste

Somente o contexto muda em relação ao T04. A tarefa, o system prompt, a stack, o contrato, o modelo e as configurações devem ser idênticos.

## Execução

1. Abra uma conversa nova ou faça uma chamada independente.
2. Envie o conteúdo integral de `prompt/assembled-prompt.md`.
3. Salve request, resposta, tokens, custo e avaliação individual.
4. Compare diretamente com a chamada correspondente do T04.

## Pergunta de comparação

O contexto curado mantém as regras necessárias para HPET04/HPET04a e reduz tokens/custo sem perda de qualidade ou rastreabilidade?

## Repositório de saída

`reserva-test-05-curated-context` — registrar a URL/commit em `output-repository.md`.

# T04 — Contexto completo

## Objetivo

Medir o efeito de fornecer todo o contexto disponível do overview e dos casos fornecidos, incluindo itens relacionados que não são necessários para a vertical slice.

## Variável do teste

Somente o conteúdo de contexto muda em relação ao T05. System prompt, tarefa, stack, contrato, modelo e configurações devem ser idênticos.

## Execução

1. Abra uma conversa nova ou faça uma chamada independente.
2. Envie o conteúdo integral de `prompt/assembled-prompt.md`.
3. Registre que o contexto inclui títulos/anchors e lacunas do overview, sem transformar títulos em requisitos detalhados.
4. Salve request, resposta, tokens, custo e avaliação individual.

## Pergunta de comparação

O contexto amplo melhora o resultado ou aumenta tokens, custo e distrações com casos que não pertencem ao escopo HPET04/HPET04a?

## Repositório de saída

`reserva-test-04-full-context` — registrar a URL/commit em `output-repository.md`.

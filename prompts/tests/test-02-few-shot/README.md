# T02 — Few-shot

## Objetivo

Avaliar se exemplos curtos e deliberados aumentam a consistência da análise, da rastreabilidade, das validações e da estrutura dos artefatos gerados.

## Variável do teste

Os mesmos dados do T01, acrescidos de exemplos few-shot. Não adicionar instruções de contexto integral ou raciocínio estruturado.

## Execução

1. Abra uma conversa nova ou faça uma chamada independente.
2. Envie o conteúdo integral de `prompt/assembled-prompt.md`.
3. Preserve os exemplos como parte da entrada; os tokens dos exemplos entram no custo.
4. Salve request, resposta, tokens, custo e avaliação individual.

## Pergunta de comparação

Os exemplos ajudam o modelo a seguir o formato e a transformar regras em validações sem aumentar desproporcionalmente a entrada ou copiar decisões que não estão na fonte?

## Repositório de saída

`reserva-test-02-few-shot` — registrar a URL/commit em `output-repository.md`.

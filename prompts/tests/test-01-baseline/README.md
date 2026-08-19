# T01 — Baseline

## Objetivo

Obter a referência de qualidade, completude, tokens e custo usando o system prompt comum, a tarefa canônica, a stack e somente o contexto mínimo. Não há few-shot, orientação de raciocínio estruturado ou contexto integral.

## Variável do teste

Contexto mínimo e nenhuma técnica adicional.

## Execução

1. Abra uma conversa nova ou faça uma chamada independente.
2. Envie o conteúdo integral de `prompt/assembled-prompt.md` na modalidade correspondente: system instruction e user message.
3. Use o modelo e as configurações declarados no `manifest.json`.
4. Salve o request e a resposta em `executions/<identificador>/`.
5. Não corrija a resposta antes de salvar o resultado bruto.

## Pergunta de comparação

O que o modelo consegue produzir sem exemplos e sem receber os detalhes completos dos casos de uso? Ele reconhece as lacunas ou inventa regras?

## Repositório de saída

`reserva-test-01-baseline` — registrar a URL/commit em `output-repository.md`.

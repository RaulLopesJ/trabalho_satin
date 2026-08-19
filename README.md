# Experimento de engenharia de prompts — reserva de hospedagem

Este repositório controla os cinco testes de prompt usados para gerar, em repositórios separados, uma vertical slice de reserva de hospedagem para pets.

## Escopo

- Casos de uso: HPET04 — Solicitar Reserva e HPET04a — Cancelar Reserva/Solicitação.
- Stack solicitada: Node.js, React e SQLite.
- Modelo informado pelo grupo: Gemini 3.7 Flash. O identificador real usado pela API precisa ser confirmado no Google AI Studio e registrado em todos os manifests/runs.
- System prompt comum: `shared/system/reservation-system-v1.md`.
- Contrato de saída comum: `shared/output/output-contract-v1.md`.

## Como executar um teste

1. Escolha uma pasta em `tests/test-XX-*`.
2. Leia seu `README.md` e confirme o `manifest.json`.
3. Abra uma sessão nova no Google AI Studio ou faça uma chamada independente pela API.
4. Envie `prompt/assembled-prompt.md` separando o bloco de system instruction do bloco de user message.
5. Use o modelo e as configurações fixadas no manifesto. Não inclua a chave no arquivo do request.
6. Salve o request sem segredo, a resposta JSON bruta, os campos `usageMetadata`, o cálculo de custo e os prints na pasta de execução do integrante.
7. Registre o repositório que receberá o resultado em `output-repository.md`.
8. Só depois de salvar a evidência bruta aplique o resultado no repositório de saída correspondente.

## Convenção de execução

```text
tests/test-XX-nome/executions/<identificador-do-integrante>/
├── request.json
├── response.json
├── output.md
├── usage.json
├── cost.md
├── evaluation.md
└── screenshots/
```

Não sobrescreva uma execução. Se o prompt ou a configuração mudar, crie um novo `run_id` e atualize a versão do manifesto.

## Matriz

- T01: baseline com contexto mínimo.
- T02: contexto mínimo + few-shot.
- T03: contexto mínimo + raciocínio estruturado com resumo verificável.
- T04: contexto integral disponível.
- T05: somente contexto relevante de HPET04/HPET04a.

## Regra de validade

T01/T02/T03 permitem comparar técnicas porque mantêm o contexto mínimo e a tarefa. T04/T05 permitem comparar curadoria porque mantêm system prompt, tarefa, stack, contrato, modelo e configurações, alterando apenas o contexto. Não compare resultados se qualquer uma dessas condições tiver mudado sem registrar a mudança.

## Segurança

- Nunca versionar API keys, tokens, `.env` ou dados pessoais reais.
- O arquivo `gemini-response.json` existente registra apenas `API_KEY_INVALID`; ele não é evidência de uma chamada válida nem deve ser usado para inventar tokens/custos.
- Não coloque credenciais nos arquivos `request.json`.

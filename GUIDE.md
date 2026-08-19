# Instruções de Projeto - Engenharia de Prompt

Este arquivo define os comandos e fluxos para a execução dos testes de engenharia de prompt.

## Comando: `Execute Test TXX` (ex: `Execute Test T01`)

Ao receber este comando, o agente deve:

1. **Carregar Configurações**:
   - Ler `prompts/tests/test-XX/manifest.json`.
   - Ler `prompts/tests/test-XX/prompt/assembled-prompt.md`.

2. **Adotar Comportamento**:
   - Assumir a `SYSTEM INSTRUCTION` contida no `assembled-prompt.md` como diretriz primária.
   - Seguir as regras da `USER MESSAGE` para a implementação técnica.

3. **Isolamento de Diretórios**:
   - **FONTE DE VERDADE**: `prompts/shared/` e `prompts/tests/test-XX/`.
   - **SAÍDA DE CÓDIGO**: `repositories/<output_repository_name>/`.
   - **EVIDÊNCIAS**: `prompts/tests/test-XX/executions/raul/run_<next_id>/`.
   - **PROIBIDO TOCAR**: Qualquer arquivo em `prompts/` que não seja da execução atual ou da pasta `shared`. Nunca modificar o código de outro teste.

4. **Registro de Métricas**:
   - Após a implementação, solicitar ao usuário o output de `/status session`.
   - Ajudar a preencher `usage.json` e `cost.md` com os dados fornecidos.

## Estrutura de Pastas

- `prompts/`: Contém as definições dos testes, técnicas e templates.
- `repositories/`: Contém o código gerado (a vertical slice) para cada teste.
- `docs/`: Documentação geral do trabalho.

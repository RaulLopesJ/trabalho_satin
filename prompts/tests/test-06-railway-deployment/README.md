# T06 — Railway deployment

## Objetivo

Verificar se o prompt consegue gerar uma vertical slice funcional com artefatos de raiz suficientes para o Railway detectar, construir, iniciar e verificar o sistema.

Este teste é uma extensão de deploy e não substitui nem reescreve os resultados históricos T01–T05.

## Variável avaliada

Completude e verificabilidade da configuração de deploy: raiz do monorepo, `package.json`, `start.sh`, `railway.json`, porta dinâmica, healthcheck, build do frontend e comunicação frontend/backend.

## Execução

1. Abra uma sessão nova ou faça uma chamada independente usando `prompt/assembled-prompt.md`.
2. Envie o bloco system e o bloco user separadamente.
3. Use o modelo/configuração do `manifest.json`.
4. Salve `request.json`, `response.json`, `usage.json`, `cost.md` e `evaluation.md` em `executions/<identificador>/`.
5. Preserve a resposta bruta antes de corrigir qualquer arquivo.
6. Verifique se o output contém `railway.json` válido e os arquivos de raiz exigidos.
7. Execute build/local smoke test apenas quando isso estiver registrado como executado; depois faça o deploy e guarde o log do Railway.

## Critérios de aceite

- A raiz da aplicação gerada contém `package.json`, `start.sh`, `railway.json`, `.gitignore`, backend e frontend.
- O build é executável a partir da raiz.
- O backend consome `process.env.PORT`, escuta em `0.0.0.0` e expõe `GET /health`.
- O frontend não depende de `localhost` em produção.
- `railway.json` é JSON válido e aponta para um comando existente.
- O README diferencia plano, execução e deploy comprovado.

## Evidência do problema de referência

A falha anterior do Railway mostrou o Railpack reportando `Script start.sh not found` e `Railpack could not determine how to build the app`. Essa evidência deve ser usada para verificar que a nova saída não omite os artefatos de raiz.

## Repositório de saída

`reserva-test-06-railway-deployment` — registrar URL, branch, commits, configuração do Railway e URL publicada somente após evidência.

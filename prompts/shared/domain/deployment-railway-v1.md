# Contexto de deploy — Railway v1

## Objetivo

Quando a tarefa pedir uma aplicação pronta para publicação no Railway, a solução deve ser gerada como um artefato executável e verificável, não apenas como uma árvore de arquivos local. O erro de referência que esta regra evita é o Railpack analisar uma raiz sem `package.json` ou `start.sh` e retornar `Railpack could not determine how to build the app`.

A ausência de evidência de deploy não pode ser transformada em afirmação de sucesso. O modelo deve distinguir configuração planejada, build executado e deploy comprovado por log.

## Topologia padrão

Use por padrão um único serviço Railway para uma aplicação autocontida:

- `frontend/` contém React + Vite e gera `frontend/dist`;
- `backend/` contém Node.js + Express;
- o backend serve `frontend/dist` e também expõe as rotas `/api`;
- a raiz do repositório contém o `package.json` orquestrador, `package-lock.json`, `start.sh` e `railway.json`;
- existe uma única porta fornecida pelo Railway.

Se a tarefa solicitar explicitamente dois serviços, não escolha essa topologia silenciosamente: gere a configuração de cada serviço, a URL/configuração da API, CORS e a ordem de publicação.

## Artefatos obrigatórios na raiz

A resposta deve gerar conteúdo completo para:

1. `package.json` raiz com scripts `build` e `start`;
2. `start.sh` raiz com `set -euo pipefail` e `exec` do processo principal;
3. `railway.json` raiz, válido como JSON e seguindo o template compartilhado;
4. `.gitignore` raiz sem segredos, `node_modules`, builds e bancos locais;
5. `package-lock.json` deve ser gerado pelo npm após validar o workspace; nunca invente seu conteúdo manualmente;
6. um `README.md` com comandos locais, build, configuração do Railway, limitações e evidências.

Não crie uma instrução `start.sh` se o arquivo não estiver presente. Não configure o Railway para executar um caminho inexistente.

## Regras de runtime

- O servidor deve usar `Number(process.env.PORT || 3001)`; nunca depender apenas de uma porta fixa.
- O servidor deve escutar em `0.0.0.0` quando a biblioteca/framework permitir.
- Deve existir `GET /health` retornando HTTP 200 e um JSON pequeno, por exemplo `{ "status": "ok" }`.
- As rotas `/api` devem ser registradas antes do fallback da SPA.
- O backend deve servir o build do frontend depois que `npm run build` for executado.
- O processo iniciado pelo Railway deve permanecer em foreground; use `exec` no `start.sh`.
- O frontend não pode usar `http://localhost:3001` fixo em produção. Use uma base configurável por `VITE_API_URL` ou, na topologia de um serviço, chamadas relativas como `/api/hosts`.
- `PORT` é fornecida pela plataforma; não peça ao usuário para criar um segredo com esse nome.

## Configuração Railway

Gere `railway.json` na raiz com o conteúdo completo. A configuração mínima esperada é:

```json
{
  "build": {
    "builder": "RAILPACK",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "bash start.sh",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

O template compartilhado omite a referência remota `$schema` para manter o arquivo portátil; ela é apenas metadado de editor e não substitui a validação da configuração pelo Railway. Se o schema ou o builder aceito pela plataforma tiver mudado, registre a divergência e a versão consultada; não declare a configuração válida apenas por aparência.

A configuração de `Root Directory` é uma configuração do serviço Railway e deve ser documentada separadamente. Para um repositório de aplicação autocontido, use `/`. Para uma aplicação mantida dentro de outro monorepo, use o caminho absoluto relativo à raiz Git, por exemplo `/repositories/reserva-test-01-baseline`, e confirme que essa pasta contém o `package.json` orquestrador.

## Dependências e persistência

- Prefira scripts npm na raiz a comandos dependentes de um shell local específico.
- Não inclua chaves, tokens ou valores pessoais em arquivos de configuração.
- SQLite em memória ou no filesystem efêmero serve apenas para protótipo; informe que os dados podem desaparecer em reinício/redeploy.
- Não invente volume, banco gerenciado, domínio ou variável secreta sem solicitação.

## Validação exigida

A saída deve listar comandos verificáveis, distinguindo planejado de executado:

```bash
npm install
npm run build
PORT=3001 npm start
curl -i http://localhost:3001/health
```

Para cada comando, informe pré-condições e resultado somente quando houver evidência. O relatório deve registrar o caminho do `railway.json`, o comando de build, o comando de start, o healthcheck, a topologia, o `Root Directory` e as limitações conhecidas.

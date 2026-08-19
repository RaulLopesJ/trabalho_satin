# Tarefa canônica — vertical slice de reserva com deploy Railway v1

Você deve projetar e gerar uma vertical slice mínima, executável e autocontida da feature de reserva de hospedagem para pets, usando Node.js no backend, React no frontend e SQLite local pré-populado.

A vertical slice deve cobrir somente HPET04 — Solicitar Reserva e HPET04a — Cancelar Reserva/Solicitação. Não implemente o sistema Hospetse inteiro.

## Entrega funcional

1. Proponha arquitetura e árvore de arquivos.
2. Modele tutor, pet, host, reserva/solicitação e serviços adicionais somente quando sustentados pelo contexto.
3. Gere backend Node.js com rotas, validações no servidor, persistência e fluxos de sucesso/erro.
4. Gere frontend React com seleção, datas, confirmação, histórico, cancelamento e mensagens.
5. Inclua dados de demonstração.
6. Inclua testes ou cenários verificáveis.

## Entrega de deploy obrigatória

Gere a aplicação como um único serviço Railway por padrão. O repositório da aplicação deve ser autocontido e conter na raiz:

```text
package.json
package-lock.json
start.sh
railway.json
.gitignore
backend/
frontend/
README.md
```

O `package.json` raiz deve orquestrar o build do frontend e o start do backend. O `start.sh` deve existir e iniciar o processo em foreground. O `railway.json` deve ser JSON válido e conter build, start, healthcheck e política de restart. O backend deve usar `process.env.PORT || 3001`, escutar em `0.0.0.0` e expor `GET /health`. O backend deve servir o build React para manter uma única porta, salvo se uma topologia de dois serviços for explicitamente justificada.

O frontend não pode usar `http://localhost:3001` fixo em produção. Use chamadas relativas `/api/...` na topologia de serviço único ou `VITE_API_URL` quando uma topologia separada for realmente necessária.

Inclua o conteúdo completo de `railway.json`, `start.sh`, `package.json` raiz, `.gitignore` e README. Não invente `package-lock.json`: informe o comando que deve gerá-lo após a validação do workspace.

## Regras de escopo e segurança

- A solicitação deve ser enviada ao host; não invente aceitação automática.
- Reserva concluída não pode ser cancelada.
- Regras ausentes devem ser marcadas como suposições ou questões abertas.
- Não inclua segredos, chaves de API ou dados reais.
- Não declare build, testes ou deploy executados sem evidência.
- Diferencie configuração planejada, validação local executada e deploy comprovado por log.

Siga integralmente o contrato `Reservation Prompt Output v2` fornecido depois desta tarefa.

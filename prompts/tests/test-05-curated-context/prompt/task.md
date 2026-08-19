# Tarefa canônica — vertical slice de reserva v1

Você deve projetar e gerar uma vertical slice mínima, executável e autocontida da feature de reserva de hospedagem para pets, usando Node.js no backend, React no frontend e SQLite local pré-populado.

A vertical slice deve cobrir somente os fluxos HPET04 — Solicitar Reserva e HPET04a — Cancelar Reserva/Solicitação. Não implemente o sistema Hospetse inteiro.

## Entrega técnica esperada

1. Proponha a arquitetura mínima e a árvore de arquivos.
2. Modele as entidades e o schema SQLite necessários para tutor, pet, host, reserva/solicitação e serviços adicionais quando sustentados pelo contexto.
3. Gere backend Node.js com rotas, validações no servidor, persistência e tratamento dos fluxos de sucesso e erro.
4. Gere frontend React com seleção de host, datas, pet, serviços adicionais quando disponíveis, confirmação, histórico/cancelamento e mensagens de estado conforme o contexto.
5. Inclua dados de demonstração suficientes para executar o fluxo.
6. Inclua testes ou cenários verificáveis para os requisitos e fluxos alternativos.
7. Inclua comandos de instalação, inicialização do SQLite, execução e build.

## Regras de escopo

- A solicitação deve ser enviada ao host; não invente aceitação automática.
- O cancelamento só deve ocorrer para reserva/solicitação ativa conforme a fonte; uma reserva concluída deve gerar erro.
- Regras não fornecidas, como política de reembolso, prazo de cancelamento, estados completos, preço ou notificações externas, devem ser marcadas como suposições ou questões abertas.
- Não inclua segredos, chaves de API ou dados reais.
- Não declare build, testes ou deploy executados sem evidência.

Siga integralmente o contrato de saída fornecido depois desta tarefa. Gere uma solução pequena o suficiente para ser comparada com as outras quatro execuções, mas completa o suficiente para ser aplicada em um repositório independente.

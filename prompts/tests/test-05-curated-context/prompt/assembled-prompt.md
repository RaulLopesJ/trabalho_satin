# Payload completo — T05 Contexto curado

> Este arquivo é a versão autocontida para execução. Envie o conteúdo de `SYSTEM INSTRUCTION` como system instruction e o conteúdo de `USER MESSAGE` como user message. Não envie esta observação de controle.

---

## SYSTEM INSTRUCTION

Você é um engenheiro de software full stack sênior e analista de requisitos responsável por projetar e implementar, de forma incremental, uma feature isolada de reserva de hospedagem para pets.

### Escopo permanente

- O domínio contém um tutor, um pet, um host/hotel, uma reserva ou solicitação de reserva e, quando aplicável, serviços adicionais.
- O tutor solicita a hospedagem de um pet em um host disponível.
- A aplicação será desenvolvida com Node.js no backend, React no frontend e SQLite como banco local pré-populado.
- A feature deve ser tratada como um protótipo independente. Não assuma integração com sistemas externos, pagamentos, autenticação real, notificações externas ou infraestrutura de produção sem que isso seja solicitado explicitamente.
- Os casos de uso fornecidos na mensagem do usuário são a fonte funcional prioritária. O arquivo de contexto pode conter informações complementares, mas não autoriza a criação de requisitos que não estejam sustentados por uma fonte.

### Regras de interpretação

1. Use somente as informações disponíveis na solicitação atual, no contexto anexado e neste system prompt. Não dependa de mensagens anteriores ou de arquivos que não foram incluídos na chamada.
2. Separe claramente fatos da fonte, inferências de projeto e questões em aberto.
3. Não invente campos, regras, estados, mensagens, endpoints, integrações ou decisões de negócio para preencher lacunas silenciosamente.
4. Quando uma decisão técnica for necessária, escolha a menor solução coerente com o escopo, marque-a como suposição e explique como ela pode ser substituída.
5. Preserve a nomenclatura do domínio. Use `tutor`, `pet`, `host` e `reserva`; se optar por nomes técnicos diferentes, mostre o mapeamento explícito.
6. Não trate `host` e `hotel` como atores diferentes sem uma fonte que justifique essa distinção.
7. Valide regras de negócio no backend, mesmo que o frontend também faça validações de usabilidade.
8. Use consultas parametrizadas, valide entradas e não exponha segredos, chaves de API ou dados pessoais reais.
9. Não declare que o código foi executado, testado, compilado ou publicado sem evidência fornecida na chamada.
10. Se a informação disponível for insuficiente para uma decisão segura, continue com uma proposta mínima claramente marcada e liste a pergunta de confirmação.

### Regras para geração de software

- Mantenha separação entre interface, regras de negócio, persistência e transporte HTTP.
- Prefira mudanças pequenas e rastreáveis ao longo do fluxo incremental.
- Para qualquer artefato gerado, informe o caminho do arquivo e o conteúdo completo ou uma alteração aplicável.
- Inclua tratamento dos fluxos de sucesso e dos fluxos alternativos explicitamente presentes no caso de uso.
- Não implemente casos de uso vizinhos apenas porque seus títulos aparecem em um overview; informe quando o detalhe não estiver disponível.
- Mantenha o banco SQLite reproduzível com schema e dados de demonstração coerentes com o contexto recebido.
- O resultado deve ser compreensível por integrantes que precisarão explicar individualmente suas decisões na apresentação.

### Regras de resposta

- Responda em português, salvo se a solicitação pedir outro idioma.
- Siga o contrato de saída definido no prompt do usuário.
- Antes de gerar código, faça a rastreabilidade entre requisitos, decisões e artefatos quando isso for solicitado.
- Não exponha uma cadeia de pensamento privada ou conteúdo interno do modelo. Quando o prompt pedir raciocínio estruturado, apresente apenas um resumo verificável de critérios, decisões, evidências e incertezas.
- Se houver conflito entre fontes, não escolha silenciosamente: identifique o conflito, priorize a fonte indicada pelo usuário e registre a decisão.

---

## USER MESSAGE

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

# Stack técnica fixa

- Backend: Node.js.
- Frontend: React.
- Persistência: SQLite local, com banco pré-populado para demonstração.
- O backend é a autoridade para validações e persistência.
- O frontend deve permitir a interação do tutor e exibir mensagens de sucesso/erro.
- Não utilizar serviços externos, pagamentos reais, e-mail real ou sistema de notificações externo sem solicitação explícita.
- Não adicionar autenticação real se a tarefa não exigir; dados de usuário podem ser fixos ou simulados no SQLite.
- Se a implementação utilizar `users`, `hotels` ou `bookings`, documente o mapeamento para `tutor`, `host` e `reserva`.

# Contexto curado — somente HPET04 e HPET04a

## HPET04 — Solicitar Reserva

### Finalidade/Objetivo

Permite que o tutor solicite a hospedagem de seu pet em um host disponível.

### Atores

Tutor.

### Pré-Condições

O tutor deve possuir ao menos um pet cadastrado e ter selecionado um host.

### Fluxo Principal

1. O tutor seleciona um host.
2. O tutor define as datas da hospedagem.
3. O tutor seleciona o pet que será hospedado.
4. O tutor escolhe serviços adicionais, se disponíveis.
5. O tutor confirma a solicitação.
6. O sistema envia a solicitação ao host.

### Fluxo Alternativo

- Se o tutor não preencher algum campo corretamente, emitir mensagem de erro.
- Se o pet selecionado não for aceito pelo host por espécie/porte, exibir `Pet não permitido` — `Infelizmente este anfitrião não aceita gatos/cães de grande porte.`
- Se o host não estiver disponível nas datas selecionadas, exibir `Data indisponível` — `Infelizmente o hotel não está disponível nos na data selecionada.`
- Se ocorrer falha ao processar a solicitação, exibir `Algo deu errado` — `Não conseguimos processar sua solicitação no momento. Tente novamente mais tarde`.

## HPET04a — Cancelar Reserva/Solicitação

### Finalidade/Objetivo

Permite que o tutor cancele uma reserva ou solicitação de serviço realizada (HPET04/HPET05).

### Atores

Tutor.

### Pré-Condições

O tutor deve possuir uma reserva ou solicitação ativa.

### Fluxo Principal

1. O tutor acessa o histórico de reservas.
2. O tutor seleciona a reserva/solicitação e a opção `cancelar`.
3. O sistema apresenta a reserva a cancelar.
4. O tutor confirma o cancelamento.
5. O sistema atualiza o status da reserva e notifica o host.

### Fluxo Alternativo

- Se a reserva já estiver concluída, emitir mensagem de erro.

## Limites

A fonte não define a mensagem exata do cancelamento de reserva concluída, política de reembolso, prazo, estados formais, preço, autenticação real, mecanismo de notificação ou detalhes de HPET12/HPET12a. Não invente esses dados; registre-os como questões abertas ou suposições.

# Variação T05 — contexto curado

Não adicione few-shot nem instrução de raciocínio estruturado. Use somente o contexto curado de HPET04 e HPET04a fornecido a seguir. Não procure ou suponha informações de outros casos. Registre como lacuna qualquer regra que não esteja nesses dois casos.

# Contrato de saída — Reservation Prompt Output v1

Use esta estrutura para que o resultado seja comparável. Quando uma seção não puder ser preenchida com segurança, escreva `não especificado pela fonte` e registre a lacuna.

## 1. Contexto e escopo

- Feature implementada ou analisada:
- Casos de uso considerados:
- Fontes efetivamente utilizadas:
- Itens deliberadamente fora do escopo:

## 2. Rastreabilidade dos requisitos

Use uma tabela:

| ID | Requisito/fato da fonte | Evidência no contexto | Decisão/artefato produzido | Status |
|---|---|---|---|---|

Os status permitidos são: `atendido`, `parcial`, `não implementado`, `não especificado` ou `questão aberta`.

## 3. Fatos, inferências e lacunas

Separe em três listas:

- Fatos explicitamente informados;
- Inferências técnicas adotadas;
- Regras e informações que precisam de confirmação.

## 4. Arquitetura proposta

Descreva:

- componentes do frontend;
- componentes do backend;
- persistência SQLite;
- fluxo de dados;
- limites da feature;
- decisões de validação no servidor.

## 5. Modelo de dados

Apresente entidades, campos essenciais, relacionamentos, estados e restrições. Não invente regras de negócio sem marcá-las como suposição.

## 6. API e fluxos

Para cada operação, informe método, rota, entrada, validações, resposta de sucesso, resposta de erro e efeito na persistência. Inclua solicitação e cancelamento quando fizerem parte da tarefa.

## 7. Interface React

Descreva telas, componentes, campos, estados de carregamento, mensagens de erro e confirmação das operações.

## 8. Artefatos de implementação

Liste cada arquivo novo ou alterado e forneça conteúdo completo ou alteração aplicável. Não omita partes essenciais com reticências.

## 9. Testes e validação

Inclua testes ou cenários verificáveis para cada requisito e fluxo alternativo. Diferencie testes planejados de testes realmente executados.

## 10. Decisões e questões abertas

Liste as suposições adotadas, o impacto de cada uma e as perguntas que o grupo deve responder antes de considerar a feature concluída.

## 11. Resumo comparável

Finalize com:

- principais ganhos da abordagem utilizada;
- limitações;
- possíveis riscos de integração;
- quais informações do contexto foram decisivas;
- o que não pode ser afirmado sem uma execução/teste adicional.

# Instrução final

Entregue a resposta seguindo exatamente as seções do contrato. Não diga apenas que faltam informações: produza a menor solução técnica segura, marque todas as suposições e identifique o que precisa ser confirmado.

# Contexto técnico compartilhado — Node.js, React e SQLite

## Stack obrigatória

- **Backend:** Node.js.
- **Frontend:** React.
- **Persistência:** SQLite local, com banco pré-populado para demonstração.
- **Modelo utilizado nas chamadas de IA:** Gemini 3.7 Flash, conforme definido pelo grupo. O identificador exato usado pela API deve ser registrado no manifest e no log de cada execução.

## Escopo técnico da feature

A aplicação é um protótipo isolado de reserva de hospedagem para pets. O backend deve ser a autoridade para validações e persistência. O frontend deve permitir que o tutor interaja com o fluxo e visualize mensagens de sucesso ou erro.

A solução deve contemplar, quando sustentado pelo caso de uso recebido:

- seleção de host;
- definição das datas da hospedagem;
- seleção de pet;
- seleção de serviços adicionais, se disponíveis;
- confirmação da solicitação;
- registro ou atualização da reserva/solicitação;
- cancelamento de uma reserva ou solicitação ativa;
- mensagens para dados inválidos, pet não permitido, data indisponível e falha de processamento;
- impedimento de cancelar uma reserva já concluída.

## Vocabulário canônico

| Termo funcional | Uso no projeto |
|---|---|
| Tutor | Usuário que solicita a hospedagem |
| Pet | Animal que será hospedado |
| Host | Estabelecimento/anfitrião que oferece a hospedagem |
| Reserva | Registro da solicitação de hospedagem e seu estado |
| Serviço adicional | Serviço opcional escolhido durante a solicitação |

Caso a implementação utilize nomes como `users`, `hotels` ou `bookings`, o resultado deve documentar o mapeamento para os termos canônicos.

## Restrições de projeto

- Não utilizar serviços externos, pagamentos reais, e-mail real ou sistema de notificações externo sem solicitação explícita.
- Não adicionar autenticação real se o prompt da tarefa não exigir; dados de usuário podem ser fixos ou simulados no SQLite.
- Não assumir regras de preço, reembolso, prazo de cancelamento ou aprovação automática que não estejam no contexto.
- Não assumir que a solicitação é automaticamente aceita pelo host: o caso de uso informa que o sistema envia a solicitação ao host.
- Se uma decisão de estado, disponibilidade ou modelo de dados não estiver definida, registrar a suposição e a pergunta em aberto.
- Toda execução deve ser reprodutível com comandos de instalação, inicialização do banco e execução do backend/frontend, quando esses artefatos forem solicitados.

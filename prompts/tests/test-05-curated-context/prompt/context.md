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

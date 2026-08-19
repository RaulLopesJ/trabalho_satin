# Regras de negócio compartilhadas — HPET04 e HPET04a

> Fonte funcional: casos de uso fornecidos pelo grupo a partir do material de casos de uso. O texto abaixo deve ser tratado como requisito do experimento; lacunas devem ser sinalizadas, não preenchidas silenciosamente.

## HPET04 — Solicitar Reserva

### Objetivo

Permitir que o tutor solicite a hospedagem de seu pet em um host disponível.

### Ator

- Tutor.

### Pré-condições

- O tutor deve possuir ao menos um pet cadastrado.
- O tutor deve ter selecionado um host.

### Fluxo principal

1. O tutor seleciona um host.
2. O tutor define as datas da hospedagem.
3. O tutor seleciona o pet que será hospedado.
4. O tutor escolhe serviços adicionais, se disponíveis.
5. O tutor confirma a solicitação.
6. O sistema envia a solicitação ao host.

### Fluxos alternativos e mensagens

- Se algum campo não for preenchido corretamente, o sistema deve emitir uma mensagem de erro.
- Se o pet selecionado não for aceito pelo host por espécie ou porte, exibir:
  - título: `Pet não permitido`;
  - detalhe fornecido: `Infelizmente este anfitrião não aceita gatos/cães de grande porte.`
- Se o host não estiver disponível nas datas selecionadas, exibir:
  - título: `Data indisponível`;
  - detalhe fornecido: `Infelizmente o hotel não está disponível nos na data selecionada.`
- Se ocorrer uma falha ao processar a solicitação, exibir:
  - título: `Algo deu errado`;
  - detalhe: `Não conseguimos processar sua solicitação no momento. Tente novamente mais tarde`.

A frase de data contém uma inconsistência textual na fonte (`nos na data`). O resultado deve preservar a mensagem de origem ou propor uma correção explicitamente identificada como decisão de apresentação; não deve alterar o requisito silenciosamente.

## HPET04a — Cancelar Reserva/Solicitação

### Objetivo

Permitir que o tutor cancele uma reserva ou solicitação de serviço realizada, incluindo HPET04/HPET05 conforme o texto da fonte.

### Ator

- Tutor.

### Pré-condições

- O tutor deve possuir uma reserva ou solicitação ativa.

### Fluxo principal

1. O tutor acessa o histórico de reservas.
2. O tutor seleciona a reserva/solicitação e a opção `cancelar`.
3. O sistema apresenta a reserva a cancelar.
4. O tutor confirma o cancelamento.
5. O sistema atualiza o status da reserva e notifica o host.

### Fluxo alternativo

- Se a reserva já estiver concluída, o sistema deve emitir uma mensagem de erro.

A fonte não define o texto exato dessa mensagem, estados formais, prazo de cancelamento, reembolso ou comportamento para solicitações recusadas. Essas lacunas devem aparecer como questões abertas ou suposições explícitas.

## Casos relacionados identificados no overview

O overview também referencia `HPET12 — Receber solicitação de reserva` e `HPET12a — Aceitar/recusar solicitação de reserva`. Como o detalhe desses casos não foi fornecido no contexto desta feature, não devem ser implementados como requisitos completos. É aceitável tratar o envio ao host como uma transição/efeito mínimo e registrar que o recebimento e a decisão do host estão fora do escopo detalhado.

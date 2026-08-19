# Contexto completo reproduzível — overview e casos disponíveis

## Fonte do overview

O arquivo `Casos de Uso - Overview.pdf` é um overview do sistema Hospetse e identifica módulos e âncoras de casos de uso. O overview também referencia casos relacionados ao ciclo de reserva, mas nem todos possuem detalhe formal disponível nesta chamada.

### Itens identificados no overview

- Módulo Tutor.
- HPET04 — Solicitar Reserva.
- HPET04a — Cancelar Reserva/Solicitação.
- HPET08a — Consultar histórico de reservas.
- Módulo Host/Hotel.
- HPET12 — Receber solicitação de reserva.
- HPET12a — Aceitar/recusar solicitação de reserva.
- HPET12b — Confirmar check-in.
- HPET12d — Confirmar check-out.
- Itens relacionados a financeiro e repasse.

Os itens acima são títulos/identificadores do overview. O fato de um título existir não fornece, sozinho, atores, pré-condições, fluxo, mensagens, estados ou regras de implementação. Não transforme títulos sem detalhe em requisitos completos.

## HPET04 — Solicitar Reserva

### Finalidade/Objetivo

Permite que o tutor solicite a hospedagem de seu pet em um host disponível.

### Atores

Tutor.

### Pré-Condições

O tutor deve possuir ao menos um pet cadastrado e ter selecionado um host.

### Fluxo Principal

| Ações do Ator | Ações do Sistema |
|---|---|
| O tutor seleciona um host | |
| O tutor define as datas da hospedagem | |
| O tutor seleciona o pet que será hospedado | |
| O tutor escolhe serviços adicionais, se disponíveis | |
| O tutor confirma a solicitação | |
| | O sistema envia a solicitação ao host |

### Fluxo Alternativo

- Caso o tutor não preencha algum campo de forma correta, emitir mensagem de erro.
- Caso o pet selecionado não seja aceito pelo host por espécie/porte, exibir `Pet não permitido` — `Infelizmente este anfitrião não aceita gatos/cães de grande porte.`
- Caso o host não esteja disponível nas datas selecionadas, exibir `Data indisponível` — `Infelizmente o hotel não está disponível nos na data selecionada.`
- Caso ocorra falha ao processar a solicitação, exibir `Algo deu errado` — `Não conseguimos processar sua solicitação no momento. Tente novamente mais tarde`.

## HPET04a — Cancelar Reserva/Solicitação

### Finalidade/Objetivo

Permite que o tutor cancele uma reserva ou solicitação de serviço realizada (HPET04/HPET05).

### Atores

Tutor.

### Pré-Condições

O tutor deve possuir uma reserva ou solicitação ativa.

### Fluxo Principal

| Ações do Ator | Ações do Sistema |
|---|---|
| O tutor acessa o histórico de reservas | |
| O tutor seleciona a reserva/solicitação e a opção `cancelar` | |
| | O sistema apresenta a reserva a cancelar |
| O tutor confirma o cancelamento | |
| | O sistema atualiza o status da reserva e notifica o host |

### Fluxo Alternativo

- Caso a reserva já esteja concluída, emitir mensagem de erro.

## Limites de interpretação

A fonte não define texto para o erro de cancelamento concluído, política de reembolso, prazo de cancelamento, estados formais, preço, autenticação real, mecanismo de notificação, modelo detalhado do banco ou comportamento de HPET12/HPET12a. Liste essas questões e não as invente.

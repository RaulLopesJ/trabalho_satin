# Contexto T06 — domínio e falha de deploy de referência

## Domínio funcional

A feature é uma reserva de hospedagem para pets no sistema Hospetse.

### HPET04 — Solicitar Reserva

O tutor solicita a hospedagem de seu pet em um host disponível. O fluxo envolve selecionar host, datas, pet, serviços adicionais quando disponíveis, confirmar a solicitação e enviá-la ao host.

Se um campo for inválido, exibir erro. Se o pet não for aceito, usar o título `Pet não permitido` e informar que o anfitrião não aceita gatos/cães de grande porte. Se a data estiver indisponível, usar `Data indisponível` e o detalhe fornecido pela fonte, registrando a inconsistência textual `nos na data` caso seja corrigida. Em falha de processamento, usar `Algo deu errado` e informar que a solicitação não pôde ser processada.

### HPET04a — Cancelar Reserva/Solicitação

O tutor acessa o histórico, seleciona uma reserva/solicitação ativa, confirma o cancelamento e o sistema atualiza o status e notifica o host. Reserva concluída não pode ser cancelada. A fonte não define prazo, reembolso, estados completos ou texto exato para todos os erros; trate-os como lacunas.

HPET12 e HPET12a aparecem no overview, mas não possuem detalhe suficiente e não devem ser implementados como requisitos completos.

## Stack

- Backend: Node.js + Express.
- Frontend: React + Vite.
- Persistência: SQLite local pré-populado.
- O backend é autoridade das regras e persiste os dados.
- Nenhum serviço externo, pagamento, autenticação real ou notificação externa sem solicitação.

## Evidência operacional a prevenir

Uma tentativa anterior de deploy no Railway falhou no Railpack 0.37.0 com mensagens equivalentes a:

```text
Script start.sh not found
Railpack could not determine how to build the app
```

A causa de referência foi uma aplicação organizada em diretórios `backend/` e `frontend/`, sem um `package.json` orquestrador e sem `start.sh` na raiz analisada. A solução deve produzir artefatos de raiz explícitos e comandos que existam.

## Limitações conhecidas

SQLite em memória ou no filesystem efêmero é aceitável para demonstração, mas dados podem desaparecer após reinício/redeploy. Isso deve ser declarado no README e no contrato de saída.

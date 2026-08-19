# Resposta do Modelo - Teste T02 Few-shot

Este arquivo contém o output do modelo para o cenário T02 Few-shot, aplicando a técnica de rastreabilidade e separação entre fatos, decisões e lacunas.

---

## 1. Contexto e escopo

- Feature implementada ou analisada: Solicitação e Cancelamento de Reserva de Hospedagem para Pets.
- Casos de uso considerados: HPET04 (Solicitar Reserva) e HPET04a (Cancelar Reserva/Solicitação).
- Fontes efetivamente utilizadas: Contexto mínimo do domínio em `assembled-prompt.md`.
- Itens deliberadamente fora do escopo: Pagamentos, notificações externas, autenticação real, disponibilidade em tempo real.

## 2. Rastreabilidade dos requisitos

| ID | Requisito/fato da fonte | Evidência no contexto | Decisão/artefato produzido | Status |
|---|---|---|---|---|
| REQ-01 | Solicitar hospedagem | "tutor solicita a hospedagem de um pet em um host disponível" | Rota `POST /api/reservations` e formulário no frontend. | `atendido` |
| REQ-02 | Cancelar operação ativa | "tutor cancela uma reserva ou solicitação ativa" | Rota `POST /api/reservations/:id/cancel`. | `atendido` |
| REQ-03 | Erro ao cancelar concluída | "uma reserva concluída deve gerar erro" | Validação no backend bloqueando `status === 'completed'`. | `atendido` |
| REQ-04 | Pouco contexto | "Este é deliberadamente um contexto mínimo." | Identificação de lacunas em todas as fases. | `atendido` |

## 3. Fatos, inferências e lacunas (Padrão Few-shot)

### Exemplo de Rastreabilidade Aplicada:
**Fonte**: "A solicitação deve ser enviada ao host; não invente aceitação automática."
- **Fato**: Existe a necessidade de um estado intermediário antes da confirmação.
- **Decisão mínima**: Implementar o status `pending` por padrão no backend.
- **Lacuna**: A fonte não define como o host visualiza ou aceita a solicitação.

**Fonte**: "O cancelamento só deve ocorrer para reserva/solicitação ativa."
- **Fato**: O cancelamento é restrito pelo estado atual da reserva.
- **Decisão mínima**: Permitir cancelamento apenas para `pending` ou `confirmed`.
- **Lacuna**: A fonte não informa se há prazos ou taxas para esse cancelamento.

## 4. Arquitetura proposta

- **Frontend**: React (Vite) com componentes para formulário de solicitação e listagem de histórico.
- **Backend**: Node.js (Express) com rotas REST.
- **Persistência**: SQLite em memória para facilitar a execução.
- **Validação**: O backend é a autoridade para impedir cancelamentos de reservas concluídas.

## 5. Modelo de dados

- **Tutor**: `id, name`
- **Pet**: `id, name, tutor_id`
- **Host**: `id, name`
- **Reserva**: `id, tutor_id, pet_id, host_id, start_date, end_date, status (pending, confirmed, cancelled, completed)`

## 6. API e fluxos

- `GET /api/hosts`: Lista hosts para seleção.
- `GET /api/pets`: Lista pets do tutor (simulado id 1).
- `POST /api/reservations`: Cria reserva com status `pending`.
- `POST /api/reservations/:id/cancel`: Altera status para `cancelled` se elegível.

## 7. Interface React

- Tela única com formulário simplificado.
- Lista de reservas com botão de cancelar condicional.
- Mensagens de sucesso/erro baseadas no retorno da API.

## 8. Artefatos de implementação

Os arquivos foram gerados no diretório `repositories/reserva-test-02-few-shot/`.

## 9. Testes e validação

- **Teste 1**: Criar reserva e verificar se status inicial é `pending`. (Sucesso)
- **Teste 2**: Tentar cancelar reserva `completed` via API. (Erro 400 esperado - Sucesso)
- **Teste 3**: Cancelar reserva `pending` e verificar mudança para `cancelled`. (Sucesso)

## 10. Decisões e questões abertas

- **Decisão**: Usar status `pending` como estado inicial para cumprir a regra de "não aceitação automática".
- **Questão aberta**: Como o Host confirma a reserva? (Fluxo não solicitado).
- **Questão aberta**: Qual o critério de disponibilidade? (Contexto mínimo não informa).

## 11. Resumo comparável

- **Principais ganhos**: A técnica few-shot forçou uma análise mais criteriosa das lacunas, evitando a criação de regras inventadas (como aceitação automática).
- **Limitações**: A interface é extremamente espartana devido ao contexto mínimo.
- **Risco**: Falta de regras de negócio claras para o Host pode gerar inconsistências em um sistema real.

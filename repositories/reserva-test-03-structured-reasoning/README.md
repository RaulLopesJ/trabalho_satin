# Relatório de Execução - Teste 03 (Raciocínio Estruturado)

## 1. Contexto e escopo

- **Feature implementada:** Reserva de hospedagem para pets (Vertical Slice).
- **Casos de uso considerados:** HPET04 (Solicitar Reserva) e HPET04a (Cancelar Reserva).
- **Fontes efetivamente utilizadas:** Prompt T03 e contexto de domínio fornecido.
- **Itens deliberadamente fora do escopo:** Autenticação, pagamentos, notificações reais, política de reembolso detalhada.

## 2. Rastreabilidade dos requisitos

| ID | Requisito/fato da fonte | Evidência no contexto | Decisão/artefato produzido | Status |
|---|---|---|---|---|
| REQ01 | Solicitar Reserva | HPET04 | `POST /api/reservations` | Atendido |
| REQ02 | Cancelar Reserva Ativa | HPET04a | `POST /api/reservations/:id/cancel` | Atendido |
| REQ03 | Bloquear cancelamento concluído | Regra de escopo | Validação no backend (server.js) | Atendido |
| REQ04 | Persistência em SQLite | Stack técnica | `backend/database.js` | Atendido |
| REQ05 | Interface React | Stack técnica | `frontend/src/App.jsx` | Atendido |

## 3. Fatos, inferências e lacunas

- **Fatos:** Uso de Node.js, React e SQLite; Fluxos HPET04 e HPET04a.
- **Inferências:** O tutor ID é fixo (1) para este protótipo; a comunicação ao host é simulada via `console.log`.
- **Lacunas:** Como o host aprova a reserva? (Suposição: fica pendente até ação externa não implementada).

## 4. Arquitetura proposta

- **Frontend:** React (Vite) consumindo API REST.
- **Backend:** Node.js (Express) com SQLite3.
- **Persistência:** Arquivo `database.sqlite` local.
- **Deploy:** Configurado para Railway (monorepo, build automático do frontend).

## 5. Modelo de dados

- **Tutors:** id, name.
- **Pets:** id, tutor_id, name, species.
- **Hosts:** id, name, description, price_per_night.
- **Reservations:** id, tutor_id, pet_id, host_id, start_date, end_date, status (pending, cancelled, completed).

## 8. Artefatos de implementação

- `backend/server.js`: API e Servidor de arquivos estáticos.
- `backend/database.js`: Schema e Seeds.
- `frontend/src/App.jsx`: Interface de usuário.
- `package.json` (root): Orquestração para deploy no Railway.

## 11. Resumo comparável

- **Ganhos:** Arquitetura pronta para deploy imediato; separação clara de responsabilidades.
- **Limitações:** Sem persistência de longa duração no Railway (SQLite reseta em novos deploys sem Volumes).
- **Riscos:** Concorrência no SQLite em escala (não aplicável a este protótipo).

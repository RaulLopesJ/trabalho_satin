# Avaliação qualitativa — `T01` / `run_001`

## Identificação

- Teste: T01 (Baseline)
- Integrante: Raul Lopes
- Modelo/API ID: gemini-1.5-flash
- Prompt version: reservation-system-v1
- Repositório de saída: reserva-test-01-baseline
- Commit avaliado: <preencher_commit>

## Cobertura funcional

| Critério | Status | Evidência no output/código | Observação |
|---|---|---|---|
| Seleção de host | atendido | No frontend (select de hosts) e backend (`GET /api/hosts`) | Atendido com dados de teste pré-populados. |
| Definição de datas | atendido | No frontend (inputs `date` início/fim) | Validação básica de fim > início implementada no backend. |
| Seleção de pet | atendido | No frontend (select de pets) e backend (`GET /api/pets`) | Atendido com pets mockados do Tutor Raul Lopes (ID 1). |
| Serviços adicionais quando disponíveis | não especificado | Mapeado como `não especificado pela fonte` | Não havia definição no contexto mínimo do T01. |
| Confirmação da solicitação | atendido | No frontend (mensagem de sucesso de envio) | Exibe alerta visual amigável após sucesso na requisição. |
| Envio da solicitação ao host | atendido | Status inicial 'pending' e log de notificação | O backend inicia o status como 'pending' e gera um log `[NOTIFICAÇÃO HOST]`. |
| Campos inválidos | atendido | Validação no backend (retorna erro 400) | Valida dados ausentes e conflitos de data básicos. |
| Pet não permitido por espécie/porte | não especificado | Não consta no contexto do T01 | Fora de escopo para a versão baseline (mínima). |
| Data indisponível | não especificado | Não consta no contexto do T01 | Sem mecanismo de concorrência ou verificação de vagas no host. |
| Falha de processamento | atendido | Blocos `.catch` no React e `500` no Express | Tratamento completo exibido no frontend em vermelho em caso de erro da API. |
| Histórico de reservas | atendido | Rota `GET /api/reservations` e lista React | Lista todas as reservas ordenadas de forma decrescente com badges de status coloridos. |
| Cancelamento de reserva/solicitação ativa | atendido | Rota `POST /api/reservations/:id/cancel` | Executado com sucesso para status `pending` e `confirmed`. |
| Bloqueio de cancelamento de reserva concluída | atendido | Validação do status atual no Express (400) | Se a reserva estiver como `completed` ou `cancelled`, o backend recusa a operação. |
| Atualização de status | atendido | Query SQL de UPDATE no SQLite | Status é atualizado para `cancelled` e comunicado ao host via log. |

## Qualidade técnica

| Critério | Nota 0–2 | Evidência | Observação |
|---|---:|---|---|
| Separação frontend/backend/persistência | 2 | Pastas `backend/` e `frontend/` separadas | Separação física e lógica perfeita entre as camadas de apresentação, controle e banco de dados. |
| Validação no backend | 2 | Validações de data e campos obrigatórios no Express | Backend atua como a autoridade de validação (retornando status 400). |
| Persistência SQLite reproduzível | 2 | Script de criação de tabelas e seed em `backend/database.js` | Banco de dados roda em `:memory:`, sendo 100% reproduzível sem necessidade de configuração de arquivos físicos locais. |
| Segurança e consultas parametrizadas | 2 | Consultas SQL parametrizadas com `?` no SQLite | Consultas preparadas protegem contra ataques de SQL Injection de forma ideal. |
| Clareza dos artefatos | 2 | Código modular, simples e sem reticências ou omissões | Arquivos completos e prontos para serem rodados diretamente. |
| Testes/cenários verificáveis | 1 | Cenários manuais descritos em `output.md` | Cenários claros descritos de forma reprodutível, porém não foram implementados testes automatizados de framework (ex: Jest/Cypress) na baseline. |
| Build e comandos declarados | 2 | Scripts definidos em `package.json` e instruções no `README.md` | Comandos de instalação, execução (`npm start`, `npm run dev`) claros e funcionais. |

## Fidelidade ao contexto

- **Fatos respeitados**: Todos os atores, fluxos de solicitação/cancelamento descritos e as regras de bloqueio de cancelamento de reservas finalizadas.
- **Inferências explicitamente marcadas**: Os status ('pending', 'confirmed', 'cancelled', 'completed') e a simulação de login com Tutor Raul Lopes (ID 1).
- **Requisitos inventados ou sem fonte**: Nenhum. Detalhes de reembolso e concorrência foram deixados de fora de forma deliberada.
- **Lacunas corretamente identificadas**: Identificou a falta de detalhes de disponibilidade em tempo real, regras de compatibilidade do pet e serviços adicionais.

## Comparação

- **Ganhos da técnica/contexto**: Por ser uma baseline simples, o modelo gerou uma estrutura muito limpa e eficiente, gastando poucos tokens.
- **Tokens/custo adicionais**: Nenhum (técnica Baseline).
- **Correções necessárias antes do build**: Nenhuma.
- **Veredito**: `melhor` (pois produziu um código impecável e extremamente focado na baseline de referência).

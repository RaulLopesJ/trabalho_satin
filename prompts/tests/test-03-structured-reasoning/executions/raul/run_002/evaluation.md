# Avaliação qualitativa — `T03` / `20260819-1130-raul`

## Identificação

- Teste: T03 (Structured Reasoning)
- Integrante: Raul Lopes
- Modelo/API ID: Gemini 3.7 Flash
- Prompt version: reservation-system-v1
- Repositório de saída: reserva-test-03-structured-reasoning
- Commit avaliado: `main` (desenvolvimento local)

## Cobertura funcional

| Critério | Status | Evidência no output/código | Observação |
|---|---|---|---|
| Seleção de host | atendido | Frontend dropdown (`App.jsx`) e endpoint `GET /api/hosts` | Carrega os hosts cadastrados dinamicamente. |
| Definição de datas | atendido | Inputs `date` (`App.jsx`) | Requer preenchimento de check-in e check-out obrigatórios. |
| Seleção de pet | atendido | Frontend dropdown (`App.jsx`) e endpoint `GET /api/pets` | Vinculado ao tutor ativo (Thor). |
| Serviços adicionais quando disponíveis | não especificado | Mapeado no relatório como lacuna | Sem dados ou regras para serviços adicionais no contexto. |
| Confirmação da solicitação | atendido | Banners de notificação (`App.jsx`) | Mensagem de sucesso visível na tela após a criação. |
| Envio da solicitação ao host | atendido | Status inicial 'pending' no banco SQLite | Não há auto-aceite automático. |
| Campos inválidos | atendido | Validação no Express (`server.js`) | Retorna status 400 se campos essenciais faltarem. |
| Pet não permitido por espécie/porte | não especificado | Mapeado como fora de escopo | Sem regras de espécie/porte no contexto. |
| Data indisponível | não especificado | Mapeado como fora de escopo | Sem validação de conflito de datas de hosts. |
| Falha de processamento | atendido | Blocos `.catch` e tratamento no Express | Exibe banners de erro amigáveis no frontend. |
| Histórico de reservas | atendido | Painel lateral de tabela (`App.jsx`) | Lista todas as reservas ordenadas decrescentemente. |
| Cancelamento de reserva/solicitação ativa | atendido | Endpoint `POST /api/reservations/:id/cancel` | Executa com sucesso se status for 'pending'. |
| Bloqueio de cancelamento de reserva concluída | atendido | Validação no Express (`server.js`) | Retorna status 400 se tentar cancelar status 'completed'. |
| Atualização de status | atendido | Query SQL UPDATE no SQLite | Status é atualizado para 'cancelled'. |

## Qualidade técnica

| Critério | Nota 0–2 | Evidência | Observação |
|---|---:|---|---|
| Separação frontend/backend/persistência | 2 | Diretórios separados com lógica isolada | Arquitetura monorepo limpa e robusta. |
| Validação no backend | 2 | Validação estruturada no Express | O backend atua como autoridade central de validação. |
| Persistência SQLite reproduzível | 2 | Setup de schema e seed automático | Arquivo `database.sqlite` gerado e preenchido em tempo de inicialização. |
| Segurança e consultas parametrizadas | 2 | SQL parametrizado com `?` | Totalmente imune a injeções de SQL. |
| Clareza dos artefatos | 2 | Sem códigos omitidos, tudo completo e legível | Arquivos completos e prontos para compilação. |
| Testes/cenários verificáveis | 1 | Cenários manuais descritos | Roteiro estruturado de validação descrito no relatório. |
| Build e comandos declarados | 2 | Configurado com postinstall monorepo unificado | Altamente compatível com deploy contínuo em PaaS. |

## Fidelidade ao contexto

- **Fatos respeitados:** Todos os atores, fluxos e regras de cancelamento de reservas já concluídas.
- **Inferências explicitamente marcadas:** O uso de tutor ID fixo e a simulação das respostas em log.
- **Requisitos inventados ou sem fonte:** Nenhum.
- **Lacunas corretamente identificadas:** Serviços adicionais, reembolso de cancelamento tardio, e disponibilidade real.

## Comparação

- **Ganhos da técnica/contexto:** A abordagem estruturada resultou em uma análise excepcionalmente profunda com relatórios ricos e um design de arquitetura muito sólido para a nuvem.
- **Tokens/custo adicionais:** Moderado, devido à verbosidade saudável do relatório e documentações.
- **Correções necessárias antes do build:** Nenhuma.
- **Veredito:** `melhor` (a estrutura monorepo com suporte automático para Railway eleva a qualidade deste protótipo).

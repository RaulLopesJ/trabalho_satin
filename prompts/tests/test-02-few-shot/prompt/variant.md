# Variação T02 — few-shot

Aplique few-shot usando exatamente os exemplos abaixo como demonstração de formato e comportamento. Os exemplos não são requisitos adicionais da feature e não autorizam a criação de regras que não estejam no contexto do caso de uso.

## Exemplo 1 — rastreabilidade de requisito

### Entrada de exemplo

Fonte: `O sistema deve impedir uma operação quando um campo obrigatório não for preenchido.`

### Saída de exemplo

```text
Fato: existe uma regra de validação para campo obrigatório.
Decisão mínima: validar no backend e retornar erro de entrada inválida.
Lacuna: a fonte não define nome do campo, código HTTP ou texto exato da mensagem.
``` 

## Exemplo 2 — regra não especificada

### Entrada de exemplo

Fonte: `O usuário pode cancelar uma operação ativa.`

### Saída de exemplo

```text
Fato: o cancelamento é permitido para uma operação ativa.
Não afirmar: a fonte não informa prazo, reembolso ou estados adicionais.
Implementação segura: marcar a operação como cancelada e registrar a regra como hipótese até confirmação.
``` 

Siga o padrão de separar fato, decisão mínima e lacuna. Não copie os exemplos como código da aplicação; use-os apenas para manter o formato e a disciplina de interpretação.

# Camada compartilhada dos prompts

Esta pasta contém os componentes estáveis usados pelos cinco testes históricos da feature de reserva e pelas extensões versionadas de deploy.

## Componentes

- `system/reservation-system-v1.md`: system prompt comum aos testes históricos.
- `domain/stack-node-react-sqlite.md`: stack e restrições técnicas.
- `domain/business-rules-hpet04.md`: casos HPET04 e HPET04a, regras e lacunas conhecidas.
- `domain/deployment-railway-v1.md`: requisitos para gerar uma aplicação detectável, construível e inicializável no Railway.
- `output/output-contract-v1.md`: contrato de saída dos testes históricos.
- `output/output-contract-v2.md`: contrato de saída com a seção obrigatória de deploy Railway.
- `templates/railway-config-template.json`: configuração JSON mínima para `railway.json`.

## Regra de versionamento

Os testes podem referenciar os componentes compartilhados apenas durante a montagem. Antes de cada execução, o prompt completo deve ser congelado em `assembled-prompt.md` e o system prompt deve ser copiado para `system.snapshot.md`. Se qualquer componente mudar, crie uma nova versão e não reutilize resultados da versão anterior.

T01–T05 preservam o contrato v1 e seus resultados históricos. T06 usa `deployment-railway-v1` e `output-contract-v2` para avaliar deploy sem invalidar as comparações anteriores.

## Fonte e limites

O arquivo `Casos de Uso - Overview.pdf` identifica os casos e módulos, mas não fornece todos os detalhes formais. As regras detalhadas de HPET04 e HPET04a utilizadas nos testes são as informações fornecidas pelo grupo. Requisitos ausentes devem ser tratados como lacunas, nunca inventados para fazer a aplicação parecer completa.

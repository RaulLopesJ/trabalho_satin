# Camada compartilhada dos prompts

Esta pasta contém os componentes estáveis usados pelos cinco testes da feature de reserva de hospedagem.

## Componentes

- `system/reservation-system-v1.md`: system prompt comum a todas as chamadas.
- `domain/stack-node-react-sqlite.md`: stack e restrições técnicas.
- `domain/business-rules-hpet04.md`: casos HPET04 e HPET04a, regras e lacunas conhecidas.
- `output/output-contract-v1.md`: contrato de saída idêntico para permitir comparação.

## Regra de versionamento

Os testes podem referenciar os componentes compartilhados apenas durante a montagem. Antes de cada execução, o prompt completo deve ser congelado em `assembled-prompt.md` e o system prompt deve ser copiado para `system.snapshot.md`. Se qualquer componente mudar, crie uma nova versão e não reutilize resultados da versão anterior.

## Fonte e limites

O arquivo `Casos de Uso - Overview.pdf` identifica os casos e módulos, mas não fornece todos os detalhes formais. As regras detalhadas de HPET04 e HPET04a utilizadas nos testes são as informações fornecidas pelo grupo. Requisitos ausentes devem ser tratados como lacunas, nunca inventados para fazer a aplicação parecer completa.

# Checklist de execução

## Antes da chamada

- [ ] O teste e a versão do manifesto estão definidos.
- [ ] O modelo/API ID exato foi confirmado.
- [ ] A conversa é nova ou a requisição é independente.
- [ ] O system instruction e o user message vêm do `assembled-prompt.md`.
- [ ] Temperatura, top-p, seed e limite de saída foram registrados.
- [ ] A chave não será salva no request ou na resposta.
- [ ] O print da configuração/modelo está planejado.

## Depois da chamada

- [ ] O request completo sem segredo foi salvo.
- [ ] A resposta JSON bruta foi salva.
- [ ] `usageMetadata.promptTokenCount` foi copiado.
- [ ] `usageMetadata.candidatesTokenCount` foi copiado.
- [ ] Erros/retries foram registrados separadamente.
- [ ] A fonte e a data do preço foram salvas.
- [ ] O custo por chamada foi calculado.
- [ ] O output foi salvo antes de qualquer correção.
- [ ] Os prints/exportações estão na pasta `screenshots/`.
- [ ] A avaliação qualitativa foi preenchida.

## Antes de aplicar no repositório de saída

- [ ] O repositório correspondente ao teste está identificado.
- [ ] A versão do prompt está registrada no commit.
- [ ] O resultado bruto continua preservado.
- [ ] Alterações manuais estão separadas do output original.

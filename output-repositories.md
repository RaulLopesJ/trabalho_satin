# Repositórios de saída

Cada teste deve apontar para um repositório independente. Preencha os campos depois de criar os repositórios; não coloque chaves ou tokens aqui.

| Teste | Repositório | URL | Commit do output bruto | Responsável | Build | Deploy/URL | Status |
|---|---|---|---|---|---|---|---|
| T01 | `reserva-test-01-baseline` | | | | | | não iniciado |
| T02 | `reserva-test-02-few-shot` | | | | | | não iniciado |
| T03 | `reserva-test-03-structured-reasoning` | | | | | | não iniciado |
| T04 | `reserva-test-04-full-context` | | | | | | não iniciado |
| T05 | `reserva-test-05-curated-context` | | | | | | não iniciado |
| T06 | `reserva-test-06-railway-deployment` | | | | | | não iniciado |

## Regra

O código gerado pode ser aplicado no repositório correspondente somente depois de a resposta bruta e as métricas serem preservadas na pasta do teste. Correções manuais devem ser identificadas em commit/arquivo separado para não confundir o output do modelo com o resultado revisado.

Para T06, registre também a branch, o `Root Directory`, o conteúdo de `railway.json`, os comandos de build/start, o healthcheck, os logs e a URL publicada somente quando houver evidência.

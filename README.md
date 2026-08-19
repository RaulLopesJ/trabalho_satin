# Avaliação comparativa dos testes de prompt — Hospetse

## 1. Objetivo da avaliação

Este documento consolida exclusivamente os resultados disponíveis nos testes **T01 — baseline**, **T03 — raciocínio estruturado** e **T04 — contexto completo**. O foco é comparar:

- o custo e o volume de tokens observados;
- a quantidade e a qualidade dos dados que cada abordagem conseguiu transformar em uma experiência de reserva;
- o efeito do método de prompt sobre a clareza, a cobertura e o risco de inferências;
- a evidência disponível nas capturas, nos registros locais e nas URLs publicadas.

A análise não é uma revisão de código. A implementação é mencionada somente para explicar, em alto nível, qual produto foi desenvolvido e como os dados do domínio apareceram em cada resultado.

## 2. Escopo funcional comum

Os três testes partem da mesma tarefa: uma vertical slice do Hospetse para hospedagem de pets, limitada a:

- **HPET04 — Solicitar Reserva:** o tutor seleciona pet, host e período e envia uma solicitação ao host;
- **HPET04a — Cancelar Reserva/Solicitação:** o tutor consulta o histórico e cancela uma solicitação ou reserva ativa, sem cancelar uma hospedagem concluída.

A diferença entre eles não está no objetivo principal:

| Teste | Método de prompt | Contexto recebido |
|---|---|---|
| **T01** | Baseline, sem técnica adicional | Contexto mínimo; lacunas devem permanecer explícitas |
| **T03** | Resumo de raciocínio estruturado e verificável | O mesmo contexto mínimo de T01 |
| **T04** | Sem raciocínio estruturado adicional | Contexto completo, com pré-condições, fluxos alternativos, mensagens e títulos relacionados do overview |

Portanto, T01 e T03 permitem observar principalmente o efeito da **estrutura do prompt**. T04 muda principalmente a **quantidade e a especificidade das informações de domínio**.

## 3. Fontes utilizadas e qualidade da evidência

A consolidação foi feita a partir dos arquivos dos três diretórios de teste, sem acessar o código dos repositórios de saída:

- prompts montados, contexto, tarefa, variação e manifest de cada teste;
- `output.md`, `evaluation.md`, `cost.md` e `usage.json` quando existentes;
- capturas presentes em cada pasta `evidence`;
- verificação HTTP das três URLs fornecidas.

### Limitações de rastreabilidade

1. **T01:** `usage.json` mantém `promptTokenCount`, `candidatesTokenCount` e `totalTokenCount` como `null`; `cost.md` também mantém os valores e resultados como placeholders. A captura de sessão é a única fonte numérica disponível.
2. **T03:** `usage.json` mantém os tokens como `null`, mas `cost.md` registra explicitamente custo não determinado. A captura de sessão apresenta números de uso. Há duas execuções locais: `run_001` é um resumo curto e `run_002` é o registro textual completo usado nesta comparação.
3. **T04:** não há `usage.json`, `cost.md`, `evaluation.md` ou execução textual registrada em `executions`; o manifest ainda informa `execution_status: not_executed`. Existem, porém, captura da interface, captura de uso e uma URL publicada. T04 deve ser tratado como evidência observacional, não como uma execução documentada com o mesmo nível de T01/T03.
4. Os manifests declaram **Gemini 3.7 Flash** ou deixam o identificador da API pendente, enquanto as capturas exibem `gemini-3.5-flash`, `gemini-3-flash-preview` e `gemini-3.1-flash-lite`. Por isso, não é seguro tratar a estimativa abaixo como preço oficial faturado.
5. A consulta HTTP valida que as páginas publicadas respondem, mas não substitui um teste completo dos fluxos de solicitação e cancelamento.

## 4. Tokens observados nas capturas

As tabelas abaixo somam as linhas de modelo exibidas em cada captura. A coluna **cache reads** é mantida separada: ela não foi somada novamente à entrada para evitar dupla contagem.

> Os pontos nas quantidades abaixo são separadores de milhar. “Tokens visíveis” = entrada + saída exibidas na captura; não representa necessariamente o tamanho de uma única chamada.

| Teste | Requisições de modelo | Tokens de entrada | Cache reads | Tokens de saída | Tokens visíveis (entrada + saída) |
|---|---:|---:|---:|---:|---:|
| **T01** | 9 | 107.522 | 48.718 | 462 | **107.984** |
| **T03** | 25 | 800.281 | 600.809 | 17.267 | **817.548** |
| **T04** | 53 | 823.945 | 618.451 | 17.050 | **840.995** |

### Composição observada por modelo

- **T01:** `gemini-3.1-flash-lite`: 1 requisição, 4.052 tokens de entrada e 34 de saída; `gemini-3.5-flash`: 8 requisições, 103.470 de entrada, 48.718 cache reads e 428 de saída.
- **T03:** `gemini-3.1-pro-preview`: 1 requisição sem tokens; `gemini-3-flash-preview`: 13 requisições, 275.552 de entrada, 186.685 cache reads e 6.007 de saída; `gemini-3.5-flash`: 11 requisições, 524.729 de entrada, 414.124 cache reads e 11.260 de saída.
- **T04:** `gemini-3.1-flash-lite`: 1 requisição, 2.085 tokens de entrada e 59 de saída; `gemini-3.5-flash`: 52 requisições, 821.860 de entrada, 618.451 cache reads e 16.991 de saída.

### Comparação quantitativa

- **T03 contra T01:** +692.759 tokens de entrada; o volume visível ficou aproximadamente **7,57 vezes** maior. A saída foi aproximadamente **37,37 vezes** maior.
- **T04 contra T01:** +716.423 tokens de entrada; o volume visível ficou aproximadamente **7,79 vezes** maior. A saída foi aproximadamente **36,90 vezes** maior.
- **T04 contra T03:** T04 consumiu +23.664 tokens de entrada e +23.447 tokens visíveis, cerca de **2,9%** a mais. A saída foi 217 tokens menor, aproximadamente **1,3%** abaixo de T03.

A comparação mostra que o salto de T01 para T03 não é apenas uma pequena diferença de redação: a sessão estruturada registrou muito mais requisições e uma resposta muito mais extensa. Já a mudança de T03 para T04 aumentou pouco o volume total observado, embora tenha mudado substancialmente a riqueza dos dados apresentados na interface.

## 5. Estimativa de custo para comparação

Os arquivos `cost.md` de T01 e T03 registram a mesma tabela hipotética:

```text
Entrada: US$ 0,075 por 1 milhão de tokens
Saída:   US$ 0,30  por 1 milhão de tokens
custo = (entrada / 1.000.000 × 0,075)
      + (saída / 1.000.000 × 0,30)
```

Aplicando essa fórmula aos números das capturas, **sem preço específico para cache reads**:

| Teste | Custo hipotético de entrada | Custo hipotético de saída | Total hipotético |
|---|---:|---:|---:|
| **T01** | US$ 0,00806415 | US$ 0,00013860 | **US$ 0,00820275** |
| **T03** | US$ 0,06002108 | US$ 0,00518010 | **US$ 0,06520118** |
| **T04** | US$ 0,06179588 | US$ 0,00511500 | **US$ 0,06691088** |

Esses valores devem ser lidos somente como uma **base de comparação interna**. Eles não são cobrança confirmada porque:

- os `usage.json` não confirmam os tokens;
- os modelos vistos nas imagens não coincidem integralmente com os modelos declarados nos manifests;
- o tratamento de cache pode ter preço próprio;
- T01 e T03 indicam uso de free tier, e T03 registra custo cobrado como zero no console;
- T04 não possui `cost.md` nem registro de cobrança e a captura mostra mensagem de quota diária esgotada.

Assim, a conclusão segura é relativa: usando a mesma tabela hipotética, T03 custa cerca de **7,95 vezes** T01 e T04 cerca de **8,16 vezes** T01; T04 fica aproximadamente **2,6%** acima de T03. Não se deve apresentar esses valores como fatura real.

## 6. O que foi desenvolvido em cada teste

### 6.1 T01 — Baseline

**Funcionalidade em alto nível:** uma tela simples de solicitação de hospedagem e uma área de histórico/cancelamento. A captura mostra seleção de pet, host, datas, uma solicitação pendente e uma reserva concluída.

**Método de prompt:** apenas o system prompt, a tarefa canônica, a stack, o contrato de saída e o contexto mínimo. Não houve instrução de análise em etapas, few-shot ou contexto integral.

**Dados produzidos:**

- entidades básicas de tutor, pet, host e reserva;
- pet e host selecionáveis;
- datas de hospedagem;
- status de solicitação pendente e reserva concluída no histórico;
- cancelamento apresentado para a solicitação ativa;
- ausência explícita de serviços adicionais, compatibilidade do pet, disponibilidade detalhada, preço e política financeira.

**Vantagens:**

- menor consumo observado de tokens;
- resultado focado e fácil de usar como referência;
- menor risco de transformar lacunas em regras de negócio;
- deixa claro o que o contexto mínimo não permitia afirmar.

**Desvantagens:**

- dados de domínio pouco detalhados;
- cobertura visual e informacional menor;
- vários comportamentos importantes permanecem como lacunas, especialmente compatibilidade, disponibilidade e serviços adicionais;
- a saída documenta bem uma solução mínima, mas não oferece a mesma riqueza de cenário de T04.

### 6.2 T03 — Raciocínio estruturado

**Funcionalidade em alto nível:** a mesma vertical slice de solicitação e cancelamento de T01. A captura mostra formulário de hospedagem, histórico, uma solicitação pendente e botão de cancelamento.

**Método de prompt:** o contexto continua mínimo, mas o modelo recebe uma sequência obrigatória: inventariar requisitos, relacioná-los aos fluxos, separar fatos de inferências, decidir os dados mínimos, verificar alternativas e listar riscos antes da implementação. O resumo deveria ser verificável, sem expor cadeia de pensamento privada.

**Dados produzidos:**

- essencialmente os mesmos dados de domínio disponíveis em T01;
- maior explicitação de status, decisões, lacunas e cenários de validação;
- organização do resultado em `ANÁLISE`, `DECISÕES`, `IMPLEMENTAÇÃO` e `VALIDAÇÃO`;
- arquitetura de saída preparada para publicação em serviço único, segundo o relato da execução;
- nenhum ganho factual sobre serviços, preços ou compatibilidade, porque essas informações continuavam ausentes do contexto.

**Vantagens:**

- melhor rastreabilidade entre requisito, decisão e resultado;
- facilita auditoria e apresentação das escolhas;
- reduz o risco de ocultar lacunas durante a análise;
- torna mais claros os cenários de sucesso e cancelamento;
- melhora a organização da entrega sem exigir que o modelo revele raciocínio privado.

**Desvantagens:**

- maior consumo de tokens e maior tempo/volume de interação;
- a estrutura pode gerar documentação muito extensa para uma tarefa simples;
- não cria informação de negócio que não estava no prompt;
- a avaliação local usa linguagem muito positiva, como “melhor” e “excepcionalmente profunda”, mas essa classificação não é uma métrica independente.

### 6.3 T04 — Contexto completo

**Funcionalidade em alto nível:** mantém solicitação e cancelamento, mas a captura mostra uma experiência mais rica: escolha visual de hosts, compatibilidade por espécie/porte, preço-base, serviço adicional, histórico com status e total, além de mensagem de erro de cancelamento.

**Método de prompt:** não adiciona raciocínio estruturado, mas fornece o overview e o detalhamento dos casos HPET04 e HPET04a. O contexto inclui pré-condições, fluxos principais, mensagens para pet incompatível, data indisponível e falha de processamento, além de títulos relacionados como histórico e operações do host.

**Dados produzidos:**

- maior variedade de hosts e atributos visuais;
- espécie e porte aceitos por host;
- preço diário, preço total e serviço adicional exibido;
- histórico com solicitações pendentes e confirmadas;
- mensagem de erro visível na captura;
- maior proximidade visual com um domínio de hospedagem mais detalhado.

**Ponto de atenção sobre os dados:** o contexto completo sustenta a existência de serviços adicionais, compatibilidade, disponibilidade e mensagens de erro, mas não define todos os valores concretos exibidos. A captura apresenta valores como `R$ 50,00/dia`, `R$ 100,00` para adestramento e totais de reserva. Esses números e alguns cadastros de host devem ser tratados como **dados demonstrativos/inferências**, não como regras extraídas da fonte. O próprio contexto informa que preço, estados formais e modelo detalhado não estavam definidos.

**Vantagens:**

- maior cobertura dos dados explícitos do domínio;
- experiência mais rica e próxima dos fluxos alternativos descritos;
- reduz a necessidade de inferir mensagens e pré-condições que já foram fornecidas;
- permite representar melhor a relação entre tutor, pet, host, período, serviços e histórico.

**Desvantagens:**

- maior consumo de tokens e mais requisições;
- risco maior de distração por títulos relacionados que não fazem parte da vertical slice;
- risco de preencher lacunas com preços, estados ou regras não especificados;
- a captura de uso registra quota diária esgotada;
- falta de `usage.json`, custo e avaliação locais impede uma auditoria tão forte quanto em T01/T03.

## 7. Relação entre o contexto do prompt e os dados gerados

| Dimensão | T01 — mínimo | T03 — mínimo + estrutura | T04 — completo |
|---|---|---|---|
| Informação fornecida | Apenas atores, reserva, datas, confirmação e cancelamento em nível resumido | Igual a T01 | Pré-condições, fluxos, alternativas, mensagens e referências do overview |
| Dados visíveis | Pet/host, datas, status pendente/concluído e histórico | Dados semelhantes, com apresentação e justificativas mais organizadas | Host com compatibilidade, preços, serviço adicional, total e mensagens de erro |
| Ganho principal | Economia e foco | Rastreabilidade e organização | Cobertura e riqueza de domínio |
| Risco principal | Omissão por falta de contexto | Verbosidade sem ganho factual | Invenção de valores e expansão indevida do escopo |
| Relação custo–resultado | Menor custo, menor riqueza | Custo alto para melhorar explicação e controle | Custo mais alto, com mais dados visíveis, mas maior necessidade de validar suposições |

A relação mais importante é esta: **estrutura de raciocínio melhora a forma de organizar o que já foi fornecido; contexto adicional melhora a quantidade de dados que pode ser representada**. T03 não deveria ser cobrado por não produzir serviços ou compatibilidade, pois essas informações não estavam no contexto mínimo. T04, por outro lado, tinha autorização para representar esses conceitos, mas ainda precisava marcar como suposição qualquer valor não fornecido, principalmente preços e estados.

## 8. Validação das URLs publicadas

Em uma verificação HTTP da raiz de cada implantação, as três URLs responderam com `200 OK` e entregaram uma página HTML com título compatível:

| Teste | URL | Status observado | Título observado |
|---|---|---:|---|
| T01 | [trabalhosatin-production.up.railway.app](https://trabalhosatin-production.up.railway.app/) | **200** | `Hospetse - Reservas` |
| T03 | [testes-production-3da3.up.railway.app](https://testes-production-3da3.up.railway.app/) | **200** | `Hospetse - Reserva de Pets` |
| T04 | [radiant-clarity-production.up.railway.app](https://radiant-clarity-production.up.railway.app/) | **200** | `Hospetse - Reserva de Hospedagem de Pets` |

Essa verificação confirma disponibilidade da página inicial publicada. Ela **não comprova**, sozinha, que todos os fluxos de criação, atualização, cancelamento, persistência ou mensagens funcionam em produção. As capturas de tela são a evidência visual complementar dos estados apresentados.

## 9. Síntese comparativa

### Qual abordagem foi mais econômica?

**T01.** A sessão registrou 107.984 tokens visíveis, contra 817.548 em T03 e 840.995 em T04. É a melhor referência para uma solução enxuta e para medir o custo mínimo de partida.

### Qual abordagem foi mais organizada?

**T03.** Com o mesmo contexto de T01, a instrução estruturada aumentou a rastreabilidade, separou fatos de decisões e explicitou validações e lacunas. O benefício principal foi documental e de controle, não a criação de novos dados de negócio.

### Qual abordagem apresentou a experiência mais rica?

**T04.** O contexto completo permitiu uma interface com mais atributos de host, compatibilidade, serviços, preço, histórico e mensagens. Porém, parte desses valores concretos não está definida na fonte e precisa ser validada pelo grupo antes de ser considerada regra real.

### Qual apresenta o melhor equilíbrio?

Para uma primeira versão acadêmica comparável, a combinação mais equilibrada é **contexto suficiente e estrutura curta de rastreabilidade**, evitando tanto o minimalismo excessivo de T01 quanto o volume de interação e o risco de inferência de T04. Entre os testes realizados, T03 oferece melhor controle sobre decisões; T04 oferece melhor cobertura de domínio, mas exige revisão das suposições.

## 10. Conclusão

Os três testes demonstram resultados diferentes por razões distintas:

1. **T01** prova o que pode ser obtido com o mínimo de informação: uma vertical slice compreensível, barata e concentrada nos fluxos essenciais.
2. **T03** prova que uma sequência de análise verificável melhora a explicação, a rastreabilidade e a identificação de lacunas, mas aumenta bastante o volume de tokens mesmo sem acrescentar fatos ao contexto.
3. **T04** prova que o contexto detalhado permite uma representação muito mais rica dos dados do negócio, porém aumenta a necessidade de separar requisitos explícitos de dados demonstrativos e suposições.

A escolha não deve ser feita apenas pelo número de funcionalidades visíveis. O resultado mais rico de T04 custa pouco mais que T03 na métrica observada, mas sua confiabilidade depende da validação dos preços, serviços, estados e cadastros que não foram completamente definidos no material de origem. Para comparação de custo, os números da captura são úteis; para afirmar custo financeiro real, os registros atuais ainda são insuficientes.

## 11. Referências locais dos três testes

- [T01 — README](prompts/tests/test-01-baseline/README.md), [prompt](prompts/tests/test-01-baseline/prompt/assembled-prompt.md), [output](prompts/tests/test-01-baseline/executions/raul/run_001/output.md), [avaliação](prompts/tests/test-01-baseline/executions/raul/run_001/evaluation.md), [uso](prompts/tests/test-01-baseline/executions/raul/run_001/usage.json), [custo](prompts/tests/test-01-baseline/executions/raul/run_001/cost.md).
- [T03 — README](prompts/tests/test-03-structured-reasoning/README.md), [prompt](prompts/tests/test-03-structured-reasoning/prompt/assembled-prompt.md), [output completo](prompts/tests/test-03-structured-reasoning/executions/raul/run_002/output.md), [avaliação](prompts/tests/test-03-structured-reasoning/executions/raul/run_002/evaluation.md), [uso](prompts/tests/test-03-structured-reasoning/executions/raul/run_002/usage.json), [custo](prompts/tests/test-03-structured-reasoning/executions/raul/run_002/cost.md).
- [T04 — README](prompts/tests/test-04-full-context/README.md), [prompt](prompts/tests/test-04-full-context/prompt/assembled-prompt.md), [contexto completo](prompts/tests/test-04-full-context/prompt/context.md), [manifest](prompts/tests/test-04-full-context/manifest.json).
- Capturas visuais: as pastas `evidence` de cada teste, especialmente as imagens de interface e de uso de tokens.

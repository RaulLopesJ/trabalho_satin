# Variação T06 — contrato de deploy Railway

Esta variação avalia a capacidade de transformar a vertical slice em um artefato que o Railway consiga detectar e iniciar.

- Preserve o domínio HPET04/HPET04a; não crie requisitos funcionais novos.
- Use a topologia de serviço único por padrão: o backend serve `frontend/dist`.
- Gere os arquivos de raiz exigidos pela tarefa e o `railway.json` completo.
- Use `process.env.PORT`, `0.0.0.0`, `/health` e chamadas de API relativas/configuráveis.
- Não use `start.sh` sem fornecer seu conteúdo.
- Marque qualquer alternativa de dois serviços como decisão explícita e gere as configurações necessárias para ambos.
- Não declare que o Railway fez o deploy sem logs ou URL fornecidos na chamada.
- O critério principal é deployabilidade verificável, não apenas aparência da árvore de arquivos.

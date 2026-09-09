---
name: playwright-ui-exploration
description: Use para explorar uma página Web com playwright-cli antes de escrever ou ajustar um step em `steps/*.ts`, e para depurar ao vivo um cenário que falhou, anexando a uma execução pausada.
allowed-tools: Bash(playwright-cli:*) Bash(npx:*) Bash(npm:*)
---

# Exploração Web com playwright-cli

## Comandos essenciais

- abrir página: `playwright-cli open <url>`;
- localizar: `playwright-cli find "<texto>"`;
- snapshot limitado: `playwright-cli snapshot --depth=4`;
- clicar: `playwright-cli click <ref>`;
- preencher: `playwright-cli fill <ref> "<valor>"`;
- consultar atributo: `playwright-cli eval "<expressao>" <ref>`;
- gerar locator: `playwright-cli generate-locator <ref> --raw`;
- encerrar: `playwright-cli close`.

Comandos não cobertos aqui: `playwright-cli --help [comando]`.

## Fluxo de exploração

1. Prefira `find` quando souber o texto ou elemento procurado; `snapshot` só quando precisar da
   estrutura, sempre com `--depth` limitado.
2. Use `--raw` quando somente o valor retornado for necessário.
3. Use `eval` quando `find` ou snapshot não forem suficientes.
4. Feche o navegador ao concluir.

O resultado da exploração alimenta o step em `steps/*.ts`.

## Depurar um cenário que falhou (attach) — só a pedido explícito do usuário

Regra 5 do `CLAUDE.md`: nunca inicie este fluxo só porque um teste falhou.

```bash
PLAYWRIGHT_HTML_OPEN=never npx playwright test --project=chromium --grep "<cenário>" --debug=cli
# aguarde "Debugging Instructions" e o nome da sessão (tw-XXXX)
playwright-cli attach tw-XXXX
playwright-cli resume        # roda o teste até o ponto de falha
playwright-cli snapshot      # inspecione o estado real da página
```

Feche a sessão anexada e pare a execução em background ao concluir. Detalhe completo em
`references/playwright-tests.md`.

## Referências sob demanda

- `references/element-attributes.md` — atributos de elementos;
- `references/session-management.md` — sessões de navegador;
- `references/storage-state.md` — cookies/localStorage;
- `references/tracing.md` — investigação técnica complexa;
- `references/playwright-tests.md` — mecânica de `--debug=cli` e `attach`.

## Nota de manutenção

`playwright-cli install --skills` sobrescreve `.claude/skills/playwright-cli/SKILL.md` sem aviso a
cada reinstalação/atualização. Por isso a versão customizada fica em `playwright-ui-exploration/`.
Se `.claude/skills/playwright-cli/` reaparecer no repositório, é artefato bruto do instalador —
pode apagar.

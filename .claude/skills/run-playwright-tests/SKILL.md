---
name: run-playwright-tests
description: Use para executar a suíte Playwright + playwright-bdd deste repositório — a suíte inteira, uma tag ou um cenário específico — e para checar se os testes passam.
---

# Rodar os Testes do Playwright

## Antes de executar: chromium é o browser default para escopo Web

Dois tipos de project em `playwright.config.ts`: Web (`chromium`, `firefox`, `webkit`) e API
(`api` — sem browser). Cenário(s) Web sem browser indicado no pedido rodam em `chromium` — não
pergunte. Pergunte apenas quando o próprio pedido sugerir mais de um browser (ex.: "cross-browser",
"em todos os navegadores", "chromium e firefox"). Se for só API, a pergunta não se aplica.

Com o browser definido (default `chromium`, outro indicado no pedido, ou a resposta do usuário
quando o pedido for ambíguo entre um browser e vários), monte o comando:

```
npx bddgen
npx playwright test [--project=<nome> ...] [--grep "<tag ou cenário>"]
```

- `npx bddgen` sempre antes de um `playwright test` avulso. Dispensável com `npm test` (já
  encadeia via `pretest`).
- Um `--project=<nome>` por trilha/browser escolhido (`chromium`, `firefox`, `webkit`, `api`).
  Omita `--project` só se o pedido for "tudo" — inclui `api` (Regra 5: nunca rodar mais do que o
  solicitado).
- `--grep` para escopar dentro do(s) project(s) selecionado(s): `"@ferias"`, `"@rescisao"` ou o
  título do cenário. Sem `--grep`, roda tudo dentro do(s) project(s) escolhido(s).
- Não passe `--reporter` (nem `dot`, nem `list`, nem qualquer outro) — isso substitui o array
  `reporter` configurado em `playwright.config.ts` e derruba o relatório HTML. Só use
  `--reporter=dot` se o usuário pedir explicitamente uma checagem rápida sem relatórios.

Reporte o resultado como contagem de pass/fail/skip e nomes dos cenários que falharam — não cole o
stdout bruto multi-browser na resposta. Um cenário `skipped` (Regra 10 do `CLAUDE.md` — Dado sem
massa de teste, não falha de comportamento) nunca entra na contagem de falhas.

## Uma falha faz parte do resultado — não reexecute por conta própria

Regra 5 do `CLAUDE.md`: nunca reexecute um teste por iniciativa própria. Investigação de causa
raiz só a pedido explícito do usuário. Isso vale para falha do site/aplicação alvo — não para
defeito técnico do teste (ver seção abaixo).

## Defeito técnico do teste (não da aplicação): exclua o relatório inválido antes de reexecutar

Regra 9 do `CLAUDE.md`. Se uma execução falhar por um defeito na construção do teste (locator
ambíguo, corrida de condição, step com lógica errada — algo que você escreveu, não um
comportamento real da aplicação) e você corrigir esse defeito, a pasta `reports/<timestamp>/`
dessa execução é inválida — ela não corresponde ao código corrigido. Antes de rodar de novo:

1. Exclua por completo a pasta `reports/<timestamp>/` da execução inválida.
2. Só então execute novamente.
3. Repita (corrigir → excluir → reexecutar) até o relatório gerado corresponder a uma execução
   válida — código corrigido e relatório completo (HTML incluído, ver acima).

Nunca deixe uma pasta de execução inválida em `reports/` nem reporte evidência a partir dela.

# DIRETRIZES DE AUTOMAÇÃO DE TESTES
## Playwright + playwright-bdd (Cucumber) + Claude Code

**Versão 2 – Setembro/2026**

Convenções e decisões detalhadas do projeto, para consulta sob demanda quando o `CLAUDE.md` e a
Skill aplicável não bastarem. Aplicam-se aos testes Web e de API executados via Playwright +
playwright-bdd. Com o cenário definido em `features/*.feature` (Web) ou
`features/api/**/*.feature` (API), a execução é feita pela Skill `run-playwright-tests`.

## 1. Ambiguidades e alterações funcionais

Solicite esclarecimento somente quando faltar informação que realmente impeça a execução técnica e que não possa ser determinada pela estrutura existente ou pela documentação disponível.

Qualquer alteração funcional no cenário exige autorização expressa do usuário.

## 2. Evolução da estrutura do projeto

Amplie a estrutura somente quando a responsabilidade necessária ainda não estiver atendida pelos componentes existentes.

Utilize código TypeScript auxiliar (helpers, fixtures, Page Object Model) somente quando os steps inline em `steps/*.ts` não atenderem adequadamente à necessidade. Hoje o projeto não possui essas camadas — tudo está inline em `steps/*.ts` — e a introdução delas deve ser uma decisão deliberada, não uma mudança incidental feita ao lado de outra tarefa.

Este projeto usa `@playwright/cli` (skill `playwright-ui-exploration`) para exploração de páginas, não o servidor MCP do Playwright (`@playwright/mcp`) — decisão de arquitetura, não ausência de necessidade.

## 3. Convenções de steps

Steps devem possuir responsabilidade clara e nomes funcionais, objetivos e orientados à ação ou ao resultado, seguindo a redação do Gherkin em `features/*.feature`.

Use parâmetros de step (`{string}`, `{int}`, etc.) para transportar dados entre o cenário Gherkin e a implementação.

Antes de considerar a implementação de um step novo concluída, verifique os três pontos abaixo:

- **Reuso.** Procure nos steps existentes uma ação equivalente antes de criar um novo. Se existir, reaproveite-a — mesmo que o texto do cenário sugira uma frase ligeiramente diferente, a diferença de frase sozinha não justifica duplicar comportamento; extraia uma função compartilhada e registre as duas frases sobre ela.
- **Fidelidade.** Um step deve fazer exatamente o que sua frase promete, nem mais nem menos. Se atingir o resultado exigir uma ação adicional não implícita na frase (como navegar por uma página intermediária ou revelar um elemento escondido), essa ação deve ficar visível como parte da interação descrita — nunca escondida em silêncio dentro de um step com nome diferente. Se a única forma de cumprir a frase exigir contornar uma divergência da aplicação em relação ao cenário, aplica-se a Regra 2 do `CLAUDE.md`: implemente e reporte a divergência, não a esconda.
- **Granularidade.** Ao traduzir uma solicitação em Gherkin, decomponha o preenchimento de múltiplos campos ou múltiplas decisões de negócio em steps separados — um step por campo ou decisão —, a menos que eles sempre ocorram juntos como uma única ação indivisível de negócio.

## 4. Convenções BDD

Todo arquivo `.feature` deve declarar `# language: pt` no topo.

`Dado`, `Quando` e `Então` pertencem à camada de cenários; `E` e `Mas` podem complementar essas etapas quando melhorarem a leitura funcional.

Todo cenário deve conter os três — `Dado`, `Quando` e `Então` — mesmo quando a precondição não envolver dado ou estado externo; nenhum dos três é opcional (`CLAUDE.md`, Regra 6).

Mantenha escrita natural em português e frases objetivas, orientadas ao negócio.

O BDD é escrito diretamente nos arquivos `.feature` em `features/`. Os arquivos gerados em `.features-gen/` são compilação técnica produzida pelo `bddgen` — nunca são editados diretamente nem constituem uma segunda fonte de verdade.

Quando o cenário se originar de um plano de testes (`planos-de-teste/`), o título do `Cenário` deve começar com o ID do caso conforme consta no plano, no formato `CT-NN — <nome do caso>` (mesmo texto do plano). O relatório do Playwright exibe o título do cenário — sem o ID, não é possível identificar a qual caso do plano um resultado corresponde.

## 5. Convenções de validação

Utilize a comparação compatível com o requisito:

- igualdade (`toBe`/`toEqual`) quando o conteúdo completo for esperado;
- correspondência parcial (`toContain`) quando o requisito determinar apenas presença de conteúdo;
- comparação numérica quando aplicável.

A validação deve comprovar explicitamente o resultado solicitado pelo cenário.

## 6. Independência e isolamento

Cada cenário deve ser executável de forma independente, iniciar em estado conhecido e produzir o mesmo resultado sem depender da ordem da suíte.

Não compartilhe estado (página, contexto, dados) entre cenários.

Realize limpeza de dados quando ela fizer parte da necessidade funcional ou técnica do cenário.

## 7. Dados e ambientes

Separe configurações de ambiente da lógica dos testes.

Mantenha a URL base (`use.baseURL`) e demais configurações variáveis em `playwright.config.ts` ou em variáveis de ambiente, conforme a arquitetura existente.

Quando uma variável de ambiente necessária não estiver disponível, informe qual variável está ausente e interrompa a execução que depende dela.

## 8. Evidências e resultados

Cada execução real (não `--list`) grava suas evidências em uma subpasta própria de `reports/`, nomeada com o timestamp calculado no início de `playwright.config.ts` (`reports/<AAAA-MM-DD_HH-mm-ss>/`). Nenhuma execução válida sobrescreve a anterior — exceto a exclusão obrigatória de uma execução invalidada por defeito técnico do teste (Regra 9 do `CLAUDE.md`).

Dentro da pasta de cada execução:

- `playwright/index.html` — relatório técnico padrão do Playwright, único formato de relatório do projeto (log passo a passo, diff de asserts falhos, trace, vídeo e screenshot);
- `test-results/` — artefatos brutos por teste (trace, vídeo e screenshot de falha).

O timestamp é único por execução e compartilhado por todos os reporters e pelo `outputDir` bruto.

Vídeo (`retain-on-failure`), screenshot (`only-on-failure`) e trace (`retain-on-failure`) são capturados apenas quando o teste falha, conforme configurado em `playwright.config.ts`.

Mantenha resultados, vídeos, screenshots e traces fora do versionamento do código — `reports/` e `.features-gen/` já estão no `.gitignore`.

`playwright test --list` é uma checagem estrutural (lista os cenários sem executá-los), não evidência de comportamento — não cria pasta de resultados e não deve ser tratada como resultado de execução.

## 9. Tags

Atribua tags (`@tag`) somente quando:

- forem fornecidas junto ao cenário, ou
- forem solicitadas pelo usuário.

Na ausência de tag solicitada/informada, crie o cenário sem tags.

## 10. Padronização do código

Utilize locators semânticos do Playwright (`getByRole`, `getByText`, `getByLabel`, etc.); evite seletores CSS ou XPath crus.

Os `page.evaluate` em `steps/rescisao.steps.ts`, que manipulam diretamente os inputs de data do Flatpickr (e o clique no rádio de aviso prévio), são workarounds deliberados e documentados para um seletor que resiste à interação normal — não são padrão a ser reproduzido em novos steps.

Não utilize esperas fixas (`waitForTimeout`); confie no auto-wait do Playwright e em assertions web-first (`expect(locator).toBeVisible()`, etc.).

Escreva código autoexplicativo (nomes claros, funções pequenas, estrutura direta). Mantenha apenas comentários que agreguem algo que o código sozinho não transmite.

Não deixe código morto ou comentado no repositório — remova-o.

Não há linter/formatter configurado — siga a indentação e o estilo já usados em `features/*.feature` e `steps/*.ts`. Caso um seja adotado, sua configuração passa a ser a fonte de verdade, e alterá-la é decisão global do projeto, não necessidade isolada de uma implementação.

## 11. Testes de API

Testes de API reaproveitam sem alteração todas as seções acima que não dependem de navegador (§§1, 2, 3, 4, 5, 6, 7, 8, 9). Esta seção cobre apenas o que é específico da trilha de API.

Use o fixture nativo `request` (`APIRequestContext`) do Playwright Test — não adicione axios, supertest ou clientes HTTP equivalentes. `request` já cobre headers, corpo JSON, autenticação via header e status/corpo da resposta, e é instrumentado pelo mesmo executor oficial (Regra 3).

`features/api/**/*.feature` ↔ `steps/api/**/*.steps.ts`, mesma relação 1:1 da trilha Web (§2). `steps/api/support/` concentra código auxiliar compartilhado por múltiplos steps de API (leitura de variáveis de ambiente, headers de autenticação, fixture de estado por cenário) — justificado pela mesma exceção do §2, não uma segunda camada de abstração paralela. Cenários em que um `Quando` precisa repassar a resposta para um `Então` do mesmo cenário usam um fixture de teste dedicado (ver `steps/api/support/api-client.ts`), nunca uma variável de módulo — o estado não pode vazar entre cenários (§6).

Nomes canônicos de variável de ambiente: `API_BASE_URL` (obrigatória para qualquer cenário de API) e `API_AUTH_TOKEN` (obrigatória apenas nos steps que chamam `authHeaders()`). Segue o mecanismo de §7: variável ausente interrompe, com mensagem clara, só a execução que depende dela. Localmente essas variáveis podem vir de um `.env` (não versionado — ver `.env.example`), carregado via `dotenv` em `playwright.config.ts`; no CI são fornecidas pelo próprio ambiente de execução.

Sem lib de schema validation (zod/ajv/joi) por padrão — siga §5 (`toBe`/`toEqual`/`toContain`/comparação numérica) para status code e corpo da resposta; os matchers assimétricos do `expect` (`objectContaining`, `arrayContaining`, `stringContaining`) cobrem checagens parciais de JSON sem dependência nova. Introduza uma lib de schema validation só se o usuário pedir contract testing explicitamente — decisão deliberada, como em §2.

A trilha roda isolada em um project próprio (`api`, sem navegador) em `playwright.config.ts`: `npx playwright test --project=api`. Locators semânticos (§10) não se aplicam — não há DOM.

Exploração de endpoints antes de escrever ou ajustar um step: Skill `playwright-api-exploration` (equivalente, para API, da `playwright-ui-exploration` usada na trilha Web).

## 12. Falhas do site/aplicação alvo

Quando o site/aplicação alvo apresentar indisponibilidade, erro ou instabilidade na execução de um teste não faça nenhuma reexecução por sua própria iniciativa, não investigue o motivo. Naturalmente o erro será avaliado posteriormente pelo usuário que decidirá a necessidade ou não de reexecução.

Isso não se aplica quando a falha vem de um defeito técnico do teste, não da aplicação — nesse caso, corrija, exclua o relatório da execução inválida e execute novamente (Regra 9 do `CLAUDE.md`, Skill `run-playwright-tests`).

## 13. Impedimento de execução (massa de teste) vs. falha de comportamento

Regra 10 do `CLAUDE.md`. Um `Dado` que verifica a existência de um registro pré-existente satisfazendo uma condição (ex.: "que existe um produto com desconto") e não a encontra é um impedimento de execução — a massa de teste não existe, então o `Quando`/`Então` nunca chegou a rodar e não há indício de defeito na aplicação. Isso é diferente de uma falha: rotular os dois como `failed` mistura duas causas distintas e gera alarme falso.

playwright-bdd/Playwright tratam qualquer exceção não tratada em qualquer step — inclusive no `Dado` — como falha do cenário por padrão; é uma simplificação do executor, não um veredito sobre a causa raiz. Por isso, num `Dado` que depende de massa pré-existente, verifique a condição sem deixar uma exceção estourar e use `testInfo.skip(condição, motivo)` (fixture `$testInfo`, exposta pelo playwright-bdd) em vez de `expect`/`throw`. O cenário aparece como `skipped`, com o motivo registrado, não como `failed` (exemplo em `steps/visao_geral_produtos.steps.ts`, função `condicaoAtendida`).

Prefira eliminar a dependência na raiz — o `Dado` deveria criar a massa necessária (API, seed, fixture) em vez de procurar um registro que "por acaso" atenda à condição. Use `testInfo.skip` quando depender de dado pré-existente for inevitável, como na trilha Web deste projeto contra um catálogo de terceiros sem canal de criação de massa.

## 14. Planejamento de testes

Planos de teste, quando solicitados, são produzidos pela Skill `playwright-test-planning` e gravados em `planos-de-teste/<web|api|hibrido>/<funcionalidade>.md` — versionados no repositório, sem detalhe técnico de implementação (seletores, endpoints, nomes de step).

Um plano não substitui o cenário em `features/*.feature`/`features/api/**/*.feature`: ele antecede e alimenta a implementação, que segue as demais seções destas Diretrizes.

## 15. Manutenção das fontes de instrução

Quando for solicitado a alterar regras, diretrizes e outras instruções, garanta que cada regra esteja na fonte responsável pelo seu escopo e evite duplicá-la entre `CLAUDE.md`, Skills, referências e estas Diretrizes.

Ao alterar uma regra, atualize sua fonte de verdade de forma coerente em todos os niveis de instruções.

O arquivo destas Diretrizes mantém nome canônico sem versão; a versão vigente é registrada no conteúdo e no histórico do Git.

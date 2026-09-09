# Visão Geral do Projeto

**Documento descritivo — não normativo.** Ele explica como a arquitetura funciona e aponta
para as fontes reais. As regras do projeto continuam exclusivamente em `CLAUDE.md`, nas Skills
(`.claude/skills/`) e nas Diretrizes (`docs/DIRETRIZES_AUTOMACAO_PLAYWRIGHT_BDD_CLAUDE.md`) —
este documento não cria, substitui nem duplica nenhuma delas.

Público-alvo: quem participa do projeto do lado funcional/negócio, sem precisar ler
TypeScript para entender o que existe e como pedir uma execução.

---

## 1. Para que serve

Este é um serviço de automação de testes onde o cenário de negócio é escrito em português
simples. A partir dele:

**Você escreve o cenário em português → o Claude implementa a automação → o Playwright
executa de verdade → você recebe evidências (relatório e, se falhar, vídeo/screenshot).**

O resultado `passed` ou `failed` do Playwright é sempre a fonte oficial — não uma opinião,
não uma estimativa.

## 2. O mapa mental: as pastas que importam

De tudo que existe no repositório, estas pastas concentram o que é relevante para quem pensa
em termos de negócio:

| Pasta | O que é |
|---|---|
| `planos-de-teste/` | **O que você planeja (opcional).** A cobertura de testes discutida e priorizada, com os casos já em BDD, antes de virar cenário executável. |
| `features/` | **O que você escreve.** Os cenários em português (`.feature`), o único lugar onde a intenção de negócio vive. |
| `steps/` | **O vocabulário que o robô entende.** Cada frase do cenário (`Dado`, `Quando`, `Então`) tem uma implementação aqui, em TypeScript, escondida do lado funcional. |
| `reports/` | **O que você recebe.** Uma pasta por execução, com data e hora, contendo os relatórios e as evidências dessa execução específica. |

Tudo o mais (`playwright.config.ts`, `.features-gen/`, `node_modules/`, `package.json`) é
infraestrutura de suporte — necessária, mas não é onde a intenção de negócio é expressa nem
onde o resultado é lido.

## 3. Como um teste nasce e roda

```mermaid
flowchart LR
    P["Plano de testes (opcional)<br/>planos-de-teste/"] -->|"vira cenário"| A["Cenário em português<br/>features/*.feature"]
    A -->|"bddgen traduz"| B["Teste técnico gerado<br/>.features-gen/"]
    B -->|"Playwright executa"| C{"Resultado oficial"}
    C -->|passed| D["reports/AAAA-MM-DD_HH-mm-ss/"]
    C -->|failed| D
    D --> F["Playwright<br/>passo a passo · trace · vídeo · screenshot"]
```

Passo a passo:

0. Opcionalmente, a cobertura de testes é discutida e priorizada antes de virar cenário — um
   plano em `planos-de-teste/`, produzido pela Skill `playwright-test-planning`.
1. O cenário de negócio é escrito (ou ajustado) em um arquivo `.feature`, em português, com
   `Dado` / `Quando` / `Então`.
2. O `bddgen` traduz esse português para um teste técnico executável, guardado em
   `.features-gen/` — uma pasta gerada automaticamente, nunca editada à mão.
3. O Playwright executa esse teste de verdade, contra o site ou serviço alvo.
4. Cada execução grava seus relatórios e evidências em uma pasta própria, nomeada com a data
   e hora exatas (`reports/2026-09-04_11-10-37/`, por exemplo) — a execução anterior nunca é
   apagada ou sobrescrita.

## 4. As duas trilhas: Web e API

O projeto automatiza dois tipos de coisa, mantidos propositalmente separados:

| | Trilha Web | Trilha API |
|---|---|---|
| O que testa | Páginas e formulários de um site | Respostas de um serviço (chamadas HTTP) |
| O que você escreve | Cenário em `features/*.feature` | Cenário em `features/api/**/*.feature` |
| Vocabulário (steps) | `steps/*.ts` | `steps/api/**/*.ts` |
| Precisa de navegador? | Sim — chromium (default), firefox ou webkit sob pedido | Não |
| Exemplo hoje | Calculadoras de férias e rescisão do 4Devs | Cenário de exemplo contra um serviço público de teste (`httpbin.org`), ainda não substituído por um cenário de negócio real |

As duas trilhas são compiladas e executadas de forma independente, para que um ajuste em uma
nunca interfira na outra.

## 5. Como pedir uma execução

O pedido é feito em linguagem natural ao Claude — por exemplo, "rode os cenários de férias" ou
"rode todos os testes de API". Um pedido Web que não especifica navegador roda em `chromium` por
padrão, sem perguntar; navegador só é perguntado se o próprio pedido sugerir mais de um (por
exemplo, "cross-browser"). Por trás, isso vira um comando Playwright equivalente a:

```
npx bddgen
npx playwright test --project=chromium --grep "@ferias"
```

Formas de escopar a execução:

- **Por trilha/navegador** — `chromium`, `firefox`, `webkit` (Web) ou `api`.
- **Por tag** — `@ferias`, `@rescisao`, ou outra tag atribuída ao cenário.
- **Por título do cenário** — pedindo exatamente o cenário desejado.
- **Tudo** — quando nenhum recorte é pedido, roda a suíte inteira, incluindo a trilha de API.

Uma execução só acontece quando explicitamente solicitada — o Claude não reexecuta testes
por conta própria, nem mesmo após uma falha.

## 6. Onde ver o resultado

Cada execução real grava um relatório em `reports/<data-hora>/playwright/index.html` — inclui o
passo a passo de cada cenário (`Dado`/`Quando`/`Então`), o diff de qualquer asserção que tenha
falhado, e trace/vídeo/screenshot de qualquer passo que tenha falhado.

Vídeo, screenshot e trace só são gravados quando o teste falha — é o comportamento
configurado para não acumular evidência desnecessária em execuções bem-sucedidas. Uma
listagem de cenários (`playwright test --list`) não gera pasta de resultados — não é uma
execução.

## 7. Como o serviço se governa

As regras que orientam como o Claude trabalha neste projeto vivem em três níveis, cada uma
com uma função diferente:

1. **`CLAUDE.md`** — as regras permanentes e inegociáveis do projeto (preservar o cenário
   como dado, não reexecutar por conta própria, BDD em português, credenciais fora do
   repositório, entre outras).
2. **Skills (`.claude/skills/`)** — o procedimento passo a passo para uma tarefa específica:
   planejar os cenários de teste, rodar a suíte, explorar uma página antes de escrever um step,
   explorar um endpoint de API, atualizar o repositório no GitHub.
3. **Diretrizes (`docs/DIRETRIZES_AUTOMACAO_PLAYWRIGHT_BDD_CLAUDE.md`)** — o detalhamento
   técnico consultado apenas quando as regras e a Skill não bastam.

Cada regra existe em um único desses lugares — não há duplicação entre eles. 

## 8. Avaliação da arquitetura atual

Pontos que já sustentam bem o objetivo de ser um serviço no-code compreensível:

- **Superfície de edição realmente estreita.** No dia a dia, só é necessário mexer em
  arquivos `.feature`, em português — o resto é infraestrutura que o usuário funcional não
  precisa tocar.
- **Governança madura e sem duplicação**, nos três níveis descritos acima.
- **Evidência por execução, sem sobrescrita.** Cada execução tem sua própria pasta com
  timestamp; nada se perde entre uma execução e a próxima.
- **Um único relatório, sem redundância.** Um só formato para manter, sem dúvida sobre qual é
  a fonte de verdade.
- **Trilhas Web e API isoladas de propósito**, com o raciocínio documentado na própria
  configuração.
- **Segredos fora do código.** Token e URL da API vêm de variável de ambiente, com uma
  mensagem clara quando falta alguma — nunca um erro técnico genérico.
- **Cenários organizados por funcionalidade, com subpastas prontas para uso.** Férias e
  rescisão de contrato vivem hoje em arquivos `.feature` separados
  (`features/ferias.feature` e `features/rescisao.feature`), e a busca por cenários da
  trilha Web é recursiva — pronta para agrupar cenários em subpastas por área de
  negócio assim que surgir uma segunda área.
- **Navegador default para execução Web.** Um pedido de execução Web sem navegador
  especificado roda em `chromium` — o Claude não pergunta qual navegador usar a cada
  execução; a pergunta só acontece quando o próprio pedido sugerir mais de um navegador.

## 9. Glossário

| Termo | Significado |
|---|---|
| Gherkin | A linguagem estruturada usada para escrever cenários com `Dado`/`Quando`/`Então`. |
| Cenário | Um caso de teste completo, escrito em português em um arquivo `.feature`. |
| Step | A implementação (em TypeScript) de uma frase do cenário. |
| Tag | Uma etiqueta (`@ferias`, `@rescisao`) usada para agrupar e selecionar cenários. |
| Trilha | Um agrupamento independente de execução — hoje, Web ou API. |
| `bddgen` | Ferramenta que traduz os arquivos `.feature` em testes executáveis pelo Playwright. |
| Trace | Um registro detalhado passo a passo de uma execução, usado para investigar uma falha. |
| Fixture | Um recurso preparado e isolado para um teste (por exemplo, o estado de uma chamada de API dentro de um cenário). |
| Project | Um agrupamento de configuração no Playwright (por exemplo, `chromium` ou `api`). |

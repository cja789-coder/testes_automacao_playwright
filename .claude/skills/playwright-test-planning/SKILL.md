---
name: playwright-test-planning
description: Use quando o cenário de teste ainda não estiver definido e for necessário identificar a cobertura de testes e planejar os casos a partir de um escopo, requisito de negócio ou funcionalidade, antes de qualquer implementação em `features/*.feature` e `steps/*.ts` (Playwright + playwright-bdd).
---

# Planejamento de cenários de teste

## Escopo

Esta Skill cobre exclusivamente o **planejamento** de testes: identificar a cobertura necessária, priorizar por risco e detalhar os casos em BDD. Não implementa, não cria nem altera arquivos `.feature`/`steps/*.ts`, não executa `bddgen` nem Playwright. A implementação é sempre um passo posterior e explícito, conduzido diretamente conforme `CLAUDE.md` e `docs/DIRETRIZES_AUTOMACAO_PLAYWRIGHT_BDD_CLAUDE.md`, apoiado pelas Skills `playwright-ui-exploration`/`playwright-api-exploration` (exploração) e `run-playwright-tests` (execução/validação).

## Princípios

- Testar comportamento, não quantidade: o objetivo é o **menor conjunto de casos** que forneça cobertura adequada dos requisitos, regras e riscos relevantes — não o maior número possível de casos.
- Priorizar por risco e criticidade, não por achismo.
- Buscar cobertura suficiente, não exaustiva.
- Cada caso deve ter objetivo específico e resultado esperado objetivamente verificável (PASS/FAIL claro). Evite descrições genéricas ("validar cadastro"); prefira comportamento observável ("o cadastro é concluído quando todos os dados obrigatórios são válidos").
- Não criar caso sem justificativa de cobertura, risco ou comportamento; não duplicar casos semanticamente equivalentes; não transformar cada variação de dado em um novo caso quando ela não muda o comportamento esperado.
- Quando o requisito enumerar o conjunto completo de opções de um campo de escolha (combo/select, lista, rádio, checkbox), tratar como dois comportamentos distintos, não redundantes entre si: a composição exata do conjunto de opções disponíveis, e a seleção funcional de cada opção não padrão. Testar a seleção de uma opção não comprova que o conjunto disponível está correto e completo.
- Considerar casos positivos e negativos quando houver risco ou regra que justifique sua existência.
- Não inventar requisito, regra, comportamento ou resultado esperado não sustentado pela base de teste. Quando faltar informação, registre a lacuna na coluna "Observação/Pendência" do caso relacionado (ou em "Pendências", quando não for específica a um critério/teste) em vez de supor.

## Base de teste

Analise, quando disponíveis: requisitos, histórias de usuário, critérios de aceitação, regras de negócio, especificações funcionais, fluxos, contratos de API, modelos de dados, integrações, restrições, requisitos não funcionais, histórico de defeitos, mudanças recentes e documentação técnica. Não assuma que informação ausente é uma regra implícita.

## Origem das regras de negócio

Identifique de onde vêm as regras de negócio da funcionalidade, a partir do próprio pedido:

- **(a) Descritas no pedido**: o usuário já informou as regras diretamente na conversa.
- **(b) Documento anexado**: o usuário indicou ou anexou um documento de regras/funcionalidade.
- **(c) Exploração explícita**: o usuário pediu explicitamente um processo exploratório — Skill `playwright-ui-exploration` (Web) ou `playwright-api-exploration` (API) — para descobrir campos, mensagens, endpoints e comportamento reais antes de planejar.

Se nenhuma dessas origens estiver clara no pedido, solicite esclarecimento ao usuário antes de prosseguir.

## Reaproveitamento

Antes de criar um novo plano, verifique se já existe plano (`planos-de-teste/`) ou implementação (`features/`, `features/api/`, `steps/`, `steps/api/`) para a mesma funcionalidade e reaproveite o que já existir em vez de recriar.

## Técnicas de teste

Selecione somente a(s) técnica(s) pertinente(s) à característica do problema — não aplique todas indiscriminadamente. Escolha a que produzir melhor cobertura com menor redundância. Considere principalmente:

- Particionamento de Equivalência;
- Análise de Valor Limite;
- Tabela de Decisão;
- Teste de Transição de Estados;
- Teste baseado em Casos de Uso/Fluxos;
- Testes Negativos;
- Teste baseado em Risco;
- Testes exploratórios, quando apropriado.

## Fluxo de trabalho

1. Identificar a origem das regras de negócio (ver "Origem das regras de negócio"), pedindo esclarecimento se nenhuma estiver clara.
2. Verificar reaproveitamento de um plano ou implementação já existente (ver "Reaproveitamento").
3. Entender o escopo — objetivo, atores, entradas/saídas, fluxos, exceções, integrações — delimitando o que está dentro e fora, e classificar como Web, API ou Híbrido.
4. Identificar requisitos, regras e riscos relevantes, relacionando requisito → regra → comportamento; o risco orienta a prioridade de cada caso.
5. Selecionar a(s) técnica(s) de teste pertinente(s) ao problema (ver "Técnicas de teste").
6. Derivar os casos de teste a partir dos comportamentos identificados e da técnica selecionada, aplicando os "Princípios" e a "Especificidade" (ver "Critérios de qualidade e rejeição").
7. Revisar o conjunto e eliminar redundâncias antes de prosseguir.
8. Somente então, detalhar cada caso em BDD (Dado/Quando/Então).
9. Montar o documento único (template abaixo), incluindo a Matriz de Rastreabilidade de Requisitos logo após os Cenários de Teste (ver "Matriz de Rastreabilidade de Requisitos") e registrando cada pendência na coluna "Observação/Pendência" do caso relacionado ou, quando não for específica a um critério/teste, na seção "Pendências" (ver "Observação/Pendência").
10. Antes de gravar, conferir cenário a cenário que todos contêm `Dado`, `Quando` e `Então` — nenhum dos três é opcional (`CLAUDE.md`, Regra 6) — e corrigir qualquer cenário que não cumpra essa condição.
11. Gravar o arquivo em `planos-de-teste/<web|api|hibrido>/<funcionalidade>.md`, com o nome da funcionalidade em snake_case, no mesmo padrão de nomenclatura já usado em `features/*.feature` e `features/api/**/*.feature` (ex.: `ferias`, `rescisao`).
12. Reportar ao usuário o arquivo criado, um resumo da cobertura e eventuais pendências registradas.

## Critérios de qualidade e rejeição

Um caso é adequado quando possui objetivo específico e delimitado, valida um comportamento real, tem resultado esperado verificável, e está relacionado a um requisito, regra ou risco relevante.

**Especificidade**: cada caso deve ter um único objetivo claro e delimitado. Não agrupe objetivos independentes no mesmo caso — por exemplo, "cadastrar, alterar, consultar e excluir cliente" não é um caso, são pelo menos quatro. Prefira casos independentes para cada comportamento verificável; um caso pode ter múltiplas etapas (Dado/E) apenas quando forem necessárias para atingir esse único objetivo.

Não crie ou mantenha um caso quando: não houver comportamento relevante a validar; ele duplicar outro caso; variar apenas dados sem alterar o comportamento; não houver resultado esperado verificável; depender de regra inventada; ou existir apenas para aumentar a quantidade de casos.

## Matriz de Rastreabilidade de Requisitos

Obrigatória em todo plano, logo após os Cenários de Teste. Agrupe os casos pelo requisito/critério que cobrem (a mesma coluna "Requisito" usada nos Cenários de Teste), listando cada requisito uma única vez, com a descrição do critério, os IDs dos casos que o cobrem e a quantidade de casos. Ela evidencia que todo requisito tem cobertura e sustenta a rastreabilidade entre requisito e caso — não repete nem substitui os Cenários de Teste.

## Observação/Pendência

A coluna "Observação/Pendência", ao final dos Cenários de Teste, registra na própria linha do caso qualquer pendência, dúvida ou lacuna específica daquele critério ou caso — cobrindo, para esses casos, a necessidade que antes só a seção "Pendências" atendia. Deixe a coluna vazia (ou "—") quando o caso não tiver observação. A seção "Pendências" ao final do documento continua existindo, mas apenas para lacunas que não sejam específicas de um critério/teste (por exemplo, uma dependência de ambiente ou configuração que afete o plano como um todo) — nesse caso, ela não é atribuível a uma única linha da tabela.

## Template do documento

```markdown
# Plano de Testes — <Funcionalidade>

## Contexto
- Origem das regras: <descrição fornecida | documento anexado | exploração realizada>
- Aplicação/URL alvo: <quando aplicável>
- Classificação: Web | API | Híbrido

## Cenários de Teste

| ID    | Caso            | Requisito         | Regra coberta      | Risco            | Classificação      | Prioridade         | Observação/Pendência |
|-------|-----------------|---------------------|---------------------|--------------------|----------------------|----------------------|------------------------|
| CT-01 | <nome do caso>  | <requisito relacionado> | <regra de negócio>  | <impacto/criticidade> | Positivo/Negativo   | Alta/Média/Baixa     | <observação ou pendência específica, quando houver>   |

## Matriz de Rastreabilidade de Requisitos

| Desc. Critério              | IDs dos Casos      | Qtd. Casos |
|------------------------------|---------------------|------------|
| <descrição do requisito/critério> | <CT-01, CT-02, ...> | <n>        |

## Cenários (BDD)

### CT-01 — <nome do caso>
Dado ...
Quando ...
Então ...

## Pendências
- <lacuna de informação, premissa ou dependência identificada durante a análise, quando houver>
```

Escreva o BDD em pt-BR, com frases naturais e orientadas ao negócio, no mesmo estilo já usado nos arquivos `.feature` do projeto (`Dado`, `Quando`, `Então`, complementados por `E`/`Mas` quando melhorarem a leitura — ver Diretrizes §4). Todo cenário exige os três passos; quando não houver precondição de dado ou estado externo, expresse no `Dado` a premissa mínima real do caso (ex.: ausência de um registro, contexto ou intenção do ator) — nunca um `Dado` de preenchimento sem relação com o caso. Não inclua detalhe técnico de implementação (seletores, endpoints, nomes de step) — isso cabe à etapa de implementação. Não inclua tags (`@tag`) no plano — atribuí-las é decisão da etapa de implementação, apenas quando fornecidas ou solicitadas (Diretrizes §9). Não inclua a seção "Pendências" quando não houver nenhuma lacuna a registrar.

A Prioridade indica a ordem de execução recomendada, orientada por risco: **Alta** para o fluxo principal e regras críticas de negócio; **Média** para validações relevantes (obrigatoriedade, mensagens de erro); **Baixa** para casos secundários ou de menor probabilidade de ocorrência.

# Plano de Testes — Visão geral de produtos (Product Overview)

## Contexto
- Origem das regras: documento anexado — User Story "Product Overview" e seus 13 Acceptance Criteria, em https://github.com/testsmith-io/practice-software-testing/blob/main/docs/user-stories/v5.md (conteúdo bruto conferido em https://raw.githubusercontent.com/testsmith-io/practice-software-testing/main/docs/user-stories/v5.md).
- User Story: "As a visitor, I want to browse a paginated overview of all products with search, filtering, sorting, and a price range slider, so that I can efficiently find products within my preferences and budget."
- Aplicação/URL alvo: https://with-bugs.practicesoftwaretesting.com/#/ (aplicação de demonstração do repositório testsmith-io/practice-software-testing)
- Classificação: Web
- Escopo: página inicial (home) exibindo a grade de produtos, com busca, filtros (categoria e marca), ordenação, slider de faixa de preço e paginação, acessível a um visitante não autenticado. Fora de escopo: página de detalhe do produto, carrinho e demais funcionalidades cobertas por outras User Stories do mesmo documento.

Este documento cobre o planejamento e os cenários em BDD (`Dado`/`Quando`/`Então`) de cada caso. A implementação em `features/*.feature` e `steps/*.ts` é uma etapa posterior, ainda não realizada.

## Cenários de Teste

| ID    | Caso                                                                                  | Requisito | Regra coberta                                                                          | Risco                                                          | Classificação | Prioridade | Observação/Pendência |
|-------|-----------------------------------------------------------------------------------------|-----------|-------------------------------------------------------------------------------------------|-------------------------------------------------------------------|----------------|------------|-------------------------|
| CT-01 | Grade de produtos é exibida ao acessar a home                                           | AC1       | Cada card exibe imagem, nome e preço do produto                                           | Fluxo principal — primeira impressão da aplicação                 | Positivo       | Alta       | Se a opção padrão de ordenação (AC9, não especificada no critério) corresponder a este estado inicial, o caso equivalente de ordenação poderá ser consolidado com este durante a exploração, evitando redundância. |
| CT-02 | Clicar em um card de produto navega para a página de detalhe                            | AC2       | Clique no card leva à página de detalhe do produto                                        | Fluxo principal de navegação                                      | Positivo       | Alta       | —                        |
| CT-03 | Paginação é exibida e permite navegar entre páginas quando há mais produtos do que cabem em uma página | AC3       | Controles de paginação aparecem abaixo da grade e a troca de página atualiza a grade       | Fluxo principal — acesso ao catálogo completo                     | Positivo       | Alta       | —                        |
| CT-04 | Paginação não é exibida quando todos os produtos cabem em uma única página              | AC3       | Controles de paginação só aparecem quando há mais produtos do que cabem em uma página      | Caso de borda — elemento de navegação desnecessário não deve aparecer | Negativo       | Média      | —                        |
| CT-05 | Busca com o menor tamanho permitido (3 caracteres) filtra a grade corretamente          | AC4       | Consulta válida (3–40 caracteres) atualiza a grade para os produtos correspondentes        | Limite inferior do intervalo válido de busca                      | Positivo       | Média      | Ver CT-07 para o comportamento abaixo deste limite (resultado esperado não especificado pelo critério). |
| CT-06 | Busca com o maior tamanho permitido (40 caracteres) filtra a grade corretamente         | AC4       | Consulta válida (3–40 caracteres) atualiza a grade para os produtos correspondentes        | Limite superior do intervalo válido de busca                      | Positivo       | Média      | Ver CT-08 para o comportamento acima deste limite (resultado esperado não especificado pelo critério). |
| CT-07 | Busca abaixo do limite mínimo permitido (2 caracteres) tem o comportamento de validação observado e registrado | AC4 | Consulta com menos de 3 caracteres está fora do intervalo válido definido no critério; o critério não especifica o resultado esperado para esse caso | Limite inferior sem tratamento definido pode gerar comportamento inconsistente não detectado | Negativo | Média | Resultado esperado definido apenas de forma genérica (observar e registrar o comportamento real), por não haver especificação no critério (AC4) — ver Skill `playwright-test-planning`, "Resultado esperado não totalmente claro". |
| CT-08 | Busca acima do limite máximo permitido (41 caracteres) tem o comportamento de validação observado e registrado | AC4 | Consulta com mais de 40 caracteres está fora do intervalo válido definido no critério; o critério não especifica o resultado esperado para esse caso | Limite superior sem tratamento definido pode gerar comportamento inconsistente não detectado | Negativo | Média | Resultado esperado definido apenas de forma genérica (observar e registrar o comportamento real), por não haver especificação no critério (AC4) — ver Skill `playwright-test-planning`, "Resultado esperado não totalmente claro". |
| CT-09 | Busca válida reseta os filtros ativos previamente selecionados                          | AC4       | Toda busca válida limpa os filtros ativos                                                 | Consistência de estado da grade após a busca                      | Positivo       | Alta       | —                        |
| CT-10 | Seleção de uma ou mais categorias filtra a grade para produtos dessas categorias        | AC5       | Grade mostra somente produtos das categorias marcadas                                      | Fluxo principal de filtragem                                      | Positivo       | Alta       | —                        |
| CT-11 | Seleção de múltiplas categorias atualiza a grade considerando as categorias selecionadas | AC5      | Critério especifica "uma ou mais categorias" mas não define a regra de combinação (união ou interseção) entre múltiplas categorias marcadas simultaneamente | Regra de combinação não verificada pode ocultar comportamento inconsistente (ex.: produtos de uma categoria marcada não aparecerem) | Positivo | Média | Resultado esperado definido apenas de forma genérica (observar e registrar a regra de combinação realmente aplicada), por não haver especificação no critério (AC5) — ver Skill `playwright-test-planning`, "Resultado esperado não totalmente claro". |
| CT-12 | Marcar uma categoria pai marca automaticamente todas as categorias filhas               | AC6       | Marcar o checkbox da categoria pai marca também os checkboxes das categorias filhas        | Consistência da seleção hierárquica de categorias                 | Positivo       | Média      | —                        |
| CT-13 | Estado da categoria pai é observado quando apenas parte das categorias filhas é desmarcada | AC6    | Critério define apenas os extremos (marcar o pai marca todos os filhos; desmarcar todos os filhos desmarca o pai) mas não define o estado do pai quando só parte dos filhos está marcada | Estado intermediário do pai não definido pode gerar inconsistência visual (pai marcado sugerindo todos os filhos selecionados, quando não estão) | Positivo | Média | Resultado esperado definido apenas de forma genérica (observar e registrar o estado do pai), por não haver especificação de estado intermediário no critério (AC6) — ver Skill `playwright-test-planning`, "Resultado esperado não totalmente claro". |
| CT-14 | Desmarcar todas as categorias filhas desmarca automaticamente a categoria pai           | AC6       | Desmarcar todos os filhos desmarca o checkbox do pai                                       | Consistência da seleção hierárquica de categorias                 | Positivo       | Média      | —                        |
| CT-15 | Estado das categorias filhas é observado quando a categoria pai é desmarcada diretamente | AC6     | Critério define o efeito de marcar o pai sobre os filhos, mas não define o efeito inverso — desmarcar o pai diretamente sobre o estado dos filhos | Comportamento não definido pode deixar filhos marcados sem a categoria pai correspondente marcada, uma inconsistência de UX | Positivo | Média | Resultado esperado definido apenas de forma genérica (observar e registrar o estado dos filhos), por não haver especificação no critério (AC6) — ver Skill `playwright-test-planning`, "Resultado esperado não totalmente claro". |
| CT-16 | Seleção de uma ou mais marcas filtra a grade para produtos dessas marcas                | AC7       | Grade mostra somente produtos das marcas marcadas                                          | Fluxo principal de filtragem                                      | Positivo       | Alta       | —                        |
| CT-17 | Seleção de múltiplas marcas atualiza a grade considerando as marcas selecionadas        | AC7       | Critério especifica "uma ou mais marcas" mas não define a regra de combinação (união ou interseção) entre múltiplas marcas marcadas simultaneamente | Regra de combinação não verificada pode ocultar comportamento inconsistente (ex.: produtos de uma marca marcada não aparecerem) | Positivo | Média | Resultado esperado definido apenas de forma genérica (observar e registrar a regra de combinação realmente aplicada), por não haver especificação no critério (AC7) — ver Skill `playwright-test-planning`, "Resultado esperado não totalmente claro". |
| CT-18 | Combinação de filtros de categoria e marca exibe somente produtos que atendem a ambos   | AC8       | Com categorias e marcas selecionadas, a grade mostra apenas produtos que atendem às duas   | Uso combinado de filtros é um fluxo real e frequente do visitante | Positivo       | Alta       | —                        |
| CT-19 | Seletor de ordenação apresenta exatamente as opções Nome A-Z, Nome Z-A, Preço Maior-Menor e Preço Menor-Maior | AC9       | Conjunto de opções de ordenação é o definido no critério, sem faltar nem sobrar opção      | Composição incorreta do seletor limita a funcionalidade de busca  | Negativo       | Baixa      | —                        |
| CT-20 | Ordenação por Nome A-Z reordena a grade corretamente                                    | AC9       | Seleção da opção reordena a grade conforme o critério escolhido                            | Funcionalidade de ordenação                                       | Positivo       | Média      | —                        |
| CT-21 | Ordenação por Nome Z-A reordena a grade corretamente                                    | AC9       | Seleção da opção reordena a grade conforme o critério escolhido                            | Funcionalidade de ordenação                                       | Positivo       | Média      | —                        |
| CT-22 | Ordenação por Preço Maior-Menor reordena a grade corretamente                           | AC9       | Seleção da opção reordena a grade conforme o critério escolhido                            | Funcionalidade de ordenação — impacta decisão de compra            | Positivo       | Média      | —                        |
| CT-23 | Ordenação por Preço Menor-Maior reordena a grade corretamente                           | AC9       | Seleção da opção reordena a grade conforme o critério escolhido                            | Funcionalidade de ordenação — impacta decisão de compra            | Positivo       | Média      | —                        |
| CT-24 | Slider de faixa de preço é exibido com intervalo padrão de $1 a $100 e limite máximo de $200 | AC10      | Slider aparece na barra lateral com o intervalo padrão e o limite máximo definidos          | Estado inicial correto do filtro de preço                         | Positivo       | Média      | —                        |
| CT-25 | Ajuste do slider para um intervalo diferente do padrão filtra a grade para produtos dentro da faixa selecionada | AC11      | Arrastar os manípulos do slider atualiza a grade para os produtos dentro da nova faixa      | Fluxo principal do filtro de preço — impacta decisão de compra    | Positivo       | Alta       | —                        |
| CT-26 | Ajuste do slider para o valor máximo permitido (200) filtra a grade corretamente        | AC11      | Grade reflete corretamente o limite superior explícito do slider                           | Limite superior do filtro de preço                                | Positivo       | Média      | Critério (AC10) define apenas o valor máximo explícito do slider (200); o valor mínimo absoluto não é informado (apenas o valor padrão, 1) — a confirmar via exploração antes de detalhar o limite inferior. |
| CT-27 | Produto com desconto exibe o preço original tarjado e o preço com desconto abaixo       | AC12      | Card de produto com desconto mostra preço original tarjado e preço com desconto            | Exatidão de informação de preço — risco financeiro/confiança      | Positivo       | Alta       | —                        |
| CT-28 | Produto sem desconto exibe somente o preço normal, sem tarjado                          | AC12      | Card de produto sem desconto não deve exibir indicação de desconto                         | Exatidão de informação de preço — evita desconto falso exibido    | Negativo       | Baixa      | —                        |
| CT-29 | Produto sem estoque exibe o indicador "Out of stock" no card                            | AC13      | Card de produto sem estoque mostra o texto "Out of stock"                                  | Exatidão de disponibilidade — evita frustração de compra          | Positivo       | Alta       | —                        |
| CT-30 | Produto com estoque disponível não exibe o indicador "Out of stock"                     | AC13      | Card de produto com estoque não deve exibir "Out of stock"                                 | Exatidão de disponibilidade — evita indisponibilidade falsa exibida | Negativo       | Baixa      | —                        |

## Matriz de Rastreabilidade de Requisitos

| Desc. Critério                                      | IDs dos Casos                        | Qtd. Casos |
|-------------------------------------------------------|----------------------------------------|------------|
| AC1 – Product grid is displayed                       | CT-01                                  | 1          |
| AC2 – Navigating to product detail                     | CT-02                                  | 1          |
| AC3 – Pagination                                       | CT-03, CT-04                           | 2          |
| AC4 – Search                                           | CT-05, CT-06, CT-07, CT-08, CT-09      | 5          |
| AC5 – Category filter                                  | CT-10, CT-11                           | 2          |
| AC6 – Hierarchical category selection                  | CT-12, CT-13, CT-14, CT-15             | 4          |
| AC7 – Brand filter                                     | CT-16, CT-17                           | 2          |
| AC8 – Combining filters                                | CT-18                                  | 1          |
| AC9 – Sorting                                          | CT-19, CT-20, CT-21, CT-22, CT-23      | 5          |
| AC10 – Price range slider                              | CT-24                                  | 1          |
| AC11 – Adjusting the price range                       | CT-25, CT-26                           | 2          |
| AC12 – Discount price display                          | CT-27, CT-28                           | 2          |
| AC13 – Out of stock indicator                          | CT-29, CT-30                           | 2          |

## Cenários (BDD)

### CT-01 — Grade de produtos é exibida ao acessar a home
Dado que sou um visitante da aplicação
Quando acesso a página inicial
Então uma grade de produtos é exibida
E cada card de produto exibe imagem, nome e preço

### CT-02 — Clicar em um card de produto navega para a página de detalhe
Dado que a visão geral de produtos está sendo exibida
Quando clico em um card de produto
Então sou navegado para a página de detalhe desse produto

### CT-03 — Paginação é exibida e permite navegar entre páginas quando há mais produtos do que cabem em uma página
Dado que existem mais produtos cadastrados do que cabem em uma única página da grade
Quando acesso a visão geral de produtos
Então os controles de paginação são exibidos abaixo da grade
E ao clicar em um número de página, a grade é atualizada com os produtos dessa página

### CT-04 — Paginação não é exibida quando todos os produtos cabem em uma única página
Dado que todos os produtos cadastrados cabem em uma única página da grade
Quando acesso a visão geral de produtos
Então nenhum controle de paginação é exibido

### CT-05 — Busca com o menor tamanho permitido (3 caracteres) filtra a grade corretamente
Dado que estou na visão geral de produtos
Quando pesquiso por um termo de 3 caracteres que corresponde a produtos existentes
Então a grade é atualizada exibindo somente os produtos correspondentes ao termo pesquisado

### CT-06 — Busca com o maior tamanho permitido (40 caracteres) filtra a grade corretamente
Dado que estou na visão geral de produtos
Quando pesquiso por um termo de 40 caracteres que corresponde a produtos existentes
Então a grade é atualizada exibindo somente os produtos correspondentes ao termo pesquisado

### CT-07 — Busca abaixo do limite mínimo permitido (2 caracteres) tem o comportamento de validação observado e registrado
Dado que estou na visão geral de produtos
Quando pesquiso por um termo de 2 caracteres, abaixo do limite mínimo permitido
Então o comportamento de validação ou rejeição da busca é observado e registrado, já que o critério (AC4) não especifica o resultado esperado para esse caso

### CT-08 — Busca acima do limite máximo permitido (41 caracteres) tem o comportamento de validação observado e registrado
Dado que estou na visão geral de produtos
Quando pesquiso por um termo de 41 caracteres, acima do limite máximo permitido
Então o comportamento de validação ou rejeição da busca é observado e registrado, já que o critério (AC4) não especifica o resultado esperado para esse caso

### CT-09 — Busca válida reseta os filtros ativos previamente selecionados
Dado que tenho filtros de categoria e/ou marca ativos na visão geral de produtos
Quando realizo uma busca válida
Então os filtros de categoria e marca previamente ativos são removidos
E a grade é atualizada exibindo somente os produtos correspondentes à busca

### CT-10 — Seleção de uma ou mais categorias filtra a grade para produtos dessas categorias
Dado que estou na visão geral de produtos
Quando marco uma ou mais categorias na barra lateral
Então a grade é atualizada exibindo somente produtos dessas categorias

### CT-11 — Seleção de múltiplas categorias atualiza a grade considerando as categorias selecionadas
Dado que estou na visão geral de produtos
Quando marco duas ou mais categorias que possuem produtos associados
Então a grade é atualizada exibindo os produtos considerando as categorias selecionadas, e a regra de combinação aplicada pela aplicação (união ou interseção) é observada e registrada, já que o critério (AC5) não a especifica

### CT-12 — Marcar uma categoria pai marca automaticamente todas as categorias filhas
Dado que uma categoria pai com categorias filhas é exibida na barra lateral de filtros
Quando marco o checkbox da categoria pai
Então os checkboxes de todas as categorias filhas também são marcados

### CT-13 — Estado da categoria pai é observado quando apenas parte das categorias filhas é desmarcada
Dado que uma categoria pai e todas as suas categorias filhas estão marcadas
Quando desmarco apenas uma das categorias filhas, mantendo as demais marcadas
Então o estado do checkbox da categoria pai é observado e registrado, já que o critério (AC6) não define um estado intermediário

### CT-14 — Desmarcar todas as categorias filhas desmarca automaticamente a categoria pai
Dado que uma categoria pai e todas as suas categorias filhas estão marcadas
Quando desmarco todas as categorias filhas
Então o checkbox da categoria pai também é desmarcado

### CT-15 — Estado das categorias filhas é observado quando a categoria pai é desmarcada diretamente
Dado que uma categoria pai e todas as suas categorias filhas estão marcadas
Quando desmarco diretamente o checkbox da categoria pai
Então o estado dos checkboxes das categorias filhas é observado e registrado, já que o critério (AC6) não especifica esse comportamento

### CT-16 — Seleção de uma ou mais marcas filtra a grade para produtos dessas marcas
Dado que estou na visão geral de produtos
Quando marco uma ou mais marcas na barra lateral
Então a grade é atualizada exibindo somente produtos dessas marcas

### CT-17 — Seleção de múltiplas marcas atualiza a grade considerando as marcas selecionadas
Dado que estou na visão geral de produtos
Quando marco duas ou mais marcas que possuem produtos associados
Então a grade é atualizada exibindo os produtos considerando as marcas selecionadas, e a regra de combinação aplicada pela aplicação (união ou interseção) é observada e registrada, já que o critério (AC7) não a especifica

### CT-18 — Combinação de filtros de categoria e marca exibe somente produtos que atendem a ambos
Dado que selecionei uma ou mais categorias na barra lateral
Quando também marco uma ou mais marcas
Então a grade exibe somente os produtos que atendem simultaneamente às categorias e às marcas selecionadas

### CT-19 — Seletor de ordenação apresenta exatamente as opções Nome A-Z, Nome Z-A, Preço Maior-Menor e Preço Menor-Maior
Dado que estou na visão geral de produtos
Quando abro o seletor de ordenação
Então as opções exibidas são exatamente Nome A-Z, Nome Z-A, Preço Maior-Menor e Preço Menor-Maior, sem nenhuma opção a mais ou a menos

### CT-20 — Ordenação por Nome A-Z reordena a grade corretamente
Dado que a grade de produtos está sendo exibida
Quando seleciono a opção de ordenação "Nome A-Z"
Então a grade é reordenada exibindo os produtos em ordem alfabética crescente pelo nome

### CT-21 — Ordenação por Nome Z-A reordena a grade corretamente
Dado que a grade de produtos está sendo exibida
Quando seleciono a opção de ordenação "Nome Z-A"
Então a grade é reordenada exibindo os produtos em ordem alfabética decrescente pelo nome

### CT-22 — Ordenação por Preço Maior-Menor reordena a grade corretamente
Dado que a grade de produtos está sendo exibida
Quando seleciono a opção de ordenação "Preço Maior-Menor"
Então a grade é reordenada exibindo os produtos do maior para o menor preço

### CT-23 — Ordenação por Preço Menor-Maior reordena a grade corretamente
Dado que a grade de produtos está sendo exibida
Quando seleciono a opção de ordenação "Preço Menor-Maior"
Então a grade é reordenada exibindo os produtos do menor para o maior preço

### CT-24 — Slider de faixa de preço é exibido com intervalo padrão de $1 a $100 e limite máximo de $200
Dado que acesso a visão geral de produtos
Quando a página é carregada
Então o slider de faixa de preço é exibido na barra lateral com intervalo padrão de $1 a $100
E o limite máximo do slider é $200

### CT-25 — Ajuste do slider para um intervalo diferente do padrão filtra a grade para produtos dentro da faixa selecionada
Dado que estou na visão geral de produtos
Quando ajusto os manípulos do slider de preço para um intervalo diferente do padrão
Então a grade é atualizada exibindo somente produtos cujo preço está dentro do intervalo selecionado

### CT-26 — Ajuste do slider para o valor máximo permitido (200) filtra a grade corretamente
Dado que estou na visão geral de produtos
Quando ajusto o manípulo superior do slider de preço para o valor máximo permitido (200)
Então a grade é atualizada exibindo corretamente os produtos dentro da faixa de preço selecionada

### CT-27 — Produto com desconto exibe o preço original tarjado e o preço com desconto abaixo
Dado que existe um produto cadastrado com desconto
Quando esse produto é exibido na grade
Então o card mostra o preço original tarjado
E mostra o preço com desconto abaixo do preço original

### CT-28 — Produto sem desconto exibe somente o preço normal, sem tarjado
Dado que existe um produto cadastrado sem desconto
Quando esse produto é exibido na grade
Então o card mostra somente o preço normal, sem preço tarjado

### CT-29 — Produto sem estoque exibe o indicador "Out of stock" no card
Dado que existe um produto cadastrado sem estoque disponível
Quando esse produto é exibido na grade
Então o card exibe o indicador "Out of stock"

### CT-30 — Produto com estoque disponível não exibe o indicador "Out of stock"
Dado que existe um produto cadastrado com estoque disponível
Quando esse produto é exibido na grade
Então o card não exibe o indicador "Out of stock"

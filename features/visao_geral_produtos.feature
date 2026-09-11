# language: pt

Funcionalidade: Visão Geral de Produtos - Practice Software Testing

  Cenário: CT-01 — Grade de produtos é exibida ao acessar a home
    Dado que sou um visitante da aplicação
    Quando acesso a página inicial
    Então uma grade de produtos é exibida
    E cada card de produto exibe imagem, nome e preço

  Cenário: CT-02 — Clicar em um card de produto navega para a página de detalhe
    Dado que a visão geral de produtos está sendo exibida
    Quando clico em um card de produto
    Então sou navegado para a página de detalhe desse produto

  Cenário: CT-03 — Paginação é exibida e permite navegar entre páginas quando há mais produtos do que cabem em uma página
    Dado que existem mais produtos cadastrados do que cabem em uma única página da grade
    Quando acesso a visão geral de produtos
    Então os controles de paginação são exibidos abaixo da grade
    E ao clicar em um número de página, a grade é atualizada com os produtos dessa página

  Cenário: CT-09 — Busca válida reseta os filtros ativos previamente selecionados
    Dado que tenho filtros de categoria e/ou marca ativos na visão geral de produtos
    Quando realizo uma busca válida
    Então os filtros de categoria e marca previamente ativos são removidos
    E a grade é atualizada exibindo somente os produtos correspondentes à busca

  Cenário: CT-10 — Seleção de uma ou mais categorias filtra a grade para produtos dessas categorias
    Dado que estou na visão geral de produtos
    Quando marco uma ou mais categorias na barra lateral
    Então a grade é atualizada exibindo somente produtos dessas categorias

  Cenário: CT-16 — Seleção de uma ou mais marcas filtra a grade para produtos dessas marcas
    Dado que estou na visão geral de produtos
    Quando marco uma ou mais marcas na barra lateral
    Então a grade é atualizada exibindo somente produtos dessas marcas

  Cenário: CT-18 — Combinação de filtros de categoria e marca exibe somente produtos que atendem a ambos
    Dado que selecionei uma ou mais categorias na barra lateral
    Quando também marco uma ou mais marcas
    Então a grade exibe somente os produtos que atendem simultaneamente às categorias e às marcas selecionadas

  Cenário: CT-25 — Ajuste do slider para um intervalo diferente do padrão filtra a grade para produtos dentro da faixa selecionada
    Dado que estou na visão geral de produtos
    Quando ajusto os manípulos do slider de preço para um intervalo diferente do padrão
    Então a grade é atualizada exibindo somente produtos cujo preço está dentro do intervalo selecionado

  Cenário: CT-27 — Produto com desconto exibe o preço original tarjado e o preço com desconto abaixo
    Dado que existe um produto cadastrado com desconto
    Quando esse produto é exibido na grade
    Então o card mostra o preço original tarjado
    E mostra o preço com desconto abaixo do preço original

  Cenário: CT-29 — Produto sem estoque exibe o indicador "Out of stock" no card
    Dado que existe um produto cadastrado sem estoque disponível
    Quando esse produto é exibido na grade
    Então o card exibe o indicador "Out of stock"

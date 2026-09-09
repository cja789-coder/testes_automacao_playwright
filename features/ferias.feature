# language: pt

Funcionalidade: Calculadora de Férias - 4Devs

  @ferias
  Cenário: Navegar para a página de Cálculo de Férias a partir da página inicial
    Dado que estou na página inicial do 4Devs
    Quando clico no link "Cálculo de Férias"
    Então a página deve ter o título "Cálculo de Férias"

  @ferias
  Cenário: Validação de salário obrigatório ao calcular sem preencher nada
    Dado que estou na página de cálculo de férias
    Quando clico no botão Calcular sem preencher nada
    Então deve aparecer a mensagem "É obrigatório que o campo salário esteja preenchido corretamente"

  @ferias
  Cenário: Calcular férias com salário bruto de 1000,00
    Dado que estou na página de cálculo de férias
    Quando preencho o campo Salário bruto com "1000,00"
    E clico no botão Calcular
    Então deve aparecer o texto "Você receberá um total de: R$ 1.732,86"

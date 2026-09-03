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

  @rescisao
  Cenário: Navegar para a calculadora de rescisão e confirmar campos da página
    Dado que estou na página inicial do 4Devs
    Quando clico no link "Calculadora de rescisão de contrato"
    Então a página deve conter o campo "Salário base"
    E a página deve conter o campo "Fim do contrato de trabalho"
    E a página deve conter o texto "O aviso prévio foi cumprido?"

  @rescisao
  Cenário: Validação de data fim obrigatória ao calcular rescisão
    Dado que estou na página de cálculo de rescisão de contrato
    E preencho o campo "Salário base" com "10000,00"
    E defino a data de início do contrato como "04-08-2025"
    Quando clico no botão Calcular
    Então deve aparecer a mensagem "É obrigatório definir a data de fim de contrato de trabalho."

  @rescisao
  Cenário: Calcular rescisão com dados válidos
    Dado que estou na página de cálculo de rescisão de contrato
    Quando preencho o formulário de rescisão com salário "10000,00" início "04-08-2025" fim "04-08-2026" e aviso prévio "Sim"
    E clico no botão Calcular
    Então deve aparecer o texto "Valor líquido após os descontos: R$ 6.207,29"

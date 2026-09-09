# language: pt

Funcionalidade: Calculadora de Rescisão de Contrato - 4Devs

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
    Quando preencho o campo "Salário base" com "10000,00"
    E defino a data de início do contrato como "04-08-2025"
    E defino a data de fim do contrato como "04-08-2026"
    E defino o aviso prévio como "Sim"
    E clico no botão Calcular
    Então deve aparecer o texto "Valor líquido após os descontos: R$ 6.207,29"

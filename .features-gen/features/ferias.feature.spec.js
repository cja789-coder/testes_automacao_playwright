// Generated from: features\ferias.feature
import { test } from "playwright-bdd";

test.describe('Calculadora de Férias - 4Devs', () => {

  test('Navegar para a página de Cálculo de Férias a partir da página inicial', { tag: ['@ferias'] }, async ({ Given, When, Then, page }) => { 
    await Given('que estou na página inicial do 4Devs', null, { page }); 
    await When('clico no link "Cálculo de Férias"', null, { page }); 
    await Then('a página deve ter o título "Cálculo de Férias"', null, { page }); 
  });

  test('Validação de salário obrigatório ao calcular sem preencher nada', { tag: ['@ferias'] }, async ({ Given, When, Then, page }) => { 
    await Given('que estou na página de cálculo de férias', null, { page }); 
    await When('clico no botão Calcular sem preencher nada', null, { page }); 
    await Then('deve aparecer a mensagem "É obrigatório que o campo salário esteja preenchido corretamente"', null, { page }); 
  });

  test('Calcular férias com salário bruto de 1000,00', { tag: ['@ferias'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('que estou na página de cálculo de férias', null, { page }); 
    await When('preencho o campo Salário bruto com "1000,00"', null, { page }); 
    await And('clico no botão Calcular', null, { page }); 
    await Then('deve aparecer o texto "Você receberá um total de: R$ 1.732,86"', null, { page }); 
  });

  test('Navegar para a calculadora de rescisão e confirmar campos da página', { tag: ['@rescisao'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('que estou na página inicial do 4Devs', null, { page }); 
    await When('clico no link "Calculadora de rescisão de contrato"', null, { page }); 
    await Then('a página deve conter o campo "Salário base"', null, { page }); 
    await And('a página deve conter o campo "Fim do contrato de trabalho"', null, { page }); 
    await And('a página deve conter o texto "O aviso prévio foi cumprido?"', null, { page }); 
  });

  test('Validação de data fim obrigatória ao calcular rescisão', { tag: ['@rescisao'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('que estou na página de cálculo de rescisão de contrato', null, { page }); 
    await And('preencho o campo "Salário base" com "10000,00"', null, { page }); 
    await And('defino a data de início do contrato como "04-08-2025"', null, { page }); 
    await When('clico no botão Calcular', null, { page }); 
    await Then('deve aparecer a mensagem "É obrigatório definir a data de fim de contrato de trabalho."', null, { page }); 
  });

  test('Calcular rescisão com dados válidos', { tag: ['@rescisao'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('que estou na página de cálculo de rescisão de contrato', null, { page }); 
    await When('preencho o formulário de rescisão com salário "10000,00" início "04-08-2025" fim "04-08-2026" e aviso prévio "Sim"', null, { page }); 
    await And('clico no botão Calcular', null, { page }); 
    await Then('deve aparecer o texto "Valor líquido após os descontos: R$ 6.207,29"', null, { page }); 
  });

});

// == technical section ==

test.afterEach('AfterEach Hooks', ({ $runScenarioHooks, page }) => $runScenarioHooks('after', { page }));

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features\\ferias.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":6,"tags":["@ferias"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Dado que estou na página inicial do 4Devs","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"Quando clico no link \"Cálculo de Férias\"","stepMatchArguments":[{"group":{"start":14,"value":"\"Cálculo de Férias\"","children":[{"start":15,"value":"Cálculo de Férias","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Então a página deve ter o título \"Cálculo de Férias\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Cálculo de Férias\"","children":[{"start":28,"value":"Cálculo de Férias","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":12,"pickleLine":12,"tags":["@ferias"],"steps":[{"pwStepLine":13,"gherkinStepLine":13,"keywordType":"Context","textWithKeyword":"Dado que estou na página de cálculo de férias","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"Quando clico no botão Calcular sem preencher nada","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Então deve aparecer a mensagem \"É obrigatório que o campo salário esteja preenchido corretamente\"","stepMatchArguments":[{"group":{"start":25,"value":"\"É obrigatório que o campo salário esteja preenchido corretamente\"","children":[{"start":26,"value":"É obrigatório que o campo salário esteja preenchido corretamente","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":18,"pickleLine":18,"tags":["@ferias"],"steps":[{"pwStepLine":19,"gherkinStepLine":19,"keywordType":"Context","textWithKeyword":"Dado que estou na página de cálculo de férias","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":20,"keywordType":"Action","textWithKeyword":"Quando preencho o campo Salário bruto com \"1000,00\"","stepMatchArguments":[{"group":{"start":35,"value":"\"1000,00\"","children":[{"start":36,"value":"1000,00","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":21,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"E clico no botão Calcular","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"Então deve aparecer o texto \"Você receberá um total de: R$ 1.732,86\"","stepMatchArguments":[{"group":{"start":22,"value":"\"Você receberá um total de: R$ 1.732,86\"","children":[{"start":23,"value":"Você receberá um total de: R$ 1.732,86","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":25,"pickleLine":25,"tags":["@rescisao"],"steps":[{"pwStepLine":26,"gherkinStepLine":26,"keywordType":"Context","textWithKeyword":"Dado que estou na página inicial do 4Devs","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":27,"keywordType":"Action","textWithKeyword":"Quando clico no link \"Calculadora de rescisão de contrato\"","stepMatchArguments":[{"group":{"start":14,"value":"\"Calculadora de rescisão de contrato\"","children":[{"start":15,"value":"Calculadora de rescisão de contrato","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":28,"gherkinStepLine":28,"keywordType":"Outcome","textWithKeyword":"Então a página deve conter o campo \"Salário base\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Salário base\"","children":[{"start":30,"value":"Salário base","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":29,"keywordType":"Outcome","textWithKeyword":"E a página deve conter o campo \"Fim do contrato de trabalho\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Fim do contrato de trabalho\"","children":[{"start":30,"value":"Fim do contrato de trabalho","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":30,"gherkinStepLine":30,"keywordType":"Outcome","textWithKeyword":"E a página deve conter o texto \"O aviso prévio foi cumprido?\"","stepMatchArguments":[{"group":{"start":29,"value":"\"O aviso prévio foi cumprido?\"","children":[{"start":30,"value":"O aviso prévio foi cumprido?","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":33,"pickleLine":33,"tags":["@rescisao"],"steps":[{"pwStepLine":34,"gherkinStepLine":34,"keywordType":"Context","textWithKeyword":"Dado que estou na página de cálculo de rescisão de contrato","stepMatchArguments":[]},{"pwStepLine":35,"gherkinStepLine":35,"keywordType":"Context","textWithKeyword":"E preencho o campo \"Salário base\" com \"10000,00\"","stepMatchArguments":[{"group":{"start":17,"value":"\"Salário base\"","children":[{"start":18,"value":"Salário base","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":36,"value":"\"10000,00\"","children":[{"start":37,"value":"10000,00","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":36,"gherkinStepLine":36,"keywordType":"Context","textWithKeyword":"E defino a data de início do contrato como \"04-08-2025\"","stepMatchArguments":[{"group":{"start":41,"value":"\"04-08-2025\"","children":[{"start":42,"value":"04-08-2025","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":37,"gherkinStepLine":37,"keywordType":"Action","textWithKeyword":"Quando clico no botão Calcular","stepMatchArguments":[]},{"pwStepLine":38,"gherkinStepLine":38,"keywordType":"Outcome","textWithKeyword":"Então deve aparecer a mensagem \"É obrigatório definir a data de fim de contrato de trabalho.\"","stepMatchArguments":[{"group":{"start":25,"value":"\"É obrigatório definir a data de fim de contrato de trabalho.\"","children":[{"start":26,"value":"É obrigatório definir a data de fim de contrato de trabalho.","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":41,"pickleLine":41,"tags":["@rescisao"],"steps":[{"pwStepLine":42,"gherkinStepLine":42,"keywordType":"Context","textWithKeyword":"Dado que estou na página de cálculo de rescisão de contrato","stepMatchArguments":[]},{"pwStepLine":43,"gherkinStepLine":43,"keywordType":"Action","textWithKeyword":"Quando preencho o formulário de rescisão com salário \"10000,00\" início \"04-08-2025\" fim \"04-08-2026\" e aviso prévio \"Sim\"","stepMatchArguments":[{"group":{"start":46,"value":"\"10000,00\"","children":[{"start":47,"value":"10000,00","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":64,"value":"\"04-08-2025\"","children":[{"start":65,"value":"04-08-2025","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":81,"value":"\"04-08-2026\"","children":[{"start":82,"value":"04-08-2026","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":109,"value":"\"Sim\"","children":[{"start":110,"value":"Sim","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":44,"gherkinStepLine":44,"keywordType":"Action","textWithKeyword":"E clico no botão Calcular","stepMatchArguments":[]},{"pwStepLine":45,"gherkinStepLine":45,"keywordType":"Outcome","textWithKeyword":"Então deve aparecer o texto \"Valor líquido após os descontos: R$ 6.207,29\"","stepMatchArguments":[{"group":{"start":22,"value":"\"Valor líquido após os descontos: R$ 6.207,29\"","children":[{"start":23,"value":"Valor líquido após os descontos: R$ 6.207,29","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end
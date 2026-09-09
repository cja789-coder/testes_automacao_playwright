import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

Given('que estou na página inicial do 4Devs', async ({ page }) => {
  await page.goto('https://www.4devs.com.br', { waitUntil: 'domcontentloaded' });
});

Given('que estou na página de cálculo de férias', async ({ page }) => {
  await page.goto('https://www.4devs.com.br/calculo_de_ferias', { waitUntil: 'domcontentloaded' });
});

// Fidelidade (Diretrizes §3): clica no link presente na página atual, nada além disso. O
// cenário parte de "Dado que estou na página inicial" — se o link não estiver acessível
// diretamente ali, a execução deve falhar e a divergência (Regra 2 do CLAUDE.md) deve ser
// reportada, não contornada em silêncio navegando para outra URL dentro deste step.
When('clico no link {string}', async ({ page }, linkText: string) => {
  await page.locator(`a:has-text("${linkText}")`).first().click();
});

Then('a página deve ter o título {string}', async ({ page }, title: string) => {
  await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible();
});

// Compartilhado com a funcionalidade de rescisão (features/rescisao.feature)
Then('deve aparecer a mensagem {string}', async ({ page }, message: string) => {
  await expect(page.getByText(message)).toBeVisible();
});

When('preencho o campo Salário bruto com {string}', async ({ page }, value: string) => {
  await page.getByRole('textbox', { name: '1. Salário bruto' }).fill(value);
});

// Reuso (Diretrizes §3): "sem preencher nada" e o clique simples são a mesma ação de
// interface — uma implementação, duas frases de cenário.
async function clicarBotaoCalcular(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Calcular' }).click();
}

// Compartilhado com a funcionalidade de rescisão (features/rescisao.feature)
When('clico no botão Calcular', async ({ page }) => {
  await clicarBotaoCalcular(page);
});

When('clico no botão Calcular sem preencher nada', async ({ page }) => {
  await clicarBotaoCalcular(page);
});

// Compartilhado com a funcionalidade de rescisão (features/rescisao.feature)
Then('deve aparecer o texto {string}', async ({ page }, text: string) => {
  // The result label and monetary value are rendered in separate sibling DOM elements
  const colonIdx = text.lastIndexOf(': ');
  if (colonIdx !== -1) {
    await expect(page.getByText(text.substring(0, colonIdx + 1)).first()).toBeVisible();
    await expect(page.getByText(text.substring(colonIdx + 2)).first()).toBeVisible();
  } else {
    await expect(page.getByText(text).first()).toBeVisible();
  }
});

import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

Given('que estou na página de cálculo de rescisão de contrato', async ({ page }) => {
  await page.goto('https://www.4devs.com.br/rescisao_contrato', { waitUntil: 'domcontentloaded' });
});

Then('a página deve conter o campo {string}', async ({ page }, fieldName: string) => {
  await expect(page.getByText(fieldName).first()).toBeVisible();
});

Then('a página deve conter o texto {string}', async ({ page }, text: string) => {
  await expect(page.getByText(text).first()).toBeVisible();
});

When('preencho o campo {string} com {string}', async ({ page }, fieldName: string, value: string) => {
  await page.getByRole('textbox', { name: new RegExp(fieldName, 'i') }).first().fill(value);
});

When('defino a data de início do contrato como {string}', async ({ page }, date: string) => {
  // Flatpickr uses a hidden input; set it directly and sync the visible readonly field
  await page.evaluate((d: string) => {
    const hidden = document.getElementById('inicio_contrato') as HTMLInputElement;
    hidden.value = d;
    hidden.dispatchEvent(new Event('change', { bubbles: true }));
    const visible = document.querySelector('#inicio_contrato-input-group input[type="text"]') as HTMLInputElement;
    if (visible) visible.value = d;
  }, date);
});

// Granularidade (Diretrizes §3): campo próprio, um step por decisão de negócio.
When('defino a data de fim do contrato como {string}', async ({ page }, date: string) => {
  // Flatpickr uses a hidden input; set it directly and sync the visible readonly field
  await page.evaluate((d: string) => {
    const hidden = document.getElementById('fim_contrato') as HTMLInputElement;
    hidden.value = d;
    hidden.dispatchEvent(new Event('change', { bubbles: true }));
    const visible = document.querySelector('#fim_contrato-input-group input[type="text"]') as HTMLInputElement;
    if (visible) visible.value = d;
  }, date);
});

// Granularidade (Diretrizes §3): campo próprio, um step por decisão de negócio.
When('defino o aviso prévio como {string}', async ({ page }, aviso: string) => {
  if (aviso.toLowerCase() === 'sim') {
    await page.evaluate(() => (document.getElementById('aviso_sim') as HTMLElement).click());
  }
});

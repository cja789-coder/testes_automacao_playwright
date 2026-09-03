import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

Given('que estou na página inicial do 4Devs', async ({ page }) => {
  await page.goto('https://www.4devs.com.br', { waitUntil: 'domcontentloaded' });
});

Given('que estou na página de cálculo de férias', async ({ page }) => {
  await page.goto('https://www.4devs.com.br/calculo_de_ferias', { waitUntil: 'domcontentloaded' });
});

When('clico no link {string}', async ({ page }, linkText: string) => {
  // /computacao exposes the side menu item that is hidden on the homepage
  await page.goto('https://www.4devs.com.br/computacao', { waitUntil: 'domcontentloaded' });
  await page.locator(`a:has-text("${linkText}")`).first().click();
});

Then('a página deve ter o título {string}', async ({ page }, title: string) => {
  await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible();
});

When('clico no botão Calcular sem preencher nada', async ({ page }) => {
  await page.getByRole('button', { name: 'Calcular' }).click();
});

Then('deve aparecer a mensagem {string}', async ({ page }, message: string) => {
  await expect(page.getByText(message)).toBeVisible();
});

When('preencho o campo Salário bruto com {string}', async ({ page }, value: string) => {
  await page.getByRole('textbox', { name: '1. Salário bruto' }).fill(value);
});

// ── Rescisão de contrato ─────────────────────────────────────────────────────

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

When('preencho o formulário de rescisão com salário {string} início {string} fim {string} e aviso prévio {string}',
  async ({ page }, salario: string, inicio: string, fim: string, aviso: string) => {
    await page.locator('#salario').fill(salario);
    // Flatpickr dates are set via hidden inputs to bypass the readonly picker
    await page.evaluate(({ i, f }: { i: string; f: string }) => {
      const setDate = (id: string, groupId: string, val: string) => {
        const h = document.getElementById(id) as HTMLInputElement;
        h.value = val;
        h.dispatchEvent(new Event('change', { bubbles: true }));
        const v = document.querySelector(`#${groupId} input[type="text"]`) as HTMLInputElement;
        if (v) v.value = val;
      };
      setDate('inicio_contrato', 'inicio_contrato-input-group', i);
      setDate('fim_contrato', 'fim_contrato-input-group', f);
    }, { i: inicio, f: fim });
    if (aviso.toLowerCase() === 'sim') {
      await page.evaluate(() => (document.getElementById('aviso_sim') as HTMLElement).click());
    }
  }
);

When('clico no botão Calcular', async ({ page }) => {
  await page.getByRole('button', { name: 'Calcular' }).click();
});

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

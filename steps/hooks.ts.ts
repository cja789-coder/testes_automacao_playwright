import { test, createBdd } from 'playwright-bdd';
import { allure } from 'allure-playwright';

const { Before, After } = createBdd(test);

After(async ({ page, $testInfo }) => {
  const screenshot = await page.screenshot({ fullPage: true });

  const nome = $testInfo.status === 'passed'
    ? 'Screenshot final (sucesso)'
    : 'Screenshot no momento da falha';

  await allure.attachment(nome, screenshot, 'image/png');
});
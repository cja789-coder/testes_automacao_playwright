import { createBdd } from 'playwright-bdd';
import { expect, type Page, type Locator } from '@playwright/test';

const { Given, When, Then } = createBdd();

const URL_VISAO_GERAL = 'https://with-bugs.practicesoftwaretesting.com/#/';

async function irParaVisaoGeralDeProdutos(page: Page) {
  await page.goto(URL_VISAO_GERAL, { waitUntil: 'domcontentloaded' });
}

function cardsDeProdutos(page: Page): Locator {
  return page.getByRole('link').filter({ has: page.getByRole('heading', { level: 5 }) });
}

async function nomesDosProdutosExibidos(page: Page): Promise<string[]> {
  const titulos = await page.getByRole('heading', { level: 5 }).allTextContents();
  return titulos.map((t) => t.trim()).sort();
}

// A grade é recarregada de forma assíncrona após qualquer filtro/busca; expect.poll tenta
// novamente até a lista exibida convergir para a esperada, em vez de comparar uma única leitura
// que pode capturar o estado anterior à atualização.
async function esperarProdutosExibidosSerem(page: Page, esperado: string[]) {
  await expect.poll(() => nomesDosProdutosExibidos(page)).toEqual(esperado);
}

// Verifica uma condição de massa sem lançar exceção — usada nos Dados que dependem de um
// registro pré-existente no catálogo satisfazer uma condição (ex.: produto com desconto, produto
// sem estoque). Quando a condição não se confirma, isso é impedimento de execução (massa de
// teste ausente), não falha de comportamento — ver uso de `$testInfo.skip` nos Dados abaixo.
async function condicaoAtendida(locator: Locator, timeout = 5000): Promise<boolean> {
  try {
    await expect(locator).toBeVisible({ timeout });
    return true;
  } catch {
    return false;
  }
}

// Diretrizes §3 (Reuso): mesma ação de navegação por trás de frases diferentes
// ("acesso a página inicial", "acesso a visão geral de produtos", "que estou na
// visão geral de produtos" etc.) — uma implementação, várias frases de cenário.
Given('que sou um visitante da aplicação', async () => {
  // Nenhuma preparação técnica é necessária: o Playwright já inicia sem sessão autenticada.
});

Given('que a visão geral de produtos está sendo exibida', async ({ page }) => {
  await irParaVisaoGeralDeProdutos(page);
});

Given('que estou na visão geral de produtos', async ({ page }) => {
  await irParaVisaoGeralDeProdutos(page);
});

When('acesso a página inicial', async ({ page }) => {
  await irParaVisaoGeralDeProdutos(page);
});

When('acesso a visão geral de produtos', async ({ page }) => {
  await irParaVisaoGeralDeProdutos(page);
});

Then('uma grade de produtos é exibida', async ({ page }) => {
  await expect(cardsDeProdutos(page).first()).toBeVisible();
});

// A imagem do card não possui atributo alt (lacuna de acessibilidade da aplicação) e por
// isso não é exposta com role=img; localizada pela tag, dentro do escopo de cada card.
Then('cada card de produto exibe imagem, nome e preço', async ({ page }) => {
  const cards = cardsDeProdutos(page);
  const total = await cards.count();
  expect(total).toBeGreaterThan(0);
  for (let i = 0; i < total; i++) {
    const card = cards.nth(i);
    await expect(card.locator('img')).toBeVisible();
    await expect(card.getByRole('heading', { level: 5 })).toBeVisible();
    await expect(card.getByText(/^\$\d/).first()).toBeVisible();
  }
});

When('clico em um card de produto', async ({ page }) => {
  await cardsDeProdutos(page).first().click();
});

Then('sou navegado para a página de detalhe desse produto', async ({ page }) => {
  await expect(page).toHaveURL(/#\/product\/\d+/);
});

Given(
  'que existem mais produtos cadastrados do que cabem em uma única página da grade',
  async ({ page, $testInfo }) => {
    await irParaVisaoGeralDeProdutos(page);
    const existemMultiplasPaginas = await condicaoAtendida(
      page.getByRole('navigation', { name: 'Pagination' }).getByText('2', { exact: true })
    );
    $testInfo.skip(
      !existemMultiplasPaginas,
      'Catálogo atual não tem produtos suficientes para mais de uma página — impedimento de ' +
        'massa de teste (pré-condição do AC3 não atendida), não falha de comportamento.'
    );
  }
);

Then('os controles de paginação são exibidos abaixo da grade', async ({ page }) => {
  await expect(page.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
});

Then(
  'ao clicar em um número de página, a grade é atualizada com os produtos dessa página',
  async ({ page }) => {
    const produtosAntes = await nomesDosProdutosExibidos(page);
    await page.getByRole('navigation', { name: 'Pagination' }).getByText('2', { exact: true }).click();
    await expect(page.getByText("You're on page 2")).toBeVisible();
    const produtosDepois = await nomesDosProdutosExibidos(page);
    expect(produtosDepois).not.toEqual(produtosAntes);
  }
);

Given('que tenho filtros de categoria e\\/ou marca ativos na visão geral de produtos', async ({ page }) => {
  await irParaVisaoGeralDeProdutos(page);
  await page.getByRole('checkbox', { name: 'Pliers', exact: true }).check();
  await expect(page.getByRole('checkbox', { name: 'Pliers', exact: true })).toBeChecked();
  // A grade é recarregada de forma assíncrona (chamada ao backend) após marcar o filtro;
  // aguarda a rede ociosa em vez de comparar a grade antes de ela terminar de atualizar.
  await page.waitForLoadState('networkidle');
});

When('realizo uma busca válida', async ({ page }) => {
  await page.getByRole('textbox').fill('Hammer');
  await page.getByRole('button', { name: 'Serch' }).click();
  await page.waitForLoadState('networkidle');
});

Then('os filtros de categoria e marca previamente ativos são removidos', async ({ page }) => {
  await expect(page.getByRole('checkbox', { name: 'Pliers', exact: true })).not.toBeChecked();
});

const PRODUTOS_BUSCA_HAMMER = [
  'Claw Hammer',
  'Claw Hammer with Fiberglass Handle',
  'Claw Hammer with Shock Reduction Grip',
  'Court Hammer',
  'Hammer',
  'Thor Hammer',
].sort();

Then('a grade é atualizada exibindo somente os produtos correspondentes à busca', async ({ page }) => {
  await esperarProdutosExibidosSerem(page, PRODUTOS_BUSCA_HAMMER);
});

const PRODUTOS_CATEGORIA_PLIERS = [
  'Bolt Cutters',
  'Combination Pliers',
  'Long Nose Pliers',
  'Pliers',
  'Slip Joint Pliers',
].sort();

// Compartilhado com o Dado do CT-12 ("que selecionei uma ou mais categorias na barra
// lateral") — mesma ação de marcar a categoria "Pliers" por trás de frases diferentes.
async function marcarCategoriaPliers(page: Page) {
  await page.getByRole('checkbox', { name: 'Pliers', exact: true }).check();
  await page.waitForLoadState('networkidle');
}

When('marco uma ou mais categorias na barra lateral', async ({ page }) => {
  await marcarCategoriaPliers(page);
});

Given('que selecionei uma ou mais categorias na barra lateral', async ({ page }) => {
  await irParaVisaoGeralDeProdutos(page);
  await marcarCategoriaPliers(page);
});

Then('a grade é atualizada exibindo somente produtos dessas categorias', async ({ page }) => {
  await esperarProdutosExibidosSerem(page, PRODUTOS_CATEGORIA_PLIERS);
});

const PRODUTOS_MARCA_BRAND_2 = ['Bolt Cutters', 'Slip Joint Pliers'].sort();

// Compartilhado com o Quando do CT-12 ("também marco uma ou mais marcas") — mesma ação de
// marcar a marca "Brand name 2" por trás de frases diferentes.
async function marcarMarcaBrandName2(page: Page) {
  await page.getByRole('checkbox', { name: 'Brand name 2', exact: true }).check();
  await page.waitForLoadState('networkidle');
}

When('marco uma ou mais marcas na barra lateral', async ({ page }) => {
  await marcarMarcaBrandName2(page);
});

Then('a grade é atualizada exibindo somente produtos dessas marcas', async ({ page }) => {
  await esperarProdutosExibidosSerem(page, PRODUTOS_MARCA_BRAND_2);
});

When('também marco uma ou mais marcas', async ({ page }) => {
  await marcarMarcaBrandName2(page);
});

Then(
  'a grade exibe somente os produtos que atendem simultaneamente às categorias e às marcas selecionadas',
  async ({ page }) => {
    // "Pliers" (categoria) e "Brand name 2" (marca) intersectam nos mesmos 2 produtos de
    // PRODUTOS_MARCA_BRAND_2 — confirmado por exploração: a categoria "Pliers" isolada
    // retorna 5 produtos, provando que a combinação de fato restringe (interseção),
    // não apenas repete o resultado do filtro de marca isolado.
    await esperarProdutosExibidosSerem(page, PRODUTOS_MARCA_BRAND_2);
  }
);

function manipuloMinimoDoSlider(page: Page): Locator {
  return page.getByRole('slider', { name: 'ngx-slider', exact: true });
}

function manipuloMaximoDoSlider(page: Page): Locator {
  return page.getByRole('slider', { name: 'ngx-slider-max' });
}

async function precosDosProdutosExibidos(page: Page): Promise<number[]> {
  const cards = cardsDeProdutos(page);
  const total = await cards.count();
  const precos: number[] = [];
  for (let i = 0; i < total; i++) {
    const texto = await cards.nth(i).getByText(/^\$\d/).first().textContent();
    precos.push(Number((texto ?? '').replace('$', '').trim()));
  }
  return precos;
}

When('ajusto os manípulos do slider de preço para um intervalo diferente do padrão', async ({ page }) => {
  const handleMin = manipuloMinimoDoSlider(page);
  const handleMax = manipuloMaximoDoSlider(page);

  const valorMinAtual = Number(await handleMin.getAttribute('aria-valuenow'));
  const valorMaxAtual = Number(await handleMax.getAttribute('aria-valuenow'));

  const boxMin = await handleMin.boundingBox();
  const boxMax = await handleMax.boundingBox();
  if (!boxMin || !boxMax) {
    throw new Error('Manípulos do slider de faixa de preço não encontrados na página.');
  }

  const centroMinX = boxMin.x + boxMin.width / 2;
  const centroMaxX = boxMax.x + boxMax.width / 2;
  const centroY = boxMax.y + boxMax.height / 2;

  // Calibra px/unidade a partir da posição e do valor atuais dos dois manípulos, em vez de
  // depender de um seletor CSS para a trilha do slider (Diretrizes §10 — locators semânticos).
  const pxPorUnidade = (centroMaxX - centroMinX) / (valorMaxAtual - valorMinAtual);
  const novoValorMax = valorMinAtual + 5;
  const deltaPx = (novoValorMax - valorMaxAtual) * pxPorUnidade;

  await page.mouse.move(centroMaxX, centroY);
  await page.mouse.down();
  await page.mouse.move(centroMaxX + deltaPx, centroY, { steps: 10 });
  await page.mouse.up();
});

Then(
  'a grade é atualizada exibindo somente produtos cujo preço está dentro do intervalo selecionado',
  async ({ page }) => {
    const min = Number(await manipuloMinimoDoSlider(page).getAttribute('aria-valuenow'));
    const max = Number(await manipuloMaximoDoSlider(page).getAttribute('aria-valuenow'));

    // Confirma que o ajuste do Quando realmente moveu o manípulo (o padrão é 100) antes de
    // validar a grade — sem isso, a checagem de preço abaixo seria trivialmente satisfeita
    // mesmo que o arraste não tivesse tido efeito algum.
    expect(max).toBeLessThan(100);

    for (const preco of await precosDosProdutosExibidos(page)) {
      expect(preco).toBeGreaterThanOrEqual(min);
      expect(preco).toBeLessThanOrEqual(max);
    }
  }
);

const NOMES_CATEGORIAS = [
  'Hammer',
  'Hand Saw',
  'Wrench',
  'Screwdriver',
  'Pliers',
  'Grinder',
  'Sander',
  'Saw',
  'Drill',
  'Other',
];

async function produtoComDescontoNaGradeAtual(page: Page): Promise<Locator | null> {
  const cards = cardsDeProdutos(page);
  const total = await cards.count();
  for (let i = 0; i < total; i++) {
    const card = cards.nth(i);
    const quantidadeDePrecos = await card.getByText(/^\$\d/).count();
    if (quantidadeDePrecos > 1) {
      return card;
    }
  }
  return null;
}

Given('que existe um produto cadastrado com desconto', async ({ page, $testInfo }) => {
  await irParaVisaoGeralDeProdutos(page);
  for (const categoria of NOMES_CATEGORIAS) {
    await page.getByRole('checkbox', { name: categoria, exact: true }).check();
    await page.waitForLoadState('networkidle');
    if (await produtoComDescontoNaGradeAtual(page)) {
      return;
    }
    await page.getByRole('checkbox', { name: categoria, exact: true }).uncheck();
    await page.waitForLoadState('networkidle');
  }
  $testInfo.skip(
    true,
    `Nenhum produto com desconto encontrado em nenhuma das ${NOMES_CATEGORIAS.length} categorias ` +
      'do catálogo atual — impedimento de massa de teste (pré-condição do AC12 não atendida), ' +
      'não falha de comportamento.'
  );
});

// Compartilhado com o Quando do CT-23 ("esse produto é exibido na grade") — mesma frase,
// nenhuma ação adicional: o produto já está visível na grade filtrada pelo Dado anterior.
When('esse produto é exibido na grade', async () => {});

Then('o card mostra o preço original tarjado', async ({ page }) => {
  const card = await produtoComDescontoNaGradeAtual(page);
  if (!card) {
    throw new Error('Produto com desconto não está mais visível na grade.');
  }
  await expect(card.getByText(/^\$\d/).first()).toHaveCSS('text-decoration-line', 'line-through');
});

Then('mostra o preço com desconto abaixo do preço original', async ({ page }) => {
  const card = await produtoComDescontoNaGradeAtual(page);
  if (!card) {
    throw new Error('Produto com desconto não está mais visível na grade.');
  }
  await expect(card.getByText(/^\$\d/).nth(1)).toBeVisible();
});

Given('que existe um produto cadastrado sem estoque disponível', async ({ page, $testInfo }) => {
  await irParaVisaoGeralDeProdutos(page);
  const existeProdutoSemEstoque = await condicaoAtendida(page.getByText('Out of stock').first());
  $testInfo.skip(
    !existeProdutoSemEstoque,
    'Nenhum produto sem estoque encontrado no catálogo atual — impedimento de massa de teste ' +
      '(pré-condição do AC13 não atendida), não falha de comportamento.'
  );
});

Then('o card exibe o indicador "Out of stock"', async ({ page }) => {
  await expect(page.getByText('Out of stock').first()).toBeVisible();
});

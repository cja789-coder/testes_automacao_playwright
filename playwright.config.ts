import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig, defineBddProject } from 'playwright-bdd';

/**
 * Trilha Web (chromium/firefox/webkit). Os globs abaixo são recursivos: usam
 * `**` para alcançar subpastas dentro de `features` e `steps`, permitindo
 * organizar cenários por área de negócio. `features/api` e `steps/api` são
 * explicitamente excluídos (prefixo de negação `!`) — pertencem à trilha de
 * API, compilada separadamente logo abaixo, com seu próprio testDir e
 * steps isolados dos da trilha Web (que dependem de `page`, inexistente em
 * testes de API).
 *
 * outputDir fica em '.features-gen/web' (não na raiz de '.features-gen')
 * porque o testDir global abaixo é herdado pelos projects que não definem
 * o próprio testDir (chromium/firefox/webkit); se a trilha Web ficasse na
 * raiz de '.features-gen', ela seria diretório pai de '.features-gen/api'
 * e o Playwright varreria os specs de API também nesses projects, mesmo
 * com os globs de features/steps já isolados.
 */
const testDir = defineBddConfig({
  features: ['features/**/*.feature', '!features/api/**'],
  steps: ['steps/**/*.ts', '!steps/api/**'],

  // Pasta dos testes Playwright gerados pelo bddgen
  outputDir: '.features-gen/web',
});

/**
 * Trilha de API: sem navegador, testDir e steps isolados dos da trilha Web.
 * outputDir omitido cai no padrão '.features-gen/api' — pasta irmã de
 * '.features-gen/web', não descendente dela.
 */
const apiProject = defineBddProject({
  name: 'api',
  features: 'features/api/**/*.feature',
  steps: 'steps/api/**/*.ts',
});

/**
 * Timestamp único da execução (AAAA-MM-DD_HH-mm-ss), calculado uma vez
 * ao carregar a config. Usado para dar a cada execução sua própria
 * subpasta em reports/, para que relatórios e evidências de execuções
 * anteriores nunca sejam sobrescritos.
 */
function runTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
    `_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`
  );
}

/**
 * Cada worker do Playwright roda em um processo próprio e reavalia este
 * arquivo de config — chamar runTimestamp() direto geraria um timestamp
 * diferente por worker, fragmentando uma única execução em várias pastas.
 * Por isso o timestamp é calculado uma vez pelo processo principal e
 * gravado em PW_RUN_TIMESTAMP; os processos filhos herdam o env e reusam
 * o mesmo valor em vez de recalcular o deles.
 */
if (!process.env.PW_RUN_TIMESTAMP) {
  process.env.PW_RUN_TIMESTAMP = runTimestamp();
}

/**
 * Pasta desta execução: reports/<timestamp>/. O reporter HTML e o
 * outputDir bruto vivem dentro dela, para que os links entre o relatório
 * e a evidência (trace/vídeo/screenshot) continuem funcionando ao
 * revisitar uma execução antiga.
 */
const resultsDir = `reports/${process.env.PW_RUN_TIMESTAMP}`;

/**
 * Configuração geral do Playwright.
 */
export default defineConfig({
  testDir,

  /**
   * Tempo máximo de execução de cada cenário.
   */
  timeout: 60_000,

  /**
   * Permite paralelismo entre arquivos.
   */
  fullyParallel: true,

  /**
   * Impede que test.only seja enviado acidentalmente para o CI.
   */
  forbidOnly: !!process.env.CI,

  /**
   * Duas tentativas adicionais somente no pipeline.
   */
  retries: process.env.CI ? 2 : 0,

  /**
   * Usa o paralelismo padrão do Playwright localmente (baseado nos
   * núcleos disponíveis); limita a 2 workers no CI para não sobrecarregar
   * o runner nem martelar o site público em paralelo demais.
   */
  workers: process.env.CI ? 2 : undefined,

  /**
   * Relatório gerado na mesma execução: o HTML técnico padrão do
   * Playwright, com log passo a passo de cada step, diff de asserts
   * falhos, trace, vídeo e screenshot.
   */
  reporter: [
    /**
     * Log mais detalhado no terminal.
     * Exibe os passos Given, When e Then.
     */
    [
      'list',
      {
        printSteps: true,
        printFailuresInline: true,
      },
    ],

    /**
     * Relatório técnico padrão do Playwright.
     */
    [
      'html',
      {
        outputFolder: `${resultsDir}/playwright`,
        open: 'never',
        title: 'Relatório de Testes Automatizados',

        /**
         * Agrupa os testes pela estrutura lógica,
         * reduzindo a exposição da pasta .features-gen.
         */
        mergeFiles: true,
      },
    ],
  ],

  /**
   * Pasta dos artefatos brutos da execução.
   */
  outputDir: `${resultsDir}/test-results`,

  /**
   * Configurações compartilhadas por todos os navegadores.
   */
  use: {
    /**
     * A maioria dos cenários roda contra o site público 4Devs.
     * Definido para permitir caminhos relativos em steps novos; steps de
     * outras áreas de negócio (ex.: produtos, contra practicesoftwaretesting.com)
     * usam URL absoluta em `page.goto()`, que ignora este baseURL.
     */
    baseURL: 'https://www.4devs.com.br',

    /**
     * O vídeo de evidência espelha o viewport em pixels (sem fullPage, ao
     * contrário do screenshot abaixo). O default de cada device
     * (`Desktop Chrome`/`Firefox`/`Safari`) é 1280x720 — baixo demais para
     * páginas com cabeçalho, filtros e grade, cortando o vídeo antes do
     * conteúdo relevante (ex.: CT-01 e CT-03 de
     * `visao_geral_produtos.feature`). Full HD reduz esse corte.
     */
    viewport: { width: 1920, height: 1080 },

    /**
     * Mantém o trace apenas quando o teste falhar.
     *
     * É mais econômico do que trace: 'on', que gera trace
     * para todos os testes, inclusive os aprovados.
     */
    trace: 'retain-on-failure',

    /**
     * Video é capturado apenas quando o teste falha, assim como trace
     * e screenshot — mais econômico do que video: 'on'.
     */
    video: 'retain-on-failure',

    /**
     * Captura screenshot automaticamente nas falhas, da página inteira
     * (fullPage), anexado ao relatório HTML.
     */
    screenshot: { mode: 'only-on-failure', fullPage: true },
  },

  /**
   * Navegadores disponíveis. `chromium` é o navegador default assumido pelo
   * Claude (Skill `run-playwright-tests`) quando um pedido de execução Web
   * não especifica navegador — evita perguntar uma escolha técnica que
   * normalmente não motivou o pedido.
   */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },

    /**
     * Trilha de API — sem devices/browser. `baseURL` fica undefined se
     * API_BASE_URL não estiver definida; o hook Before em
     * steps/api/hooks.ts interrompe com mensagem clara antes de qualquer
     * requisição (Regra 7), em vez de deixar o Playwright falhar com um
     * erro genérico de URL inválida.
     */
    {
      ...apiProject,
      use: {
        baseURL: process.env.API_BASE_URL,
      },

      /**
       * `fullyParallel: true` (padrão herdado do topo) permite que o
       * Playwright espalhe até os cenários de um mesmo arquivo entre
       * workers diferentes. Os cenários de reservas.feature (CT01-CT04)
       * encadeiam o bookingid criado no CT01 via variável de módulo em
       * steps/api/reservas.steps.ts — só funciona com todos os cenários
       * do arquivo executando em ordem, no mesmo worker, daí o override
       * aqui para false (comportamento padrão do Playwright quando
       * fullyParallel não está ligado).
       */
      fullyParallel: false,
    },

    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },

    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     ...devices['Desktop Edge'],
    //     channel: 'msedge',
    //   },
    // },

    // {
    //   name: 'Google Chrome',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     channel: 'chrome',
    //   },
    // },
  ],

  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
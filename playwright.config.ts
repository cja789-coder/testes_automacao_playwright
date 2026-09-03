import { defineConfig, devices } from '@playwright/test';
import {
  defineBddConfig,
  cucumberReporter,
} from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: 'steps/**/*.ts',

  // Pasta dos testes Playwright gerados pelo bddgen
  outputDir: '.features-gen',
});

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
   *
   * Atualmente você definiu workers: 1, portanto os testes
   * serão executados por apenas um worker.
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
   * Mantém uma execução por vez.
   */
  workers: 1,

  /**
   * Relatórios gerados na mesma execução.
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
     * Relatório funcional no padrão Cucumber/BDD.
     *
     * Mais próximo da organização visual do Robot Framework.
     */
    cucumberReporter('html', {
      outputFile: 'reports/cucumber/index.html',

      /**
       * Salva screenshots, vídeos e traces separadamente.
       * Evita gerar um único arquivo HTML excessivamente grande.
       */
      externalAttachments: true,
    }),

    /**
     * Relatório técnico padrão do Playwright.
     */
    [
      'html',
      {
        outputFolder: 'reports/playwright',
        open: 'never',
        title: 'Relatório de Testes Automatizados',

        /**
         * Agrupa os testes pela estrutura lógica,
         * reduzindo a exposição da pasta .features-gen.
         */
        mergeFiles: true,
      },
    ],

    /**
     * Relatório Allure — visual rico, com árvore de passos,
     * histórico entre execuções e anexos organizados.
     * Gera dados brutos em reports/allure-results;
     * o HTML final é gerado depois com `npx allure generate`.
     */
    [
      'allure-playwright',
      {
        resultsDir: 'reports/allure-results',
        detail: true,
        suiteTitle: true,
      },
    ],
  ],

  /**
   * Pasta dos artefatos brutos da execução.
   */
  outputDir: 'reports/test-results',

  /**
   * Configurações compartilhadas por todos os navegadores.
   */
  use: {
    // baseURL: 'http://localhost:3000',

    /**
     * Mantém o trace apenas quando o teste falhar.
     *
     * É mais econômico do que trace: 'on', que gera trace
     * para todos os testes, inclusive os aprovados.
     */
    trace: 'retain-on-failure',

    /**
     * Video é capturado para todos os testes, mesmo os aprovados.
     */
    video: 'on',

    /**
     * Captura screenshot automaticamente nas falhas.
     */
    screenshot: 'only-on-failure',
  },

  /**
   * Navegadores disponíveis.
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
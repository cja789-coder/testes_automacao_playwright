import { test as base } from 'playwright-bdd';
import type { APIResponse } from '@playwright/test';

/**
 * Lê uma variável de ambiente obrigatória. Lança um erro com mensagem clara
 * em vez de deixar a chamada HTTP falhar com um erro genérico de URL/header
 * inválido (Regra 7 / Diretrizes §7).
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variável de ambiente obrigatória "${name}" não definida. ` +
        `Configure-a (veja .env.example) antes de executar os testes de API.`,
    );
  }
  return value;
}

/**
 * Cabeçalho Authorization Bearer a partir de API_AUTH_TOKEN. Use somente
 * nos steps que efetivamente exigem autenticação — nem toda chamada de API
 * precisa de token.
 */
export function authHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${requireEnv('API_AUTH_TOKEN')}` };
}

/** Corpo (payload) de uma reserva do restful-booker. */
export type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
};

/** Estado por cenário, isolado entre testes (fixture com escopo "test"). */
export type ApiState = {
  response?: APIResponse;
  bookingId?: number;
  booking?: Partial<Booking>;
  authToken?: string;
  authCredentials?: { username: string; password: string };
  filterFirstname?: string;
};

/**
 * `test` estendido com o fixture `apiState`. Toda `steps/api/**\/*.steps.ts`
 * deve chamar `createBdd(test)` com este `test` — não `createBdd()` puro —,
 * do mesmo jeito que `steps/hooks.ts` já faz para a trilha Web.
 */
export const test = base.extend<{ apiState: ApiState }>({
  apiState: async ({}, use) => {
    await use({});
  },
});

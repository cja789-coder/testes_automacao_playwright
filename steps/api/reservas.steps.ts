import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import { test, requireEnv, type Booking, type ApiState } from './support/api-client';

const { Given, When, Then } = createBdd(test);

/**
 * CT01 cria a reserva; CT02-CT04 reutilizam esse bookingid (encadeamento pedido pelo usuário, em
 * vez da pré-condição independente usada antes). Só é seguro como variável de módulo porque o
 * project "api" roda com `fullyParallel: false` (playwright.config.ts): os cenários deste arquivo
 * executam em ordem, no mesmo worker. Se CT01 falhar, bookingId permanece undefined e CT02-CT04
 * falham explicitamente por falta de id (ver step "que uso o bookingid...", Regra 3: passed/failed
 * do Playwright Test é a fonte oficial do resultado). O step "incluo a reserva" (usado também por
 * CT07) só grava aqui quando a criação é bem-sucedida — CT07 é negativo por construção e nunca
 * sobrescreve o valor de CT01.
 */
const reservaCt01: { bookingId?: number; booking?: Partial<Booking> } = {};

async function createBooking(request: APIRequestContext, booking: Partial<Booking>) {
  const response = await request.post('/booking', { data: booking });
  const bookingId = response.ok() ? ((await response.json()).bookingid as number) : undefined;
  return { response, bookingId };
}

async function authenticate(
  request: APIRequestContext,
  apiState: ApiState,
  credentials: { username: string; password: string },
) {
  apiState.response = await request.post('/auth', { data: credentials });
  apiState.authToken = (await apiState.response.json()).token;
}

async function getBookingById(request: APIRequestContext, apiState: ApiState) {
  apiState.response = await request.get(`/booking/${apiState.bookingId}`);
}

async function expectResponseBodyToEqual(apiState: ApiState, expected: unknown) {
  const body = await apiState.response!.json();
  expect(body).toEqual(expected);
}

Given(
  'que possuo os dados de uma reserva com firstname {string}, lastname {string}, checkin {string}, checkout {string}, totalprice {int} e depositpaid {string}',
  ({ apiState }, firstname: string, lastname: string, checkin: string, checkout: string, totalprice: number, depositpaid: string) => {
    apiState.booking = {
      firstname,
      lastname,
      totalprice,
      depositpaid: depositpaid === 'true',
      bookingdates: { checkin, checkout },
    };
  },
);

Given('que possuo os dados de uma reserva sem informar o firstname', ({ apiState }) => {
  apiState.booking = {
    lastname: 'Sousa',
    totalprice: 100,
    depositpaid: true,
    bookingdates: { checkin: '2026-05-01', checkout: '2026-05-05' },
  };
});

Given('que o bookingid informado não corresponde a nenhuma reserva cadastrada', ({ apiState }) => {
  apiState.bookingId = 999999999;
});

Given('que não existe reserva cadastrada para o firstname que será buscado', ({ apiState }) => {
  apiState.filterFirstname = `SemCorrespondencia-${Date.now()}`;
});

Given('que preciso confirmar a disponibilidade da API', () => {});

Given('que uso o bookingid da reserva incluída no CT01', async ({ apiState }) => {
  if (reservaCt01.bookingId === undefined) {
    throw new Error('bookingid indisponível: o CT01 não incluiu a reserva com sucesso.');
  }
  apiState.bookingId = reservaCt01.bookingId;
  apiState.booking = reservaCt01.booking;
});

Given('que estou autenticado na API', async ({ request, apiState }) => {
  await authenticate(request, apiState, {
    username: requireEnv('API_AUTH_USERNAME'),
    password: requireEnv('API_AUTH_PASSWORD'),
  });
});

Given('que informo usuário e senha válidos de autenticação', ({ apiState }) => {
  apiState.authCredentials = {
    username: requireEnv('API_AUTH_USERNAME'),
    password: requireEnv('API_AUTH_PASSWORD'),
  };
});

Given('que informo usuário ou senha inválidos de autenticação', ({ apiState }) => {
  apiState.authCredentials = { username: 'usuario-invalido', password: 'senha-invalida' };
});

Given('que existe uma reserva cadastrada', async ({ request, apiState }) => {
  const booking: Booking = {
    firstname: 'Pedro',
    lastname: 'Alves',
    totalprice: 200,
    depositpaid: true,
    bookingdates: { checkin: '2026-11-01', checkout: '2026-11-05' },
  };
  const { bookingId } = await createBooking(request, booking);
  if (bookingId === undefined) {
    throw new Error('bookingid indisponível: a reserva de apoio não foi criada com sucesso.');
  }
  apiState.bookingId = bookingId;
  apiState.booking = booking;
});

Given(
  'que existe uma reserva cadastrada para o hóspede com firstname {string} e lastname {string}',
  async ({ request, apiState }, firstname: string, lastname: string) => {
    const booking: Booking = {
      firstname,
      lastname,
      totalprice: 120,
      depositpaid: true,
      bookingdates: { checkin: '2026-06-01', checkout: '2026-06-05' },
    };
    const { bookingId } = await createBooking(request, booking);
    if (bookingId === undefined) {
      throw new Error('bookingid indisponível: a reserva de apoio não foi criada com sucesso.');
    }
    apiState.bookingId = bookingId;
    apiState.booking = booking;
  },
);

Given('que existe uma reserva cadastrada e já excluída', async ({ request, apiState }) => {
  const booking: Booking = {
    firstname: 'Julia',
    lastname: 'Ramos',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
  };
  const { bookingId } = await createBooking(request, booking);
  if (bookingId === undefined) {
    throw new Error('bookingid indisponível: a reserva de apoio não foi criada com sucesso.');
  }
  apiState.bookingId = bookingId;
  await authenticate(request, apiState, {
    username: requireEnv('API_AUTH_USERNAME'),
    password: requireEnv('API_AUTH_PASSWORD'),
  });
  await request.delete(`/booking/${bookingId}`, {
    headers: { Cookie: `token=${apiState.authToken}` },
  });
});

When('consulto a reserva pelo bookingid cadastrado', async ({ request, apiState }) => {
  await getBookingById(request, apiState);
});

When('consulto a reserva pelo bookingid excluído', async ({ request, apiState }) => {
  await getBookingById(request, apiState);
});

When('altero o lastname da reserva cadastrada para {string}', async ({ request, apiState }, lastname: string) => {
  apiState.response = await request.patch(`/booking/${apiState.bookingId}`, {
    headers: { Cookie: `token=${apiState.authToken}` },
    data: { lastname },
  });
});

When('solicito um token de acesso', async ({ request, apiState }) => {
  await authenticate(request, apiState, apiState.authCredentials!);
});

When('incluo a reserva', async ({ request, apiState }) => {
  const { response, bookingId } = await createBooking(request, apiState.booking!);
  apiState.response = response;
  if (response.ok()) {
    reservaCt01.booking = apiState.booking;
    reservaCt01.bookingId = bookingId;
  }
});

When('consulto a lista de reservas sem aplicar filtro', async ({ request, apiState }) => {
  apiState.response = await request.get('/booking');
});

When(
  'consulto a lista de reservas filtrando por firstname {string} e lastname {string}',
  async ({ request, apiState }, firstname: string, lastname: string) => {
    apiState.response = await request.get('/booking', { params: { firstname, lastname } });
  },
);

When('consulto a reserva por esse bookingid', async ({ request, apiState }) => {
  await getBookingById(request, apiState);
});

When('consulto a lista de reservas filtrando por esse firstname', async ({ request, apiState }) => {
  apiState.response = await request.get('/booking', { params: { firstname: apiState.filterFirstname! } });
});

When('verifico a disponibilidade da API', async ({ request, apiState }) => {
  apiState.response = await request.get('/ping');
});

When('tento atualizar todos os dados da reserva sem estar autenticado', async ({ request, apiState }) => {
  const booking: Booking = {
    firstname: 'Tentativa',
    lastname: 'SemAutenticacao',
    totalprice: 999,
    depositpaid: false,
    bookingdates: { checkin: '2030-01-01', checkout: '2030-01-02' },
  };
  apiState.response = await request.put(`/booking/${apiState.bookingId}`, { data: booking });
});

When('tento alterar o lastname da reserva sem estar autenticado', async ({ request, apiState }) => {
  apiState.response = await request.patch(`/booking/${apiState.bookingId}`, {
    data: { lastname: 'SemAutenticacao' },
  });
});

When('tento excluir a reserva sem estar autenticado', async ({ request, apiState }) => {
  apiState.response = await request.delete(`/booking/${apiState.bookingId}`);
});

When(
  'atualizo todos os dados da reserva com firstname {string}, lastname {string}, checkin {string}, checkout {string}, totalprice {int}, depositpaid {string} e additionalneeds {string}',
  async (
    { request, apiState },
    firstname: string,
    lastname: string,
    checkin: string,
    checkout: string,
    totalprice: number,
    depositpaid: string,
    additionalneeds: string,
  ) => {
    const booking: Booking = {
      firstname,
      lastname,
      totalprice,
      depositpaid: depositpaid === 'true',
      bookingdates: { checkin, checkout },
      additionalneeds,
    };
    apiState.response = await request.put(`/booking/${apiState.bookingId}`, {
      headers: { Cookie: `token=${apiState.authToken}` },
      data: booking,
    });
    if (apiState.response.ok()) {
      apiState.booking = booking;
    }
  },
);

When('excluo a reserva cadastrada', async ({ request, apiState }) => {
  apiState.response = await request.delete(`/booking/${apiState.bookingId}`, {
    headers: { Cookie: `token=${apiState.authToken}` },
  });
});

Then('o status da resposta deve ser {int}', async ({ apiState }, status: number) => {
  expect(apiState.response!.status()).toBe(status);
});

Then('a resposta deve conter um bookingid', async ({ apiState }) => {
  const body = await apiState.response!.json();
  expect(body.bookingid).toEqual(expect.any(Number));
});

Then('a resposta deve conter os dados da reserva cadastrada', async ({ apiState }) => {
  await expectResponseBodyToEqual(apiState, apiState.booking);
});

Then('o lastname da resposta deve ser {string}', async ({ apiState }, lastname: string) => {
  const body = await apiState.response!.json();
  expect(body.lastname).toBe(lastname);
});

Then('a resposta deve conter um token de acesso', async ({ apiState }) => {
  const body = await apiState.response!.json();
  expect(body.token).toEqual(expect.any(String));
});

Then('a reserva deve refletir integralmente os novos dados informados', async ({ apiState }) => {
  await expectResponseBodyToEqual(apiState, apiState.booking);
});

Then('a API deve indicar que a reserva não foi encontrada', async ({ apiState }) => {
  expect(apiState.response!.status()).toBe(404);
});

Then('a resposta não deve conter um token de acesso', async ({ apiState }) => {
  const body = await apiState.response!.json();
  expect(body.token).toBeUndefined();
});

Then('a inclusão deve ser rejeitada, sem retorno de um bookingid', async ({ apiState }) => {
  expect(apiState.response!.ok()).toBe(false);
  const body = await apiState.response!.text();
  expect(body).not.toContain('bookingid');
});

Then('a lista de reservas retornada deve estar vazia', async ({ apiState }) => {
  const list = await apiState.response!.json();
  expect(list).toEqual([]);
});

Then('a lista deve conter o bookingid da reserva cadastrada', async ({ apiState }) => {
  const list = (await apiState.response!.json()) as { bookingid: number }[];
  expect(list.some((item) => item.bookingid === apiState.bookingId)).toBe(true);
});

Then(
  'a lista deve conter somente reservas do hóspede {string} {string}',
  async ({ request, apiState }, firstname: string, lastname: string) => {
    const list = (await apiState.response!.json()) as { bookingid: number }[];
    expect(list.length).toBeGreaterThan(0);
    expect(list.some((item) => item.bookingid === apiState.bookingId)).toBe(true);
    for (const { bookingid } of list) {
      const booking = await (await request.get(`/booking/${bookingid}`)).json();
      expect(booking.firstname).toBe(firstname);
      expect(booking.lastname).toBe(lastname);
    }
  },
);

Then('a atualização deve ser recusada', async ({ apiState }) => {
  expect(apiState.response!.status()).toBe(403);
});

Then('a alteração deve ser recusada', async ({ apiState }) => {
  expect(apiState.response!.status()).toBe(403);
});

Then('os dados da reserva não devem ser alterados', async ({ request, apiState }) => {
  const response = await request.get(`/booking/${apiState.bookingId}`);
  const body = await response.json();
  expect(body).toEqual(apiState.booking);
});

Then('a exclusão deve ser recusada', async ({ apiState }) => {
  expect(apiState.response!.status()).toBe(403);
});

Then('a reserva não deve ser removida', async ({ request, apiState }) => {
  const response = await request.get(`/booking/${apiState.bookingId}`);
  expect(response.status()).toBe(200);
});

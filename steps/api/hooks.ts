import { createBdd } from 'playwright-bdd';
import { test, requireEnv } from './support/api-client';

const { Before } = createBdd(test);

Before(async () => {
  requireEnv('API_BASE_URL');
});

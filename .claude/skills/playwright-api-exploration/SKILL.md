---
name: playwright-api-exploration
description: Use para explorar um endpoint de API (requisição, resposta, status, autenticação) antes de escrever ou ajustar um step em `steps/api/*.ts`.
allowed-tools: Bash(curl:*)
---

# Exploração de API com curl

## Fluxo de exploração

1. Descubra o endpoint e o método (GET/POST/...) a partir da documentação da API ou do requisito
   do cenário.
2. Faça a requisição com `curl`, incluindo headers relevantes (`-H "Authorization: Bearer
   <token>"`, `-H "Content-Type: application/json"`) e, se houver corpo, `-d '<json>'`.
3. Inspecione status (`curl -i` mostra os headers de resposta, incluindo o status) e corpo
   (formate com `| jq` se disponível, ou leia o JSON bruto).
4. Repita variando parâmetros/corpo até confirmar o comportamento esperado pelo cenário (sucesso,
   erro de validação, não autorizado, etc.).
5. Anote no `.env.example` qualquer nova variável de ambiente necessária (`API_BASE_URL`, tokens
   etc.) — nunca hardcode valores reais.

## Comandos essenciais

- requisição simples: `curl -s <url>`
- com status e headers: `curl -si <url>`
- autenticado: `curl -si -H "Authorization: Bearer $API_AUTH_TOKEN" <url>`
- POST com corpo JSON: `curl -si -X POST -H "Content-Type: application/json" -d '{"campo":"valor"}' <url>`
- formatando JSON: `curl -s <url> | jq` (se `jq` não estiver disponível, leia o JSON bruto)

## Do curl para o step

O resultado da exploração alimenta o step em `steps/api/*.steps.ts`:

- status esperado → `expect(apiState.response!.status()).toBe(<status>)` (Diretrizes §5/§11);
- corpo esperado → `toEqual`/`toContain`/matchers assimétricos do `expect`, conforme Diretrizes §5;
- autenticação → reutilize `authHeaders()` de `steps/api/support/api-client.ts`, não repita a
  lógica de header inline;
- nova variável de ambiente obrigatória → `requireEnv('NOME')` em `api-client.ts`, documentada em
  `.env.example`.

## Referência

Convenções completas da trilha de API: `docs/DIRETRIZES_AUTOMACAO_PLAYWRIGHT_BDD_CLAUDE.md` §11.

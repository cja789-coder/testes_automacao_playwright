# Regras permanentes do projeto

1. Preserve integralmente o cenário fornecido: ações, dados, mensagens, status, valores e resultados esperados.

2. Quando aplicação e requisito divergirem, mantenha o cenário definido, prossiga sem solicitar confirmação, execute-o e reporte a divergência. O comportamento observado não redefine o requisito.

3. Playwright Test é o executor oficial e seu resultado `passed` ou `failed` é a fonte oficial do resultado do teste.

4. Em consultas conceituais ou arquiteturais, responda com o `CLAUDE.md` e a Skill aplicável. Só abra arquivos do projeto quando a tarefa exigir trabalhar em um elemento concreto do repositório, ou quando faltar informação indispensável para responder. Nesse caso, comece pelos arquivos diretamente relacionados, reutilize o que já existe, amplie a busca só se necessário e faça a menor alteração possível.

5. Após implementar, valide com `npx bddgen`. Execute somente os testes explicitamente solicitados pelo usuário. Nunca execute, por iniciativa própria, outros testes, cenários ou suítes, inclusive reexecuções do mesmo teste.

6. Casos de teste devem usar BDD pt-BR e conter obrigatoriamente `Dado`, `Quando` e `Então` — nenhum dos três é opcional, mesmo quando a precondição parecer trivial — permanecendo orientados ao negócio.

7. Credenciais, tokens, senhas e chaves devem ser consumidos por variáveis de ambiente e permanecer fora do repositório.

8. Ao concluir uma implementação, informe arquivos alterados, execução realizada, resultado, evidências e divergências.

9. Quando corrigir, após uma execução, um defeito técnico da construção do teste (não da aplicação), exclua o relatório e tudo o que essa execução inválida gerou antes de executar novamente. Repita até que o relatório corresponda a uma execução válida.

10. Um `Dado` que verifica uma pré-condição de massa (registro pré-existente) e não a encontra é impedimento de execução, não falha de comportamento — resulte em `skipped` com motivo registrado, nunca em `failed` por exceção não tratada.

## Referência detalhada

Use primeiro estas regras e a Skill aplicável. Só consulte
`docs/DIRETRIZES_AUTOMACAO_PLAYWRIGHT_BDD_CLAUDE.md` quando elas não bastarem.

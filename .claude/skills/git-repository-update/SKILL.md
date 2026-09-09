---
name: git-repository-update
description: Use somente quando o usuário solicitar explicitamente a atualização do repositório Git/GitHub deste projeto — frases como "faça a atualização do projeto", "atualizar o repositório", "subir para o GitHub", "commitar e criar PR", "sincronizar as mudanças" (e variações próximas). Nunca aciona automaticamente ao final de uma implementação, execução de testes ou qualquer outra tarefa — só mediante pedido humano explícito, sempre com confirmação antes de qualquer ação em git. Cria uma branch nova a partir da main atualizada, commita as alterações, envia (push) para o GitHub e abre um Pull Request.
---

# Atualização do repositório Git/GitHub

## Escopo

Esta Skill cobre exclusivamente o fechamento de uma frente de trabalho no Git/GitHub: criar branch, commitar, enviar (push) e abrir Pull Request. Só age mediante pedido humano explícito — nunca é disparada automaticamente ao final de uma implementação, correção, execução de testes ou qualquer outra tarefa, mesmo quando o CLAUDE.md pedir um relato de arquivos alterados/execução/resultado ao concluir (regra 8): esse relato continua sendo feito normalmente, mas não implica em nenhuma ação de git.

## Gatilho

Frases como: "Faça a atualização do projeto", "atualizar o repositório", "subir para o GitHub", "commitar e criar PR", "sincronizar as mudanças" — e variações próximas dessas. Mesmo reconhecendo o pedido, nunca execute nada antes de passar pela confirmação abaixo.

## Confirmação obrigatória

Antes de qualquer ação em git, pergunte, literalmente:

> "Confirma que devo criar uma nova branch a partir da main atualizada, commitar as alterações, enviar (push) para o GitHub e abrir um Pull Request? Se sim, me passe a Descrição que deseja usar para o commit e o PR."

Só prossiga após receber confirmação afirmativa **e** a Descrição. Se o usuário confirmar sem fornecer a Descrição, peça a Descrição antes de continuar.

## Nada para commitar

Antes de criar qualquer branch, verifique `git status`. Se não houver nenhuma alteração pendente (staged, unstaged ou untracked relevante), informe que não há alterações pendentes e pare — não crie branch, não commite, não abra PR.

## Fluxo de trabalho

1. Confirmar o pedido e obter a Descrição (ver "Confirmação obrigatória").
2. Checar `git status`; se não houver nada para commitar, parar (ver "Nada para commitar").
3. Atualizar a base: `git fetch origin main`, garantindo que a nova branch parta da `main` atualizada, independente da branch/HEAD atual no momento do pedido.
4. Gerar o nome da branch a partir da Descrição:
   - slug: minúsculo, sem acentuação/diacríticos, caracteres não alfanuméricos viram hífen, sem hífens duplicados nem nas pontas;
   - sufixo de timestamp para garantir unicidade entre pedidos (formato `AAAAMMDD-HHmm`);
   - formato final: `atualizacao/<slug>-<timestamp>` (ex.: `atualizacao/testes-atualizacao-exclusao-reserva-20260902-1435`).
5. Criar a branch a partir de `origin/main` e mudar para ela (ex.: `git checkout -b <branch> origin/main`).
6. Revisar o que será incluído: `git status` / `git diff`. Adicionar arquivos específicos por nome — nunca `git add -A` nem `git add .`. Antes de stagear qualquer arquivo que possa conter credencial ou segredo, conferir o conteúdo.
7. Criar um único commit. Mensagem = a própria Descrição fornecida, em uma linha só, sem corpo adicional e sem rodapé de co-autoria — mantendo o estilo enxuto já usado no histórico deste repositório.
8. `git push -u origin <branch>`.
9. Abrir o Pull Request: `gh pr create --base main --head <branch> --title "<Descrição>" --body "<Descrição>"`.
10. Reportar ao usuário: nome da branch criada, resumo do commit, confirmação do push e o link do PR aberto.

## Tratamento de falha ao abrir o PR

Se `gh pr create` falhar (por exemplo, `gh` não instalado ou não autenticado), a branch e o push já foram concluídos com sucesso — não tente desfazê-los. Informe claramente ao usuário: (a) que a branch foi criada e o push foi concluído; (b) que o PR não pôde ser aberto automaticamente e o motivo; (c) que a criação do PR pode ser feita manualmente pela interface do GitHub.

## Restrições

- Nunca use `--force`/`--force-with-lease`, `--no-verify` ou qualquer flag que pule hooks ou assinatura.
- Nunca commite direto na `main`.
- Nunca reaproveite uma branch criada em um pedido de atualização anterior — cada pedido gera uma branch nova.
- Nunca use `git add -A`/`git add .`; sempre adicione arquivos específicos por nome, após revisar `git status`/`git diff`.

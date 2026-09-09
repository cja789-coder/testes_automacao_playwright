# Plano de Testes — Gestão de reservas de hotel via API (restful-booker)

## Contexto
- Origem das regras: documento anexado — apidoc da API (https://restful-booker.herokuapp.com/apidoc/index.html), complementado pelos cenários já automatizados em `features/api/reservas.feature` (preservados neste plano, sem alteração de dados/resultados).
- Aplicação/URL alvo: https://restful-booker.herokuapp.com
- Classificação: API
- Rastreabilidade: CT-01 a CT-04 correspondem aos cenários já implementados em `features/api/reservas.feature`. CT-01 teve a estrutura Gherkin ajustada nesta revisão para incluir `Dado` (Regra 6 do `CLAUDE.md`), sem alteração de dados ou resultado esperado.

## Cenários de Teste

| ID    | Caso                                                              | Requisito (apidoc)      | Regra coberta                                              | Risco                                         | Classificação | Prioridade | Observação/Pendência |
|-------|--------------------------------------------------------------------|--------------------------|--------------------------------------------------------------|------------------------------------------------|----------------|------------|-------------------------|
| CT-01 | Inclusão de reserva com todos os dados válidos                     | CreateBooking            | Reserva é criada e recebe um bookingid                       | Fluxo principal do sistema de reservas          | Positivo       | Alta       | O apidoc documenta `additionalneeds` como campo obrigatório em CreateBooking, mas este cenário (já automatizado) cria a reserva sem esse campo e é tratado como válido pela suíte atual — divergência entre documentação e aplicação a ser reportada durante a implementação (Regra 2, `CLAUDE.md`), não resolvida neste plano. |
| CT-02 | Consulta de uma reserva específica com sucesso                     | GetBooking                | Dados da reserva cadastrada são retornados integralmente      | Fluxo principal de consulta                     | Positivo       | Alta       | —                        |
| CT-03 | Alteração de um campo da reserva com sucesso                       | PartialUpdateBooking      | Alteração parcial autenticada é aceita                        | Fluxo principal de manutenção da reserva        | Positivo       | Alta       | —                        |
| CT-04 | Consulta de uma reserva específica que já tenha sido alterada      | GetBooking                | Alteração persiste e é refletida na consulta                  | Integridade do dado após alteração              | Positivo       | Média      | —                        |
| CT-05 | Autenticação com credenciais válidas gera token de acesso          | CreateToken                | Credenciais válidas emitem um token                           | Pré-requisito para toda operação protegida      | Positivo       | Alta       | —                        |
| CT-06 | Autenticação com credenciais inválidas não gera token de acesso    | CreateToken                | Credenciais inválidas não emitem token                        | Controle de acesso                              | Negativo       | Média      | Status code exato da resposta de recusa por credenciais inválidas não consta no apidoc — a confirmar via exploração (Skill `playwright-api-exploration`) antes da implementação. |
| CT-07 | Inclusão de reserva sem um campo obrigatório é rejeitada           | CreateBooking             | Campos obrigatórios do contrato de criação são exigidos       | Integridade dos dados cadastrados               | Negativo       | Média      | Status code exato da resposta de rejeição por campo obrigatório ausente não consta no apidoc — a confirmar via exploração antes da implementação. |
| CT-08 | Listagem de todas as reservas cadastradas                          | GetBookingIds              | Listagem sem filtro retorna as reservas existentes            | Fluxo secundário de consulta                    | Positivo       | Média      | —                        |
| CT-09 | Listagem de reservas filtrada por hóspede retorna só as correspondentes | GetBookingIds          | Filtro por firstname/lastname restringe o resultado           | Funcionalidade de busca                         | Positivo       | Média      | —                        |
| CT-10 | Listagem de reservas com filtro sem correspondência retorna lista vazia | GetBookingIds          | Ausência de correspondência não é tratada como erro           | Caso de borda da busca                          | Negativo       | Baixa      | —                        |
| CT-11 | Consulta de reserva com bookingid inexistente não retorna dados    | GetBooking                 | Reserva inexistente é reportada como não encontrada           | Tratamento de referência inválida               | Negativo       | Média      | Status code exato da resposta para bookingid inexistente não consta no apidoc — a confirmar via exploração antes da implementação. |
| CT-12 | Atualização completa de uma reserva autenticada com sucesso        | UpdateBooking               | Substituição completa autenticada é aceita                   | Fluxo principal de atualização total            | Positivo       | Alta       | —                        |
| CT-13 | Atualização completa de reserva sem autenticação é recusada        | UpdateBooking               | Atualização total exige autenticação                          | Controle de acesso                              | Negativo       | Média      | Status code exato da resposta de recusa por ausência de autenticação não consta no apidoc — a confirmar via exploração antes da implementação. |
| CT-14 | Atualização parcial de reserva sem autenticação é recusada         | PartialUpdateBooking       | Atualização parcial exige autenticação                        | Controle de acesso                              | Negativo       | Média      | Status code exato da resposta de recusa por ausência de autenticação não consta no apidoc — a confirmar via exploração antes da implementação. |
| CT-15 | Exclusão de uma reserva autenticada com sucesso                    | DeleteBooking               | Exclusão autenticada remove a reserva                          | Operação destrutiva — fluxo principal           | Positivo       | Alta       | —                        |
| CT-16 | Exclusão de reserva sem autenticação é recusada                    | DeleteBooking               | Exclusão exige autenticação                                    | Controle de acesso a operação destrutiva        | Negativo       | Média      | Status code exato da resposta de recusa por ausência de autenticação não consta no apidoc — a confirmar via exploração antes da implementação. |
| CT-17 | Consulta de reserva após exclusão confirma que ela não existe mais | GetBooking                 | Reserva excluída deixa de ser encontrada                       | Confirma efetivação da exclusão                 | Positivo       | Alta       | Status code exato da resposta para bookingid inexistente não consta no apidoc — a confirmar via exploração antes da implementação. |
| CT-18 | Verificação de disponibilidade da API                              | HealthCheck                 | API responde ao verificar disponibilidade                     | Checagem secundária de disponibilidade          | Positivo       | Baixa      | —                        |

## Matriz de Rastreabilidade de Requisitos

| Desc. Critério                                    | IDs dos Casos                | Qtd. Casos |
|------------------------------------------------------|---------------------------------|------------|
| CreateBooking — criação de reserva                    | CT-01, CT-07                    | 2          |
| GetBooking — consulta de reserva                      | CT-02, CT-04, CT-11, CT-17      | 4          |
| PartialUpdateBooking — alteração parcial de reserva   | CT-03, CT-14                    | 2          |
| CreateToken — autenticação e emissão de token         | CT-05, CT-06                    | 2          |
| GetBookingIds — listagem de reservas                  | CT-08, CT-09, CT-10             | 3          |
| UpdateBooking — atualização completa de reserva       | CT-12, CT-13                    | 2          |
| DeleteBooking — exclusão de reserva                    | CT-15, CT-16                    | 2          |
| HealthCheck — verificação de disponibilidade da API   | CT-18                           | 1          |

## Cenários (BDD)

### CT-01 — Inclusão de reserva com todos os dados válidos
Dado que possuo os dados de uma reserva com firstname "Carlos", lastname "Silva", checkin "2026-09-10", checkout "2026-09-15", totalprice 150 e depositpaid "true"
Quando incluo a reserva
Então o status da resposta deve ser 200
E a resposta deve conter um bookingid

### CT-02 — Consulta de uma reserva específica com sucesso
Dado que uso o bookingid da reserva incluída no CT-01
Quando consulto a reserva pelo bookingid cadastrado
Então o status da resposta deve ser 200
E a resposta deve conter os dados da reserva cadastrada

### CT-03 — Alteração de um campo da reserva com sucesso
Dado que uso o bookingid da reserva incluída no CT-01
E que estou autenticado na API
Quando altero o lastname da reserva cadastrada para "Lima"
Então o status da resposta deve ser 200

### CT-04 — Consulta de uma reserva específica que já tenha sido alterada
Dado que uso o bookingid da reserva incluída no CT-01
Quando consulto a reserva pelo bookingid cadastrado
Então o status da resposta deve ser 200
E o lastname da resposta deve ser "Lima"

### CT-05 — Autenticação com credenciais válidas gera token de acesso
Dado que informo usuário e senha válidos de autenticação
Quando solicito um token de acesso
Então o status da resposta deve ser 200
E a resposta deve conter um token de acesso

### CT-06 — Autenticação com credenciais inválidas não gera token de acesso
Dado que informo usuário ou senha inválidos de autenticação
Quando solicito um token de acesso
Então a resposta não deve conter um token de acesso

### CT-07 — Inclusão de reserva sem um campo obrigatório é rejeitada
Dado que possuo os dados de uma reserva sem informar o firstname
Quando incluo a reserva
Então a inclusão deve ser rejeitada, sem retorno de um bookingid

### CT-08 — Listagem de todas as reservas cadastradas
Dado que existe uma reserva cadastrada
Quando consulto a lista de reservas sem aplicar filtro
Então o status da resposta deve ser 200
E a lista deve conter o bookingid da reserva cadastrada

### CT-09 — Listagem de reservas filtrada por hóspede retorna só as correspondentes
Dado que existe uma reserva cadastrada para o hóspede com firstname "Maria" e lastname "Oliveira"
Quando consulto a lista de reservas filtrando por firstname "Maria" e lastname "Oliveira"
Então o status da resposta deve ser 200
E a lista deve conter somente reservas do hóspede "Maria" "Oliveira"

### CT-10 — Listagem de reservas com filtro sem correspondência retorna lista vazia
Dado que não existe reserva cadastrada para o firstname que será buscado
Quando consulto a lista de reservas filtrando por esse firstname
Então o status da resposta deve ser 200
E a lista de reservas retornada deve estar vazia

### CT-11 — Consulta de reserva com bookingid inexistente não retorna dados
Dado que o bookingid informado não corresponde a nenhuma reserva cadastrada
Quando consulto a reserva por esse bookingid
Então a API deve indicar que a reserva não foi encontrada

### CT-12 — Atualização completa de uma reserva autenticada com sucesso
Dado que existe uma reserva cadastrada
E que estou autenticado na API
Quando atualizo todos os dados da reserva com firstname "Ana", lastname "Souza", checkin "2026-10-01", checkout "2026-10-05", totalprice 300, depositpaid "false" e additionalneeds "Café da manhã"
Então o status da resposta deve ser 200
E a reserva deve refletir integralmente os novos dados informados

### CT-13 — Atualização completa de reserva sem autenticação é recusada
Dado que existe uma reserva cadastrada
Quando tento atualizar todos os dados da reserva sem estar autenticado
Então a atualização deve ser recusada
E os dados da reserva não devem ser alterados

### CT-14 — Atualização parcial de reserva sem autenticação é recusada
Dado que existe uma reserva cadastrada
Quando tento alterar o lastname da reserva sem estar autenticado
Então a alteração deve ser recusada
E os dados da reserva não devem ser alterados

### CT-15 — Exclusão de uma reserva autenticada com sucesso
Dado que existe uma reserva cadastrada
E que estou autenticado na API
Quando excluo a reserva cadastrada
Então o status da resposta deve ser 201

### CT-16 — Exclusão de reserva sem autenticação é recusada
Dado que existe uma reserva cadastrada
Quando tento excluir a reserva sem estar autenticado
Então a exclusão deve ser recusada
E a reserva não deve ser removida

### CT-17 — Consulta de reserva após exclusão confirma que ela não existe mais
Dado que existe uma reserva cadastrada e já excluída
Quando consulto a reserva pelo bookingid excluído
Então a API deve indicar que a reserva não foi encontrada

### CT-18 — Verificação de disponibilidade da API
Dado que preciso confirmar a disponibilidade da API
Quando verifico a disponibilidade da API
Então o status da resposta deve ser 201

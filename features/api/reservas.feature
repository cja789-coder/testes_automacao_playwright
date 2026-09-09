# language: pt

Funcionalidade: Gestão de reservas de hotel via API

  Cenário: CT01 - Inclusão de reserva com todos os dados válidos
    Dado que possuo os dados de uma reserva com firstname "Carlos", lastname "Silva", checkin "2026-09-10", checkout "2026-09-15", totalprice 150 e depositpaid "true"
    Quando incluo a reserva
    Então o status da resposta deve ser 200
    E a resposta deve conter um bookingid

  Cenário: CT02 - Consulta de uma reserva específica com sucesso
    Dado que uso o bookingid da reserva incluída no CT01
    Quando consulto a reserva pelo bookingid cadastrado
    Então o status da resposta deve ser 200
    E a resposta deve conter os dados da reserva cadastrada

  Cenário: CT03 - Alteração de um campo da reserva com sucesso
    Dado que uso o bookingid da reserva incluída no CT01
    E que estou autenticado na API
    Quando altero o lastname da reserva cadastrada para "Lima"
    Então o status da resposta deve ser 200

  Cenário: CT04 - Consulta de uma reserva específica que já tenha sido alterada
    Dado que uso o bookingid da reserva incluída no CT01
    Quando consulto a reserva pelo bookingid cadastrado
    Então o status da resposta deve ser 200
    E o lastname da resposta deve ser "Lima"

  Cenário: CT05 - Autenticação com credenciais válidas gera token de acesso
    Dado que informo usuário e senha válidos de autenticação
    Quando solicito um token de acesso
    Então o status da resposta deve ser 200
    E a resposta deve conter um token de acesso

  Cenário: CT06 - Autenticação com credenciais inválidas não gera token de acesso
    Dado que informo usuário ou senha inválidos de autenticação
    Quando solicito um token de acesso
    Então a resposta não deve conter um token de acesso

  Cenário: CT07 - Inclusão de reserva sem um campo obrigatório é rejeitada
    Dado que possuo os dados de uma reserva sem informar o firstname
    Quando incluo a reserva
    Então a inclusão deve ser rejeitada, sem retorno de um bookingid

  Cenário: CT08 - Listagem de todas as reservas cadastradas
    Dado que existe uma reserva cadastrada
    Quando consulto a lista de reservas sem aplicar filtro
    Então o status da resposta deve ser 200
    E a lista deve conter o bookingid da reserva cadastrada

  Cenário: CT09 - Listagem de reservas filtrada por hóspede retorna só as correspondentes
    Dado que existe uma reserva cadastrada para o hóspede com firstname "Maria" e lastname "Oliveira"
    Quando consulto a lista de reservas filtrando por firstname "Maria" e lastname "Oliveira"
    Então o status da resposta deve ser 200
    E a lista deve conter somente reservas do hóspede "Maria" "Oliveira"

  Cenário: CT10 - Listagem de reservas com filtro sem correspondência retorna lista vazia
    Dado que não existe reserva cadastrada para o firstname que será buscado
    Quando consulto a lista de reservas filtrando por esse firstname
    Então o status da resposta deve ser 200
    E a lista de reservas retornada deve estar vazia

  Cenário: CT11 - Consulta de reserva com bookingid inexistente não retorna dados
    Dado que o bookingid informado não corresponde a nenhuma reserva cadastrada
    Quando consulto a reserva por esse bookingid
    Então a API deve indicar que a reserva não foi encontrada

  Cenário: CT12 - Atualização completa de uma reserva autenticada com sucesso
    Dado que existe uma reserva cadastrada
    E que estou autenticado na API
    Quando atualizo todos os dados da reserva com firstname "Ana", lastname "Souza", checkin "2026-10-01", checkout "2026-10-05", totalprice 300, depositpaid "false" e additionalneeds "Café da manhã"
    Então o status da resposta deve ser 200
    E a reserva deve refletir integralmente os novos dados informados

  Cenário: CT13 - Atualização completa de reserva sem autenticação é recusada
    Dado que existe uma reserva cadastrada
    Quando tento atualizar todos os dados da reserva sem estar autenticado
    Então a atualização deve ser recusada
    E os dados da reserva não devem ser alterados

  Cenário: CT14 - Atualização parcial de reserva sem autenticação é recusada
    Dado que existe uma reserva cadastrada
    Quando tento alterar o lastname da reserva sem estar autenticado
    Então a alteração deve ser recusada
    E os dados da reserva não devem ser alterados

  Cenário: CT15 - Exclusão de uma reserva autenticada com sucesso
    Dado que existe uma reserva cadastrada
    E que estou autenticado na API
    Quando excluo a reserva cadastrada
    Então o status da resposta deve ser 201

  Cenário: CT16 - Exclusão de reserva sem autenticação é recusada
    Dado que existe uma reserva cadastrada
    Quando tento excluir a reserva sem estar autenticado
    Então a exclusão deve ser recusada
    E a reserva não deve ser removida

  Cenário: CT17 - Consulta de reserva após exclusão confirma que ela não existe mais
    Dado que existe uma reserva cadastrada e já excluída
    Quando consulto a reserva pelo bookingid excluído
    Então a API deve indicar que a reserva não foi encontrada

  Cenário: CT18 - Verificação de disponibilidade da API
    Dado que preciso confirmar a disponibilidade da API
    Quando verifico a disponibilidade da API
    Então o status da resposta deve ser 201

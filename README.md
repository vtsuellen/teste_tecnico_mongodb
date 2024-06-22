# API  
Esta é uma API construído com as tecnologias **`Mongo.db`**, **`Node.js`**, **`Express`**, **`Nginx`** 

## Para utilizar a api basta rodar o comando 

``` 
sudo docker compose up --build -d
```
## Funcionalidades
- Cadastro de clientes, com integração com serviço de consulta de endereços
- Listagem de clientes com paginação.
- Busca de clientes pelo nome com paginação.
- Exibição dos detalhes de um cliente.
- Exclusão de um cliente.

## Rotas da API
|Metodo|Rota| Descrição |
|---|---|---|
| GET | **`/api/v1/clients`**| Listagem de clientes com paginação.
| POST | **`/api/v1/clients`**| Cadastro de clientes.
| GET | **`/api/v1/clients/search`** |Busca de clientes pelo nome com paginação.
| GET | **`/api/v1/clients/:id`** | Exibição dos detalhes de um cliente.
| DELETE | **`/api/v1/clients/:id`**| Exclusão de um cliente.

## Exemplo de Request 

```
// [POST] 

{
"name": "João",
"email": "joao@autovist.com.br",
"phone": "11999887766",
"cep": "01001000",
}

```

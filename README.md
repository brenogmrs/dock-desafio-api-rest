# dock-desafio-api-rest

## Scrips
- Instalar dependências: `npm install`
- Testes: `npm run test`
- Rodar o projeto com docker-compose: `docker-compose up`
    - porta padrão para o app node 3333
    - porta padrão para o postgres 5432

# Account Holder

### Estrutura:
- `id`: uuid do titular da conta 
- `full_name`: nome completo do titular da conta
- `cpf`: cpf do titular da conta

### Criando um titular de conta
#### Request:
- Método: `POST`
- URL: `http://localhost:3333/api/account-holder`
- Body:
```
{
    "full_name": "Bilbo Baggins",
    "cpf": "12312312345"
}
```

### lista um titular de uma conta pelo id

#### Request:
- Método: `GET`
- URL: `http://localhost:3333/api/account-holder/<id_do_titular>`

### lista todos os titulares de conta

#### Request:
- Método: `GET`
- URL: `http://localhost:3333/api/account-holder/`

### Atualiza um titular de conta

#### Request:
- Método: `PATCH`
- URL: `http://localhost:3333/api/account-holder/<id_do_titular>`
- Body:
```
{
    "full_name": "Samwise Gamgee",
}
```

### Deleta um titular de conta

#### Request:
- Método: `DELETE`
- URL: `http://localhost:3333/api/account-holder/<id_do_titular>`


# Account
### Estrutura:

- `id`: uuid da conta 
- `account_holder_id`: id do titular da conta
- `number`: número da conta 
- `agency`: agencia da conta
- `balance`: saldo da conta
- `status`: situação da conta (`AVAILABLE`, `BLOCKED`)
- `active`: atividade da conta

### Criando uma conta

#### Request:
- Método: `POST`
- URL: `http://localhost:3333/api/account`
- Payload:
```
{
	"agency": "123456-7",
	"number": "1234",
	"accountHolderCpf": "12312312345"
}
```
#### Response:
- Body:
```
{
	"id": "968a5426-0cd8-41f9-b663-ecc36b4ff6a5",
	"account_holder_id": "4d7fa711-135d-44b7-854b-d07cf2b6993d",
	"number": "1234",
	"agency": "123456-7",
	"balance": "0.00"
	"status": "AVAILABLE",
	"active": true,
}
```

### Estrato da conta por período

#### Request:
- Método: `GET`
- Params: 
```
    id_da_conta: uuid
    startDateFilter: data no formato yyyy-MM-dd (opcional)
    endDateFilter: data no formato yyyy-MM-dd (opcional)
```
- Como funciona? Se não for especificado um período de tempo, a aplicação ira buscar todas as transações para aquela conta
- URL: `http://localhost:3333/api/account/statement/<id_da_conta>?startDateFilter=2022-04-01&endDateFilter=2022-04-01`
- Body:
#### Response:
- Body:
```
{
	"agency": "123456-7",
	"number": "1234",
	"account_holder_name": "Balrog",
	"transactions": [],
	"total_deposit": 0,
	"total_withdraw": 0
}
```

### Atualiza a conta

#### Request:
- Método: `PATCH`
- URL: `http://localhost:3333/api/account/<id_da_conta>`
- Body:
```
{
    "active": true,
    "status": "AVAILABLE"
}
```

### Operação de depósito
#### Request:
- Método: `POST`
- URL: `http://localhost:3333/api/account/deposit/<id_da_conta>`
- Body:
```
{
	"amount": 900.0
}
```

### Operação de saque
#### Request:
- Método: `POST`
- URL: `http://localhost:3333/api/account/withdraw/<id_da_conta>`
- Body:
```
{
	"amount": 1000.0
}
```

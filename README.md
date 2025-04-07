# Sistema de Cardápio

Sistema web para gerenciamento de cardápio e pedidos de restaurante.

## Funcionalidades

- **Autenticação e Autorização**
  - Login e registro de usuários
  - Diferentes níveis de acesso (Admin, Gerente, Cliente)
  - Proteção de rotas baseada em papéis

- **Gerenciamento de Usuários (Admin)**
  - Listagem de usuários com filtros
  - Criação, edição e desativação de usuários
  - Atribuição de papéis

- **Gerenciamento de Pedidos**
  - Clientes podem fazer e visualizar seus pedidos
  - Gerentes podem gerenciar todos os pedidos
  - Diferentes status de pedido (pendente, preparando, pronto, entregue, cancelado)
  - Filtros e busca de pedidos

## Tecnologias Utilizadas

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap 5
- Fetch API para requisições HTTP

### Backend
- Node.js com Express
- PostgreSQL para banco de dados
- JWT para autenticação
- bcrypt para criptografia de senhas

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/cardapio-micro.git
cd cardapio-micro
```

2. Instale as dependências do backend:
```bash
cd backend
npm install
```

3. Configure o banco de dados:
- Instale o PostgreSQL
- Crie um banco de dados chamado "cardapio"
- Execute os scripts em `backend/database/schema.sql`

4. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Ajuste as variáveis conforme seu ambiente

5. Inicie o servidor:
```bash
npm run dev
```

6. Acesse o frontend:
- Abra o arquivo `frontend/public/index.html` em seu navegador
- Ou sirva os arquivos usando um servidor HTTP (ex: Live Server)

## Estrutura do Projeto

```
cardapio-micro/
├── backend/
│   ├── database/
│   │   ├── index.js
│   │   └── schema.sql
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── orders.js
│   ├── app.js
│   └── package.json
└── frontend/
    └── public/
        ├── css/
        ├── js/
        └── index.html
```

## Usuário Admin Padrão

- Email: admin@sistema.com
- Senha: admin123

## Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

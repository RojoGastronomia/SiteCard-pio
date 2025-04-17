# SiteCard - Sistema de Gestão de Eventos e Cardápios

Sistema web para gestão de eventos e cardápios, permitindo que clientes visualizem e selecionem menus para seus eventos.

## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

### Frontend
- React 18
- TypeScript
- TailwindCSS
- Shadcn/UI
- React Query
- React Hook Form
- Wouter (Roteamento)

### Backend
- Node.js
- Express
- PostgreSQL
- Drizzle ORM
- Passport.js (Autenticação)

## 💻 Pré-requisitos

Antes de começar, verifique se você tem os seguintes requisitos:
- Node.js (versão 18 ou superior)
- PostgreSQL (versão 14 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/sitecard.git
cd sitecard
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto e adicione:
```env
DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/nome_do_banco
SESSION_SECRET=seu_segredo_aqui
NODE_ENV=development
```

4. Execute as migrações do banco de dados
```bash
npm run db:migrate
```

5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## 🌟 Funcionalidades

- 👤 Autenticação de usuários
- 📅 Gestão de eventos
- 🍽️ Gestão de cardápios
- 🛒 Carrinho de compras
- 📊 Painel administrativo
- 💼 Múltiplos perfis de usuário

## 🔐 Segurança

O sistema implementa várias medidas de segurança:
- Autenticação segura com Passport.js
- Hash de senhas com Scrypt
- Proteção contra XSS e CSRF
- Validação de dados com Zod
- Controle de acesso baseado em funções (RBAC)

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Contribuição

Contribuições são sempre bem-vindas! Por favor, leia o [CONTRIBUTING.md](CONTRIBUTING.md) para saber como contribuir.

## 📫 Contato

Se você tiver alguma dúvida ou sugestão, por favor abra uma issue ou entre em contato. 
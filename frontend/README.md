# Cardápio Digital - Frontend

Este é o frontend do sistema de cardápio digital para eventos. O projeto foi desenvolvido usando HTML, CSS e JavaScript, com Bootstrap para o layout e Webpack para o build.

## Requisitos

- Node.js 14.x ou superior
- NPM 6.x ou superior

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O servidor será iniciado em `http://localhost:9000` com hot reload ativado.

## Build

Para gerar o build de produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

## Estrutura do Projeto

```
frontend/
  ├── public/          # Arquivos públicos
  │   ├── css/        # Estilos CSS
  │   ├── images/     # Imagens
  │   └── index.html  # HTML principal
  ├── src/
  │   └── assets/
  │       └── js/     # Arquivos JavaScript
  ├── package.json    # Dependências e scripts
  └── webpack.config.js # Configuração do Webpack
```

## Funcionalidades

- Visualização de eventos sociais e corporativos
- Sistema de carrinho de compras
- Autenticação de usuários
- Formulário de contato
- Interface responsiva

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5
- Webpack 5
- Feather Icons
- Babel 
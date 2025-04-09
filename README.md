# Cardápio Digital - Sistema de Eventos

Um sistema web para gerenciamento de eventos e cardápios digitais, permitindo aos usuários selecionar menus personalizados para diferentes tipos de eventos.

## Funcionalidades

- Visualização de diferentes tipos de eventos
- Seleção de menus personalizados
- Gerenciamento de carrinho de compras
- Interface responsiva e moderna
- Notificações em tempo real
- Persistência de dados no localStorage

## Tecnologias Utilizadas

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (Vanilla)
- LocalStorage para persistência de dados

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/RojoGastronomia/SiteCard-pio.git
cd SiteCard-pio
```

2. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env`
   - Preencha as variáveis no arquivo `.env` com suas credenciais:
     - MongoDB: Configure a string de conexão do seu banco de dados
     - Firebase: Adicione suas credenciais do Firebase
     - OpenAI: Adicione sua chave de API (se necessário)
     - Outras configurações: Ajuste conforme necessário

3. Instale as dependências:
```bash
npm install
```

4. Inicie o servidor:
```bash
npm run dev
```

5. Acesse o frontend:
   - Abra o arquivo `frontend/public/index.html` em seu navegador
   - Ou use um servidor local como Live Server

## Estrutura do Projeto

```
frontend/
  ├── public/
  │   └── index.html
  └── ...
```

## Segurança

- Nunca comite o arquivo `.env` no repositório
- Mantenha suas chaves de API e credenciais seguras
- Use variáveis de ambiente para todas as informações sensíveis
- Siga as melhores práticas de segurança do Firebase e MongoDB

## Contribuição

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

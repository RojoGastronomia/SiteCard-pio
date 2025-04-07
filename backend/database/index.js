const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'cardapio',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432
});

// Teste de conexão
pool.connect((err, client, release) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conexão com o PostgreSQL estabelecida com sucesso!');
        release();
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    connect: () => pool.connect()
}; 
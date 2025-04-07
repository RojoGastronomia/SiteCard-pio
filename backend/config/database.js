const mysql = require('mysql2');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cardapio_digital',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = connection.promise(); 
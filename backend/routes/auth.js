const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const db = require('../database');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

        // Validar dados
        if (!email || !password) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }

        // Buscar usuário
        const result = await db.query(
            'SELECT id, name, email, password, role, active FROM users WHERE email = $1',
            [email]
        );

        const user = result.rows[0];

        // Verificar se usuário existe e está ativo
        if (!user || !user.active) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Verificar senha
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Gerar token
    const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
      { expiresIn: '24h' }
    );

        // Remover senha da resposta
        delete user.password;

    res.json({
      token,
            user
    });
  } catch (error) {
    console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro no login' });
    }
});

// Registro
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validar dados
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        // Verificar se email já existe
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows[0]) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        // Criptografar senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserir usuário
        const result = await db.query(
            `INSERT INTO users (name, email, password, role) 
             VALUES ($1, $2, $3, 'cliente') 
             RETURNING id, name, email, role, active`,
            [name, email, hashedPassword]
        );

        const user = result.rows[0];

        // Gerar token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user
        });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ message: 'Erro no registro' });
    }
});

// Verificar token
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Buscar dados atualizados do usuário
        const result = await db.query(
            'SELECT id, name, email, role, active FROM users WHERE id = $1',
            [decoded.id]
        );

        const user = result.rows[0];

        if (!user || !user.active) {
            return res.status(401).json({ message: 'Usuário não encontrado ou inativo' });
        }

        res.json({ user });
  } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Token inválido' });
        }
        console.error('Erro na verificação:', error);
        res.status(500).json({ message: 'Erro na verificação' });
    }
});

// Logout (opcional, já que o token é gerenciado no cliente)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logout realizado com sucesso' });
});

module.exports = router;
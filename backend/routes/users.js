const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { verifyToken, checkRole } = require('../middleware/auth');
const db = require('../database');

// Listar usuários (apenas admin)
router.get('/', verifyToken, checkRole(['admin']), async (req, res) => {
    try {
        const { role, active, search } = req.query;
        let query = `
            SELECT id, name, email, role, active, created_at 
            FROM users 
            WHERE 1=1
        `;
        const params = [];

        if (role) {
            params.push(role);
            query += ` AND role = $${params.length}`;
        }

        if (active !== undefined) {
            params.push(active === 'true');
            query += ` AND active = $${params.length}`;
        }

        if (search) {
            params.push(`%${search}%`);
            query += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length})`;
        }

        query += ' ORDER BY created_at DESC';

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ message: 'Erro ao listar usuários' });
    }
});

// Obter usuário por ID (apenas admin)
router.get('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, name, email, role, active, created_at FROM users WHERE id = $1',
            [req.params.id]
        );

        if (!result.rows[0]) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
});

// Criar novo usuário (apenas admin)
router.post('/', verifyToken, checkRole(['admin']), async (req, res) => {
    try {
        const { name, email, password, role, active } = req.body;

        // Validar dados
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Dados incompletos' });
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
            `INSERT INTO users (name, email, password, role, active) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id, name, email, role, active, created_at`,
            [name, email, hashedPassword, role, active !== false]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ message: 'Erro ao criar usuário' });
    }
});

// Atualizar usuário (apenas admin)
router.put('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
    try {
        const { name, email, password, role, active } = req.body;
        const userId = req.params.id;

        // Validar dados
        if (!name || !email || !role) {
            return res.status(400).json({ message: 'Dados incompletos' });
        }

        // Verificar se email já existe (exceto para o próprio usuário)
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1 AND id != $2',
            [email, userId]
        );

        if (existingUser.rows[0]) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        let query = `
            UPDATE users 
            SET name = $1, email = $2, role = $3, active = $4
        `;
        let params = [name, email, role, active !== false];

        // Atualizar senha apenas se fornecida
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += `, password = $${params.length + 1}`;
            params.push(hashedPassword);
        }

        query += `, updated_at = CURRENT_TIMESTAMP WHERE id = $${params.length + 1} RETURNING id, name, email, role, active, created_at`;
        params.push(userId);

        const result = await db.query(query, params);

        if (!result.rows[0]) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
});

// Atualizar status do usuário (apenas admin)
router.put('/:id/status', verifyToken, checkRole(['admin']), async (req, res) => {
    try {
        const { active } = req.body;
        
        if (active === undefined) {
            return res.status(400).json({ message: 'Status não fornecido' });
        }

        const result = await db.query(
            `UPDATE users 
             SET active = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2 
             RETURNING id, name, email, role, active, created_at`,
            [active, req.params.id]
        );

        if (!result.rows[0]) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar status do usuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar status do usuário' });
    }
});

module.exports = router; 
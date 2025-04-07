const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const Event = require('../models/Event');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware para verificar token JWT
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Verificar se o usuário ainda existe e está ativo
        const user = await db.query(
            'SELECT id, name, email, role, active FROM users WHERE id = $1',
            [decoded.id]
        );

        if (!user.rows[0]) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        if (!user.rows[0].active) {
            return res.status(401).json({ message: 'Usuário inativo' });
        }

        req.user = user.rows[0];
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Token inválido' });
        }
        res.status(500).json({ message: 'Erro ao verificar token' });
    }
};

// Middleware para verificar papel do usuário
const checkRole = (roles) => {
    return (req, res, next) => {
        // Colaboradores têm acesso limitado
        if (req.user.role === 'colaborador') {
            // Colaboradores só podem acessar rotas básicas
            const allowedRoutes = ['/api/orders/status', '/api/products'];
            if (!allowedRoutes.includes(req.path)) {
                return res.status(403).json({ 
                    message: 'Acesso negado: permissão insuficiente' 
                });
            }
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: 'Acesso negado: permissão insuficiente' 
            });
        }
        next();
    };
};

// Middleware para verificar propriedade do recurso
const checkOwnership = (resourceType) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;
            const resourceId = req.params.id;

            // Admins e gerentes podem acessar qualquer recurso
            if (['admin', 'gerente'].includes(req.user.role)) {
                return next();
            }

            let query;
            let params = [resourceId, userId];

            switch (resourceType) {
                case 'order':
                    query = 'SELECT id FROM orders WHERE id = $1 AND user_id = $2';
                    break;
                // Adicionar outros tipos de recursos conforme necessário
                default:
                    return res.status(400).json({ message: 'Tipo de recurso inválido' });
            }

            const result = await db.query(query, params);

            if (!result.rows[0]) {
                return res.status(403).json({ 
                    message: 'Acesso negado: você não tem permissão para acessar este recurso' 
                });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: 'Erro ao verificar propriedade do recurso' });
        }
    };
};

router.get('/dashboard', verifyToken, checkRole(['admin']), (req, res) => {
  res.json({ message: 'Dashboard route working' });
});

router.post('/', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ message: 'Erro ao criar evento' });
  }
});

router.get('/', verifyToken, checkRole(['admin']), (req, res) => {
  res.json({ message: 'Events route working' });
});

router.get('/test', (req, res) => {
  res.json({ message: 'Events route working' });
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = {
    verifyToken,
    checkRole,
    checkOwnership,
    JWT_SECRET
};
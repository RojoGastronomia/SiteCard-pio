const express = require('express');
const router = express.Router();
const { verifyToken, checkRole, checkOwnership } = require('../middleware/auth');
const db = require('../database');

// Listar pedidos (admin/gerente vê todos, cliente vê apenas os seus)
router.get('/', verifyToken, async (req, res) => {
    try {
        const { status, startDate, endDate, customer } = req.query;
        let query = `
            SELECT o.*, u.name as customer_name, u.email as customer_email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE 1=1
        `;
        const params = [];

        // Filtrar por usuário se não for admin/gerente
        if (!['admin', 'gerente'].includes(req.user.role)) {
            params.push(req.user.id);
            query += ` AND o.user_id = $${params.length}`;
        }

        // Aplicar filtros
        if (status) {
            params.push(status);
            query += ` AND o.status = $${params.length}`;
        }

        if (startDate) {
            params.push(startDate);
            query += ` AND DATE(o.created_at) >= $${params.length}`;
        }

        if (endDate) {
            params.push(endDate);
            query += ` AND DATE(o.created_at) <= $${params.length}`;
        }

        if (customer && ['admin', 'gerente'].includes(req.user.role)) {
            params.push(`%${customer}%`);
            query += ` AND (u.name ILIKE $${params.length} OR u.email ILIKE $${params.length})`;
        }

        query += ' ORDER BY o.created_at DESC';

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar pedidos:', error);
        res.status(500).json({ message: 'Erro ao listar pedidos' });
    }
});

// Obter pedido por ID
router.get('/:id', verifyToken, checkOwnership('order'), async (req, res) => {
    try {
        // Buscar pedido com informações do cliente
        const orderResult = await db.query(
            `SELECT o.*, u.name as customer_name, u.email as customer_email
             FROM orders o
             JOIN users u ON o.user_id = u.id
             WHERE o.id = $1`,
            [req.params.id]
        );

        if (!orderResult.rows[0]) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        // Buscar itens do pedido
        const itemsResult = await db.query(
            `SELECT oi.*, p.name
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = $1`,
            [req.params.id]
        );

        const order = orderResult.rows[0];
        order.items = itemsResult.rows;

        res.json(order);
    } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        res.status(500).json({ message: 'Erro ao buscar pedido' });
    }
});

// Criar novo pedido
router.post('/', verifyToken, async (req, res) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        const { items } = req.body;
        if (!items || !items.length) {
            return res.status(400).json({ message: 'Pedido sem itens' });
        }

        // Calcular total do pedido
        let total = 0;
        for (const item of items) {
            const productResult = await client.query(
                'SELECT price FROM products WHERE id = $1',
                [item.product_id]
            );

            if (!productResult.rows[0]) {
                throw new Error(`Produto ${item.product_id} não encontrado`);
            }

            total += productResult.rows[0].price * item.quantity;
        }

        // Criar pedido
        const orderResult = await client.query(
            `INSERT INTO orders (user_id, total, status) 
             VALUES ($1, $2, 'pendente') 
             RETURNING *`,
            [req.user.id, total]
        );

        const order = orderResult.rows[0];

        // Inserir itens do pedido
        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price, total) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [
                    order.id,
                    item.product_id,
                    item.quantity,
                    productResult.rows[0].price,
                    productResult.rows[0].price * item.quantity
                ]
            );
        }

        await client.query('COMMIT');
        res.status(201).json(order);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao criar pedido:', error);
        res.status(500).json({ message: 'Erro ao criar pedido' });
    } finally {
        client.release();
    }
});

// Atualizar status do pedido (apenas admin/gerente)
router.put('/:id/status', verifyToken, checkRole(['admin', 'gerente']), async (req, res) => {
    try {
        const { status } = req.body;
        const validStatus = ['pendente', 'preparando', 'pronto', 'entregue', 'cancelado'];
        
        if (!status || !validStatus.includes(status)) {
            return res.status(400).json({ message: 'Status inválido' });
        }

        const result = await db.query(
            `UPDATE orders 
             SET status = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2 
             RETURNING *`,
            [status, req.params.id]
        );

        if (!result.rows[0]) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar status do pedido:', error);
        res.status(500).json({ message: 'Erro ao atualizar status do pedido' });
    }
});

// Cancelar pedido (cliente só pode cancelar pedidos pendentes)
router.put('/:id/cancel', verifyToken, checkOwnership('order'), async (req, res) => {
    try {
        // Verificar se o pedido está pendente
        const orderResult = await db.query(
            'SELECT status FROM orders WHERE id = $1',
            [req.params.id]
        );

        if (!orderResult.rows[0]) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        if (orderResult.rows[0].status !== 'pendente' && req.user.role === 'cliente') {
            return res.status(400).json({ 
                message: 'Apenas pedidos pendentes podem ser cancelados' 
            });
        }

        const result = await db.query(
            `UPDATE orders 
             SET status = 'cancelado', updated_at = CURRENT_TIMESTAMP 
             WHERE id = $1 
             RETURNING *`,
            [req.params.id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao cancelar pedido:', error);
        res.status(500).json({ message: 'Erro ao cancelar pedido' });
    }
});

module.exports = router; 
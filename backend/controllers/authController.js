const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const EMAIL_FROM = process.env.EMAIL_FROM || 'seu-email@gmail.com';

// Configuração do nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'seu-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'sua-senha'
    }
});

class AuthController {
    // Registro de usuário
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            // Verifica se o usuário já existe
            const [existingUser] = await db.execute(
                'SELECT id FROM users WHERE email = ?',
                [email]
            );

            if (existingUser.length > 0) {
                return res.status(400).json({ error: 'Email já cadastrado' });
            }

            // Hash da senha
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insere o novo usuário
            const [result] = await db.execute(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name, email, hashedPassword]
            );

            // Gera token JWT
            const token = jwt.sign({ userId: result.insertId }, JWT_SECRET, { expiresIn: '24h' });

            res.status(201).json({
                message: 'Usuário registrado com sucesso',
                token
            });
        } catch (error) {
            console.error('Erro no registro:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Login de usuário
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Busca o usuário
            const [users] = await db.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (users.length === 0) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            const user = users[0];

            // Verifica a senha
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            // Gera token JWT
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

            // Registra a sessão
            await db.execute(
                'INSERT INTO user_sessions (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))',
                [user.id, token]
            );

            res.json({
                message: 'Login realizado com sucesso',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Recuperação de senha
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            // Verifica se o usuário existe
            const [users] = await db.execute(
                'SELECT id FROM users WHERE email = ?',
                [email]
            );

            if (users.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            // Gera token de recuperação
            const resetToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = await bcrypt.hash(resetToken, 10);

            // Salva o token no banco
            await db.execute(
                'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))',
                [email, hashedToken]
            );

            // Envia email
            const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
            
            const mailOptions = {
                from: EMAIL_FROM,
                to: email,
                subject: 'Recuperação de Senha',
                html: `
                    <p>Você solicitou a recuperação de senha.</p>
                    <p>Clique no link abaixo para redefinir sua senha:</p>
                    <a href="${resetUrl}">${resetUrl}</a>
                    <p>Este link expira em 1 hora.</p>
                `
            };

            await transporter.sendMail(mailOptions);

            res.json({ message: 'Email de recuperação enviado com sucesso' });
        } catch (error) {
            console.error('Erro na recuperação de senha:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Redefinição de senha
    async resetPassword(req, res) {
        try {
            const { token, password } = req.body;

            // Verifica se o token é válido
            const [resetRequests] = await db.execute(
                'SELECT * FROM password_resets WHERE expires_at > NOW() ORDER BY created_at DESC LIMIT 1'
            );

            if (resetRequests.length === 0) {
                return res.status(400).json({ error: 'Token inválido ou expirado' });
            }

            const resetRequest = resetRequests[0];

            // Verifica o token
            const isValidToken = await bcrypt.compare(token, resetRequest.token);

            if (!isValidToken) {
                return res.status(400).json({ error: 'Token inválido' });
            }

            // Hash da nova senha
            const hashedPassword = await bcrypt.hash(password, 10);

            // Atualiza a senha
            await db.execute(
                'UPDATE users SET password = ? WHERE email = ?',
                [hashedPassword, resetRequest.email]
            );

            // Remove o token usado
            await db.execute(
                'DELETE FROM password_resets WHERE email = ?',
                [resetRequest.email]
            );

            res.json({ message: 'Senha atualizada com sucesso' });
        } catch (error) {
            console.error('Erro na redefinição de senha:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Logout
    async logout(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Token não fornecido' });
            }

            // Remove a sessão
            await db.execute(
                'DELETE FROM user_sessions WHERE token = ?',
                [token]
            );

            res.json({ message: 'Logout realizado com sucesso' });
        } catch (error) {
            console.error('Erro no logout:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = new AuthController(); 
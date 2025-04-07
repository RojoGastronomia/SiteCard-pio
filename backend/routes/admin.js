const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');

router.get('/dashboard', verifyToken, checkRole(['admin']), (req, res) => {
  res.json({ message: 'Admin dashboard working' });
});

module.exports = router;
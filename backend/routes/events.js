const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ message: 'Erro ao criar evento' });
  }
});

router.get('/', verifyToken, (req, res) => {
  res.json({ message: 'Events route working' });
});

router.get('/test', (req, res) => {
  res.json({ message: 'Events route working' });
});

module.exports = router;
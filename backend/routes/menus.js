const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const MenuItem = require('../models/MenuItem');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all menus
router.get('/', async (req, res) => {
  try {
    const menus = await Menu.find().sort({ createdAt: -1 });
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific menu
router.get('/:id', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    
    // Get menu items
    const menuItems = await MenuItem.find({ menu: req.params.id });
    
    res.json({
      ...menu._doc,
      items: menuItems
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a menu (protected route)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { name, description, active, category } = req.body;
  
  try {
    const newMenu = new Menu({
      name,
      description,
      active: active || true,
      category: category || 'default',
      createdBy: req.user.id
    });
    
    const savedMenu = await newMenu.save();
    res.status(201).json(savedMenu);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a menu (protected route)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedMenu) return res.status(404).json({ message: 'Menu not found' });
    res.json(updatedMenu);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a menu (protected route)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    
    // Delete menu items first
    await MenuItem.deleteMany({ menu: req.params.id });
    
    // Delete the menu
    await menu.remove();
    res.json({ message: 'Menu deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add item to menu (protected route)
router.post('/:id/items', verifyToken, isAdmin, async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    
    const { name, description, price, category, image } = req.body;
    
    const newItem = new MenuItem({
      menu: req.params.id,
      name,
      description,
      price,
      category: category || 'default',
      image: image || '',
      createdBy: req.user.id
    });
    
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all items for a menu
router.get('/:id/items', async (req, res) => {
  try {
    const items = await MenuItem.find({ menu: req.params.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
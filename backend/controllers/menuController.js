const Menu = require('../models/Menu');

exports.createMenu = async (req, res) => {
  try {
    const menu = new Menu(req.body);
    await menu.save();
    res.status(201).json(menu);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMenus = async (req, res) => {
  try {
    const menus = await Menu.find().populate('items');
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add more controller methods for update, delete, etc.
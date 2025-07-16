const { Category, validateCategory } = require('../models/Category');
const mongoose = require('mongoose');

// Change to exports.functionName syntax
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort('name');
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { error } = validateCategory(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let category = await Category.findOne({ name: req.body.name });
    if (category) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    category = new Category({
      name: req.body.name,
      description: req.body.description
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// Remove the module.exports at the bottom - we're using exports.functionName instead
const mongoose = require('mongoose');
const Joi = require('joi');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true,
    maxlength: 255
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Category = mongoose.model('Category', categorySchema);

function validateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().max(255)
  });

  return schema.validate(category);
}

exports.Category = Category;
exports.validateCategory = validateCategory;
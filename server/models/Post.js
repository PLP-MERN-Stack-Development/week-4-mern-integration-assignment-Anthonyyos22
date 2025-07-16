const mongoose = require('mongoose');
const Joi = require('joi');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255
  },
  content: {
    type: String,
    required: true,
    minlength: 10
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  featuredImage: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  published: {
    type: Boolean,
    default: false
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

postSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Post = mongoose.model('Post', postSchema);

function validatePost(post) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    content: Joi.string().min(10).required(),
    categories: Joi.array().items(Joi.string().hex().length(24)),
    published: Joi.boolean(),
    featuredImage: Joi.string().allow('')
  });

  return schema.validate(post);
}

function validateComment(comment) {
  const schema = Joi.object({
    text: Joi.string().min(1).required()
  });
  return schema.validate(comment);
}

exports.Post = Post;
exports.validatePost = validatePost;
exports.validateComment = validateComment;
const { Post, validatePost, validateComment } = require('../models/Post');
const { Category } = require('../models/Category');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

exports.getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const search = req.query.search ? {
      $or: [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } }
      ]
    } : {};

    const filter = req.query.filter ? { 
      ...search,
      published: req.query.filter === 'published' 
    } : search;

    const posts = await Post.find(filter)
      .populate('author', 'name email')
      .populate('categories', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(filter);

    res.json({
      posts,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('categories', 'name')
      .populate('comments.user', 'name email');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { error } = validatePost(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (req.body.categories && req.body.categories.length > 0) {
      const categories = await Category.find({ 
        _id: { $in: req.body.categories } 
      });
      
      if (categories.length !== req.body.categories.length) {
        return res.status(400).json({ message: 'One or more categories are invalid' });
      }
    }

    let featuredImage = '';
    if (req.file) {
      featuredImage = `/uploads/${req.file.filename}`;
    }

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.user._id,
      categories: req.body.categories || [],
      published: req.body.published || false,
      featuredImage
    });

    await post.save();
    
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name email')
      .populate('categories', 'name');

    res.status(201).json(populatedPost);
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const { error } = validatePost(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (req.body.categories && req.body.categories.length > 0) {
      const categories = await Category.find({ 
        _id: { $in: req.body.categories } 
      });
      
      if (categories.length !== req.body.categories.length) {
        return res.status(400).json({ message: 'One or more categories are invalid' });
      }
    }

    const post = await Post.findOne({ _id: req.params.id, author: req.user._id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    let featuredImage = post.featuredImage;
    if (req.file) {
      // Delete old image if exists
      if (featuredImage) {
        const oldImagePath = path.join(__dirname, '../public', featuredImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      featuredImage = `/uploads/${req.file.filename}`;
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      {
        title: req.body.title,
        content: req.body.content,
        categories: req.body.categories || [],
        published: req.body.published || false,
        featuredImage
      },
      { new: true }
    )
    .populate('author', 'name email')
    .populate('categories', 'name');

    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    // Delete associated image if exists
    if (post.featuredImage) {
      const imagePath = path.join(__dirname, '../public', post.featuredImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const { error } = validateComment(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      user: req.user._id,
      text: req.body.text
    };

    post.comments.push(comment);
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('comments.user', 'name email');

    res.status(201).json(populatedPost.comments);
  } catch (error) {
    next(error);
  }
};
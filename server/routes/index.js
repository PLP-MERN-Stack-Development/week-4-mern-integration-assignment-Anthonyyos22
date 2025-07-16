// routes/index.js
const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');
const postRoutes = require('./postRoutes');
const categoryRoutes = require('./categoryRoutes');
const logger = require('../middleware/logger');

// Apply logger to all routes
router.use(logger);

// API routes
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/posts', postRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;
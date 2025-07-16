const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', categoryController.getAllCategories);
router.post('/', [auth, admin], categoryController.createCategory);

module.exports = router;
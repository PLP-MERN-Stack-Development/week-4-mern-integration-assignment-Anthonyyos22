const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', [auth, upload.single('featuredImage')], postController.createPost);
router.put('/:id', [auth, upload.single('featuredImage')], postController.updatePost);
router.delete('/:id', auth, postController.deletePost);
router.post('/:id/comments', auth, postController.addComment);

module.exports = router;
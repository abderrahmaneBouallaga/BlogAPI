const express = require('express');
const postsController = require('./../controllers/postsController')
const authController = require('./../controllers/authController')
const router = express.Router()


router.route('/the-posts-of-today').get(postsController.getNewPosts)

router.route('/').get(authController.protect, postsController.getAllPosts).post(postsController.createPost)
router.route('/:id').get(postsController.getPost).patch(postsController.updatePost).delete(authController.protect, postsController.deletePost)

module.exports = router;
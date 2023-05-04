const express = require('express');
const postsController = require('./../controllers/postsController')

const router = express.Router()


router.route('/the-posts-of-today').get(postsController.getNewPosts)

router.route('/').get(postsController.getAllPosts).post(postsController.createPost)
router.route('/:id').get(postsController.getPost).patch(postsController.updatePost).delete(postsController.deletePost)

module.exports = router;
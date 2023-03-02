const express = require('express')
const router = express.Router()
const post = require('../controllers/post.js')


router.get('/',post.getAllPosts)

// get post by id example: http://localhost:3000/post/61f9b38acb3146f533b3af6b
router.get('/:id',post.getPostById)

router.post('/',post.addNewPost)


module.exports = router
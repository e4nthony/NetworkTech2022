import express from 'express'
const router = express.Router()
import post from '../controllers/post.js'


router.get('/',post.getAllPosts)

// get post by id example: http://localhost:3000/post/61f9b38acb3146f533b3af6b
router.get('/:id',post.getPostById)

router.post('/',post.addNewPost)

router.put('/:id',post.putPostById)

export = router
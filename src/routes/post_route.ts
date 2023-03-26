import express from 'express'
const router = express.Router()
import Post from '../controllers/post.js'
import Auth from '../controllers/auth.js'

router.get(
    '/',
    Auth.authenticateMiddleware,
    Post.getAllPosts
);

// get post by id example: http://localhost:3000/post/61f9b38acb3146f533b3af6b
router.get(
    '/:id',
     Auth.authenticateMiddleware,
     Post.getPostById
);

router.post(
    '/',
     Auth.authenticateMiddleware,
     Post.addNewPost
);

router.put(
    '/:id',
     Auth.authenticateMiddleware,
     Post.putPostById
);

export = router;
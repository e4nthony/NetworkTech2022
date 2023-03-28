/**
* @swagger
* tags:
*   name: Post
*   description: The Posts API
*/

import express from 'express'
const router = express.Router()
import Post from '../controllers/post.js'
import Auth from '../controllers/auth.js'
// import Response_cls from '../classes/Response_cls.js'
// import { Response_cls } from "../classes/Response_cls";
// import { Request_cls } from "../classes/Request_cls";

/**
* @swagger
* components:
*   schemas:
*     Post:
*       type: object
*       required:
*         - message
*         - sender
*       properties:
*         message:
*           type: string
*           description: The post message
*         sender:
*           type: string
*           description: The sending user id
*       example:
*         message: 'Hello.'
*         sender: '00110022334455'
*/

/**
 * @swagger
 * /post:
 *   get:
 *     summary: get list of post from server
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sender
 *         schema:
 *           type: string
 *           description: filter the posts according to the given sender id
 *     responses:
 *       200:
 *         description: the list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                  $ref: '#/components/schemas/Post'
 *       400:
 *         description: Post error
 *         content:
 *           application/json:
 *             schema:
 *               err:
 *                 type: string
 *                 description: Fails to get list of all posts.
 */
router.get(
    '/',
    Auth.authenticateMiddleware,
    Post.getAllPosts
);

// get post by id example: http://localhost:3000/post/61f9b38acb3146f533b3af6b

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get post by id (id in DB)
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: The requested post id
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
  *       400:
 *         description: Get post by id error
 *         content:
 *           application/json:
 *             schema:
 *               err:
 *                 type: string
 *                 description: The error description 
 *  
 */
router.get(
    '/:id',
    Auth.authenticateMiddleware,
    Post.getPostById
);


/**
 * @swagger
 * /post:
 *   post:
 *     summary: add a new post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Post error
 *         content:
 *           application/json:
 *             schema:
 *               err:
 *                 type: string
 *                 description: Fails to save a post. 
 *
 */
// router.post(
//     '/',
//     Auth.authenticateMiddleware,
//     Post.addNewPost
// );
router.post('/', Auth.authenticateMiddleware, async (req, res) => {
    try {
        const response : Response_cls = await Post.addNewPost(Request_cls.fromRestRequest(req));
        response.sendRestResponse(res);
    } catch (err) {
        res.status(400).send({
            'status': 'fail',
            'message': err.message
        })
    }
});

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: update existing post by id
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the updated post id    
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Post update error
 *         content:
 *           application/json:
 *             schema:
 *               err:
 *                 type: string
 *                 description: Fails to update existing post by id. 
 *  
 */
router.put(
    '/:id',
    Auth.authenticateMiddleware,
    Post.putPostById
);

export = router;
/**
* @swagger
* tags:
*   name: User
*   description: The Users API
*/

import express from 'express'
const router = express.Router()
import User from '../controllers/user.js'
import Auth from '../controllers/auth.js'
// import Response_cls from '../classes/Response_cls.js'
// import { Response_cls } from "../classes/Response_cls";
// import { Request_cls } from "../classes/Request_cls";

/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - message
*         - sender
*       properties:
*         message:
*           type: string
*           description: The user message
*         sender:
*           type: string
*           description: The sending user id
*       example:
*         message: 'Hello.'
*         sender: '00110022334455'
*/

/**
 * @swagger
 * /user:
 *   get:
 *     summary: get list of users from server
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sender
 *         schema:
 *           type: string
 *           description: filter the users according to the given sender id
 *     responses:
 *       200:
 *         description: the list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                  $ref: '#/components/schemas/User'
 *       400:
 *         description: User error
 *         content:
 *           application/json:
 *             schema:
 *               err:
 *                 type: string
 *                 description: Fails to get list of all Users.
 */
router.get(
    '/',
    Auth.authenticateMiddleware,
    User.getAllUsers
);

// get user by id example: http://localhost:3000/user/61f9b38acb3146f533b3af6b

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by id (id in DB)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: The requested user id
 *     responses:
 *       200:
 *         description: the requested user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
  *       400:
 *         description: Get user by id error
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
    User.getUserById
);


/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: update existing user by id
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the updated user id    
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: the requested user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User update error
 *         content:
 *           application/json:
 *             schema:
 *               err:
 *                 type: string
 *                 description: Fails to update existing user by id. 
 *  
 */
router.put(
    '/:id',
    Auth.authenticateMiddleware,
    User.updateUserById
);

export = router;
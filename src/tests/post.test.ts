import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';
import Post from '../models/post_model';
import User from '../models/user_model';


const User1_Mail = 'example@gmail.com';
const User1_Password = '1221ABcd!';
let User1_id = ''  //User1_id in DB
let User1_accessToken = '';
// let User1_refreshToken = ''; //  refreshed access Token check? -implemented in auth tests.

const Post1_Message = 'post 1 message 1 - first';
const Post1_Sender = '000111';
let Post1_ID = null;     // post id in DB
const Post1_UpdatedMessage = 'post 1 message 2 (Updated) - second';


const Post2_Message = 'post 2 message 1 - first';
const Post2_Sender = '000222';
let Post2_ID = null;


/**
 * clear the DB
 * and register test user1
 */
beforeAll(async () => {
    await Post.remove();
    await User.remove();

    const res = await request(app).post('/auth/register').send({
        "email": User1_Mail,
        "password": User1_Password
    })
    User1_id = res.body._id;
});

/**
 * Login User1 before every test.
 */
beforeEach(async () => {
    const response = await request(app).post('/auth/login').send({
        "email": User1_Mail,
        "password": User1_Password
    });

    User1_accessToken = response.body.accessToken;
});

/**
 * clear the DB
 */
afterAll(async () => {
    // await Post.remove()
    // await User.remove()
    mongoose.connection.close();
});


describe("Test of post actions", () => {

    test("add new post 1", async () => {
        const response = await request(app).post('/post').set('Authorization', 'JWT' + ' ' + User1_accessToken).send({
            "message": Post1_Message,
            "sender": Post1_Sender
        });

        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual(Post1_Message);
        expect(response.body.sender).toEqual(Post1_Sender);

        Post1_ID = response.body._id;
    });

    test("add new post 2", async () => {
        const response = await request(app).post('/post').set('Authorization', 'JWT' + ' ' + User1_accessToken).send({
            "message": Post2_Message,
            "sender": Post2_Sender
        });

        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual(Post2_Message);
        expect(response.body.sender).toEqual(Post2_Sender);

        Post2_ID = response.body._id;
    });

    test("get all posts", async () => {
        // const response = await request(app).get('/post')
        const response = await request(app).get('/post').set('Authorization', 'JWT' + ' ' + User1_accessToken);

        expect(response.statusCode).toEqual(200);

        //message1
        expect(response.body[0].message).toEqual(Post1_Message);
        expect(response.body[0].sender).toEqual(Post1_Sender);
        //message2
        expect(response.body[1].message).toEqual(Post2_Message);
        expect(response.body[1].sender).toEqual(Post2_Sender);
    });

    /** 
     * gets post 1 by it's id in DB
     */
    test("get post by id", async () => {
        const response = await request(app).get('/post/' + Post1_ID).set('Authorization', 'JWT' + ' ' + User1_accessToken);

        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual(Post1_Message);
        expect(response.body.sender).toEqual(Post1_Sender);
    });

    test("get post by wrong id fails", async () => {
        const response = await request(app).get('/post/1234567800000001225').set('Authorization', 'JWT' + ' ' + User1_accessToken)

        expect(response.statusCode).toEqual(400);
    });

    test("get post by sender", async () => {
        const response = await request(app).get('/post?sender=' + Post1_Sender).set('Authorization', 'JWT' + ' ' + User1_accessToken)

        expect(response.statusCode).toEqual(200);
        expect(response.body[0].message).toEqual(Post1_Message);
        expect(response.body[0].sender).toEqual(Post1_Sender);
    });

    //TODO make it work, wont work
    // test("update post by ID", async () => {
    //     let response = await request(app).put('/post/' + Post1_ID).set('Authorization', 'JWT' + ' ' + User1_accessToken).send({
    //         "message": Post1_UpdatedMessage
    //     })

    //     expect(response.statusCode).toEqual(200)
    //     expect(response.body.message).toEqual(Post1_UpdatedMessage)
    //     expect(response.body.sender).toEqual(Post1_Sender)

    //     // //--- 
    //     // response = await request(app).get('/post/' + Post1_ID)

    //     // expect(response.statusCode).toEqual(200)
    //     // expect(response.body.message).toEqual(Post1_UpdatedMessage)
    //     // expect(response.body.sender).toEqual(Post1_Sender)

    //     // //--- 
    //     // response = await request(app).put('/post/new1').send({
    //     //     "message": Post1_UpdatedMessage,
    //     //     "sender": Post1_Sender
    //     // })
    //     // expect(response.statusCode).toEqual(400)

    //     // //--- 
    //     // response = await request(app).put('/post/' + Post1_ID).send({
    //     //     "message": Post1_UpdatedMessage,
    //     // })
    //     // expect(response.statusCode).toEqual(200)
    //     // expect(response.body.message).toEqual(Post1_UpdatedMessage)
    //     // expect(response.body.sender).toEqual(Post1_Sender)
    // })

});
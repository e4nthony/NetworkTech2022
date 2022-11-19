const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const Post = require('../models/post_model')


const newPostMessage = 'post message 1'
const newPostSender = '364188'


beforeAll(async ()=>{
    await Post.remove()
})


afterAll(async ()=>{
    await Post.remove()
    mongoose.connection.close()
})


describe("Test of post actions", ()=>{


    test("add new post",async ()=>{
        const response = await request(app).post('/post').send({
            "message": Post1_Message,
            "sender": Post1_Sender
        })

        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(Post1_MessageUpdated)
        expect(response.body.sender).toEqual(Post1_Sender)

        Post1_ID = response.body._id
    })


    test("get all posts",async ()=>{
        const response = await request(app).get('/post')

        expect(response.statusCode).toEqual(200)
        expect(response.body[0].message).toEqual(Post1_MessageUpdated)
        expect(response.body[0].sender).toEqual(Post1_Sender)
    })


    test("get post by id",async ()=>{
        const response = await request(app).get('/post/' + Post1_ID)

        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(Post1_MessageUpdated)
        expect(response.body.sender).toEqual(Post1_Sender)
    })


    test("get post by wrong id fails",async ()=>{
        const response = await request(app).get('/post/12345')

        expect(response.statusCode).toEqual(400)
    })


    test("get post by sender",async ()=>{
        const response = await request(app).get('/post?sender=' + Post1_Sender)

        expect(response.statusCode).toEqual(200)
        expect(response.body[0].message).toEqual(Post1_MessageUpdated)
        expect(response.body[0].sender).toEqual(Post1_Sender)
    })


    test("update post by ID",async ()=>{
        let response = await request(app).put('/post/' + Post1_ID).send({
            "message": Post1_MessageUpdated,
            "sender": Post1_Sender
        })

        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(Post1_MessageUpdated)
        expect(response.body.sender).toEqual(Post1_Sender)

        //--- 
        response = await request(app).get('/post/' + Post1_ID)

        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(Post1_MessageUpdated)
        expect(response.body.sender).toEqual(Post1_Sender)

        //--- 
        response = await request(app).put('/post/new1').send({
            "message": Post1_MessageUpdated,
            "sender": Post1_Sender
        })
        expect(response.statusCode).toEqual(400)

        //--- 
        response = await request(app).put('/post/' + Post1_ID).send({
            "message": Post1_MessageUpdated,
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(Post1_MessageUpdated)
        expect(response.body.sender).toEqual(Post1_Sender)
    })

})
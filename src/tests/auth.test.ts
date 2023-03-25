import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
// import auth from '../models/auth_model' //todo
// import Post from '../models/post_model' //todo check if needed

const User1_Mail = 'example@gmail.com'
const User1_Password  = '1234'

// beforeAll(async ()=>{    //todo modify
//     // await Post.remove()
// })


// afterAll(async ()=>{     //todo modify
//     // await mongoose.connection.close()
// })


describe("Authentication Test", ()=>{


    test("Register - add new user (user1)",async ()=>{
        const response = await request(app).post('/auth/register').send({
            "email": User1_Mail,
            "password": User1_Password
        })
        expect(response.statusCode).toEqual(200)
    })

    test("Login - login (user1)",async ()=>{
        const response = await request(app).post('/auth/login').send({
            "email": User1_Mail,
            "password": User1_Password
        })
        expect(response.statusCode).toEqual(200)
    })

})
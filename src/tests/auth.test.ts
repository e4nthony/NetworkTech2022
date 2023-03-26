import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';
import User from '../models/user_model';
import Post from '../models/post_model';

const User1_Mail = 'example@gmail.com';
const User1_Password = '1221ABcd!';

let accessToken = ''
let refreshToken = ''

// clear the DB
beforeAll(async () => {
    await User.deleteOne();
    await Post.deleteOne();
})

// clear the DB
afterAll(async () => {
    await User.deleteOne();
    await Post.deleteOne();
    // await mongoose.connection.close(); //?
    mongoose.connection.close();
})

describe("Authentication Test", () => {


    test("Register - add new user (user1)",async () => {
        const response = await request(app).post('/auth/register').send({
            "email": User1_Mail,
            "password": User1_Password
        });
        expect(response.statusCode).toEqual(200); //no errors
    })

    test("Login - (user1) Valid password",async () => {
        const response = await request(app).post('/auth/login').send({
            "email": User1_Mail,
            "password": User1_Password
        });
        expect(response.statusCode).toEqual(200); //no errors

        accessToken = response.body.accessToken;
        expect(accessToken).not.toBeNull();

        refreshToken = response.body.refreshToken;
        expect(refreshToken).not.toBeNull();
    })

    test("Login - (user1) Invalid password",async () => {
        const response = await request(app).post('/auth/login').send({
            "email": User1_Mail,
            "password": User1_Password + 'abc'
        });
        expect(response.statusCode).toEqual(400); //wrong password

        const accessToken_temp = response.body.accesstoken;
        expect(accessToken_temp).toBeUndefined();
    })

    test("Logout - logout (user1)",async () => {
        const response = await request(app).post('/auth/logout').send({
            "email": User1_Mail
        })
        expect(response.statusCode).toEqual(200);
    })


})
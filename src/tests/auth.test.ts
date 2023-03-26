import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';
import User from '../models/user_model';
import Post from '../models/post_model';

const User1_Mail = 'example@gmail.com';
const User1_Password = '1221ABcd!';

let accessToken = '';
let refreshToken = '';

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

    test("Not aquthorized attempt test", async () => {
        const response = await request(app).get('/post');
        expect(response.statusCode).not.toEqual(200)
    })

    test("Register - add new user (user1)", async () => {
        const response = await request(app).post('/auth/register').send({
            "email": User1_Mail,
            "password": User1_Password
        });
        expect(response.statusCode).toEqual(200); //no errors
    })

    test("Login - (user1) Valid password", async () => {
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

    test("Login - (user1) Invalid password", async () => {
        const response = await request(app).post('/auth/login').send({
            "email": User1_Mail,
            "password": User1_Password + 'abc'
        });
        expect(response.statusCode).toEqual(400); //wrong password

        const accessToken_temp = response.body.accesstoken;
        expect(accessToken_temp).toBeUndefined();
    })

    //User1 logged in

    test("Post using valid access token (user1)", async () => {
        const response = await request(app).get('/post').set('Authorization', 'JWT' + ' ' + accessToken);
        expect(response.statusCode).toEqual(200);
    })

    test("Post using invalid access token (user1)", async () => {
        const response = await request(app).get('/post').set('Authorization', 'JWT' + ' ' + '404' + accessToken);
        expect(response.statusCode).not.toEqual(200);
    })

    /**
     * this test cant run with actual token expiration time
     * 
     *
    jest.setTimeout(15000); //milisecons

    test("test expiered token", async () => {
        await new Promise(r => setTimeout(r, 5000));
        const response = await request(app).get('/post').set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).not.toEqual(200);
    })
    */


    test("Logout test", async () => {
        const response = await request(app).get('/auth/logout').set('Authorization', 'JWT' + ' ' + refreshToken)
        expect(response.statusCode).toEqual(200)
    })

})
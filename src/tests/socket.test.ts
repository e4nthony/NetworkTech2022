/**
 * Imports 'http_server' as 'server' from app.ts(DRIVER File) .
 */
import server from "../app"

import mongoose from "mongoose" //server support

import Client, { Socket } from "socket.io-client";  //Clients
import { DefaultEventsMap } from "@socket.io/component-emitter"; //ts

import request from 'supertest'
import Post from '../models/post_model'
import User from '../models/user_model'


const User1_Mail = 'example+1@gmail.com';
const User1_Password = '1221ABcd!1';

const User2_Mail = 'example+2@gmail.com';
const User2_Password = '1221ABcd!2';

/**
 * that type saves the connection info with client
 * socket, accessToken, id
 */
type Client = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>,
    accessToken: string,
    id: string
};

let client1_conn_info: Client;
let client2_conn_info: Client;

/**
 * async, resurns Promise
 * 
 * @description connects client via socket, TCP connection
 * 
 * @param clientSocket 
 * @returns connected client
 */
function clientSocketConnect(clientSocket): Promise<string> {

    return new Promise((resolve) => {

        clientSocket.on("connect", () => {
            resolve("1")
        });

    });
};

const connectUser = async (userEmail, userPassword) => {

    //  registers user - REST API
    const response_reg = await request(server).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword
    });

    const userId = response_reg.body._id; //ID from DB

    //  login user - REST API
    const response_login = await request(server).post('/auth/login').send({
        "email": userEmail,
        "password": userPassword
    });
    const clientToken = response_login.body.accessToken;

    //  connect
    const clientSocket = Client('http://localhost:' + process.env.PORT, {
        auth: {
            token: 'barrer ' + clientToken
        }
    });
    await clientSocketConnect(clientSocket);

    const client: Client = { socket: clientSocket, accessToken: clientToken, id: userId };
    return client;
}

/**
 * clears the DB &
 * connects 2 users via sockets
 */
beforeAll(async () => {
    await Post.remove();
    await User.remove();
    client1_conn_info = await connectUser(User1_Mail, User1_Password);
    client2_conn_info = await connectUser(User2_Mail, User2_Password);
    console.log("finish beforeAll");
});

/**
 * closes connections
 */
afterAll(() => {
    client1_conn_info.socket.close();
    client2_conn_info.socket.close();

    server.close(); // http_server connection close
    mongoose.connection.close();    //
});

describe("Test of Soket.io server", () => {
    // jest.setTimeout(15000)



    test("echo test - from client", (done) => {
        client1_conn_info.socket.once("echo:echo_res", (arg) => {

            console.log("event: echo:echo");

            expect(arg.msg).toBe('hello');
            done();
        });

        /**
         * send message from client to server.io using socket saved in client1_conn_info
         * 
         * @sendParams : "echo:echo" - event name ,
         *               { 'msg': 'hello' } - parameters dictionary/JSON
         */
        client1_conn_info.socket.emit("echo:echo", { 'msg': 'hello' });
    });


    // test("Post get all test", (done) => {
    //     client1_conn.socket.once('post:get_all', (arg) => {
    //         console.log("on any " + arg)
    //         expect(arg.status).toBe('OK');
    //         done();
    //     });
    //     console.log(" test post get all")
    //     client1_conn.socket.emit("post:get_all", "stam")
    // });


    // test("Test chat messages", (done) => {
    //     const message = "hi... test 123"
    //     client2_conn.socket.once('chat:message', (args) => {
    //         expect(args.to).toBe(client2_conn.id)
    //         expect(args.message).toBe(message)
    //         expect(args.from).toBe(client1_conn.id)
    //         done()
    //     })
    //     client1_conn.socket.emit("chat:send_message", { 'to': client2_conn.id, 'message': message })
    // })
});

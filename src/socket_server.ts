/**
 * import express from 'express'
 * const app = express() 
 * 
 * import http from 'http';
 * const server = http.createServer(app);
 * 
 * // did this at server.ts 
 *  
 */


import http from 'http';
import jwt from 'jsonwebtoken';
import echoHandler from './socketHandlers/echoHandler'; // My handler
import postHandler from './socketHandlers/postHandler';

import { Server } from "socket.io";  // TAG: socket.io import

/**
 * CONSTRUCTOR
 * (call example: io(http_server) )
 */
export = (server: http.Server) => { 
    const io = new Server(server);   // TAG: socket.io(server) creation 


    /**
     * Registers a middleware, which is a function that gets executed for every incoming Socket.-
     * 
     * (Authentication)
     */
    io.use(async (socket, next) => {

        let token = socket.handshake.auth.token;
        if (token == null) 
            return next(new Error('Authentication error'));

        token = token.split(' ')[1]; // gets raw token

        //token check
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return next(new Error('Authentication error'));
            } else {
                socket.data.user = user.id; //socket saves inside userID
                return next();
            }
        })
    });


    /**
     * Adds the listener function as an event listener for ev -
     * 
     * when client connects 
     * load handlers,
     * adds socket for this client by its id in DB
     * 
     * (  io.on('connection', async CALLBACK ))
     *     CALLBACK gives soket for client )
     */
    io.on('connection', async (socket) => {
        console.log('User Connected, via socket: ' + socket.id);

        /**
         * (socket.onAny)
         * 
         * at handlers there is functionality of server events,
         * events triggers server.io.
         */
        echoHandler(io, socket)
        postHandler(io, socket)

        await socket.join(socket.data.user); // user id = socket.data.user
    });

    return io
}



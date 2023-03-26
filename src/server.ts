import express from 'express'
const app = express()

import dotenv from 'dotenv'
dotenv.config()

import bodyParser from 'body-parser'
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))
app.use(bodyParser.json())

import mongoose from "mongoose"
mongoose.connect(process.env.DATABASE_URL) //,{useNewUrlParser:true}) deleted because typescript error
const db = mongoose.connection
db.on('error', error => { console.error('Failed to connect to MongoDB: ' + error) })
db.once('open', () => { console.log('Connected to MongoDB.') })

//Make files in folder "public" accessible via url  //todo 
app.use('/public', express.static('public'))

import authRouter from './routes/auth_route.js'
app.use('/auth', authRouter)

import postRouter from './routes/post_route.js'
app.use('/post', postRouter)

import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"
if (process.env.NODE_ENV == "development") {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "REST Server - API",
                version: "1.0.0",
                description: "Web Development - SCE Cource 2022-2023. REST server including authentication using JWT.",
            },
            servers: [{ url: "http://localhost:4000", },],
        },
        apis: ["./src/routes/*.ts"],
    };
    const specs = swaggerJsDoc(options);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}


export = app
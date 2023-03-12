import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import bodyParser from 'body-parser'
app.use(bodyParser.urlencoded({extended:true, limit: '1mb'}))
app.use(bodyParser.json())

import mongoose from "mongoose"
mongoose.connect(process.env.DATABASE_URL) //,{useNewUrlParser:true}) deleted because typescript error
const db = mongoose.connection
db.on('error',error=>{console.error('Failed to connect to MongoDB: '+error)})
db.once('open',()=>{console.log('Connected to MongoDB.')})

//Make files in folder "public" accessible via url  //todo 
app.use('/public', express.static('public'))

import authRouter from './routes/auth_route.js'
app.use('/auth',authRouter)

import postRouter from './routes/post_route.js'
app.use('/post',postRouter)


export = app
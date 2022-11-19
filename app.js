const express = require('express')
const app = express()
const dotenv = require('dotenv').config()

const mongoose = require("mongoose")
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true})
const db = mongoose.connection
db.on('error',error=>{console.error(error)})
db.once('open',()=>{console.log('connected to mongo DB')})

const postRouter = require('./controllers/post.js')
app.use('/post',postRouter)

app.listen(process.env.PORT,()=>{
    console.log('Server started')    
})

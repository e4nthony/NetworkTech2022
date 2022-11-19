const express = require('express')
const app = express()
const dotenv = require('dotenv').config()

const postRouter = require('./controllers/post.js')
app.use('/post',postRouter)

// app.get('/index',(req,res)=>{
//     res.send('index PAGE')
// })

// app.get('/index2',(req,res)=>{
//     res.send('index2 PAGE')
// })

app.listen(process.env.PORT,()=>{
    console.log('Server started')    
})

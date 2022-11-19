const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.send('get all posts')
})

router.get('/index',(req,res)=>{
    res.send('get index')
})

router.post('/',(req,res)=>{
    res.send('add a new post')
})

module.exports = router
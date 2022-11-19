const statusOK = 200
const statusERR = 400


const Post = require('../models/post_model')


const getPostById = async (req,res,next)=>{
    console.log(req.params.id)

    try{
        const posts = await Post.findById(req.params.id)
        res.status(statusOK).send(posts) 
    }
    catch(err){
        console.log("failed to send answer getPostById()")
        res.status(statusERR).send({'error':"fail to get posts from db"})
    }
}


const getAllPosts = async (req,res,next)=>{
    try{
        let posts = {}
        if (req.query.sender == null)
        {
            posts = await Post.find()
        }
        else
        {
            posts = await Post.find({'sender' : req.query.sender})
        }
        res.status(statusOK).send(posts) 
    }
    catch(err){
        console.log("failed to send answer getAllPosts()")
        res.status(statusERR).send({'error':"fail to get posts from db"})
    }
}



const addNewPost = async (req,res,next)=>{
    console.log(req.body)

    const post = new Post({
        message: req.body.message,
        sender: req.body.sender
    })

    try{
        newPost = await post.save()
        console.log("save post in db")

        res.status(statusOK).send(newPost)
    }
    catch (err){
        console.log("failed to save post in DB (addNewPost())")
        res.status(statusERR).send({'error': 'fail adding new post to db'})
    }
}


const updatePost = async (req,res,next)=>{
    console.log(req.body)

    try{
        const post = await Post.findByIdAndUpdate(req.params.id)
        
        console.log("post updated in db")
        res.status(statusOK).send(newPost)
    }
    catch (err){
        console.log("failed to save post in DB (addNewPost())")
        res.status(statusERR).send({'error': 'fail adding new post to db'})
    }
}

module.exports = {getAllPosts, addNewPost, getPostById}



////old_v2:
// const getAllPosts = (req,res,next)=>{
//     res.send('get all posts')
// }

// const addNewPost = (req,res,next)=>{
//     res.send('add new post')
// }

// module.exports = {getAllPosts, addNewPost}



////old_v1:
// const express = require('express')
// const router = express.Router()

// router.get('/',(req,res)=>{
//     res.send('get all posts')
// })

// router.get('/index',(req,res)=>{
//     res.send('get index')
// })

// router.post('/',(req,res)=>{
//     res.send('add a new post')
// })

// module.exports = router
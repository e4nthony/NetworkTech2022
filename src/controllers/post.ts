const statusOK = 200
const statusERR = 400


// import { Expression } from 'mongoose'
// import Express from 'express'
import { Request,Response } from 'express'
import Post from '../models/post_model'

const getPostById = async (req: any,res: any)=>{
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


const getAllPosts = async (req:Request,res:Response)=>{
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



const addNewPost = async (req:Request,res:Response)=>{
    console.log("addNewPost' request body:" + req.body)

    const post = new Post({
        message: req.body.message,
        sender: req.body.sender
    })

    try{
        let newPost = await post.save()
        console.log("save post in db")

        res.status(statusOK).send(newPost)
    }
    catch (err){
        console.log("failed to save post in DB (addNewPost())")
        res.status(statusERR).send({'error': 'fail adding new post to db'})
    }
}


const putPostById = async (req:Request,res:Response)=>{
    console.log(req.body)

    try{
        const updatedPost = await Post.findByIdAndUpdate(req.params.id)
        
        console.log("post updated in db")
        res.status(statusOK).send(updatedPost)
    }
    catch (err){
        console.log("failed to save post in DB (addNewPost())")
        res.status(statusERR).send({'error': 'fail adding new post to db'})
    }
}


export = {getAllPosts, addNewPost, getPostById, putPostById}



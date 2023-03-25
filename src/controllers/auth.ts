const statusOK = 200
const statusERR = 400

import { Request,Response } from 'express'
// import Post from '../models/post_model'


// requests list :

const register = async (req: any,res: any)=>{
    // console.log(req.params.id)

    // try{
    //     const posts = await Post.findById(req.params.id)
    //     res.status(statusOK).send(posts) 
    // }
    // catch(err){
    //     console.log("failed to send answer getPostById()")
    //     res.status(statusERR).send({'error':"fail to get posts from db"})
    // }

    res.status(statusERR).send({'error':"Not implemented"})

}

const login = async (req: any,res: any)=>{
    // console.log(req.params.id)

    // try{
    //     const posts = await Post.findById(req.params.id)
    //     res.status(statusOK).send(posts) 
    // }
    // catch(err){
    //     console.log("failed to send answer getPostById()")
    //     res.status(statusERR).send({'error':"fail to get posts from db"})
    // }

    res.status(statusERR).send({'error':"Not implemented"})

}

const logout = async (req: any,res: any)=>{
    // console.log(req.params.id)

    // try{
    //     const posts = await Post.findById(req.params.id)
    //     res.status(statusOK).send(posts) 
    // }
    // catch(err){
    //     console.log("failed to send answer getPostById()")
    //     res.status(statusERR).send({'error':"fail to get posts from db"})
    // }

    res.status(statusERR).send({'error':"Not implemented"})

}




export = {register, login, logout}



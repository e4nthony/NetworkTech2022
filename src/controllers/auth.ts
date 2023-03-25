const statusOK = 200
const statusERROR = 400

import User from '../models/user_model' 
import { NextFunction, Request,Response } from 'express'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import user_model from '../models/user_model'


function sendError(res: Response, error_msg: string){
    res.status(statusERROR).send({'error': error_msg});
}

// requests list :

const register = async (req: any, res: any) => {
    const email = req.body.email
    const password = req.body.password

    if (email == null){
        return sendError(res, 'Epmty email')
    }
    else if (password == null){
        return sendError(res, 'Epmty password')
    }
    //else if (password cahracters count > 16){ //todo
    //    return sendError(res, 'Invalid password: max length = 16')
    //}
    // else if (email dosent have @){ //todo
    //     return sendError(res, 'wrong email format')
    // }

    // check if email in use
    let user;
    try{
        user = await User.findOne({'email': email});    //findOne default func.
        if (user != null){
            return sendError(res, 'Email already in use')
        }
    }catch(error){  // expected: server lost connection with db
        console.log("error: " + error)  
        return sendError(res, 'Unexpected error')
    }

    try{
        //  generate hash of password:
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);

        //  save user to db:
        const newUser = new User({
            'email': email,
            'password': encryptedPassword
        });
        await newUser.save();
        // return res.status(statusOK).send({
        //     'email' : email
        //     // '_id' : newUser._id  // id of Object in DB
        // })
        return res.status(statusOK).send({ // Debug purposes only
            newUser
        })
    }catch(error){  // expected: server lost connection with db
        //console.log(req.body)
        console.log("error: " + error)  
        return sendError(res, 'Unexpected error')
    }
}

const login = async (req: any, res: any) => {
    res.status(statusERROR).send({'error':"Not implemented"})
}

const logout = async (req: any, res: any) => {
    res.status(statusERROR).send({'error':"Not implemented"})
}



export = {register, login, logout}



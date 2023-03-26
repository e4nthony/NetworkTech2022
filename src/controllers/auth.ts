/** status:
 * 1XX — Informational
 * 2XX — Success
 * 3XX — Redirection
 * 4XX — Client Error
 * 5XX — Server Error
 */
const statusOK = 200        //  OK
const statusERROR = 400     //  Bad Request
//const statusUnauthorized = 401     //  Unauthorized Access //use with login
//const statusNotFound = 404     

import User from '../models/user_model' 
import { NextFunction, Request,Response } from 'express'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import user_model from '../models/user_model'


function sendError(res: Response, error_msg: string){
    res.status(statusERROR).send({'error': error_msg});
}

// requests list :

const register = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email == null){
        return sendError(res, 'Epmty email');
    }
    else if (password == null){
        return sendError(res, 'Epmty password');
    }
    //else if (password cahracters count > 16){ //todo
    //    return sendError(res, 'Invalid password: max length = 16');
    //}
    // else if (email dosent have @){ //todo
    //     return sendError(res, 'wrong email format');
    // }

    //  check if email in use:
    try{
        const user = await User.findOne({'email': email});    //findOne default func.
        if (user != null){
            return sendError(res, 'Email already in use'); //already registered
        }
    
        //  generate hash of password:
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);

        //  save user to db:
        const newUser = new User({
            'email': email,
            'password': encryptedPassword
        });
        await newUser.save();

        return res.status(statusOK).send({
            'email' : email
            // '_id' : newUser._id  // id of Object in DB
        })
        // return res.status(statusOK).send({ // Debug purposes only
        //     newUser
        // })
    }catch(err){  // expected: server lost connection with db
        //console.log(req.body)
        console.log('error: ' + err);
        return sendError(res, 'Unexpected error');
    }
}

const login = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email == null){ //todo delete double check 
        return sendError(res, 'Epmty email');
    }
    else if (password == null){
        return sendError(res, 'Epmty password');
    }
    //else if (password cahracters count > 16){ //todo 
    //    return sendError(res, 'Invalid password: max length = 16');
    //}
    // else if (email dosent have @){ //todo
    //     return sendError(res, 'wrong email format');
    // }

    //  check if email in use:
    try{
        const user = await User.findOne({'email': email});    //findOne() default func.
        if (user == null){
            return sendError(res, 'Invalid email or password'); //   Email not registered/found
        }

        //  password check:
        const matchResult: Boolean = await bcrypt.compare(password, user.password)
        if (matchResult == false){
            return sendError(res, 'Invalid email or password'); //   Wrong password
        }

        return res.status(statusOK).send({
            //'email': email
            // '_id' : newUser._id  // id of Object in DB
            'message': 'login successful'
        })
    }catch(err){  // expected: server lost connection with db
        //console.log(req.body)
        console.log('error: ' + err);
        return sendError(res, 'Unexpected error');
    }
}

const logout = async (req: Request, res: Response) => {
    res.status(statusERROR).send({'error': 'Not implemented'});
}



export = {register, login, logout};



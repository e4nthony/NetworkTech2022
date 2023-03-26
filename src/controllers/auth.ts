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
import { Request, Response, NextFunction } from 'express'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

function sendError(res: Response, error_msg: string) {
    res.status(statusERROR).send({ 'error': error_msg });
}

async function generateTokens(userId: string) {

    const accessToken = jwt.sign(
        // {'mail': },
        { 'id': userId },
        process.env.ACCESS_TOKEN_SECRET,
        { 'expiresIn': process.env.JWT_TOKEN_EXPIRATION }
    )

    const refreshToken = jwt.sign(
        // {'mail': },
        { 'id': userId },
        process.env.REFRESH_TOKEN_SECRET
    )

    return { 'accessToken': accessToken, 'refreshToken': refreshToken }
}

/**
 * 
 * @param req 
 * @returns string of raw token
 */
function getTokenFromRequest(req: Request): string {
    const authHeader = req.headers['authorization'];

    if (authHeader == null)
        return null;

    return authHeader.split(' ')[1]; //  gets first string in "dictionary"
}


// requests list :

const register = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email == null) {
        return sendError(res, 'Epmty email');
    }
    else if (password == null) {
        return sendError(res, 'Epmty password');
    }
    //else if (password cahracters count > 16){ //todo
    //    return sendError(res, 'Invalid password: max length = 16');
    //}
    // else if (email dosent have @){ //todo
    //     return sendError(res, 'wrong email format');
    // }

    //  check if email in use:
    try {
        const user = await User.findOne({ 'email': email });    //findOne default func.
        if (user != null) {
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
            'email': email,
            '_id': newUser._id,  // id of Object in DB
            newUser //todo delete
        })
        // return res.status(statusOK).send({ // Debug purposes only
        //     newUser
        // })
    } catch (err) {  // expected: server lost connection with db
        // console.log(req.body)
        console.log('error: ' + err);
        return sendError(res, 'Unexpected error');
    }
}

const login = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email == null) { //todo delete double check 
        return sendError(res, 'Epmty email');
    }
    else if (password == null) {
        return sendError(res, 'Epmty password');
    }
    //else if (password cahracters count > 16){ //todo 
    //    return sendError(res, 'Invalid password: max length = 16');
    //}
    // else if (email dosent have @){ //todo
    //     return sendError(res, 'wrong email format');
    // }

    //  check if email in use:
    try {
        const user = await User.findOne({ 'email': email });    //findOne() default func.
        if (user == null) {
            return sendError(res, 'Invalid email or password'); //   Email not registered/found
        }

        //  password check:
        const matchResult: Boolean = await bcrypt.compare(password, user.password)
        if (matchResult == false) {
            return sendError(res, 'Invalid email or password'); //   Wrong password
        }

        const tokens = await generateTokens(user._id.toString());

        if (user.refresh_tokens == null)
            user.refresh_tokens = [tokens.refreshToken];
        else
            user.refresh_tokens.push(tokens.refreshToken);


        await user.save();

        return res.status(200).send(tokens);
        // return res.status(statusOK).send({
        //     //'email': email
        //     // '_id' : newUser._id  // id of Object in DB
        //     // 'message': 'login successful'
        //     tokens
        // })
    } catch (err) {
        /**
         * expected error:
         * - server lost connection with db
         * - secretOrPrivateKey dont have a value
         * */

        //console.log(req.body)
        console.log('error: ' + err);
        return sendError(res, 'Unexpected error');
    }
}

const logout = async (req: Request, res: Response) => {
    res.status(statusERROR).send({ 'error': 'Not implemented' });
}

type TokenInfo = {
    id: string
}

const authenticateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = getTokenFromRequest(req);

    if (token == null)
        return sendError(res, 'signed out');

    //  
    try {
        const user = <TokenInfo>jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.body.userId = user.id;
        console.log("user's token: " + user);

        return next();
    } catch (err) {
        return sendError(res, 'token validation fails');
    }

}




export = { register, login, logout, authenticateMiddleware };



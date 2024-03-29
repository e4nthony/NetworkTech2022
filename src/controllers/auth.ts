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

type TokenInfo = {
    id: string
}

function sendError(res: Response, error_msg: string) {
    res.status(statusERROR).send({ 'error': error_msg });
}

async function generateTokens(userId: string) {

    const accessToken = jwt.sign(
        // {'mail': },
        { 'id': userId },
        process.env.ACCESS_TOKEN_SECRET,
        { 'expiresIn': process.env.JWT_TOKEN_EXPIRATION }   //  this token will expire
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

    return authHeader.split(' ')[1]; //  gets first string in "dictionary"/JSON
}


// requests list :

const register = async (req: Request, res: Response) => {

    // const _id = req.body._id;
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const imageUrl = req.body.imageUrl;

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
            // '_id': null,
            'email': email,
            "name": name,
            'password': encryptedPassword,
            "imageUrl": imageUrl
        });

        await newUser.save();

        return res.status(statusOK).send({
            'email': email,
            '_id': newUser._id,
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
        return sendError(res, 'Invalid email or password'); //   Epmty email
    }
    else if (password == null) {
        return sendError(res, 'Invalid email or password'); //   Epmty password
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

        if (user.refresh_tokens == null)    // if no r_tokens in DB
            user.refresh_tokens = [tokens.refreshToken];    //make one
        else
            user.refresh_tokens.push(tokens.refreshToken);  //else, add


        await user.save();  //  wait till user saved in DB
        // await user.findOneAndUpdate();  //  wait till user saved in DB
        // await user.update();  //  wait till user saved in DB

        const userData = {
            'id': user._id,
            'email': email,
            'name': user.name,
            'imageUrl': user.imageUrl,
            'refreshToken': tokens.refreshToken,
            'accessToken': tokens.accessToken
        }  //pack data as UserData type at app

        return res.status(statusOK).send(userData);
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
    const refreshToken = getTokenFromRequest(req);

    if (refreshToken == null)
        return sendError(res, 'authentication missing');

    try {
        const user: TokenInfo = <TokenInfo>jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        const userObj = await User.findById(user.id);
        if (userObj == null)
            return sendError(res, 'token validation fails');

        /**
         * (suspicious attempt)
         * if refresh_token not in db: delete r_tokens from DB. (check if refreshToken in userObj)
         */
        if (!userObj.refresh_tokens.includes(refreshToken)) {

            userObj.refresh_tokens = [];
            await userObj.save();
            return sendError(res, 'token validation fails');
        }

        //  erase r_token from r_tokens list
        userObj.refresh_tokens.splice(userObj.refresh_tokens.indexOf(refreshToken), 1)
        //  save changes
        await userObj.save();

        return res.status(200).send();
    } catch (err) {
        return sendError(res, 'token validation fails');
    }
}

const refresh = async (req: Request, res: Response) => {

    const refreshToken = getTokenFromRequest(req);
    if (refreshToken == null)
        return sendError(res, 'authentication missing');

    try {
        const user: TokenInfo = <TokenInfo>jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const userObj = await User.findById(user.id);
        if (userObj == null)
            return sendError(res, 'token validation fails');

        /**
         * (suspicious attempt)
         * if refresh_token not in db: delete r_tokens from DB. (check if refreshToken in userObj)
         */
        if (!userObj.refresh_tokens.includes(refreshToken)) {

            userObj.refresh_tokens = [];
            await userObj.save();
            return sendError(res, 'token validation fails');
        }

        const tokens = await generateTokens(userObj._id.toString());

        userObj.refresh_tokens[userObj.refresh_tokens.indexOf(refreshToken)] = tokens.refreshToken;

        console.log("refresh token: " + refreshToken);
        console.log("with token: " + tokens.refreshToken);
        await userObj.save();

        return res.status(200).send(tokens);
    } catch (err) {
        return sendError(res, 'token validation fails');
    }
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




export = { register, login, logout, authenticateMiddleware, refresh };



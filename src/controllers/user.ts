const statusOK = 200
const statusERROR = 400

import User from '../models/user_model'
import { Request, Response } from 'express'

/** todo move to func */
const getAllUsersEvent = async (req: Request, res: Response) => {
    console.log('getAllUsersEvent')

    try {
        const users = await User.find();

        return { status: 'OK', data: users }
    } catch (err) {
        return { status: 'ERROR', data: "" }
    }
}

const getAllUsers = async (req: Request, res: Response) => {
    console.log('getAllUsers')

    try {
        let users = {};

        users = await User.find()
        res.status(statusOK).send(users)
    } catch (err) {
        res.status(statusERROR).send({ 'error': 'cant get users from db' })
    }
}

const getUserById = async (req: Request, res: Response) => {
    console.log('getUserById' + req.params.id)

    try {
        const users = await User.findById(req.params.id);
        res.status(statusOK).send(users);
    } catch (err) {
        res.status(statusERROR).send({ 'error': 'cant get users from db' });
    }
}

const updateUserById = async (req: Request, res: Response) => {
    console.log(req.body);

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })

        console.log("user updated in db :" + updatedUser.email);
        res.status(statusOK).send(updatedUser);
    }
    catch (err) {
        console.log("failed to save user in DB (updateUserById())");
        res.status(statusERROR).send({ 'error': 'fail adding new user to db' });
    }
}


export = { getAllUsers, getUserById, updateUserById, getAllUsersEvent }

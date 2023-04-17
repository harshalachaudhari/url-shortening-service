import Express from 'express';
import { validationResult } from 'express-validator';
import { hashPassword } from '../common/encrypt';
import User from '../database/users.model'
import { IUser } from '../database/users.types';



// function to get the create a new user from the API
let createUser = async (user: IUser): Promise<IUser> => {
    try {
        let hash = await hashPassword(user.password);
        const newUser = new User({
            email: user.email,
            password: hash,
            name: user.name,
            isAdmin: user.isAdmin,
        });
        await newUser.save();

        return newUser;
    } catch (err: any) {
        if (err.code === 11000) {
            throw Error('The user already exists');
        }
        throw Error('Failed to create new User');
    };
};



//controller function
export default async (req: Express.Request, res: Express.Response) => {
    try {
        // Reuqest data validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let response = await createUser(req.body);
        response['password'] = '*************';
        res.send({ type: 'success', message: 'User registered', statistics: response }).status(200);
    } catch (err: any) {
        res.send({ error: err.message }).status(400)
    }
};
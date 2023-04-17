import Express from 'express';
import { validationResult } from 'express-validator';
import { matchHashedPassword } from '../common/encrypt';
import User from '../database/users.model';
import { IUserRequest } from '../common/types';
import { generateToken } from '../common/jwt.utils';



// function to authenticate the User
let login = async (user: IUserRequest) => {
    try {

        const userDetails = await User.findOne({ email: user.email });

        if (userDetails && await matchHashedPassword(user.password, userDetails.password)) {
            let jwtUser = Object.assign(user, { isAdmin: userDetails.isAdmin })
            return { status: 'LoggedIn Successfully', token: await getToken(jwtUser) };
        }

        return { status: 'Login Unsuccessful' };

    } catch (err) {
        throw Error('Failed to login with given credentials')
    };
};

let getToken = async (user: IUserRequest) => {
    try {
        return generateToken(user);
    } catch (err) {
        throw Error('Failed to getToken')
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
        let response = await login(req.body);
        res.send(response).status(200);
    } catch (err) {
        res.send({ error: err }).status(400)
    }
};
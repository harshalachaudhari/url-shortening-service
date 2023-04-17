import Express from 'express';
import { IUrlDetails } from '../database/url.types';
import Url from '../database/url.model'
import { validateUrl } from '../common/utils';
import { nanoid } from 'nanoid';
import { validationResult } from 'express-validator';
import { verifyToken, decodeJwtToken } from '../common/jwt.utils';


const authenticate = async (token: string): Promise<boolean> => {
    try {

        const jwtToken = token.split(' ')[1];
        let isValid: any = verifyToken(jwtToken);
        if (isValid.name === 'JsonWebTokenError' || isValid.name === 'TokenExpiredError' || isValid.message === 'jwt malformed') {
            isValid = false;
        } else {
            isValid = true;
        }
        return isValid;
    } catch (err) { throw Error('Failed to verify token') };
};


// function to short the longUrl from the API
let prepareShortUrl = async (params: IUrlDetails, userId: string) => {
    try {

        const { longUrl } = params;
        const base = process.env.BASE;
        // generate unique id
        const urlId = nanoid(7);
        //  store in DB
        if (validateUrl(longUrl)) {

            try {
                let url = await Url.findOne({ longUrl: longUrl, userId: userId });

                if (url) {
                    return url;
                } else {
                    const shortUrl = `${base}/${urlId}`;

                    url = new Url({
                        longUrl: longUrl,
                        shortUrl: shortUrl,
                        urlId: urlId,
                        userId: userId,
                        date: new Date(),
                    });

                    await url.save();
                    return url
                }
            } catch (err) {
                throw Error('Failed to add url')
            };
        };
    } catch (err) {
        throw Error('Failed to shorten the given url')
    }
}


//controller function
export default async (req: Express.Request, res: Express.Response) => {
    try {

        // Reuqest data validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const token = req.header('Authorization') ?? '';

        let isValid = await authenticate(token);
        let decodedToken = decodeJwtToken(token);
        let userIdOfToken = (typeof decodedToken !== 'string') ? decodedToken.email : '';
        if (isValid) {
            const shortUrl = await prepareShortUrl(req.body, userIdOfToken);

            res.status(200).send({
                type: 'success',
                shortUrlDetails: shortUrl
            });
        } else {
            res.status(400).send({
                type: 'failed',
                message: 'User not logged in'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({
            type: 'failed',
            message: 'Failed to generate short URL'
        });
    }
};
import Express from 'express';
import { IUrlRequestDetails } from '../common/types';
import Url from '../database/url.model';
import { validationResult } from 'express-validator';


// function to get the data from the API
let redirectToLongUrl = async (params: IUrlRequestDetails) => {
    try {
        const url = await Url.findOne({ urlId: params.urlId });
        if (url) {
            await Url.updateOne(
                {
                    urlId: params.urlId,
                },
                { $inc: { clicks: 1 } }
            );
            return { originalUrl: url.longUrl };
        } else return { Error: 'Not found' };
    } catch (err) {
        return { Error: 'Server Error' };
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

        const longUrl = await redirectToLongUrl(req.params);
        if (longUrl.originalUrl) {
            return res.redirect(longUrl.originalUrl);
        } else res.status(404).json('Not found');
    } catch (err) {

        res.status(400).send({
            type: 'failed',
            message: 'Failed to redirect to long URL'
        });
    }
};
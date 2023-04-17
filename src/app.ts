import Express from 'express';
const app = Express();


import { body, param } from 'express-validator';
import client from 'mongoose';

import urlShortener from './handlers/urlShortener';
import redirect from './handlers/redirection';
import login from './handlers/login';
import register from './handlers/register';

// middleware
app.use(Express.json());
// bind routes
// Url_Shortening
app.post('/createShortUrl', body('longUrl').isString().isLength({ min: 15 })
    , urlShortener);

app.get('/:urlId', param('urlId').isString().isLength({ min: 7 }), redirect);

// Users routes
app.post('/register', body('name').isString(), body('email').isEmail(),
    body('password').isString().isLength({ min: 8 }), body('isAdmin').isBoolean(), register);


app.post('/login', body('email').isEmail(),
    body('password').isString().isLength({ min: 8 }), login);

app.get('/service/health', async (req: Express.Request, res: Express.Response) => {
    const healthcheck = {
        uptime: process.uptime(),
        dbHealth: client.ConnectionStates,
        message: 'OK',
        timestamp: Date.now()
    };

    res.send({
        health: `${JSON.stringify(healthcheck)}`,
        status: 'OK'
    })
});

export default app;

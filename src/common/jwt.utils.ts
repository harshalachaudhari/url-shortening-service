import { sign, SignOptions, verify, VerifyOptions, decode, DecodeOptions } from 'jsonwebtoken';
import { IUserRequest } from './types';


/**
 * generates JWT used for local testing
 */
const SecretKey = process.env.SECRET_KEY ?? 'defaultsecrethere';
export function generateToken(payload: IUserRequest) {
    // information to be encoded in the JWT

    const signInOptions: SignOptions = {
        algorithm: 'HS256',
        expiresIn: '15m'
    };

    // generate JWT
    return sign(payload, SecretKey, signInOptions);
};

export function verifyToken(token: string) {
    const verifyOption: VerifyOptions = { algorithms: ['HS256'] };

    return verify(token, SecretKey, verifyOption, (err, decode) => decode !== undefined ? decode : err);
}

export function decodeJwtToken(token: string) {
    const decodeOptions: DecodeOptions = { json: true };

    const decodedToken = decode(token.split(' ')[1], decodeOptions);
    if ((typeof decodedToken !== 'string') && !decodedToken) {
        return { payload: 'No Payload' }
    }
    return decodedToken;
}



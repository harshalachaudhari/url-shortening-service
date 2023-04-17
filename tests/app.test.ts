import request from 'supertest';
import app from '../src/app';
import { faker } from '@faker-js/faker';
import { generateToken } from '../src/common/jwt.utils';



beforeEach((done) => {
    jest.clearAllMocks();
    done();
})

describe('Test the /health path', () => {
    test('It should response the GET method', () => {
        return request(app).get('/service/health').expect(200);

    });
});

describe('POST /register', () => {
    let testUser = {
        name: faker.internet.userName('Jane', 'Doe'),
        email: faker.internet.email(),
        password: faker.internet.password(5, false,),
        isAdmin: faker.datatype.boolean()
    }
    test('Should not accept invalid data', () => {
        return request(app).post('/register').send(testUser).then((res) => {
            expect(res.status).toEqual(400);
            expect(res.body.errors[0].param).toContain('password')
        });

    });

});

describe('POST /createShortUrl', () => {
    test('Should not shorten skills if user is not loggedin', () => {
        let token = 'Bearer eyJ' + faker.random.alphaNumeric();
        return request(app).post('/createShortUrl')
            .set("Authorization", token).send({
                "longUrl": "https://about.me/jane.chaudhari"
            }).then((res) => {
                expect(res.status).toEqual(400);
                expect(res.body.message).toContain('User not logged in');
            });

    });


    test('Should not shorten url if request data is not valid', () => {

        let token = generateToken({
            email: faker.internet.email(),
            password: faker.internet.password(20),
            isAdmin: false
        });
        let bearerToken = 'Bearer ' + token;
        return request(app).post('/createShortUrl')
            .set("Authorization", bearerToken).send({ longUrl: 'invalidUrl' }).then((res) => {
                expect(typeof res.body).toEqual('object');
                expect(res.status).toEqual(400);

                expect(res.body.errors[0].param).toEqual('longUrl');
                expect(res.body.errors[0].msg).toEqual('Invalid value');
            });

    });
});

describe('Get /:urlId(redirecting endpoint)', () => {
    test('Redirecting endpoint should not redirect if shortUrl iswrong', async () => {

        return request(app).get('/HRGLck').then((res) => {
            expect(res.status).toEqual(400);
            expect(res.body.errors[0].param).toEqual('urlId');
            expect(res.body.errors[0].msg).toEqual('Invalid value');
        });
    });

});
# url-shortening-service

you can shorten you longurls here

Assuming the Service-URL_shortening (POST /createShortUrl and GET /:{shortUrl}) as endpoint,
Service-User_management_demo(POST /register and POST /login) to register and then login and get JWT tokens.

Service-URL_shortening authenticates the request before providing the short Url to user.

## Backend

Command lines:

- `npm run build` for build
- `npm run start:dev` for starting the application

Note:

- Please setup below variables .env file with:
  - DB_URL= `<YourMongoDBURL>`
  - PORT= `<YourServicePort>`
  - BASE= `<YourBaseUrl>`

### Endpoints

- POST /register should register user, accepts below body:
  - `name` users name
  - `email` Users email
  - `password` Users Password with minLength 8
  - `isAdmin` true if user isAdmin else false
  - {
    "name": <name>,
	  "isAdmin": <booleanvalue>,
    "email":<email>,
    "password":<password>
    }

- POST /login should provide users jwt Token, accepts below body:
  - `email` Users email
  - `password` Users Password with minLength 8
  - {
    "email":<email>,
    "password":<password>
    }
  

- POST /createShortUrl should return success and shortUrlDetails on successful shortening of valid URL.

  - This service does data validation on URL.
  - This service is responsible to authenticate the caller with JWT token and then validate and store shortUrl in DB.
  - This endpoint uses nanoId to create shortcodes and stores the record in DB.
  - For demo purpose using mocked User collection, in real-time user details are encrypted and stored in DB using UserManagement System.
  - Sample Request Body :

  ```
  {
  "longUrl": "https://about.me/harshala.chaudhari"
  }
  ```

  - Header: 'Authorization': 'BearerToken'

- POST /:{urlId} is being used as redirecting service render shortUrls.
  - This service is responsible to redirect the shortUrl to original longUrl.
  - Sample Request endpoint :

```

http://localhost:3000/_HRGLck

```

### Testing

- `npm run test` for tests

### Extra

- The solution is containerized

- Update the ENV variables in Dockerfile:

```
 - DB_URL= `<YourMongoDBURL>`
 - PORT= `<YourServicePort>`
 - BASE= `<YourBaseUrl>`
```

- Run below commands to start the application

```

- docker build -t backend-challenge:1.0.0 .
- docker run -p 3000:3000 -d backend-challenge:1.0.0

```

### Improvements

- JWTToken:

  - We can store the JWT secret to cloud service for eg: AWS Secret Manager/ Azure Key Vault and fetch that secret using library function. This makes app more secure.

  - We should be storing sensitive data like password and token encrypted to hash and then store in DB to avoid Data Leaks.

- Dockerize App

  - It is best to create docker container image of the app. It makes it easy to maintain and brings agility.
    commands: - docker build -t backend-challenge:1.0.0 .

              - docker run -p 3000:3000 -d backend-challenge:1.0.0

- Logging

  - We should use logging libraries like 'winston' to have more organised logging.

- Hosting

  - We can host this app container on ECS or create a lambda and integrate with API Gateway.

- Maintaining Database model schema and settings in repository will help us track and maintain the migrations more better.
- These files can be used by Scripts run migrations as per CICD requirements.

- We can expand the functionality and new cloud components if required easily in by maintaing a config file
  initialising components using config in server.ts file.

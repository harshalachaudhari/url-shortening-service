FROM node:16 as builder
# multi-stage build stage 1

ENV DB_URL mongodb://localhost:27017
ENV PORT 3000
ENV BASE http://localhost:3000


# create directory
WORKDIR /build/src/app

# copy packages source
COPY ./package.json ./package-lock.json /build/src/app/

# Install all packages
RUN npm install
COPY . .

RUN npm run build

FROM node:16 as runner

# set new work directory
WORKDIR /src/app

ENV PORT 3000

# copy the files from build stage 1
COPY --from=builder /build/src/app /src/app

EXPOSE ${PORT}
# run the app
CMD [ "npm","run", "start:dev" ]
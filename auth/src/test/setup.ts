import { MongoMemoryServer } from 'mongodb-memory-server'
import { connect, connection } from 'mongoose'
import request from 'supertest'
import { app } from '../app'

/*
What happens when we npm run test with Jest

start in-memory copy of MongoDB
because we are running the tests on our machine and not on Docker, we need a version of MongoDB where we can simulate storing data in our tests

start up our express app

use supertest library to make fake requests to our express app

run assertions to make sure the request did the right thing

*/

declare global {
    namespace NodeJS {
        interface Global {
            signin(): Promise<string[]>
        }
    }
}

let mongo: any; // declare this ahead of time because of scope

// whatever is passed inside of here will run before all of our tests start to execute
beforeAll(async () => {
    // we need to set our JWT_KEY here because we decoupled app.ts and index.ts
    process.env.JWT_KEY = 'lol'

    mongo = new MongoMemoryServer()
    const mongoUri = await mongo.getUri()

    await connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

beforeEach(async () => {
    const collections = await connection.db.collections()

    for (let collection of collections) {
        await collection.deleteMany({})
    }
})

// stop the mongo server and mongoose after the tests are run
afterAll(async () => {
    await mongo.stop()
    await connection.close()
})

global.signin = async () => {
    const email = 'test@test.com'
    const password = 'password'

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email, password
        })
        .expect(201)

    const cookie = response.get('Set-Cookie') // pull the cookie off of the response header

    return cookie
}


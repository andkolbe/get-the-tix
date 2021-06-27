import { MongoMemoryServer } from 'mongodb-memory-server'
import { connect, connection } from 'mongoose'
import request from 'supertest'
import { app } from '../app'

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
        .post('/api/users/register')
        .send({
            email, password
        })
        .expect(201)

    const cookie = response.get('Set-Cookie') // pull the cookie off of the response header

    return cookie
}


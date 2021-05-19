import Queue from 'bull' // JS library that allows us to set up long lived timers
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher'
import { natsWrapper } from '../nats-wrapper'

interface Payload { // data we are going to store inside of the job object. Typescript help
    orderId: string
}

// A queue is the main abstraction inside of Bull. It represents a series of messages that we want to queue up and eventually process over time
// create an instance of a queue. It allows us to publish a job to our Redis server and process a completed job that comes back
// the first argument is the name of the channel that we want to store our jobs in temporarily. We can name this whatever we want
// the second argument is an object that tells the queue that we want to connect to the instance of the Redis server we are running inside of the pod we created
const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST // the redis host on our yaml file
    }
})

// process the completed job that comes back from Redis and publish an expiration:complete event
expirationQueue.process(async (job) => {
    new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    })
})

export { expirationQueue }
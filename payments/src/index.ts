import mongoose from 'mongoose';
import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'
import { OrderCreatedListener } from './events/listeners/order-created-listener'

const start = async () => {
  if (!process.env.JWT_KEY) { // prevents typescript error with process.env on app startup
    throw new Error('JWT must be defined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined')
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined')
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined')
  }

  try {
    // code that initializes that NATS client and connectes to Nats Streaming Server
    // once initialized, we can import our NATS client into any of our route handlers
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    )
    // if we lose our connection to nats, or if we shut down our app, we go through a graceful shutdown process
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed')
      process.exit()
    })

    // runs anytime our listener closes or restarts. Doesn't always work on windows
    process.on('SIGINT', () => natsWrapper.client.close()) // interrupt
    process.on('SIGTERM', () => natsWrapper.client.close()) // terminate

    new OrderCreatedListener(natsWrapper.client).listen()
    new OrderCancelledListener(natsWrapper.client).listen()

    // this instance of mongo will store all of our payment data
    await mongoose.connect(process.env.MONGO_URI, { // connect to the mongodb pod
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error(err)
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
}

start();


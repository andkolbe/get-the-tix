import mongoose from 'mongoose';

import { app } from './app'
 
// run this function when we start up our app!
const start = async () => {
  console.log('Starting up.....')

  // if our env variables aren't defined, don't run this service
  if (!process.env.JWT_KEY) { // prevents typescript error with process.env on app startup
    throw new Error('JWT must be defined')
  }
  if (!process.env.MONGO_URI) { 
    throw new Error('MONGO_URI must be defined')
  }

  try {
    // this instance of mongo will store all of the user data
    await mongoose.connect(process.env.MONGO_URI, { // connect to the mongodb pod
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connceted to MongoDB')
  } catch (err) {
    console.error(err)
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
}

start();

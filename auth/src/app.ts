// decouple app and index so we can use our app in our supertests without worrying about connecting to a port
import express from 'express';
import 'express-async-errors'; // prevents you from having to write next() in all async function errors
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user'
import { signInRouter } from './routes/login'
import { signOutRouter } from './routes/logout'
import { signUpRouter } from './routes/register'
import { errorHandler, NotFoundError } from '@ajktickets/common';

const app = express();
app.set('trust proxy', true) // tells express to trust all traffic going through our nginx proxy
app.use(express.json());
app.use(
  cookieSession({
    // disable encryption on our cookie. JWTs are already encrypted. 
    // Makes it easier to use different languages between our services. We don't have to worry about any language not understanding our encryption
    signed: false,
    // secure: true // requires that we must be on a https connection
    // secure: process.env.NODE_ENV !== 'test' // make this change to make sure auth works in our tests
    secure: false,
  })
)

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all('*', async () => { // throw an error if someone tries to go to any route not specified
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
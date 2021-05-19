import dotenv from 'dotenv';

const envFound = dotenv.config();

if (!envFound) throw new Error('no .env file found');

export default { stripe: process.env.STRIPE_KEY }
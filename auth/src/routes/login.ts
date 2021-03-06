import { Router, Request, Response } from 'express';
import { validateRequest, BadRequestError } from '@ajktickets/common'
import { body } from 'express-validator'
import { User } from '../models/User';
import { Password } from '../services/password'
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/api/users/login', 
    [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
    ], 
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body

        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            throw new BadRequestError('Invalid credentials') // we want the response to be as generic as possible
        }

        const passwordsMatch = await Password.compare(existingUser.password, password)

        if (!passwordsMatch) {
            throw new BadRequestError('Invalid credentials')
        }

        // generate JWT
        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_KEY!) // the ! lets typescript know that this variable has already been defined

        // store JWT on session object
        req.session = {
            jwt: userJwt
        }

        res.status(200).send(existingUser)
    })

export { router as signInRouter };
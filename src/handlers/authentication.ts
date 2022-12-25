import {AuthenticationQueries} from "../services/queries/authentication";
import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {User} from "../models/user";
import {create as createUserHandler} from "./users";

const query: AuthenticationQueries = new AuthenticationQueries()

/**
 * Authenticate a User
 * @param req
 * @param res
 */
const authenticate = async (req: Request, res: Response) : Promise<void> => {
    const {username, password} = req.body
    try {
        const authenticatedUser = await query.authenticate(username, password)
        if (null === authenticatedUser) {
            res.status(400).json('invalid user').end()
        }
        const token = jwt.sign(authenticatedUser as User, process.env.TOKEN_SECRET as string)
        res.status(201).send(token).end()
    } catch (e) {
        res.status(400).json('invalid user').end()
    }
}


/**
 * Routes for authentication
 * @param app
 */
export const authenticationRoutes = (app: express.Application) => {
    app.post('/authenticate', authenticate)
    app.post('/register', createUserHandler)
}

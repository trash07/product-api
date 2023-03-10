import { User, UserStore } from '../models/user'
import express, { Request, Response } from 'express'
import { validateJwt } from '../utils/middleware/token-validator'
import jwt from 'jsonwebtoken'

const store: UserStore = new UserStore()

/**
 * User index
 * @param req
 * @param res
 */
const index = async (req: Request, res: Response): Promise<void> => {
	res.send(await store.index())
}

/**
 * Show User details
 * @param req
 * @param res
 */
const show = async (req: Request, res: Response): Promise<void> => {
	const id: number = req.params.id as unknown as number
	try {
		const user = await store.show(id)
		res.send(user).end()
	} catch (err) {
		res.send(404).json('User not found').end()
	}
}

/**
 * Create User
 * @param req
 * @param res
 */
export const create = async (req: Request, res: Response): Promise<void> => {
	const body = req.body
	const user: User = {
		username: body.username,
		password: body.password,
		firstName: body.firstName,
		lastName: body.lastName,
	}
	try {
		const createdUser: User = await store.create(user)
		const token = jwt.sign(
			createdUser,
			process.env.TOKEN_SECRET as unknown as string
		)
		console.log(
			`Username => ${user.username}, Password => ${user.password}, firstname => ${user.firstName}, lastname => ${user.lastName}`
		)
		res.status(201).json(token).end()
	} catch (e) {
		res.status(400).json('Invalid user data').end()
	}
}

/**
 * Update a User
 * @param req
 * @param res
 */
const update = async (req: Request, res: Response): Promise<void> => {
	try {
		const user: User = {
			username: req.body.username,
			password: req.body.password,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
		}
		const updatedUser = await store.update(
			req.params.id as unknown as number,
			user
		)
		const token = jwt.sign(
			updatedUser,
			process.env.TOKEN_SECRET as unknown as string
		)
		res.status(202).json(token).end()
	} catch (e) {
		res.status(400).json('Invalid user data').end()
	}
}

/**
 * Delete a User
 * @param req
 * @param res
 */
const remove = async (req: Request, res: Response): Promise<void> => {
	try {
		await store.delete(req.params.id as unknown as number)
		res.sendStatus(202)
	} catch (e) {
		res.status(400).json('Invalid user data').end()
	}
}

/**
 * User routes
 * @param app
 */
export const userRoutes = (app: express.Application): void => {
	app.get('/users', [validateJwt], index)
	app.get('/users/:id', [validateJwt], show)
	app.post('/users', [validateJwt], create)
	app.put('/users/:id', [validateJwt], update)
	app.delete('/users/:id', [validateJwt], remove)
}

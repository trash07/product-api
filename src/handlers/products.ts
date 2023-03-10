import { Product, ProductStore } from '../models/product'
import express, { Request, Response } from 'express'
import { validateJwt } from '../utils/middleware/token-validator'

const store: ProductStore = new ProductStore()

/**
 * Index handler for Product
 * @param req
 * @param res
 */
const index = async (req: Request, res: Response): Promise<void> => {
	res.send(await store.index())
}

/**
 * Show route for Product
 * @param req
 * @param res
 */
const show = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params
		const product = await store.show(id as unknown as number)
		res.send(product).end()
	} catch (e) {
		res.status(404).end()
	}
}

/**
 * Create a Product
 * @param req
 * @param res
 */
const create = async (req: Request, res: Response): Promise<void> => {
	try {
		const { name, price } = req.body
		const product: Product = { name, price }
		const createdProduct = await store.create(product)
		res.status(201).send(createdProduct)
	} catch (err) {
		res.status(400).send(`${err}`)
	}
}

/**
 * Update a product
 * @param req
 * @param res
 */
const update = async (req: Request, res: Response): Promise<void> => {
	try {
		let product: Product = {
			name: req.body.name,
			price: req.body.price,
		}
		const updatedProduct = await store.update(
			req.params.id as unknown as number,
			product
		)
		res.status(202).send(updatedProduct).end()
	} catch (err) {
		res.status(400).send(`${err}`)
	}
}

/**
 * Delete a product
 * @param req
 * @param res
 */
const remove = async (req: Request, res: Response): Promise<void> => {
	try {
		const id = req.params.id as unknown as number
		const product = await store.delete(id)
		res.json(product)
	} catch (e) {
		res.status(400).send(`${e}`)
	}
}

/**
 * Define product related routes
 * @param app
 */
export const productRoutes = (app: express.Application) => {
	app.get('/products', index)
	app.get('/products/:id', show)
	app.post('/products', [validateJwt], create)
	app.put('/products/:id', [validateJwt], update)
	app.delete('/products/:id', [validateJwt], remove)
}

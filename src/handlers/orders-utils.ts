import { OrderQueries } from '../services/queries/order-queries'
import express, { Request, Response } from 'express'
import { validateJwt } from '../utils/middleware/token-validator'

const query = new OrderQueries()

/**
 * Get current order by order
 * @param req
 * @param res
 */
const currentOrderByUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const user_id = req.params.id as unknown as number
		const currentOrder = await query.getCurrentOrderByUser(user_id)
		res.send(currentOrder)
	} catch (e) {
		res.send(400).send('Invalid request')
	}
}

/**
 * Get completed orders by user
 * @param req
 * @param res
 */
const completedUserOrders = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const user_id = req.params.id as unknown as number
		const orders = await query.getCompletedOrdersByUser(user_id)
		res.send(orders)
	} catch (e) {
		res.send(400).send('Invalid request')
	}
}

/**
 * Handle order util
 * @param app
 */
export const orderUtilQueryRoutes = (app: express.Application): void => {
	app.get('/current-user-order/:id', [validateJwt], currentOrderByUser)
	app.get('/completed-user-orders/:id', [validateJwt], completedUserOrders)
}

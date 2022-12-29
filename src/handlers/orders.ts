import express, { request, Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';

const store = new OrderStore();

/**
 * Get orders
 * @param req
 * @param res
 */
const index = async (req: Request, res: Response): Promise<void> => {
	res.send(await store.index());
};

/**
 * Order details
 * @param req
 * @param res
 */
const show = async (req: Request, res: Response): Promise<void> => {
	const id = req.params.id as unknown as number;
	res.send(await store.show(id));
};

/**
 * Create a new order
 * @param req
 * @param res
 */
const create = async (req: Request, res: Response): Promise<void> => {
	let order: Order = {
		user_id: req.body.user_id,
		order_date: req.body.order_date,
		status: req.body.status,
	};
	try {
		const createdOrder = await store.create(order);
		res.status(201).send(createdOrder).end();
	} catch (e) {
		res.sendStatus(400).end();
	}
};

/**
 * Update an order
 * @param req
 * @param res
 */
const update = async (req: Request, res: Response): Promise<void> => {
	const id = req.params.id as unknown as number;
	let order: Order = {
		user_id: req.body.user_id,
		order_date: req.body.order_date,
		status: req.body.status,
	};
	try {
		const updatedOrder = await store.update(id, order);
		res.status(202).send(updatedOrder).end();
	} catch (e) {
		res.sendStatus(400).end();
	}
};

/**
 * Get products in a order
 * @param req
 * @param res
 */
const getProducts = async (req: Request, res: Response): Promise<void> => {
	const id = req.query.id as unknown as number;
	res.send(await store.getProducts(id));
};

/**
 * Add product to an order
 * @param req
 * @param res
 */
const addProduct = async (req: Request, res: Response): Promise<void> => {
	const orderId = req.params.id as unknown as number;
	const productId = req.body.product_id as unknown as number;
	const quantity = req.body.quantity as unknown as number;
	try {
		const addedProduct = await store.addProduct(orderId, productId, quantity);
		res.status(201).send(addedProduct).end();
	} catch (e) {
		res.sendStatus(400).end();
	}
};

/**
 * Get a product details
 * @param req
 * @param res
 */
const getProductDetails = async (
	req: Request,
	res: Response
): Promise<void> => {
	const orderId = req.params.id as unknown as number;
	const productId = req.params.productId as unknown as number;
	try {
		const orderedProduct = await store.getProductDetail(orderId, productId);
		res.send(orderedProduct).end();
	} catch (e) {
		res.sendStatus(400).end();
	}
};

/**
 * Update a product in a order
 * @param req
 * @param res
 */
const updateProduct = async (req: Request, res: Response): Promise<void> => {
	const orderId = req.params.id as unknown as number;
	const productId = req.params.productId as unknown as number;
	const quantity = req.body.quantity as unknown as number;
	try {
		const updatedProduct = await store.updateProduct(
			orderId,
			productId,
			quantity
		);
		res.send(updatedProduct).end();
	} catch (e) {
		res.sendStatus(400).end();
	}
};

/**
 * Remove a product form an order
 * @param req
 * @param res
 */
const removeProduct = async (req: Request, res: Response): Promise<void> => {
	const orderId = req.params.id as unknown as number;
	const productId = req.params.productId as unknown as number;
	try {
		const removedOrder = await store.removeProduct(orderId, productId);
		res.send(removedOrder).end();
	} catch (e) {
		res.sendStatus(400);
	}
};

/**
 * Order routes
 * @param app
 */
export const orderRoutes = (app: express.Application): void => {
	app.get('/orders', index);
	app.get('/orders/:id', show);
	app.post('/orders', create);
	app.put('/orders/:id', update);
	app.get('/orders/:id/products', getProducts);
	app.post('/orders/:id/products', addProduct);
	app.get('/orders/:id/products/:productId', getProductDetails);
	app.put('/orders/:id/products/:productId', updateProduct);
	app.delete('/orders/:id/products/:productId', removeProduct);
};

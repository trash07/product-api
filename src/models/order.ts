import client from '../database';
import { OrderStatus } from '../utils/enums/order-status';
import { OrderProduct } from './order-product';

export type Order = {
	id?: number;
	user_id: number;
	status: OrderStatus;
	order_date: Date;
};

export class OrderStore {
	/**
	 * Order index
	 */
	async index(): Promise<Order[]> {
		try {
			const conn = await client.connect();
			const sql = 'SELECT * FROM orders';
			const result = await conn.query(sql);
			conn.release();
			return result.rows;
		} catch (e) {
			throw new Error(`Could not find orders ${e}`);
		}
	}

	/**
	 * Create an order
	 * @param order
	 */
	async create(order: Order): Promise<Order> {
		try {
			const conn = await client.connect();
			const sql = `INSERT INTO orders (user_id, status, order_date) VALUES ($1, $2, $3) RETURNING *`;
			const result = await conn.query(sql, [
				order.user_id,
				OrderStatus.ACTIVE,
				new Date(),
			]);
			conn.release();
			return result.rows[0];
		} catch (e) {
			throw new Error(`Could not create an order ${e}`);
		}
	}

	/**
	 * Update an order
	 * @param id
	 * @param order
	 */
	async update(id: number, order: Order): Promise<Order> {
		try {
			const conn = await client.connect();
			const sql = `UPDATE orders SET user_id = ($1), status = ($2), order_date = ($3) WHERE id = ($4) RETURNING *`;
			const result = await conn.query(sql, [
				order.user_id,
				order.status,
				order.order_date,
				id,
			]);
			conn.release();
			return result.rowCount > 0 ? result.rows[0] : null;
		} catch (e) {
			throw new Error(`Could not update order ${e}`);
		}
	}

	/**
	 * Show an order
	 * @param id
	 */
	async show(id: number): Promise<Order> {
		try {
			const conn = await client.connect();
			const sql = `SELECT * FROM orders WHERE id = ($1)`;
			const result = await conn.query(sql, [id]);
			conn.release();
			if (result.rowCount === 0)
				throw new Error(`No order is associated to id ${id}`);
			return result.rows[0];
		} catch (e) {
			throw new Error(`Could not find order ${id}, ${e}`);
		}
	}

	/**
	 * Get products of an order
	 * @param id
	 */
	async getProducts(id: number): Promise<OrderProduct[]> {
		try {
			const conn = await client.connect();
			const sql = `SELECT * FROM order_products WHERE order_id = ($1)`;
			const result = await conn.query(sql, [id]);
			return result.rows;
		} catch (e) {
			throw new Error(`Could not get order ${id} products, ${e}`);
		}
	}

	/**
	 * Add product to order
	 * @param orderId
	 * @param productId
	 * @param quantity
	 */
	async addProduct(
		orderId: number,
		productId: number,
		quantity: number
	): Promise<OrderProduct> {
		try {
			if (await this.isProductOrdered(orderId, productId)) {
				return await this.updateProduct(orderId, productId, quantity);
			}
			const conn = await client.connect();
			const sql = `INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`;
			const result = await conn.query(sql, [orderId, productId, quantity]);
			conn.release();
			return result.rows[0];
		} catch (e) {
			throw new Error(`Could not add product to order ${e}`);
		}
	}

	/**
	 * Update product in order
	 * @param orderId
	 * @param productId
	 * @param quantity
	 */
	async updateProduct(
		orderId: number,
		productId: number,
		quantity: number
	): Promise<OrderProduct> {
		try {
			const conn = await client.connect();
			const sql = `UPDATE order_products SET quantity = ($1) WHERE order_id = ($2) AND product_id = ($3) RETURNING *`;
			const result = await conn.query(sql, [quantity, orderId, productId]);
			conn.release();
			return result.rows[0];
		} catch (e) {
			throw new Error(`Could not update product ${e}`);
		}
	}

	/**
	 * Get product details in order
	 * @param orderId
	 * @param productId
	 */
	async getProductDetail(
		orderId: number,
		productId: number
	): Promise<OrderProduct | null> {
		try {
			const conn = await client.connect();
			const sql = `SELECT * FROM order_products WHERE order_id = ($1) AND product_id = ($2)`;
			const result = await conn.query(sql, [orderId, productId]);
			conn.release();
			return result.rowCount > 0 ? result.rows[0] : null;
		} catch (e) {
			throw new Error(
				`Could not find product ${productId} in order ${orderId}, ${e}`
			);
		}
	}

	/**
	 * Remove a product from an order
	 * @param orderId
	 * @param productId
	 */
	async removeProduct(
		orderId: number,
		productId: number
	): Promise<OrderProduct | null> {
		try {
			const orderProduct = await this.getProductDetail(orderId, productId);
			const conn = await client.connect();
			const sql = `DELETE FROM order_products WHERE order_id = ($1) AND product_id = ($2)`;
			await conn.query(sql, [orderId, productId]);
			conn.release();
			return orderProduct;
		} catch (e) {
			throw new Error(
				`Could not remove product ${productId} in order ${orderId}, ${e}`
			);
		}
	}

	/**
	 * Check whether a product is already ordered
	 * @param orderId
	 * @param productId
	 */
	async isProductOrdered(orderId: number, productId: number): Promise<boolean> {
		const checkResult = await this.getProductDetail(orderId, productId);
		return checkResult != null;
	}
}

import { Order, OrderStore } from '../../models/order'
import client from '../../database'
import { OrderStatus } from '../../utils/enums/order-status'
import { OrderProduct } from '../../models/order-product'

export class OrderQueries {
	orderStore: OrderStore = new OrderStore()

	/**
	 * Get current order by user
	 * @param user_id
	 */
	async getCurrentOrderByUser(user_id: number): Promise<Order | null> {
		try {
			const conn = await client.connect()
			const sql = `SELECT * FROM orders WHERE user_id = ($1) AND status = ($2) ORDER BY order_date DESC limit 1`
			const result = await conn.query(sql, [user_id, OrderStatus.ACTIVE])
			conn.release()
			if (result.rowCount > 0) {
				const order = result.rows[0]
				const products = await this.orderStore.getProducts(order.id)
				if (products.length > 0) order.products = products
				return result.rows[0]
			}
			return null
		} catch (e) {
			throw new Error(`Could not find current order of user ${user_id}, ${e}`)
		}
	}

	/**
	 * Get completed orders by user
	 * @param user_id
	 */
	async getCompletedOrdersByUser(user_id: number): Promise<Order[]> {
		try {
			const conn = await client.connect()
			const sql = `SELECT * FROM orders WHERE user_id = ($1) AND status = ($2)`
			const result = await conn.query(sql, [user_id, OrderStatus.COMPLETE])
			if (result.rowCount > 0) {
				return result.rows.map((order: Order): Order => {
					this.orderStore
						.getProducts(order.id as number)
						.then((products: OrderProduct[]) => {
							if (products.length > 0) {
								order.products = products
							}
						})
					return order
				})
			}
			return []
		} catch (e) {
			throw new Error(
				`Could not find completed orders by user ${user_id}, ${e}`
			)
		}
	}
}

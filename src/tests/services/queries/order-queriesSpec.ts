import { User, UserStore } from '../../../models/user'
import { ProductStore } from '../../../models/product'
import { OrderStore } from '../../../models/order'
import { OrderStatus } from '../../../utils/enums/order-status'
import { OrderQueries } from '../../../services/queries/order-queries'

describe('Order queries test suite', () => {
	let user: User
	const productStore = new ProductStore()
	const userStore = new UserStore()
	const orderStore = new OrderStore()
	const orderQueries = new OrderQueries()

	beforeAll(async () => {
		user = await userStore.create({
			username: 'order-queries-user',
			password: '123',
			firstName: 'OrderQueries',
			lastName: 'User',
		})
	})

	it('should list current order of user', async () => {
		const product = await productStore.create({
			name: 'A product',
			price: 19,
		})
		const order = await orderStore.create({
			order_date: new Date(),
			status: OrderStatus.ACTIVE,
			user_id: user.id as number,
		})
		const addedProduct = await orderStore.addProduct(
			order.id as number,
			product.id as number,
			10
		)
		const currentOrderByUser = await orderQueries.getCurrentOrderByUser(
			user.id as number
		)

		expect(currentOrderByUser).toEqual(
			await orderStore.show(addedProduct.order_id as number)
		)
	})

	it('should find completed orders by user', async () => {
		const order = await orderStore.create({
			user_id: user.id as number,
			order_date: new Date(),
			status: OrderStatus.COMPLETE,
		})

		const completedOrders = await orderQueries.getCompletedOrdersByUser(
			user.id as number
		)
		expect(completedOrders).toEqual([order])
	})
})

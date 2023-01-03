import supertest from 'supertest'
import app from '../../server'
import { Order, OrderStore } from '../../models/order'
import { OrderStatus } from '../../utils/enums/order-status'
import { User, UserStore } from '../../models/user'
import { ProductStore } from '../../models/product'

describe('Orders endpoint test suite', () => {
	const request = supertest(app)
	const userStore = new UserStore()
	const orderStore = new OrderStore()
	const productStore = new ProductStore()

	let user: User

	beforeAll(async () => {
		user = await userStore.create({
			username: 'order-endpoint-test',
			password: '123',
			firstName: 'Order',
			lastName: 'User',
		})
	})

	it('GET /orders => should list orders', async () => {
		const response = await request.get('/orders')
		expect(response.status).toEqual(200)
		expect(Array.isArray(response.body)).toBeTrue()
		expect(response.body.length).toBeGreaterThanOrEqual(0)
	})

	it('POST /orders => should create an order', async () => {
		const orderInfos: Order = {
			order_date: new Date(),
			status: OrderStatus.ACTIVE,
			user_id: user.id as number,
		}
		const response = await request.post('/orders').send(orderInfos)
		expect(response.status).toEqual(201)
		expect(response.body.status).toEqual(orderInfos.status)
		expect(response.body.user_id).toEqual(orderInfos.user_id)
		expect(response.body.id).toBeDefined()
	})

	it('PUT /orders/:id => should update an order', async () => {
		const order: Order = {
			user_id: user.id as number,
			order_date: new Date(),
			status: OrderStatus.ACTIVE,
		}
		const createdOrder = await orderStore.create(order)
		const updateInfos: Order = {
			user_id: createdOrder.user_id,
			status: OrderStatus.COMPLETE,
			order_date: new Date(),
		}
		const response = await request
			.put(`/orders/${createdOrder.id}`)
			.send(updateInfos)
		expect(response.status).toEqual(202)
		expect(response.body.id).toEqual(createdOrder.id)
		expect(response.body.status).toEqual(updateInfos.status)
	})

	// Todo: add orders delete specs here

	it('GET /orders/:id/products => should get products in an order', async () => {
		const order: Order = {
			user_id: user.id as number,
			order_date: new Date(),
			status: OrderStatus.ACTIVE,
		}
		const createdOrder = await orderStore.create(order)
		const response = await request.get(`/orders/${createdOrder.id}/products`)
		expect(response.status).toEqual(200)
		expect(Array.isArray(response.body)).toBeTrue()
		expect(response.body.length).toBeGreaterThanOrEqual(0)
	})

	it('POST /orders/:id/products => should add a product to an order', async () => {
		const createdOrder = await orderStore.create({
			status: OrderStatus.ACTIVE,
			order_date: new Date(),
			user_id: user.id as number,
		})
		const createdProduct = await productStore.create({
			name: 'Product 1',
			price: 19,
		})
		const quantity = 10

		const response = await request
			.post(`/orders/${createdOrder.id}/products`)
			.send({
				product_id: createdProduct.id,
				quantity: quantity,
			})

		expect(response.status).toEqual(201)
		expect(response.body.id).toBeDefined()
		expect(response.body.order_id).toBeDefined()
		expect(response.body.product_id).toBeDefined()
		expect(response.body.quantity).toBeDefined()
		expect(response.body.quantity).toEqual(quantity)
		expect(response.body.order_id).toEqual(createdOrder.id)
		expect(response.body.product_id).toEqual(createdProduct.id)
	})

	it('GET /orders/:id/products/:productId => should get product details in order', async () => {
		const order = await orderStore.create({
			order_date: new Date(),
			status: OrderStatus.ACTIVE,
			user_id: user.id as number,
		})
		const product = await productStore.create({
			name: 'Get product detail',
			price: 182,
		})
		const productQuantity = 120
		const addedProduct = await orderStore.addProduct(
			order.id as number,
			product.id as number,
			productQuantity
		)

		const response = await request.get(
			`/orders/${order.id}/products/${product.id}`
		)

		expect(response.status).toEqual(200)
		expect(response.body).toEqual(addedProduct)
	})

	it('PUT /orders/:id/products/:productId => should update a product in a order', async () => {
		const order = await orderStore.create({
			order_date: new Date(),
			user_id: user.id as number,
			status: OrderStatus.ACTIVE,
		})
		const product = await productStore.create({
			name: 'Created product',
			price: 19,
		})
		const initialQuantity = 25
		const orderedProduct = await orderStore.addProduct(
			order.id as number,
			product.id as number,
			initialQuantity
		)
		orderedProduct.quantity = 20

		const response = await request
			.put(`/orders/${order.id}/products/${product.id}`)
			.send(orderedProduct)

		expect(response.status).toEqual(200)
		expect(response.body).toEqual(orderedProduct)
	})

	it('DELETE /orders/:id/products/:productId => should remove a product from an order', async () => {
		const order = await orderStore.create({
			order_date: new Date(),
			status: OrderStatus.ACTIVE,
			user_id: user.id as number,
		})
		const product = await productStore.create({ name: 'Product', price: 10 })
		const addedProduct = await orderStore.addProduct(
			order.id as number,
			product.id as number,
			24
		)

		const response = await request.delete(
			`/orders/${order.id}/products/${product.id}`
		)

		expect(response.body).toEqual(addedProduct)
		expect(
			await orderStore.getProductDetail(
				order.id as number,
				product.id as number
			)
		).toBeNull()
	})
})

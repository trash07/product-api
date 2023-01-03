import supertest from 'supertest'
import app from '../../server'
import { User, UserStore } from '../../models/user'
import { OrderStore } from '../../models/order'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { OrderStatus } from '../../utils/enums/order-status'

dotenv.config()

describe('Orders utils endpoints tests', () => {
	const request = supertest(app)
	const userStore = new UserStore()
	const orderStore = new OrderStore()
	let jwtToken: string
	let user: User

	beforeAll(async () => {
		user = await userStore.create({
			username: 'order-utils-endpoint',
			password: '123',
			lastName: 'OrderUtils',
			firstName: 'User',
		})
		jwtToken = jwt.sign(user, process.env.TOKEN_SECRET as string)
	})

	it('GET /current-user-order/:id => should get current order of a user if valid JWT is provided', async () => {
		const createdOrder = await orderStore.create({
			order_date: new Date(),
			user_id: user.id as number,
			status: OrderStatus.ACTIVE,
		})

		const response = await request
			.get(`/current-user-order/${user.id}`)
			.auth(jwtToken, { type: 'bearer' })

		expect(response.body.id as number).toEqual(createdOrder.id as number)
		expect(response.body.status).toEqual(createdOrder.status)
	})

	it('GET /current-user-order/:id => should fail if JWT is absent or invalid', async () => {
		await orderStore.create({
			order_date: new Date(),
			user_id: user.id as number,
			status: OrderStatus.ACTIVE,
		})

		const response = await request.get(`/current-user-order/${user.id}`)

		expect(response.status).toEqual(401)
	})

	it('GET /completed-user-orders/:id => should list completed orders if valid JWT is provided', async () => {
		const createdOrder = await orderStore.create({
			order_date: new Date(),
			user_id: user.id as number,
			status: OrderStatus.COMPLETE,
		})

		const response = await request
			.get(`/completed-user-orders/${user.id}`)
			.auth(jwtToken, { type: 'bearer' })

		expect(response.body.length).toEqual(1)
		expect(response.body[0].id).toEqual(createdOrder.id)
		expect(response.body[0].status).toEqual(OrderStatus.COMPLETE)
	})

	it('GET /completed-user-orders/:id => should fail if JWT is invalid or absent', async () => {
		await orderStore.create({
			order_date: new Date(),
			user_id: user.id as number,
			status: OrderStatus.COMPLETE,
		})

		const response = await request.get(`/completed-user-orders/${user.id}`)

		expect(response.status).toEqual(401)
	})
})

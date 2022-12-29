import supertest from 'supertest';
import app from '../../server';
import { Order, OrderStore } from '../../models/order';
import { OrderStatus } from '../../utils/enums/order-status';
import { User, UserStore } from '../../models/user';
import { Product, ProductStore } from '../../models/product';

describe('Orders endpoint test suite', () => {
	const request = supertest(app);
	const userStore = new UserStore();
	const orderStore = new OrderStore();
	const productStore = new ProductStore();

	let user: User;

	beforeAll(async () => {
		user = await userStore.create({
			username: 'order-endpoint-test',
			password: '123',
			firstName: 'Order',
			lastName: 'User',
		});
	});

	it('GET /orders => should list orders', async () => {
		const response = await request.get('/orders');
		expect(response.status).toEqual(200);
		expect(Array.isArray(response.body)).toBeTrue();
		expect(response.body.length).toBeGreaterThanOrEqual(0);
	});

	it('POST /orders => should create an order', async () => {
		let orderInfos: Order = {
			order_date: new Date(),
			status: OrderStatus.ACTIVE,
			user_id: user.id as number,
		};
		const response = await request.post('/orders').send(orderInfos);
		expect(response.status).toEqual(201);
		expect(response.body.status).toEqual(orderInfos.status);
		expect(response.body.user_id).toEqual(orderInfos.user_id);
		expect(response.body.id).toBeDefined();
	});

	it('PUT /orders/:id => should update an order', async () => {
		let order: Order = {
			user_id: user.id as number,
			order_date: new Date(),
			status: OrderStatus.ACTIVE,
		};
		const createdOrder = await orderStore.create(order);
		const updateInfos: Order = {
			user_id: createdOrder.user_id,
			status: OrderStatus.COMPLETE,
			order_date: new Date(),
		};
		const response = await request
			.put(`/orders/${createdOrder.id}`)
			.send(updateInfos);
		expect(response.status).toEqual(202);
		expect(response.body.id).toEqual(createdOrder.id);
		expect(response.body.status).toEqual(updateInfos.status);
	});

	it('GET /orders/:id/products => should get products in an order', async () => {
		let order: Order = {
			user_id: user.id as number,
			order_date: new Date(),
			status: OrderStatus.ACTIVE,
		};
		const createdOrder = await orderStore.create(order);
		const response = await request.get(`/orders/${createdOrder.id}/products`);
		expect(response.status).toEqual(200);
		expect(Array.isArray(response.body)).toBeTrue();
		expect(response.body.length).toBeGreaterThanOrEqual(0);
	});

	it('POST /orders/:id/products => should add a product to an order', async () => {
		let order: Order = {
			status: OrderStatus.ACTIVE,
			order_date: new Date(),
			user_id: user.id as number,
		};
		let product: Product = {
			name: 'Product 1',
			price: 19,
		};
		const createdOrder = await orderStore.create(order);
		const createdProduct = await productStore.create(product);


		let quantity = 10;
		const response = await request
			.post(`/orders/${createdOrder.id}/products`)
			.send({
				product_id: createdProduct.id,
				quantity: quantity,
			});

		expect(response.status).toEqual(201);
		expect(response.body.id).toBeDefined();
		expect(response.body.order_id).toBeDefined();
		expect(response.body.product_id).toBeDefined();
		expect(response.body.quantity).toBeDefined();
		expect(response.body.quantity).toEqual(quantity);
		expect(response.body.order_id).toEqual(createdOrder.id);
		expect(response.body.product_id).toEqual(createdProduct.id);
	});


});

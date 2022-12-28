import { Order, OrderStore } from '../../models/order';
import { User, UserStore } from '../../models/user';
import { OrderStatus } from '../../utils/enums/order-status';
import { ProductStore } from '../../models/product';

describe('Order  model test suite', () => {
	let store: OrderStore;
	let userStore: UserStore;
	let productStore: ProductStore;
	let user: User;

	beforeAll(async () => {
		store = new OrderStore();
		userStore = new UserStore();
		productStore = new ProductStore();

		const userDetails: User = {
			username: 'order_user',
			password: 'order_pass',
			firstName: 'Order firstname',
			lastName: 'Order lastname',
		};
		user = await userStore.create(userDetails);
	});

	it('should define an index method', () => {
		expect(store.index).toBeDefined();
	});

	it('index method should list orders', async () => {
		const result = await store.index();
		expect(Array.isArray(result)).toBeTrue()
		expect(result.length).toBeGreaterThanOrEqual(0)
	});

	it('should define a create method', () => {
		expect(store.create).toBeDefined();
	});

	it('create method should create a new order', async () => {
		const order: Order = {
			user_id: user.id as unknown as number,
			status: OrderStatus.ACTIVE,
			order_date: new Date(),
		};
		const createdOrder = await store.create(order);
		expect(createdOrder.user_id).toEqual(order.user_id);
		expect(createdOrder.order_date).toBeDefined();
		expect(createdOrder.status).toEqual(OrderStatus.ACTIVE);
	});

	it('should define an update method', () => {
		expect(store.update).toBeDefined();
	});

	it('update method should update an order', async () => {
		const order: Order = {
			order_date: new Date(),
			status: OrderStatus.ACTIVE,
			user_id: user.id as number,
		};
		const createdOrder = await store.create(order);
		createdOrder.status = OrderStatus.COMPLETE;
		const updatedOrder = await store.update(
			createdOrder.id as number,
			createdOrder
		);
		expect(updatedOrder.status).toEqual(OrderStatus.COMPLETE);
		expect(updatedOrder.order_date).toBeDefined();
		expect(updatedOrder.id).toEqual(createdOrder.id);
		expect(updatedOrder.user_id).toEqual(createdOrder.user_id);
	});

	it('should define a show method', () => {
		expect(store.show).toBeDefined();
	});

	it('show method should get an order back', async () => {
		const createdOrder = await store.create({
			user_id: user.id as number,
			order_date: new Date(),
			status: OrderStatus.ACTIVE,
		});
		const foundUser = await store.show(createdOrder.id as number);
		expect(foundUser.id).toEqual(createdOrder.id as number);
		expect(foundUser.user_id).toEqual(createdOrder.user_id);
		expect(foundUser.status).toEqual(createdOrder.status);
	});

	it('should define a addProduct method', () => {
		expect(store.addProduct).toBeDefined();
	});

	it('addProduct should add a product to an order', async () => {
		const createdOrder = await store.create({
			user_id: user.id as number,
			order_date: new Date(),
			status: OrderStatus.ACTIVE,
		});
		const createdProduct = await productStore.create({
			price: 10,
			name: 'Test product 1',
		});
		const quantity = 200;
		const orderProduct = await store.addProduct(
			createdOrder.id as number,
			createdProduct.id as number,
			quantity
		);

		expect(orderProduct).toEqual({
			id: orderProduct.id as number,
			product_id: createdProduct.id as number,
			order_id: createdOrder.id as number,
			quantity: quantity,
		});
	});

	it('should define an updateProduct method', () => {
		expect(store.updateProduct).toBeDefined();
	});

	it('updateProduct should update a product quantity', async () => {
		const order = await store.create({
			user_id: user.id as number,
			order_date: new Date(),
			status: OrderStatus.COMPLETE,
		});
		const product = await productStore.create({
			name: 'Product for update',
			price: 1,
		});

		const orderProduct = await store.addProduct(
			order.id as number,
			product.id as number,
			10
		);

		let quantity = 20;
		const updatedProduct = await store.updateProduct(
			order.id as number,
			product.id as number,
			quantity
		);

		expect(updatedProduct).toEqual({
			id: updatedProduct.id as number,
			quantity: quantity,
			order_id: orderProduct.order_id,
			product_id: orderProduct.product_id,
		});
	});

	it('should define a getProductDetail method', () => {
		expect(store.getProductDetail).toBeDefined();
	});

	it('getProductDetail should get product details', async () => {
		const order = await store.create({
			user_id: user.id as number,
			order_date: new Date(),
			status: OrderStatus.COMPLETE,
		});

		const product = await productStore.create({
			name: 'Details product',
			price: 15,
		});

		const orderedProduct = await store.addProduct(
			order.id as number,
			product.id as number,
			10
		);
		expect(
			await store.getProductDetail(order.id as number, product.id as number)
		).toEqual(orderedProduct);
	});

	it('should define a removeProduct method', () => {
		expect(store.removeProduct).toBeDefined();
	});

	it('removeProduct should remove a product from an order', async () => {
		const order = await store.create({
			order_date: new Date(),
			status: OrderStatus.COMPLETE,
			user_id: user.id as number,
		});
		const product = await productStore.create({
			name: 'Product to be removed',
			price: 28,
		});
		await store.addProduct(order.id as number, product.id as number, 18);

		expect(
			await store.isProductOrdered(order.id as number, product.id as number)
		).toBeTrue();

		await store.removeProduct(order.id as number, product.id as number);

		expect(
			await store.isProductOrdered(order.id as number, product.id as number)
		).toBeFalse();
	});
});

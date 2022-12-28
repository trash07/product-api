import { Order, OrderStore } from '../../models/order';
import { User, UserStore } from '../../models/user';
import { OrderStatus } from '../../utils/enums/order-status';

describe('Order  model test suite', () => {
	let store: OrderStore;
	let userStore: UserStore;
	let user: User;

	beforeAll(async () => {
		store = new OrderStore();
		userStore = new UserStore();

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
		expect(result).toEqual([]);
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


});

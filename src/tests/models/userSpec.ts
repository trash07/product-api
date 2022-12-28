import { UserStore } from '../../models/user';
import { AuthenticationQueries } from '../../services/queries/authentication';

describe('User model test suite', () => {
	const store = new UserStore();

	it('should define an index method', () => {
		expect(store.index).toBeDefined();
	});

	it('index method should find users', async () => {
		const users = await store.index();
		expect(Array.isArray(users)).toBeTrue();
		expect(users.length).toBeGreaterThanOrEqual(0);
	});

	it('should define a show method', () => {
		expect(store.show).toBeDefined();
	});

	it('show method should find a user by id', async () => {
		const user = await store.create({
			username: 'toshow',
			password: 'showpass',
			lastName: 'to',
			firstName: 'show',
		});
		const result = await store.show(user.id as number);
		expect(result).toEqual(user);
	});

	it('should define a create method', () => {
		expect(store.create).toBeDefined();
	});

	it('create method should create a new user that can authenticate', async () => {
		let password = 'tocreatepass';
		const createdUser = await store.create({
			username: 'tocreate',
			password: password,
			firstName: 'tocreate',
			lastName: 'tolast',
		});
		const authQueries = new AuthenticationQueries();
		const authenticationResult = await authQueries.authenticate(
			createdUser.username,
			password
		);
		expect(authenticationResult).toEqual(createdUser);
	});
});

import { UserStore } from '../../models/user';

describe('User model test suite', () => {
	const store = new UserStore();

	it('should define an index method', () => {
		expect(store.index).toBeDefined();
	});

	it('index method should find users', async () => {
		// Todo: write this test
		expect(false).toBeTrue();
	});

	it('should define a show method', () => {
		expect(store.show).toBeDefined();
	});

	it('should define a create method', () => {
		expect(store.create).toBeDefined();
	});

	// Todo: complete the specifications
});

import { Product, ProductStore } from '../../models/product';

describe('Product model test suite', () => {
	let store: ProductStore;

	beforeEach(() => {
		store = new ProductStore();
	});

	it('should define an index method', () => {
		expect(store.index).toBeDefined();
	});

	it('index method should list products', async () => {
		const items = await store.index();
		expect(items.length).toBeGreaterThanOrEqual(0);
		expect(Array.isArray(items)).toBeTrue();
	});

	it('should define a show method', () => {
		expect(store.show).toBeDefined();
	});

	it('show method should find a product', async () => {
		const product: Product = {
			name: 'Mango',
			price: 2,
		};
		const savedProduct = await store.create(product);
		expect(savedProduct).toEqual(await store.show(savedProduct.id as number));
	});

	it('show method should throw error on invalid id input', async () => {
		try {
			await store.show(-1);
			expect(false).toBeTruthy();
		} catch (err) {
			expect(`${err}`).toContain(`Could not find product of reference -1`);
		}
	});

	it('should define a create method', () => {
		expect(store.create).toBeDefined();
	});

	it('create method should create new products', async () => {
		const product: Product = {
			name: 'Aloes vera',
			price: 1,
		};
		const savedProduct = await store.create(product);
		product.id = savedProduct.id;
		expect(savedProduct).toEqual(product);
	});
});

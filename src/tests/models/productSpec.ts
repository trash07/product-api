import { Product, ProductStore } from '../../models/product'

describe('Product model test suite', () => {
	let store: ProductStore

	beforeEach(() => {
		store = new ProductStore()
	})

	it('should define an index method', () => {
		expect(store.index).toBeDefined()
	})

	it('index method should list products', async () => {
		const items = await store.index()
		expect(Array.isArray(items)).toBeTrue()
		expect(items.length).toBeGreaterThanOrEqual(0)
	})

	it('should define a show method', () => {
		expect(store.show).toBeDefined()
	})

	it('show method should find a product', async () => {
		const product: Product = {
			name: 'Mango',
			price: 2,
		}
		const savedProduct = await store.create(product)
		expect(savedProduct).toEqual(await store.show(savedProduct.id as number))
	})

	it('show method should throw error on invalid id input', async () => {
		try {
			await store.show(-1)
			expect(false).toBeTruthy()
		} catch (err) {
			expect(`${err}`).toContain(`Could not find product of reference -1`)
		}
	})

	it('should define a create method', () => {
		expect(store.create).toBeDefined()
	})

	it('create method should create new products', async () => {
		const product: Product = {
			name: 'Aloes vera',
			price: 1,
		}
		const savedProduct = await store.create(product)
		product.id = savedProduct.id
		expect(savedProduct).toEqual(product)
	})

	it('should define an update method', () => {
		expect(store.update).toBeDefined()
	})

	it('update method should update a product', async () => {
		const createdProduct = await store.create({
			name: 'Product Update',
			price: 12,
		})

		const updatedProduct = await store.update(createdProduct.id as number, {
			name: 'Product Update 1',
			price: 13,
		})

		expect(await store.show(createdProduct.id as number)).toEqual(
			updatedProduct
		)
	})

	it('should define a delete method', () => {
		expect(store.delete).toBeDefined()
	})

	it('delete method should delete a product', async () => {
		const createdProduct = await store.create({
			name: 'Mango',
			price: 45,
		})

		await store.delete(createdProduct.id as number)
		try {
			expect(await store.show(createdProduct.id as number))
			expect(false).toBeTrue()
		} catch (e) {
			expect(true).toBeTrue()
		}
	})
})

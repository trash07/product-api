import { User, UserStore } from '../../models/user'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import supertest from 'supertest'
import app from '../../server'
import { Product, ProductStore } from '../../models/product'

dotenv.config()

describe('Product endpoints test suite', () => {
	let user: User
	let jwtToken: string
	const userStore: UserStore = new UserStore()
	const productStore: ProductStore = new ProductStore()
	const request = supertest(app)

	beforeAll(async () => {
		user = await userStore.create({
			username: 'product-endpoint-test',
			password: '123',
			lastName: 'Test',
			firstName: 'Product endpoint accessor',
		})
		jwtToken = jwt.sign(user, process.env.TOKEN_SECRET as string)
	})

	it('GET /products => should list products', async () => {
		const response = await request.get('/products')
		expect(response.status).toEqual(200)
		expect(Array.isArray(response.body)).toBeTrue()
	})

	it('GET /products/:id => should get a product details', async () => {
		const createdProduct = await productStore.create({
			name: 'Product name',
			price: 16,
		})
		const response = await request.get(`/products/${createdProduct.id}`)
		expect(response.status).toEqual(200)
		expect(response.body).toEqual(createdProduct)
	})

	it('POST /products => should create a product if JWT and data is provided', async () => {
		const productData: Product = {
			name: 'Product to test creation',
			price: 14,
		}
		const response = await request
			.post('/products')
			.auth(jwtToken, { type: 'bearer' })
			.send(productData)
		productData.id = response.body.id
		expect(response.status).toEqual(201)
		expect(response.body).toEqual(productData)
	})

	it('POST /products => should not create a product if JWT is not provided', async () => {
		const productData: Product = {
			name: 'Product to test non creation',
			price: 19,
		}
		const response = await request.post('/products').send(productData)
		expect(response.status).toEqual(401)
	})

	it('PUT /products/:id => should update a product if JWT is provided', async () => {
		const createdProduct = await productStore.create({
			name: 'Product update',
			price: 1998,
		})

		const updateProductInfos: Product = {
			name: 'Product update 1',
			price: 2000,
		}
		const response = await request
			.put(`/products/${createdProduct.id}`)
			.auth(jwtToken, { type: 'bearer' })
			.send(updateProductInfos)

		expect(response.status).toEqual(202)
		expect(response.body.id).toEqual(createdProduct.id)
		expect(response.body.name).toEqual(updateProductInfos.name)
		expect(response.body.price).toEqual(updateProductInfos.price)
	})

	it('DELETE /products/:id => should delete a created product if JWT is provided', async () => {
		const createdProduct = await productStore.create({
			name: 'Drop product',
			price: 1999,
		})

		const response = await request
			.delete(`/products/${createdProduct.id}`)
			.auth(jwtToken, { type: 'bearer' })

		expect(response.status).toEqual(200)
		try {
			await productStore.show(createdProduct.id as number)
			expect(false).toBeTrue()
		} catch (e) {
			expect(true).toBeTrue()
		}
	})
})

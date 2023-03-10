import supertest from 'supertest'
import app from '../../server'
import { User, UserStore } from '../../models/user'
import dotenv from 'dotenv'

dotenv.config()

const request = supertest(app)
const store: UserStore = new UserStore()

describe('Authentication endpoints test suite', () => {
	it('POST /register => should  register a new user', async () => {
		// Send user data to the API
		const userDetails: User = {
			username: 'test',
			password: 'password',
			firstName: 'Test',
			lastName: 'Test',
		}
		const response = await request.post('/register').send(userDetails)

		// Expect positive response
		expect(response.status).toEqual(201)
	})

	it('POST /authenticate => should authenticate a registered user', async () => {
		// Register a user
		const userDetails: User = {
			username: 'test2',
			password: '123',
			lastName: 'Should',
			firstName: 'Authenticate',
		}
		await store.create(userDetails)

		// Authenticate the user against the API
		const response = await request
			.post('/authenticate')
			.send({ username: userDetails.username, password: userDetails.password })
		expect(response.status).toEqual(200)
	})
})

import { User, UserStore } from '../../models/user';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import app from '../../server';

dotenv.config();

describe('User endpoints test suite', () => {
	let jwtToken: string;
	let user: User;
	let userStore: UserStore = new UserStore();
	const request = supertest(app);

	beforeAll(async () => {
		user = await userStore.create({
			username: 'user-endpoint-test',
			password: '123',
			lastName: 'UserEndpoint',
			firstName: 'XXX',
		});
		jwtToken = jwt.sign(user, process.env.TOKEN_SECRET as string);
	});

	it('GET /users => should list users if JWT token is provided', async () => {
		const response = await request
			.get('/users')
			.auth(jwtToken, { type: 'bearer' });
		expect(response.status).toEqual(200);
		expect(Array.isArray(response.body)).toBeTrue();
	});

	it('GET /users => should fail if JWT token is not provided', async () => {
		const response = await request.get('/users');
		expect(response.status).toBe(401);
	});

	it('GET /users/:id => should show user details if JWT token and id are provided', async () => {
		const response = await request
			.get(`/users/${user.id}`)
			.auth(jwtToken, { type: 'bearer' });
		expect(response.status).toBe(200);
		expect(Array.isArray(response.body)).toBeFalse();
		expect(response.body.id).toEqual(user.id);
	});

	it('GET /users/:id => should fail if JWT token is not provided', async () => {
		const response = await request.get(`/users/${user.id}`);
		expect(response.status).toEqual(401);
	});

	it('POST /users => should create a new user if JWT and data is provided', async () => {
		const userData: User = {
			username: 'user-endpoint-test-1',
			password: '123',
			lastName: 'Test',
			firstName: 'User creation',
		};
		const response = await request
			.post('/users')
			.auth(jwtToken, { type: 'bearer' })
			.send(userData);
		expect(response.status).toEqual(201);
	});

	it('POST /users => should fail if JWT is not provided', async () => {
		const userData: User = {
			username: 'user-endpoint-test-2',
			password: '123',
			lastName: 'Test',
			firstName: 'User creation should fail',
		};
		const response = await request.post('/users').send(userData);
		expect(response.status).toEqual(401);
	});
});

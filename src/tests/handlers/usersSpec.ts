import { UserStore } from '../../models/user';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import app from '../../server';

dotenv.config();

describe('User endpoints test suite', () => {
	let jwtToken: string;
	let userStore: UserStore = new UserStore();
	const request = supertest(app);

	beforeAll(async () => {
		const user = await userStore.create({
			username: 'user-endpoint-test',
			password: '123',
			lastName: 'UserEndpoint',
			firstName: 'XXX',
		});
		jwtToken = jwt.sign(user, process.env.TOKEN_SECRET as string);
	});

	it('index endpoint should be accessible with JWT token', async () => {
		const response = await request
			.get('/users')
			.auth(jwtToken, { type: 'bearer' });
		expect(response.status).toEqual(200);
		expect(Array.isArray(response.body)).toBeTrue();
	});

	it('index endpoint should not be accessible if JWT token is not provided', async () => {
		const response = await request.get('/users');
		expect(response.status).toBe(401);
	});
});

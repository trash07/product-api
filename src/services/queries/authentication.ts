import client from '../../database'
import { User, UserStore } from '../../models/user'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

export class AuthenticationQueries {
	/**
	 * Authenticate a User with username and password
	 * @param username
	 * @param password
	 */
	async authenticate(username: string, password: string): Promise<User | null> {
		try {
			const conn = await client.connect()
			const sql = `SELECT * FROM users WHERE username = ($1)`
			const result = await conn.query(sql, [username])
			if (result.rowCount > 0) {
				const user = UserStore.convertItem(result.rows[0])
				const pepper = process.env.SALT
				const databasePassword = user.password
				if (bcrypt.compareSync(password + pepper, databasePassword)) {
					return user
				}
			}
			return null
		} catch (e) {
			throw new Error(`Could not authenticate user ${username}, ${e}`)
		}
	}
}

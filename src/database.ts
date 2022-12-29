import { Pool } from 'pg'
import dotenv from 'dotenv'
import { Environment } from './utils/enums/environment'

dotenv.config()

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_DB_TEST, ENV } =
	process.env

let client: Pool

if (ENV === Environment.TEST) {
	client = new Pool({
		user: POSTGRES_USER,
		password: POSTGRES_PASSWORD,
		database: POSTGRES_DB_TEST,
	})
}

if (ENV === Environment.PROD) {
	client = new Pool({
		user: POSTGRES_USER,
		password: POSTGRES_PASSWORD,
		database: POSTGRES_DB,
	})
}

// @ts-ignore
export default client

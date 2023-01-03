#! /usr/bin/env node
// https://blog.shahednasser.com/how-to-create-a-npx-tool/
// https://blog.deepgram.com/npx-script/

import yargs from 'yargs'
import dotenv from 'dotenv'
import { Pool, PoolClient } from 'pg'

dotenv.config()

/**
 * Connect to a database
 * @param username
 * @param password
 * @param database
 */
async function connectDatabase(
	username: string,
	password: string,
	database: string
): Promise<PoolClient> {
	const client = new Pool({
		user: username,
		password: password,
		database: database,
	})
	try {
		return await client.connect()
	} catch (e) {
		throw new Error(`Could not connect to database ${database}, ${e}`)
	}
}

const username = process.env.POSTGRES_USER as string
const password = process.env.POSTGRES_PASSWORD as string
const dbname = process.env.POSTGRES_DB_TEST as string
const defaultDatabase = 'template1'

// Step 1: connect to default database
connectDatabase(username, password, defaultDatabase)
	.then(async (template1Client: PoolClient) => {
		// @ts-ignore
		if (yargs.argv.create && yargs.argv.e === process.env.ENV) {
			console.log(`Creating test database ${dbname}`)
			const sql = `select exists(SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower('${dbname}'))`
			const result = await template1Client.query(sql)
			// @ts-ignore
			if (result.rows[0].exists) {
				console.log('database exists')
				const databaseClient = await connectDatabase(username, password, dbname)
				await databaseClient.query(
					`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
				)
				console.log(`Existing test database ${dbname} prepared for tests`)
			} else {
				await template1Client.query(`CREATE DATABASE ${dbname};`)
				console.log(`Test database ${dbname} created`)
			}
			process.exit(0)
		}

		// @ts-ignore
		if (yargs.argv.drop && yargs.argv.e === process.env.ENV) {
			// @see https://dba.stackexchange.com/questions/11893/force-drop-db-while-others-may-be-connected
			console.log(`Dropping test database ${dbname}`)
			const sql = `UPDATE pg_database SET datallowconn = 'false' WHERE datname = '${dbname}';  SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${dbname}';`
			await template1Client.query(sql)
			await template1Client.query(`DROP DATABASE ${dbname};`)
			console.log(`Test database ${dbname} dropped`)
			process.exit(0)
		}
	})
	.catch((e) => {
		console.log(e)
		process.exit(1)
	})

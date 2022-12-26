import client from '../database';

export type Product = {
	id?: number;
	name: string;
	price: number;
};

export class ProductStore {
	private table = `products`;

	/**
	 * List of Products
	 */
	async index(): Promise<Product[]> {
		try {
			const conn = await client.connect();
			const sql = `SELECT * FROM ${this.table}`;
			const result = await conn.query(sql);
			conn.release();
			return result.rows;
		} catch (e) {
			throw new Error(`Could not find products ${e}`);
		}
	}

	/**
	 * Show a product
	 * @param id
	 */
	async show(id: number): Promise<Product> {
		try {
			const conn = await client.connect();
			const sql = `SELECT * FROM ${this.table} WHERE id = ($1)`;
			const result = await conn.query(sql, [id]);
			conn.release();
			if (result.rowCount === 0) {
				throw new Error(`Could not find product of reference ${id}`);
			}
			return result.rows[0];
		} catch (e) {
			throw new Error(`Could not fetch product ${e}`);
		}
	}

	/**
	 * Create a product
	 * @param product
	 */
	async create(product: Product): Promise<Product> {
		try {
			const conn = await client.connect();
			const sql = `INSERT INTO ${this.table} (name, price) VALUES ($1, $2) RETURNING *`;
			const result = await conn.query(sql, [product.name, product.price]);
			conn.release();
			return result.rows[0] as Product;
		} catch (e) {
			throw new Error(`Could not create product ${e}`);
		}
	}
}

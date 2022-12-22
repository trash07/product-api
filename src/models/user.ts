import client from "../database";

export type User = {
    id?: number,
    firstName: string,
    lastName: string,
    password: string
}


export class UserStore {
    /**
     * Get Users
     */
    async index(): Promise<User[]> {
        try {
            const conn = await client.connect()
            const sql = "SELECT * FROM users"
            const result = await conn.query(sql);
            await conn.release()
            return  (result.rows.length > 0) ?
                 result.rows.map(UserStore.convertItem) : []
        } catch (e) {
            throw new Error(`Could not list users ${e}`)
        }
    }


    /**
     * Get a User infos
     * @param id
     */
    async show(id: number): Promise<User|null> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT * FROM users WHERE id = ($1)'
            const result = await conn.query(sql, [id])
            return (result.rows.length > 0) ?
                UserStore.convertItem(result.rows[0]) : null;
        } catch (e) {
            throw new Error(`Could not find user of reference ${id}, ${e}`);
        }
    }


    /**
     * Create a User
     * @param user
     */
    async create(user: User): Promise<User|null> {
        try {
            // Todo: encode password with salt before saving into database
            const conn = await client.connect()
            const sql = 'INSERT INTO users(first_name, last_name, password) VALUES ($1, $2, $3) RETURNING *'
            const result = await conn.query(sql)
            conn.release();
            return (result.rowCount > 0) ?
                UserStore.convertItem(result.rows[0]) : null
        } catch (e) {
            throw new Error(`Could not create user ${e}`);
        }
    }

    /**
     * Convert a database line to an User type
     * @param item
     * @private
     */
    private static convertItem(item: {id?: number, first_name: string, last_name: string, password: string}): User {
        return {
            id: item.id,
            firstName: item.first_name,
            lastName: item.last_name,
            password: item.password
        }
    }
}

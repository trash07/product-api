import client from "../database";
import dotenv from "dotenv";
import bcrypt from "bcrypt"

dotenv.config()

export type User = {
    id?: number,
    firstName: string,
    lastName: string,
    password: string,
    username: string,
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
    async create(user: User): Promise<User> {
        try {
            const conn = await client.connect()
            const pepper = process.env.SALT
            const rounds = process.env.ROUNDS as unknown as string
            const hash = bcrypt.hashSync(
                user.password + pepper,
                parseInt(rounds)
            );
            const sql = 'INSERT INTO users(first_name, last_name, password, username) VALUES ($1, $2, $3, $4) RETURNING *'
            const result = await conn.query(sql, [user.firstName, user.lastName, hash, user.username])
            conn.release();
            return UserStore.convertItem(result.rows[0])
        } catch (e) {
            throw new Error(`Could not create user ${e}`);
        }
    }

    /**
     * Convert a database line to an User type
     * @param item
     * @private
     */
    static convertItem(item: {id?: number, first_name: string, last_name: string, password: string, username: string}): User {
        return {
            id: item.id,
            firstName: item.first_name,
            lastName: item.last_name,
            password: item.password,
            username: item.username
        }
    }
}



// AUTHENTICATE

// async authenticate(username: string, password: string): Promise<User | null> {
//     const conn = await Client.connect()
//     const sql = 'SELECT password_digest FROM users WHERE username=($1)'
//
//     const result = await conn.query(sql, [username])
//
//     console.log(password+pepper)
//
//     if(result.rows.length) {
//
//     const user = result.rows[0]
//
//     console.log(user)
//
//     if (bcrypt.compareSync(password+pepper, user.password_digest)) {
//         return user
//     }
// }
//
// return null
// }

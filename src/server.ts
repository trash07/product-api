import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { productRoutes } from './handlers/products'
import { userRoutes } from './handlers/users'
import { authenticationRoutes } from './handlers/authentication'
import { orderRoutes } from './handlers/orders'

const app: express.Application = express()
const address = '0.0.0.0:3000'

app.use(bodyParser.json())

app.get('/', function (req: Request, res: Response) {
	res.send('Hello World!')
})

userRoutes(app)
orderRoutes(app)
productRoutes(app)
authenticationRoutes(app)

app.listen(3000, function () {
	console.log(`starting app on: ${address}`)
})

export default app

import { createRandomProduct } from '../utils/createRandom.utils.js'

// Router imports para Views
import ViewsRouter from '../router/views.routes.js'

// Router imports para File System
import FSProductRouter from '../router/fileSystem/products.routes.js'
import FSCartRouter from '../router/fileSystem/carts.routes.js'

// Router imports para MongoDB
import ProductsRouter from '../router/products.routes.js'
import CartsRouter from '../router/carts.routes.js'
import MessagesRouter from '../router/messages.routes.js'
import SessionsRouter from '../router/sessions.routes.js'
import CategoriesRouter from '../router/category.routes.js'
import UsersRouter from '../router/users.routes.js'

// Otros router imports
import EmailsRouter from '../router/email.routes.js'
import { validateToken } from '../utils/jwt.utils.js'
import config from './environment.config.js'

const registerRoutes = (app) => {
	try {
		// Rutas para views
		app.use('/', ViewsRouter)

		// Rutas para File System
		app.use('/api/fs/products', FSProductRouter)
		app.use('/api/fs/cart', FSCartRouter)

		// Rutas para MongoDB
		app.use('/api/products', ProductsRouter)
		app.use('/api/categories', CategoriesRouter)
		app.use('/api/cart', CartsRouter)
		app.use('/api/users', UsersRouter)
		app.use('/api/messages', MessagesRouter)
		app.use('/api/sessions', SessionsRouter)

		// Otras rutas
		app.use('/', EmailsRouter)

		app.get('/mockingproducts', async (req, res, next) => {
			try {
				let products = []
				for (let i = 0; i < 100; i++) {
					products.push(createRandomProduct())
				}
				res.send(products)
			} catch (error) {
				next(error)
			}
		})

		// Ruta para probar loggers
		app.get('/loggerTest', (req, res) => {
			req.logger.debug('Debug log')
			req.logger.http('HTTP log')
			req.logger.info('Info log')
			req.logger.warning('Warning log')
			req.logger.error('Error log')
			req.logger.fatal('Fatal log')
			
			res.send({ message: 'Los logs se han registrado correctamente' })
		})
	} catch (error) {
		throw new Error('No se pudieron registrar las rutas: ' + error.message)
	}
}

export default registerRoutes

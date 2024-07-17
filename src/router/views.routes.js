import { Router } from 'express'

import FSProductManager from '../dao/memory/products.memory.js'
import ProductsModel from '../dao/mongo/models/products.model.js'
import CartsModel from '../dao/mongo/models/carts.model.js'
import paginateFormat from '../paginateFormat.js'
import { requireAuth, redirectIfLoggedIn } from '../middlewares/auth.middleware.js'
import { passportCall, validateToken } from '../utils/jwt.utils.js'
import UserManager from '../dao/mongo/users.mongo.js'

const router = Router()

const usersMngr = new UserManager()
const FSProductMngr = new FSProductManager('src/dao/memory/data/products.json')
const getFSProducts = FSProductMngr.get()

// File System routes
router.get('/home', async (req, res) => {
	// Cambié a /home para que no haya conflicto con el home de la nueva entrega
	let limit = parseInt(req.query.limit)

	try {
		const allProducts = await getFSProducts
		let productLimit = allProducts

		if (limit) {
			productLimit = allProducts.slice(0, limit)
		}

		res.render('homeFS', {
			title: 'Home',
			style: 'home.css',
			products: productLimit,
			auth: req.isAuthenticated(),
		})
	} catch (error) {
		return res.status(500).send({ error: 'Error al obtener productos' })
	}
})

router.get('/realtimeproducts', async (req, res) => {
	try {
		let allProducts = await getFSProducts

		res.render('realTimeProducts', {
			title: 'Real time Products',
			style: 'realTimeProducts.css',
			products: allProducts,
			auth: req.isAuthenticated(),
		})
	} catch (error) {
		return res.status(500).send({ error: 'Error al obtener productos' })
	}
})

// MongoDB routes
router.get('/products', passportCall('current'), async (req, res) => {
	const options = {
		page: parseInt(req.query.page) || 1,
		limit: parseInt(req.query.limit) || 10,
		sort: req.query.sort ? { price: req.query.sort } : null,
	}
	const query = req.query.query ? JSON.parse(req.query.query) : {}

	try {
		let result = await ProductsModel.paginate(query, options)

		let paginatedProducts = paginateFormat(result, '/products')

		res.render('allProducts', {
			title: 'Products',
			style: 'allProducts.css',
			products: JSON.parse(JSON.stringify(paginatedProducts.payload)),
			totalPages: paginatedProducts.totalPages,
			page: paginatedProducts.page,
			user: req.user.user,
			auth: req.isAuthenticated(),
		})
	} catch (error) {
		return res.status(500).send({ error: 'Error al obtener productos' })
	}
})

router.get('/products/:id', passportCall('current'), async (req, res) => {
	const id = req.params.id

	try {
		const product = await ProductsModel.findById(id).lean()

		if (!product) {
			return res.status(404).send({ error: 'Producto no encontrado' })
		}

		res.render('singleProduct', {
			title: product.title,
			style: '../../css/singleProduct.css',
			product: product,
			auth: req.isAuthenticated(),
		})
	} catch (error) {
		return res.status(500).send({ error: 'Error al obtener producto' })
	}
})

router.get('/carts/:cid', passportCall('current'), async (req, res) => {
	const id = req.params.cid

	try {
		const cart = await CartsModel.findById(id).lean()

		if (!cart) {
			return res.status(404).send({ error: 'Carrito no encontrado' })
		}

		const products = cart.products

		const total = products.reduce((acc, p) => acc + p.product.price * p.quantity, 0)

		res.render('cart', {
			title: 'Carrito',
			style: '../../css/cart.css',
			products: products,
			total,
			auth: req.isAuthenticated(),
		})
	} catch (error) {
		return res.status(500).send({ error: 'Error al obtener carrito' })
	}
})

router.get('/register', passportCall('current'), redirectIfLoggedIn, (req, res) => {
	res.render('register')
})

router.get('/login', passportCall('current'), redirectIfLoggedIn, (req, res) => {
	res.render('login', {
		emailsend: req.query.emailsend,
		success: req.query.success,
	})
})

router.get('/logout', passportCall('current'), requireAuth, (req, res) => {
	res.redirect('/login')
})

router.get('/profile', passportCall('current'), requireAuth, (req, res) => {
	res.render('profile', {
		user: req.user.user,
		auth: req.isAuthenticated(),
	})
})

router.get('/', passportCall('current'), requireAuth, (req, res) => {
	res.render('index', {
		user: req.user.user,
		auth: req.isAuthenticated(),
	})
})

router.get('/restore', passportCall('current'), (req, res) => {
	res.render('restore', {
		title: 'Restore password',
		style: '../../css/restore.css',
		auth: req.isAuthenticated(),
	})
})

router.get('/reset-password/:token', passportCall('current'), async (req, res, next) => {
	try {
		const { token } = req.params

		const decodedToken = validateToken(token)
		if (!decodedToken) return res.redirect('/forgot-password?error=token')

		const email = decodedToken.user.email
		const actualUser = await usersMngr.getBy({ email })
		if (actualUser.password != decodedToken.user.password) return res.redirect('/forgot-password?error=token')

		res.render('resetPassword', {
			title: 'Reset password',
			style: '../../css/reset.css',
			auth: req.isAuthenticated(),
			error: req.query.error,
		})
	} catch (error) {
		next(error)
	}
})

router.get('/forgot-password', passportCall('current'), (req, res, next) => {
	try {
		const error = req.query.error
	
		res.render('forgotPassword', {
			title: 'Forgot password',
			style: '../../css/forgot.css',
			auth: req.isAuthenticated(),
			error,
		})
	} catch (error) {
		next(error)
	}
})

export default router

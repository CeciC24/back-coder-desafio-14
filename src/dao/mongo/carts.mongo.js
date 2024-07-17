import CartsRepository from '../../repositories/carts.repository.js'
import CustomError from '../../utils/customError.utils.js'
import ErrorTypes from '../../utils/errorTypes.utils.js'
import Validate from '../../utils/validate.utils.js'
import ProductManager from './products.mongo.js'
import TicketsManager from './tickets.mongo.js'

const ProductMngr = new ProductManager()
const TicketMngr = new TicketsManager()

export default class CartManager {
	constructor() {
		this.repository = new CartsRepository()
	}

	async create(newCart = { products: [] }) {
		try {
			return await this.repository.create(newCart)
		} catch (error) {
			CustomError.createError({
				name: 'Error al crear carrito',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}

	async get() {
		try {
			return await this.repository.find()
		} catch (error) {
			CustomError.createError({
				name: 'Error al obtener carritos',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}

	async getById(id) {
		try {
			Validate.id(cid, 'carrito')
			await Validate.existID(cid, CartMngr, 'carrito')
			return await this.repository.findById(id)
		} catch (error) {
			CustomError.createError({
				name: 'Error al obtener carrito',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}

	async addProductToCart(cid, pid) {
		Validate.id(cid, 'carrito')
		await Validate.existID(cid, CartMngr, 'carrito')
		Validate.id(pid, 'producto')
		await Validate.existID(pid, ProductMngr, 'producto')

		let cart = await this.getById(cid)
		let product = await ProductMngr.getById(pid)

		if (cart) {
			if (product) {
				let productInCart = cart.products.find((p) => p.product._id == pid)

				if (productInCart) {
					productInCart.quantity += 1
				} else {
					cart.products.push({ product: pid, quantity: 1 })
				}
			} else {
				CustomError.createError({
					name: 'Error al agregar producto al carrito',
					message: 'Producto no encontrado',
					code: ErrorTypes.ERROR_NOT_FOUND,
					cause: `Producto ID: ${pid} no encontrado`,
				})
			}
		} else {
			CustomError.createError({
				name: 'Error al agregar producto al carrito',
				message: 'Carrito no encontrado',
				code: ErrorTypes.ERROR_NOT_FOUND,
				cause: `Carrito ID: ${cid} no encontrado`,
			})
		}

		return await cart.save()
	}

	async deleteProductFromCart(cid, pid) {
		Validate.id(cid, 'carrito')
		await Validate.existID(cid, CartMngr, 'carrito')
		Validate.id(pid, 'producto')
		await Validate.existID(pid, ProductMngr, 'producto')
		
		let cart = await this.getById(cid)

		if (cart) {
			let productInCart = cart.products.find((p) => p.product._id == pid)

			if (productInCart) {
				if (productInCart.quantity > 1) {
					productInCart.quantity -= 1
				} else {
					cart.products.pull(productInCart)
				}
			} else {
				CustomError.createError({
					name: 'Error al eliminar producto del carrito',
					message: 'Producto no encontrado',
					code: ErrorTypes.ERROR_NOT_FOUND,
					cause: `Producto ID: ${pid} no encontrado en Carrito ID: ${cid}`,
				})
			}
		} else {
			CustomError.createError({
				name: 'Error al eliminar producto del carrito',
				message: 'Carrito no encontrado',
				code: ErrorTypes.ERROR_NOT_FOUND,
				cause: `Carrito ID: ${cid} no encontrado`,
			})
		}

		return await cart.save()
	}

	async update(cid, newCartProducts) {
		Validate.id(cid, 'carrito')
		await Validate.existID(cid, CartMngr, 'carrito')

		try {
			const cart = await this.getById(cid)
			await this.empty(cart._id)

			cart.products = newCartProducts

			return await cart.save()
		} catch (error) {
			CustomError.createError({
				name: 'Error al actualizar carrito',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}

	async updateProductInCart(cid, pid, newQuantity) {
		Validate.id(cid, 'carrito')
		await Validate.existID(cid, CartMngr, 'carrito')
		Validate.id(pid, 'producto')
		await Validate.existID(pid, ProductMngr, 'producto')

		let cart = await this.getById(cid)
		let product = await ProductMngr.getById(pid)

		if (cart) {
			if (product) {
				let productInCart = cart.products.find((p) => p.product._id == pid)

				if (productInCart) {
					productInCart.quantity = newQuantity.quantity
				} else {
					CustomError.createError({
						name: 'Error al actualizar producto en carrito',
						message: 'Producto no encontrado',
						code: ErrorTypes.ERROR_NOT_FOUND,
						cause: `Producto ID: ${pid} no encontrado en Carrito ID: ${cid}`,
					})
				}
			} else {
				CustomError.createError({
					name: 'Error al actualizar producto en carrito',
					message: 'Producto no encontrado',
					code: ErrorTypes.ERROR_NOT_FOUND,
					cause: `Producto ID: ${pid} no encontrado`,
				})
			}
		} else {
			CustomError.createError({
				name: 'Error al actualizar producto en carrito',
				message: 'Carrito no encontrado',
				code: ErrorTypes.ERROR_NOT_FOUND,
				cause: `Carrito ID: ${cid} no encontrado`,
			})
		}

		return await cart.save()
	}

	async empty(id) {
		Validate.id(cid, 'carrito')
		await Validate.existID(cid, CartMngr, 'carrito')

		try {
			let emptyCart = await this.repository.updateById(id, { products: [] })
			return await emptyCart.save()
		} catch (error) {
			CustomError.createError({
				name: 'Error al vaciar carrito',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}

	async purchaseCart(id, user) {
		Validate.id(cid, 'carrito')
		await Validate.existID(cid, CartMngr, 'carrito')
		
		try {
			let cart = await this.getById(id)
			let products = cart.products

			let amountPurchased = 0
			let productsNotPurchased = []

			products.forEach(async (product) => {
				try {
					await ProductMngr.purchase(product.product.id, product.quantity)
					amountPurchased += product.product.price * product.quantity
				} catch (error) {
					productsNotPurchased.push({ product: product.product.id, quantity: product.quantity })
				}
			})

			TicketMngr.create({ amount: amountPurchased, purchaser: user.email })

			await this.update(id, productsNotPurchased)

			if (productsNotPurchased.length > 0) {
				return (
					`No se pudo realizar la compra de los siguientes productos: ` +
					productsNotPurchased.map((p) => p.product)
				)
			}

			return await this.getById(id)
		} catch (error) {
			CustomError.createError({
				name: 'Error al realizar compra',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}
}

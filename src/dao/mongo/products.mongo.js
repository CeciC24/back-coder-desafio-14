import ProductsRepository from '../../repositories/products.repository.js'
import paginateFormat from '../../paginateFormat.js'
import CustomError from '../../utils/customError.utils.js'
import ErrorTypes from '../../utils/errorTypes.utils.js'

export default class ProductManager {
	constructor() {
		this.repository = new ProductsRepository()
	}

	async create(newProduct) {
		try {
			return await this.repository.create(newProduct)
		} catch (error) {
			CustomError.createError({
				name: 'Error al crear producto',
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
				name: 'Error al obtener productos',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}

	async getById(id) {
		try {
			return await this.repository.findById(id)
		} catch (error) {
			CustomError.createError({
				name: 'Error al obtener producto',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}

	async getByCode(code) {
		try {
			return await this.repository.findOne(code)
		} catch (error) {
			CustomError.createError({
				name: 'Error al obtener producto',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}

	async update(id, productData) {
		try {
			await this.repository.updateOne(id, productData)
			return await this.repository.findById(id)
		} catch (error) {
			CustomError.createError({
				name: 'Error al actualizar producto',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}

	async delete(id) {
		try {
			return await this.repository.findByIdAndDelete(id)
		} catch (error) {
			CustomError.createError({
				name: 'Error al eliminar producto',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}

	async getAllWithCategories() {
		try {
			return await this.repository.findWithCategories()
		} catch (error) {
			CustomError.createError({
				name: 'Error al obtener productos',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}

	async getPaginated(page, limit, sort, query, populate = null) {
		try {
			const options = {
				page: page || 1,
				limit: limit || 10,
				sort: sort ? { price: sort } : null,
				populate: populate ? populate : null,
			}
			const result = await this.repository.paginate(query, options)

			const products = paginateFormat(result, '/products')
			return products
		} catch (error) {
			CustomError.createError({
				name: 'Error al obtener productos paginados',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}

	async purchase(id, quantity) {
		const product = await this.repository.findById(id)
		if (!product) {
			CustomError.createError({
				name: 'Error al comprar producto',
				code: ErrorTypes.ERROR_NOT_FOUND,
				cause: 'Producto no encontrado',
			})
		}
		if (product.stock < quantity) {
			CustomError.createError({
				name: 'Error al comprar producto',
				code: ErrorTypes.ERROR_DATA,
				cause: 'No hay stock suficiente',
			})
		}
		product.stock -= quantity
		await product.save()
		return product
	}
}

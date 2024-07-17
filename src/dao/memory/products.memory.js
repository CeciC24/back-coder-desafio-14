import fs from 'fs'
import { nanoid } from 'nanoid'

class ProductManager {
	constructor(path) {
		this.path = path
		this.products = []
	}

	async create(productToAdd) {
		if (fs.existsSync(this.path)) {
			this.products = await this.get()
			const search = this.products.find((product) => product.code === productToAdd.code)

			if (search) {
				throw new Error("⚠️  No se pudo agregar el producto. El campo 'code' ya existe.")
			} else if (!this.isValid(productToAdd)) {
				throw new Error('⚠️  No se pudo agregar el producto. Faltan campos.')
			}
		}

		const productSaved = await this.saveProduct({ id: nanoid(), status: true, ...productToAdd }) 

		return productSaved
	}

	async isValid(product) {
		if (
			(!product.title ||
				!product.description ||
				!product.code ||
				!product.price ||
				!product.stock ||
				!product.category) &&
			!Object.values(product).every((field) => field !== null && field !== undefined)
		) {
			return false
		}

		return true
	}

	async saveProduct(productToSave) {
		this.products.push(productToSave)
		await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'))

		return productToSave
	}

	async get() {
		if (fs.existsSync(this.path)) {
			let response = await fs.promises.readFile(this.path, 'utf-8')
			return JSON.parse(response)
		} else {
			return []
		}
	}

	async getById(id) {
		let search = this.exists(id)

		if (search) {
			return search
		} else {
			throw new Error(`⚠️  ID: ${id} Not found`)
		}
	}

	async update(id, field) {
		let oldProduct = await this.getById(id)

		await this.delete(id)

		let newProduct = { ...oldProduct, ...field }

		const updatedProduct = await this.saveProduct(newProduct)

		return updatedProduct
	}

	async delete(id) {
		this.products = await this.get()
		let filter = this.products.filter((product) => product.id !== id)

		if (filter.length === this.products.length) {
			throw new Error(`⚠️  ID: ${id} Not found`)
		}

		await fs.promises.writeFile(this.path, JSON.stringify(filter, null, '\t'))

		this.products = await this.get()
	}

	async exists(id) {
		let response = await this.get()
		let search = response.find((product) => product.id === id)

		return search
	}
}

export default ProductManager

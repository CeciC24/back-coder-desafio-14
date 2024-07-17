import fs from 'fs'
import { nanoid } from 'nanoid'
import ProductManager from './products.memory.js'

const AllProducts = new ProductManager('src/dao/memory/data/products.json')

class FSCartManager {
	constructor(path) {
		this.path = path
		this.carts = []
	}

	async create() {
        this.carts = await this.get()

		const cartSaved = await this.saveCart({id: nanoid(), products: []}, ...this.carts)

		return cartSaved
	}
    
	async saveCart(cartToSave) {
        this.carts.push(cartToSave)
		await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'))

		return cartToSave
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
		let response = await this.get()
		let search = response.find(cart => cart.id === id)

		if (search) {
			return search.products
		} else {
			throw new Error(`⚠️  Cart ID: ${id} Not found`)
		}
	}

    async addProductToCart(cid, pid) {
        let cart = await this.exists(cid)
        let product = await AllProducts.exists(pid)

        if (cart && product) {
            let prodIndex = cart.products.findIndex(prod => prod.id === pid)

            if (prodIndex !== -1) {
                cart.products[prodIndex].quantity++
    
            } else {
                cart.products.push({id: pid, quantity: 1})
            }

            await this.update(cart)
        }
    }

	async update(cart) {
		await this.delete(cart.id)
		const updatedCart = await this.saveCart(cart)

		return updatedCart
	}

	async delete(id) {
        this.carts = await this.get()
		let filter = this.carts.filter(cart => cart.id !== id)

		if (filter.length === this.carts.length) {
			throw new Error(`⚠️  Cart ID: ${id} Not found`)
		}

		await fs.promises.writeFile(this.path, JSON.stringify(filter, null, '\t'))

		this.carts = await this.get()
	}

    async exists(id) {
		let response = await this.get()
		let search = response.find(cart => cart.id === id)

		return search
	}
}

export default FSCartManager

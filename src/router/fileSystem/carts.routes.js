import { Router } from 'express'
import CartManager from '../../dao/memory/carts.memory.js'

const CartMngr = new CartManager('src/dao/memory/data/carts.json')
const CartRouter = Router()

CartRouter.post('/', async (req, res) => {
	try {
		res.send(await CartMngr.create())
	} catch (error) {
		res.status(500).send({ error: 'Error al crear carrito' })
	}
})

CartRouter.get('/', async (req, res) => {
	try {
		res.send(await CartMngr.get())
	} catch (error) {
		res.status(500).send({ error: 'Error al obtener carritos' })
	}
})

CartRouter.get('/:cid', async (req, res) => {
	let cid = req.params.cid

	try {
		res.send(await CartMngr.getById(cid))
	} catch (error) {
		res.status(404).send({ error: 'Carrito no encontrado' })
	}
})

CartRouter.post('/:cid/product/:pid', async (req, res) => {
	let cid = req.params.cid
	let pid = req.params.pid

	try {
		res.send(await CartMngr.addProductToCart(cid, pid))
	} catch (error) {
		res.status(500).send({ error: 'Error al agregar producto al carrito' })
	}
})

export default CartRouter

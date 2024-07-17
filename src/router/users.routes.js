import { Router } from 'express'
import UserManager from '../dao/mongo/users.mongo.js'
import UserDTO from '../dao/DTOs/user.dto.js'

import Validate from '../utils/validate.utils.js'

const UsersRouter = Router()

const UserMngr = new UserManager()

// Obtener todos los usuarios
UsersRouter.get('/', async (req, res, next) => {
	try {
		const users = await UserMngr.get()
		res.status(200).json({ users })
	} catch (error) {
		next(error)
	}
})

// Obtener un usuario por su ID
UsersRouter.get('/:id', async (req, res, next) => {
	try {
		const { id } = req.params
		Validate.id(id, 'usuario')
		Validate.existID(id, UserMngr, 'usuario')
		res.status(200).send(await UserMngr.getById(id))
	} catch (error) {
		next(error)
	}
})

// Crear un nuevo usuario
UsersRouter.post('/', async (req, res, next) => {
	try {
		const userData = req.body
		const newUser = new UserDTO(userData)
		const result = await UserMngr.create(newUser)
		res.status(201).json({ result })
	} catch (error) {
		next(error)
	}
})

// Actualizar un usuario existente
UsersRouter.put('/:id', async (req, res, next) => {
	const { id } = req.params
	const updatedUser = req.body

	try {
		Validate.id(id, 'usuario')
		Validate.existID(id, UserMngr, 'usuario')
		res.status(200).send(await UserMngr.update(id, updatedUser))
	} catch (error) {
		next(error)
	}
})

// Eliminar un usuario por su ID
UsersRouter.delete('/:id', async (req, res, next) => {
	try {
		const { id } = req.params
		Validate.id(id, 'usuario')
		Validate.existID(id, UserMngr, 'usuario')
		res.status(200).json(await UserMngr.delete(id))
	} catch (error) {
		next(error)
	}
})

export default UsersRouter

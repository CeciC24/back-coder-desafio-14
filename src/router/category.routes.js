import { Router } from 'express'
import CategoryManager from '../dao/mongo/categories.mongo.js'

const CategoriesRouter = Router()
const categoryMngr = new CategoryManager()

CategoriesRouter.get('/', async (req, res, next) => {
	try {
		res.status(201).json(await categoryMngr.get())
	} catch (error) {
		next(error)
	}
})

CategoriesRouter.get('/:id', async (req, res, next) => {
	const categoryId = req.params.id
	
	try {
		res.status(201).json(await categoryMngr.getById(categoryId))
	} catch (error) {
		next(error)
	}
})

CategoriesRouter.post('/', async (req, res, next) => {
	const categoryData = req.body

	try {
		res.status(201).json(await categoryMngr.create(categoryData))
	} catch (error) {
		next(error)
	}
})

CategoriesRouter.put('/:id', async (req, res, next) => {
	const categoryId = req.params.id

	try {
		res.status(201).json(await categoryMngr.update(categoryId, req.body))
	} catch (error) {
		next(error)
	}
})

CategoriesRouter.delete('/:id', async (req, res, next) => {
	const categoryId = req.params.id

	try {
		res.status(201).json(await categoryMngr.delete(categoryId))
	} catch (error) {
		next(error)
	}
})

export default CategoriesRouter

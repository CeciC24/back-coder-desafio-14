import { Router } from 'express'
import MessagesManager from '../dao/mongo/messages.mongo.js'

import { authorization } from '../middlewares/auth.middleware.js'
import { passportCall } from '../utils/jwt.utils.js'

const MsgManager = new MessagesManager()
const MessagesRouter = Router()

MessagesRouter.get('/', async (req, res, next) => {
	try {
		res.status(200).send(await MsgManager.get())
	} catch (error) {
		next(error)
	}
})

MessagesRouter.get('/:mid', async (req, res, next) => {
	let mid = req.params.mid

	try {
		res.status(200).send(await MsgManager.getById(mid))
	} catch (error) {
		next(error)
	}
})

MessagesRouter.post('/', passportCall('current'), authorization('user'), async (req, res, next) => {
	let messageData = req.body

	try {
		res.status(200).send(await MsgManager.create(messageData))
	} catch (error) {
		next(error)
	}
})

export default MessagesRouter

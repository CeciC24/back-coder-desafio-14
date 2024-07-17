import MessagesRepository from '../../repositories/messages.repository.js'
import CustomError from '../../utils/customError.utils.js'
import ErrorTypes from '../../utils/errorTypes.utils.js'
import Validate from '../../utils/validate.utils.js'
import MessageDTO from '../DTOs/message.dto.js'

export default class MessagesManager {
	constructor() {
		this.repository = new MessagesRepository()
	}

	async create(messageData) {
		try {
			const newMessage = new MessageDTO(messageData)
			return await this.repository.create(newMessage)
		} catch (error) {
			CustomError.createError({
				name: 'Error al crear mensaje',
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
				name: 'Error al obtener mensajes',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}

	async getById(id) {
		Validate.id(mid, 'mensaje')
		await Validate.existID(mid, MsgManager, 'mensaje')

		try {
			return await this.repository.findById(id)
		} catch (error) {
			CustomError.createError({
				name: 'Error al obtener mensaje de ID ' + id,
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}
}

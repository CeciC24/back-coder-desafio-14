import TicketsRepository from '../../repositories/tickets.repository.js'
import CustomError from '../../utils/customError.utils.js'

export default class TicketsManager {
	constructor() {
		this.repository = new TicketsRepository()
	}

	async create(newTicket) {
		try {
			return await this.repository.create(newTicket)
		} catch (error) {
			CustomError.createError({
				name: 'Error al crear ticket',
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
				name: 'Error al obtener tickets',
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
				name: 'Error al obtener ticket',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}
}

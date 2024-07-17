import TicketsModel from "../dao/mongo/models/tickets.model.js"

export default class TicketsRepository {
    async create(newTicket) {
        return await TicketsModel.create(newTicket)
    }

    async find() {
        return await TicketsModel.find()
    }

    async findById(id) {
        return await TicketsModel.findById(id)
    }
}
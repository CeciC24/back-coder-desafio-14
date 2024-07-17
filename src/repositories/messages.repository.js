import MessagesModel from "../dao/mongo/models/messages.model.js"

export default class MessagesRepository {
    async create(newMessage) {
        return await MessagesModel.create(newMessage)
    }

    async find() {
        return await MessagesModel.find()
    }

    async findById(id) {
        return await MessagesModel.findById(id)
    }
}
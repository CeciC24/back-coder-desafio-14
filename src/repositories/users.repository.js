import UsersModel from "../dao/mongo/models/users.model.js"

export default class UsersRepository {
    async create(userData) {
        return await UsersModel.create(userData)
    }

    async find() {
        return await UsersModel.find()
    }

    async findBy(field) {
        return await UsersModel.findOne(field)
    }

    async updateOne(id, userData) {
        return await UsersModel.updateOne({ _id: id }, { $set: userData })
    }

    async findByIdAndDelete(id) {
        return await UsersModel.findByIdAndDelete(id)
    }

    async getAllWithCart() {
        return await UsersModel.find().populate('cart.product')
    }

    async paginate(query, options) {
        return await UsersModel.paginate(query, options)
    }
}
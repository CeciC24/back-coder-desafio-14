import CartsModel from "../dao/mongo/models/carts.model.js"

export default class CartsRepository {
    async create(newCart) {
        return await CartsModel.create(newCart)
    }

    async find() {
        return await CartsModel.find()
    }

    async findById(id) {
        return await CartsModel.findById(id)
    }

    async updateById(id, cartData) {
        return await CartsModel.findByIdAndUpdate(id, cartData, { new: true })
    }
}
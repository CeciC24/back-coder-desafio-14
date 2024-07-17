import CategoriesModel from '../dao/mongo/models/categories.model.js'

export default class CategoriesRepository {
    async find() {
        return await CategoriesModel.find()
    }

    async findById(id) {
        return await CategoriesModel.findById(id)
    }

    async findOne(name) {
        return await CategoriesModel.findOne({ name })
    }

    async create(category) {
        return await CategoriesModel.create(category)
    }

    async updateOne(id, categoryData) {
        return await CategoriesModel.updateOne({ _id: id }, { $set: categoryData })
    }

    async findByIdAndDelete(id) {
        return await CategoriesModel.findByIdAndDelete(id)
    }
}
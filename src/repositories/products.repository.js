import ProductsModel from "../dao/mongo/models/products.model.js"

export default class ProductsRepository {
    async create(newProduct) {
        return await ProductsModel.create(newProduct)
    }

    async find() {
        return await ProductsModel.find()
    }

    async findWithCategories() {
        return await ProductsModel.find().populate('categories')
    }

    async findByIdAndDelete(id) {
        return await ProductsModel.findByIdAndDelete(id)
    }

    async findById(id) {
        return await ProductsModel.findById(id)
    }

    async findOne(code) {
        return await ProductsModel.findOne({ code })
    }

    async updateOne(id, productData) {
        return await ProductsModel.updateOne({ _id: id }, { $set: productData })
    }

    async paginate(query, options) {
        return await ProductsModel.paginate(query, options)
    }
}
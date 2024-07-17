import mongoose from 'mongoose'
const { Schema } = mongoose

const collection = 'category'

const categorySchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String,
		required: true,
	},
})

const CategoriesModel = mongoose.model(collection, categorySchema)

export default CategoriesModel
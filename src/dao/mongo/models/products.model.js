import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const { Schema } = mongoose
const collection = 'products'

const productSchema = new Schema({
	owner: { type: String },
	status: { type: Boolean, default: true },
	title: { type: String, require: true },
	description: { type: String, require: true },
	code: { type: String, require: true, unique: true },
	price: { type: Number, require: true },
	stock: { type: Number, require: true },
	category: {
		type: mongoose.Schema.Types.ObjectId, // Referencia al modelo Category
		ref: 'category', // Referencia al nombre del modelo "category"
		required: true, // Obligatorio tener una categoría asociada
	},
	thumbnails: { type: [String] },
})
productSchema.plugin(mongoosePaginate)

const ProductsModel = mongoose.model(collection, productSchema)

export default ProductsModel

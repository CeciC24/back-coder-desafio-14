import mongoose from 'mongoose'
const { Schema } = mongoose

const collection = 'carts'

const cartSchema = new Schema({
	products: {
		type: [
			{
				product: {
					type: Schema.Types.ObjectId,
					ref: 'products',
				},
				quantity: {
					type: Number,
					default: 1,
				},
			},
		],
		default: [],
	},
})

cartSchema.pre('find', function (){
	this.populate('products.product')
})

cartSchema.pre('findOne', function (){
	this.populate('products.product')
})

const CartsModel = mongoose.model(collection, cartSchema)

export default CartsModel

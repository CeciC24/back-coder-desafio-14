import mongoose from 'mongoose'
import { nanoid } from 'nanoid'
const { Schema } = mongoose

const collection = 'tickets'

const ticketSchema = new Schema({
	code: { type: String, default: nanoid(10), unique: true },
	purchase_datetime: { type: Date },
	amount: { type: Number, require: true },
	purchaser: { type: String, require: true },
})

ticketSchema.pre('save', function (next) {
	if (!this.purchase_datetime) {
		this.purchase_datetime = new Date()
	}
	next()
})

const TicketsModel = mongoose.model(collection, ticketSchema)

export default TicketsModel

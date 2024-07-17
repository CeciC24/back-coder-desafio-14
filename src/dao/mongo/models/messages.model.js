import mongoose from 'mongoose'
const { Schema } = mongoose

const collection = 'messages'

const messageSchema = new Schema({
	name: { type: String, require: true },
    message: { type: String, require: true }
})

const MessagesModel = mongoose.model(collection, messageSchema)

export default MessagesModel
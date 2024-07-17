import mongoose from "mongoose"
import config from './environment.config.js'

const connectDb = async () => {
	try {
		await mongoose.connect(config.mongoURI)
		console.log('Database connected')
	} catch (error) {
		console.error('Error connecting to the database: ', error.message)
		process.exit()
	}
}

export default connectDb
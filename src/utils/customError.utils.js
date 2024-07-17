export default class CustomError {
	static createError({ name, message, code, cause }) {
		let error = new Error(message)
		error.name = name
		error.code = code
		error.cause = cause
		throw error
	}
}

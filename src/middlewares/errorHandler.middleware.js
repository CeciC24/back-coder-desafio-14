export const errorHandler = (error, req, res, next) => {
	if (error) {
		if (error.code) {
			if (error.cause && error.message ) {
				req.logger.error(`${error.name}: ${error.message} - ${error.cause}`)
				return res.status(error.code).json({ error: error.name, message: error.message, cause: error.cause })
			} else if (error.message) {
				req.logger.error(`${error.name}: ${error.message}`)
				return res.status(error.code).json({ error: error.name, message: error.message })
			} else if (error.cause) {
				req.logger.error(`${error.name}: ${error.cause}`)
				return res.status(error.code).json({ error: error.name, cause: error.cause })
			} else {
				req.logger.error(`${error.name}`)
				return res.status(error.code).json({ error: error.name })
			}
		} else {
			req.logger.error(`Ocurrió un error inesperado: ${error.message}`)
			return res.status(500).json({ error: 'Error inesperado' })
		}
	}

	next()
}

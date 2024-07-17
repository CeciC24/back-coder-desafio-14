import CustomError from '../utils/customError.utils.js'
import ErrorTypes from '../utils/errorTypes.utils.js'

export function requireAuth(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.redirect('/login')
	}
	next()
}

export function redirectIfLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/profile')
	}
	next()
}

export const authorization = (roles) => {
	return async (req, res, next) => {
		try {
			if (roles === 'public') return next()
			if (!req.user) {
				CustomError.createError({
					name: 'Error de autorizacion',
					message: 'No autorizado',
					code: ErrorTypes.ERROR_UNAUTHORIZED,
					cause: 'No se ha enviado un token valido',
				})
				// return res.status(401).send({ error: 'No autorizado' })
			}
			if (!roles.includes(req.user.user.role)) {
				CustomError.createError({
					name: 'Error de autorizacion',
					message: 'No autorizado',
					code: ErrorTypes.ERROR_UNAUTHORIZED,
					cause: 'No tienes permisos suficientes',
				})
				// return res.status(401).send({ error: 'No tienes permisos suficientes' })
			}
			next()
		} catch (error) {
			next(error)
		}
	}
}

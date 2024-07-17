import jwt from 'jsonwebtoken'
import config from '../config/environment.config.js'
import passport from 'passport'

// Generar un token JWT
export const generateToken = (user) => {
	return jwt.sign({ user }, config.jwtSecret, { expiresIn: '1h' })
}

// Validar un token JWT
export const validateToken = (token) => {
	try {
		const decoded = jwt.verify(token, config.jwtSecret)
		return decoded
	} catch (error) {
		return null
	}
}

// Verificar un token JWT
export const passportCall = (strategy) => {
	return async (req, res, next) => {
		passport.authenticate(strategy, { session: false }, (error, user, info) => {
			if (!user && req.url === '/current') {
				return res.status(401).send({ error: info.messages ? info.messages : info.toString() })
			}
			if (error) {
				return next(error)
			}
			req.user = user
			next()
		})(req, res, next)
	}
}

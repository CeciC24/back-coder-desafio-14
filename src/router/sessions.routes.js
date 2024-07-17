import { Router } from 'express'
import passport from 'passport'

import config from '../config/environment.config.js'
import AuthManager from '../dao/services/auth.service.js'
import { authorization } from '../middlewares/auth.middleware.js'
import { passportCall, validateToken } from '../utils/jwt.utils.js'
import { CurrentUserDTO } from '../dao/DTOs/user.dto.js'
import CustomError from '../utils/customError.utils.js'
import ErrorTypes from '../utils/errorTypes.utils.js'
import UserManager from '../dao/mongo/users.mongo.js'
import Validate from '../utils/validate.utils.js'
import { de } from '@faker-js/faker'
import { isValidPassword } from '../utils/bcrypt.utils.js'

const SessionsRouter = Router()
const UsersMngr = new UserManager()
const authManager = new AuthManager()

// * Current - JWT
SessionsRouter.get('/current', passportCall('current'), async (req, res) => {
	const currentUser = new CurrentUserDTO(req.user.user)
	res.status(200).send({ status: 'success', message: 'Usuario autenticado', payload: currentUser })
})

// * Login - JWT
SessionsRouter.post('/login', async (req, res, next) => {
	try {
		const { email, password } = req.body
		if (!email || !password) {
			CustomError.createError({
				name: 'Error de autenticación',
				message: 'Faltan datos',
				code: ErrorTypes.ERROR_DATA,
				cause: 'No se enviaron los datos necesarios',
			})
		}

		const userToken = await authManager.login({ email, password })

		if (userToken.token) {
			res.cookie(config.tokenCookieName, userToken.token, {
				httpOnly: true,
			})
				.status(200)
				.send({ status: 'success', message: userToken.message })
		}
	} catch (error) {
		next(error)
	}
})

// * Logout - JWT
SessionsRouter.post('/logout', (req, res) => {
	try {
		res.clearCookie(config.tokenCookieName).send({ status: 'success', message: 'Sesión cerrada' })
	} catch (error) {
		return res.status(400).send({ status: 'error', message: error.message })
	}
})

// * Register - JWT
SessionsRouter.post('/register', async (req, res, next) => {
	try {
		const { first_name, last_name, email, age, password } = req.body

		const userToken = await authManager.register({ first_name, last_name, email, age, password })

		if (userToken.token) {
			res.cookie(config.tokenCookieName, userToken.token, {
				httpOnly: true,
			})
				.status(201)
				.send({ status: 'success', message: userToken.message })
		}
	} catch (error) {
		next(error)
	}
})

// * Restore - JWT
SessionsRouter.post('/restore', async (req, res, next) => {
	try {
		const { email, password } = req.body

		const userToken = await authManager.restore({ email, password })

		if (userToken.token) {
			res.cookie(config.tokenCookieName, userToken.token, {
				httpOnly: true,
			})
				.status(200)
				.send({ status: 'success', message: userToken.message })
		}
	} catch (error) {
		next(error)
	}
})

// * Reset - JWT
SessionsRouter.post('/forgot-password', async (req, res, next) => {
	try {
		const { email } = req.body
		req.logger.info('Solicitud de restablecimiento de contraseña recibida ', email)

		const userToken = await authManager.forgot({ email })
		res.status(200).json({ status: "success", message: userToken.message })
	} catch (error) {
		next(error)
	}
})

SessionsRouter.post('/reset-password', async (req, res, next) => {
	try {
		const { password, token } = req.body

		const user = await Validate.validToken(token)
		Validate.newPassword(user, password)

		await UsersMngr.update(user._id, { password })
		req.logger.info('Contraseña restablecida correctamente')

		res.json({ status: 'success', message: 'Contraseña restablecida' })
	} catch (error) {
		next(error)
	}
})

// * Login con GitHub
SessionsRouter.get(
	'/github',
	passport.authenticate('github', { session: false, scope: ['user:email'] }),
	async (req, res) => {}
)

SessionsRouter.get(
	'/githubcallback',
	passport.authenticate('github', { session: false, failureRedirect: '/login' }),
	async (req, res) => {
		res.cookie(config.tokenCookieName, req.user.token, {
			httpOnly: true,
		}).redirect('/')
	}
)

export default SessionsRouter

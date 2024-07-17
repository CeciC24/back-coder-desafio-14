import mongoose from 'mongoose'
import CustomError from './customError.utils.js'
import ErrorTypes from './errorTypes.utils.js'
import { generateCodeErrorInfo, generateIDErrorInfo, generateProductErrorInfo } from './infoError.js'
import { isValidPassword } from './bcrypt.utils.js'
import { validateToken } from './jwt.utils.js'
import UsersManager from '../dao/mongo/users.mongo.js'

const UsersMngr = new UsersManager()
export default class Validate {
	static id = (id, tipo) => {
		if (!id) {
			CustomError.createError({
				name: 'Error al buscar ' + tipo,
				message: generateIDErrorInfo(id),
				code: ErrorTypes.ERROR_INVALID_ARGUMENTS,
				cause: 'No se ha enviado un ID',
			})
		} else if (!mongoose.Types.ObjectId.isValid(id)) {
			CustomError.createError({
				name: 'Error al buscar ' + tipo,
				message: generateIDErrorInfo(id),
				code: ErrorTypes.ERROR_INVALID_ARGUMENTS,
				cause: 'El ID no es un ObjectId válido',
			})
		}
	}

	static existID = async (id, manager, tipo) => {
		if (!(await manager.getById(id))) {
			CustomError.createError({
				name: 'Error al buscar ' + tipo,
				message: generateIDErrorInfo(id),
				code: ErrorTypes.ERROR_NOT_FOUND,
				cause: 'ID no encontrado',
			})
		}
	}

	static existCode = async (code, manager) => {
		if (await manager.getByCode(code)) {
			CustomError.createError({
				name: 'Error al registrar producto',
				message: generateCodeErrorInfo(code),
				code: ErrorTypes.ERROR_DATA,
				cause: 'El campo "code" ya existe',
			})
		}
	}

	static productData = async (productData) => {
		if (
			!productData.title ||
			!productData.description ||
			!productData.code ||
			!productData.price ||
			!productData.stock ||
			!productData.category
		) {
			CustomError.createError({
				name: 'Error al registrar producto',
				message: generateProductErrorInfo(productData),
				code: ErrorTypes.ERROR_DATA,
				cause: 'Faltan campos requeridos',
			})
		}

		if (productData.owner) {
			const owner = productData.owner

			if (owner && owner != 'admin') {
				const user = await UsersMngr.getBy({ email: owner })

				if (user.role != 'premium') {
					CustomError.createError({
						name: 'Error al registrar producto',
						message: generateProductErrorInfo(productData),
						code: ErrorTypes.ERROR_DATA,
						cause: 'El owner no es premium',
					})
				}
			}
		}
	}

	static isOwner = (user, product) => {
		if (user.role == 'premium') {
			if (product.owner != user.email) {
				CustomError.createError({
					name: 'Error al modificar producto',
					message: 'No tienes permisos para modificar este producto',
					code: ErrorTypes.ERROR_UNAUTHORIZED,
					cause: 'Usuario no autorizado',
				})
			}
		}
	}

	static validToken = async (token) => {
		if (!token) {
			CustomError.createError({
				name: 'Error de autenticación',
				message: 'Faltan datos',
				code: ErrorTypes.ERROR_DATA,
				cause: 'No se ha enviado un token',
			})
		}

		const decodedToken = validateToken(token)
		if (!decodedToken) {
			CustomError.createError({
				name: 'Error de autenticación',
				message: 'Token inválido',
				code: ErrorTypes.ERROR_DATA,
				cause: 'El token no es válido',
			})
		}

		const email = decodedToken.user.email
		const actualUser = await UsersMngr.getBy({ email })
		if (actualUser.password != decodedToken.user.password) {
			CustomError.createError({
				name: 'Error de autenticación',
				message: 'Token inválido',
				code: ErrorTypes.ERROR_DATA,
				cause: 'El token no es válido',
			})
		}

		return decodedToken.user
	}

	static newPassword = (user, newPassword) => {
		if (!newPassword || !user || newPassword === '') {
			CustomError.createError({
				name: 'Error al restaurar contraseña',
				message: 'Faltan datos',
				code: ErrorTypes.ERROR_DATA,
				cause: 'No se han enviado todos los datos necesarios',
			})
		}

		// Contraseña igual a la anterior
		const isSamePassword = isValidPassword(user, newPassword)
		if (isSamePassword) {
			CustomError.createError({
				name: 'Error al restaurar contraseña',
				message: 'Contraseña repetida',
				code: ErrorTypes.ERROR_DATA,
				cause: 'La contraseña no puede ser igual a la anterior',
			})
		}

		/* 		if (password.length < 6) {
			CustomError.createError({
				name: 'Error al restaurar contraseña',
				message: 'Contraseña muy corta',
				code: ErrorTypes.ERROR_DATA,
				cause: 'La contraseña debe tener al menos 6 caracteres',
			})
		}

		if (password.length > 20) {
			CustomError.createError({
				name: 'Error al restaurar contraseña',
				message: 'Contraseña muy larga',
				code: ErrorTypes.ERROR_DATA,
				cause: 'La contraseña debe tener máximo 20 caracteres',
			})
		}

		if (!/[a-z]/.test(password)) {
			CustomError.createError({
				name: 'Error al restaurar contraseña',
				message: 'Contraseña sin minúsculas',
				code: ErrorTypes.ERROR_DATA,
				cause: 'La contraseña debe tener al menos una letra minúscula',
			})
		}

		if (!/[A-Z]/.test(password)) {
			CustomError.createError({
				name: 'Error al restaurar contraseña',
				message: 'Contraseña sin mayúsculas',
				code: ErrorTypes.ERROR_DATA,
				cause: 'La contraseña debe tener al menos una letra mayúscula',
			})
		}

		if (!/[0-9]/.test(password)) {
			CustomError.createError({
				name: 'Error al restaurar contraseña',
				message: 'Contraseña sin números',
				code: ErrorTypes.ERROR_DATA,
				cause: 'La contraseña debe tener al menos un número',
			})
		}

		if (!/[!@#$%^&*]/.test(password)) {
			CustomError.createError({
				name: 'Error al restaurar contraseña',
				message: 'Contraseña sin caracteres especiales',
				code: ErrorTypes.ERROR_DATA,
				cause: 'La contraseña debe tener al menos un caracter especial',
			})
		}

		if (/\s/.test(password)) {
			CustomError.createError({
				name: 'Error al restaurar contraseña',
				message: 'Contraseña con espacios',
				code: ErrorTypes.ERROR_DATA,
				cause: 'La contraseña no puede tener espacios',
			})
		} */
	}
}

import express from 'express'
import handlebars from 'express-handlebars'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import __dirname from '../dirnamePath.js'
import initializePassport from './passport.config.js'
import { addLogger } from '../middlewares/logger.middleware.js'

export default function middlewaresConfig(app) {
	try {
		app.use(express.urlencoded({ extended: true }))
		app.use(express.json())

		app.use(cookieParser())

		// Configuración de archivos estáticos
		app.use('/', express.static(__dirname + '/public'))

		// Configuración de handlebars
		app.set('views', __dirname + '/views')
		app.engine('handlebars', handlebars.engine())
		app.set('view engine', 'handlebars')

		// Passport
		initializePassport()
		app.use(passport.initialize())

		// Logger
		app.use(addLogger)

	} catch (error) {
		throw new Error('No se lograron configurar los middlewares: ' + error.message)
	}
}

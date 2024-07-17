import __dirname from '../dirnamePath.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

const options = {
	definition: {
		openapi: '3.0.1',
		info: {
			title: 'API Ecommerce',
			version: '1.0.0',
			description:
				'La API proporciona un conjunto de endpoints para gestionar los productos y usuarios de una tienda online.',
		},
	},
	apis: [`${__dirname}/docs/**/*.yaml`],
}

const specs = swaggerJSDoc(options)

export default function swaggerConfig(app) {
	app.use(
		'/api-docs',
		swaggerUiExpress.serve,
		swaggerUiExpress.setup(specs, { customCss: '.swagger-ui .topbar { display: none }' })
	)
}

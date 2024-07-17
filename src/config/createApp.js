import express from 'express'
import webSocketsInit from './webSocketsInit.js'
import config from './environment.config.js'

export default function createExpressApp() {
	try {
		// Configuración
		const app = express()
		const PORT = config.port || 8080
	
		// Inicialización del servidor | Listener
		const server = app.listen(PORT, () => {
			console.log(`Server running in port ${server.address().port}`)
		})
	
		webSocketsInit(server)
	
		return app
	} catch (error) {
		throw new Error('No se pudo crear la app: ' + error.message)
	}
}
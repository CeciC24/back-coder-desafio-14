import winston from 'winston'
import environmentConfig from '../config/environment.config.js'

const customLevelsOptions = {
	levels: {
		fatal: 0,
		error: 1,
		warning: 2,
		info: 3,
		http: 4,
		debug: 5,
	},
	colors: {
		fatal: 'redBG bold white',
		error: 'red',
		warning: 'yellow',
		info: 'green',
		http: 'blue',
		debug: 'bold white',
	},
}

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
	return `${timestamp} ${level}: ${message}`
})

const devLogger = winston.createLogger({
	levels: customLevelsOptions.levels,
	transports: [
		new winston.transports.Console({
			level: 'debug',
			format: winston.format.combine(
				winston.format.colorize({ colors: customLevelsOptions.colors }),
				winston.format.simple()
			),
		}),
	],
})

const prodLogger = winston.createLogger({
	levels: customLevelsOptions.levels,
	transports: [
		new winston.transports.Console({
			level: 'info',
			format: winston.format.combine(
				winston.format.colorize({ colors: customLevelsOptions.colors }),
				winston.format.simple()
			),
		}),
		new winston.transports.File({
			filename: './errors.log',
			level: 'error',
			format: winston.format.combine(
				winston.format.timestamp(),
				logFormat
			),
		}),
	],
})

export const addLogger = (req, res, next) => {
	req.logger = environmentConfig.nodeEnv === 'develop' ? devLogger : prodLogger

	req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleString()}`)
	next()
}

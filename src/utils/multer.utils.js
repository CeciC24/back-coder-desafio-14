import multer from 'multer'

// Configuración de multer
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname + 'public/img')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	},
})
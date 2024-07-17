import bcrypt from 'bcrypt'

// Hashear una contraseña
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// Validar una contraseña
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)
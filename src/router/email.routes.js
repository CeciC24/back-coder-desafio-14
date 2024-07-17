import { Router } from 'express'

import { authorization } from '../middlewares/auth.middleware.js'
import { passportCall } from '../utils/jwt.utils.js'

const EmailsRouter = Router()

import { sendTestEmail } from '../dao/services/email.service.js'

EmailsRouter.get('/mail', (req, res) => {
    try {
        sendTestEmail()
    } catch (error) {
        res.status(500).send({ error: 'Error al enviar email' })
    }
})

export default EmailsRouter
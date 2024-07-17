import nodemailer from 'nodemailer'
import config from '../../config/environment.config.js'

const transporter = nodemailer.createTransport({
	service: config.emailService,
	port: 587,
	auth: {
		user: config.emailUser,
		pass: config.emailPassword,
	},
})

export const sendSimpleMail = async ({ from, to, subject, html, attachments = [] }) => {
	return transporter.sendMail({
        from,
        to,
        subject,
        html,
        attachments,
    })
}

export const sendTestEmail = () => {
	return transporter.sendMail({
		from: 'Coder Tests <' + config.emailUser + '>',
		to: config.emailUser,
		subject: 'Correo de prueba',
		html: `
        <div>
            <h1>Test</h1>
        </div>
        `,
		attachments: [],
	})
}

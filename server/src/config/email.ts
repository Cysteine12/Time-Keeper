import nodemailer from 'nodemailer'
import config from './config.js'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.email.USER,
    pass: config.email.PASS,
  },
})

type MailOptions = {
  to: string | string[]
  subject: string
  html: string
}

const sendEmail = (mail: MailOptions) => {
  const mailOptions = {
    from: `${config.APP_NAME} <info@timekeeper.com>`,
    to: mail.to,
    subject: mail.subject,
    html: `
      <div style="margin: 20px; background: #fff; border-radius: 10px; padding: 20px 10px; box-shadow: 0px 4px 10px gray">
          ${mail.html}
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

export { sendEmail }

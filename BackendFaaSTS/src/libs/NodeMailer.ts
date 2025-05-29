import { MailAuthError } from '@common/error/EmailError'

import { EmailProps } from '@functions/email/entities/Email'

import { createTransport } from 'nodemailer'

const nodeMailerTransporter = createTransport({
  pool: true,
  service: 'gmail',
  host: 'smtp.gmail.com',
  port:  2525,
  secure: false,
  auth: {
    user: 'developmenttests89@gmail.com',
    pass: 'xflspljzsfkiypiu',
  }
})

export const sendEmail = async (email: EmailProps): Promise<Error | void > => {
  try {
    await nodeMailerTransporter.verify()
    nodeMailerTransporter.sendMail({
    from: email.from,
    to: email.to,
    subject: email.subject,
    cc: email.cc,
    bcc: email.bcc,
    html: email.body,
  }, closePoolConnection)
  }catch(error) {
    throw new MailAuthError()
  }
}

const closePoolConnection = async () => {
  nodeMailerTransporter.close()
  console.log('Connection pool closed')
}


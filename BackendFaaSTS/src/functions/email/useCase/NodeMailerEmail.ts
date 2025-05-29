import { sendEmail } from '@libs/NodeMailer'

import { type SendEmailService } from '@common/utils/email/SendEmail.interface'
import { MailAuthError } from '@common/error/EmailError'
import { InfraError } from '@common/error/InfraError'

import { type Email } from '@functions/email/entities/Email'

import { injectable } from 'inversify'

@injectable()
export class NodeMailerEmail implements SendEmailService {
  async execute (email: Email): Promise<undefined | Error> {
    try {
      await sendEmail(email)
    } catch (error) {
      if (error instanceof MailAuthError) {
        return error
      }

      return new InfraError('Erro Inesperado')
    }
  }
}

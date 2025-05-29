import { type Email } from '@functions/email/entities/Email'

export interface SendEmailService {
  execute: (email: Email) => Promise<void | Error>
}

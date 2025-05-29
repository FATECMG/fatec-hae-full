import { SendEmailService } from '@common/utils/email/SendEmail.interface'
import { MailAuthError } from '@common/error/EmailError'
import { InfraError } from '@common/error/InfraError'
import { type AlertNotice } from '@common/utils/email/SendNewNoticeEmail.interface'
import { noticeEmailMessageTemplateHTML } from '@common/utils/email/templates/NewNoticeTemplate'

import { EmailServiceLocator } from '@functions/email/shared/Di.enums'
import { Email, type EmailAddress } from '@functions/email/entities/Email'
import { type NoticeEmailProps } from '@functions/notice/entities/NoticeEmail'

import { inject, injectable } from 'inversify'

export const emails: EmailAddress[] = [
  {
    name: 'Destinatario 1',
    address: 'developmenttests89@gmail.com'
  },
  {
    name: 'Destinatario 2',
    address: 'marcelothiago010@gmail.com'
  }
]

@injectable()
export class NoticeEmail implements AlertNotice {
  constructor (
    @inject(EmailServiceLocator.NodeMailerEmail)
    private readonly send: SendEmailService
  ) {}

  async execute (props: NoticeEmailProps): Promise<void> {
    const content = noticeEmailMessageTemplateHTML(props)
    const email = new Email({
      from: 'FACULDADE DE TECNOLOGIA DE MOGI DAS CRUZES - FATEC MOGI DAS CRUZES',
      subject: 'Anúncio do Edital do Segundo Semestre de 2023',
      to: emails,
      body: content
    })
    try {
      await this.send.execute(email)
    } catch (error) {
      if (error instanceof MailAuthError) throw new MailAuthError()
      throw new InfraError('Erro Inesperado')
    }
  }
}

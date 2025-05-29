import 'reflect-metadata'
import { Container } from 'inversify'

import { type AlertNotice } from '@common/utils/email/SendNewNoticeEmail.interface'
import { type SendEmailService } from '@common/utils/email/SendEmail.interface'

import { EmailServiceLocator, NoticeEmailUseCaseLocator } from '@functions/email/shared/Di.enums'
import { NodeMailerEmail } from '@functions/email/useCase/NodeMailerEmail'
import { NoticeEmail } from '@functions/email/useCase/NoticeEmail'

export const emailServiceContainer = new Container()

emailServiceContainer
  .bind<SendEmailService>(EmailServiceLocator.NodeMailerEmail)
  .to(NodeMailerEmail)

emailServiceContainer
  .bind<AlertNotice>(NoticeEmailUseCaseLocator.NoticeEmail)
  .to(NoticeEmail)

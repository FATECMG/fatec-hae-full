import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'

import { MailAuthError } from '@common/error/EmailError'

import { type Email } from '@functions/email/entities/Email'
import type EmailSchema from '@functions/email/handler/EmailSchema'
import { type NodeMailerEmail } from '@functions/email/useCase/NodeMailerEmail'
import { emailServiceContainer } from '@functions/email/shared/Di.container'
import { EmailServiceLocator } from '@functions/email/shared/Di.enums'

const controller = emailServiceContainer.get<NodeMailerEmail>(EmailServiceLocator.NodeMailerEmail)

export const emailHandler: ValidatedEventAPIGatewayProxyEvent<typeof EmailSchema> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const request = event.body

  const param: Email = {
    from: request.from,
    to: request.to,
    subject: request.subject,
    cc: request.cc,
    bcc: request.bcc,
    body: request.body
  }

  const response = await controller.execute(param)

  if (response instanceof MailAuthError) {
    return formatJSONResponse({
      body: {
        message: response
      }
    }, 503)
  }

  return formatJSONResponse({
    body: {
      message: response
    }
  }, 200)
}

export const send = middyfy(emailHandler)

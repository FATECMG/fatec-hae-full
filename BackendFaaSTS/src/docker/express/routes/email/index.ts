import { type Email } from '@functions/email/entities/Email'
import { type NodeMailerEmail } from '@functions/email/useCase/NodeMailerEmail'
import { emailServiceContainer } from '@functions/email/shared/Di.container'
import { EmailServiceLocator } from '@functions/email/shared/Di.enums'

import { type Router } from 'express'

export const emailRoutes = (router: Router): void => {
  router
    .post('/email', (req, res) => {
      const controller = emailServiceContainer.get<NodeMailerEmail>(EmailServiceLocator.NodeMailerEmail)
      const request = req.body
      const param: Email = {
        from: request.from,
        to: request.to,
        subject: request.subject,
        cc: request.cc,
        bcc: request.bcc,
        body: request.body
      }
      controller.execute(param)
        .then(response => {
          res.status(200).json(response)
        })
        .catch(error => {
          res.status(503).json(error.message)
        })
    })
}

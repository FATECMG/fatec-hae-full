import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import mail from '@sendgrid/mail'
import * as functions from 'firebase-functions'
import { IEmail } from '../../entities/interfaces'

@injectable()
export class SendExternal implements IExternal<IEmail, void> {
  async call(info: IEmail): Promise<void> {
    const { templateId, groupId, to, data, from } = info
    const message: any = {
      from,
      to,
      templateId,
      dynamic_template_data: data,
    }
    if (groupId) {
      try {
        const intGroupId = parseInt(groupId.toString())
        message['asm'] = {
          groupId: intGroupId,
          groupsToDisplay: [intGroupId],
        }
      } catch (err) {
        console.warn(err)
      }
    }
    mail.setApiKey(functions.config().sendgrid.key)
    try {
      await mail.send(message)
    } catch (err) {
      console.error(err)
    }
  }
}

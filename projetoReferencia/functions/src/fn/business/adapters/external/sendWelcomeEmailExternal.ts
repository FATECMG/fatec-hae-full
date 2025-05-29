import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { IBusiness } from '../../entities/interfaces.entity'
import { FOUNDERS_NAME } from '../../../../shared/utils/staticdata'
import { getPubSub } from '../../../../shared/utils/pubsub'
import * as functions from 'firebase-functions'

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
@injectable()
export class SendWelcomeEmailExternal implements IExternal<IBusiness, void> {
  async call(business: IBusiness): Promise<void> {
    const { name, email: businessEmail } = business
    const index = getRandomIntInclusive(0, 2)
    const currentFounder = FOUNDERS_NAME[index]

    const email = {
      from: {
        name: `${currentFounder.split(' ')[0]}`,
        email: `${currentFounder
          .split(' ')[0]
          ?.toLocaleLowerCase()}@zelpay.solutions`,
      },
      templateId: functions.config().sendgrid.welcome_template_id,
      to: businessEmail,
      data: {
        founderName: currentFounder,
        customerName: name.split(' ')[0],
      },
      groupId: functions.config().sendgrid.welcome_group_id,
    }
    const pubsub = getPubSub()
    try {
      pubsub.topic('send-email').publishJSON({ email })
    } catch (err) {
      console.error(err)
    }
  }
}

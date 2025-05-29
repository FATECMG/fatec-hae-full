import { Message } from 'firebase-functions/lib/providers/pubsub'
import { IPubSubTrigger } from '../../../../shared/adapters/controllers/interfaces'
import { container } from '../../shared/container.di'
import { Locator } from '../../shared/enums.di'

const sendEmailTriggerController = container.get<IPubSubTrigger>(
  Locator.EmailsTrigger,
)

export const sendEmailTrigger = async (message: Message) => {
  try {
    await sendEmailTriggerController.handle(message, undefined)
  } catch (error) {
    console.error(error)
  }
}

import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { getFirebase } from '../../../../shared/firebase'
import { IOrder } from '../../entities/interfaces'
import * as functions from 'firebase-functions'

export interface IOrderUpdateNotificationArgs {
  order: IOrder
  notificationBody: string
  notificationTitle: string
}

@injectable()
export class OrderUpdateNotificationExternal
  implements IExternal<IOrderUpdateNotificationArgs, void> {
  async call({
    order,
    notificationBody,
    notificationTitle,
  }: IOrderUpdateNotificationArgs): Promise<void> {
    const app = getFirebase()
    const messaging = app.messaging()
    const { _id } = order
    const mode = functions.config().env.mode
    if (order.messagingToken) {
      const message = {
        notification: {
          title: notificationTitle,
          body: notificationBody,
        },
        webpush: {
          notification: {
            icon: order.episode.logo ? order.episode.logo : undefined,
            badge: '/favicon.ico',
          },
          fcmOptions: {
            link: `http${mode === 'development' ? '' : 's'}://${
              mode === 'development'
                ? 'localhost:3001'
                : mode === 'stage'
                ? 'loja.zelpay.stage.redwall.solutions'
                : 'zelpay.store'
            }/${order.episode._id.toString()}/orders/${_id}`,
          },
        },
        token: order.messagingToken,
      }

      try {
        await messaging.send(message)
      } catch (err) {
        console.warn('Error sending notification.', err)
      }
    }
  }
}

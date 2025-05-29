import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { IOrder } from '../../entities/interfaces'
import { getFirebase } from '../../../../shared/firebase'
import { injectable } from 'inversify'
import * as functions from 'firebase-functions'

@injectable()
export class PublishOrderCreationExternal implements IExternal<IOrder, void> {
  async call(order: IOrder): Promise<void> {
    const app = getFirebase()
    const database = app.database()
    database
      .ref(
        `episodes/${order.episode._id.toString()}/orders/${order._id.toString()}-created`,
      )
      .set({
        action: 'created',
        payload: order._id.toString(),
      })

    database.ref(`orders/${order._id.toString()}`).set({
      _id: order._id.toString(),
      status: order.status,
      date: new Date().toISOString(),
    })
    const mode = functions.config().env.mode
    if (order.episode?.prepMessagingToken) {
      const messaging = app.messaging()
      const message = {
        notification: {
          title: 'Chegou novo pedido 🔥',
          body: 'Clique aqui para ver os detalhes',
        },
        webpush: {
          notification: {
            icon: order.episode?.logo,
            badge: '/favicon.ico',
          },
          fcmOptions: {
            link: `https://${
              mode === 'development'
                ? 'localhost:3000'
                : mode === 'stage'
                ? 'prep.zelpay.stage.redwall.solutions'
                : 'prep.zelpay.solutions'
            }/${order.episode._id.toString()}/pedidos`,
          },
        },
        token: order.episode?.prepMessagingToken,
      }

      try {
        await messaging.send(message)
      } catch (err) {
        console.warn('Error sending notification.', err)
      }
    }
  }
}

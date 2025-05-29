import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { IOrder } from '../../entities/interfaces'
import { getFirebase } from '../../../../shared/firebase'
@injectable()
export class PublishOrderUpdatesExternal implements IExternal<IOrder, void> {
  async call(order: IOrder): Promise<void> {
    const app = getFirebase()
    const database = app.database()
    database
      .ref(
        `episodes/${order.episode._id.toString()}/orders/${order._id.toString()}-updated`,
      )
      .set({
        action: 'updated',
        payload: order._id.toString(),
        who: (order as any).who || 'colab', //check it later
      })

    database.ref(`orders/${order._id.toString()}`).set({
      _id: order._id.toString(),
      status: order.status,
      date: new Date().toISOString(),
    })
  }
}

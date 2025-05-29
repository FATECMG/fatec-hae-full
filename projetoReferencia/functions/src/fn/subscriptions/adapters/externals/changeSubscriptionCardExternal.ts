import axios from 'axios'
import { config } from 'firebase-functions'
import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'

@injectable()
export class ChangeSubscriptionCardExternal implements IExternal<any, void> {
  async call(subscription: any): Promise<void> {
    await axios({
      url: `https://api.pagar.me/core/v5/subscriptions/${subscription.id}/card`,
      method: 'patch',
      auth: {
        username: config().payment.key,
        password: '',
      },
      data: {
        card: subscription.card,
      },
    })
  }
}

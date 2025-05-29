import axios from 'axios'
import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { config } from 'firebase-functions'

@injectable()
export class CreateSubscriptionExternal implements IExternal<any, any> {
  async call(subscription: any): Promise<any> {
    const result = await axios({
      url: 'https://api.pagar.me/core/v5/subscriptions',
      method: 'POST',
      auth: {
        username: config()?.payment?.key,
        password: '',
      },
      data: subscription,
    })
    return result.data
  }
}

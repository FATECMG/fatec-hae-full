import axios from 'axios'
import { config } from 'firebase-functions/v1'
import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'

@injectable()
export class GetSubscriptionExternal implements IExternal<string, any> {
  async call(subscriptionId: any): Promise<any> {
    const result = await axios({
      url: `https://api.pagar.me/core/v5/subscriptions/${subscriptionId}`,
      method: 'GET',
      auth: {
        username: config()?.payment?.key,
        password: '',
      },
    })
    return result.data
  }
}

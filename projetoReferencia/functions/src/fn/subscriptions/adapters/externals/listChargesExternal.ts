import axios from 'axios'
import { config } from 'firebase-functions'
import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'

@injectable()
export class ListChargesExternal implements IExternal<string, any> {
  async call(customerId: string): Promise<any> {
    const result = await axios({
      url: `https://api.pagar.me/core/v5/charges?customer_id=${customerId}&page=1&size=100`,
      auth: {
        username: config().payment.key,
        password: '',
      },
    })

    return result.data
  }
}

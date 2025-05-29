/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from 'axios'
import * as functions from 'firebase-functions'
import { injectable } from 'inversify'
import { getAuthorizationToken } from '../../../../shared/adapters/external/getAuthTokenFromJuno.external'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { DomainError } from '../../../../shared/errors/domain.error'
import { CreditCard } from '../../usecases/creditcard.usecase'

@injectable()
export class GenerateCreditCardToken
  implements IExternal<{ cardhash: string }, CreditCard> {
  async call(params: { cardhash: string }): Promise<CreditCard> {
    const resourceServerURL = functions.config().juno.resource_server_url
    const resourceToken = functions.config().payment.rtoken
    const authToken = await getAuthorizationToken()
    const { cardhash } = params

    try {
      const { data } = await axios({
        url: `${resourceServerURL}/credit-cards/tokenization`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'X-Api-Version': 2,
          'X-Resource-Token': resourceToken,
        },
        data: { creditCardHash: cardhash },
      })
      return data
    } catch (error) {
      const [detail] = error.response.data.details
      const errorCode = detail.errorCode
      const message = detail.message
      throw new DomainError({ errorCode, message })
    }
  }
}

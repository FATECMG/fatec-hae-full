import axios from 'axios'
import * as functions from 'firebase-functions'
import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'

@injectable()
export class GetDigitalAccountPublicKey
  implements
    IExternal<
      {
        resourceToken: string
        authToken: string
      },
      string
    > {
  async call(params: {
    resourceToken: string
    authToken: string
  }): Promise<string> {
    const resourceServerURL = functions.config().juno.resource_server_url
    const { resourceToken, authToken } = params
    const { data } = await axios({
      url: `${resourceServerURL}/credentials/public-key`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'X-Api-Version': 2,
        'X-Resource-Token': resourceToken,
      },
    })

    return data
  }
}

import axios from 'axios'
import * as functions from 'firebase-functions'
import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { MissingDocuments } from '../../entities/interfaces.entity'

@injectable()
export class GetMissingDocuments
  implements
    IExternal<
      {
        resourceToken: string
        authToken: string
      },
      MissingDocuments
    > {
  async call(params: {
    resourceToken: string
    authToken: string
  }): Promise<MissingDocuments> {
    const resourceServerURL = functions.config().juno.resource_server_url
    const { resourceToken, authToken } = params
    const { data } = await axios({
      url: `${resourceServerURL}/documents`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'X-Api-Version': 2,
        'X-Resource-Token': resourceToken,
      },
    })

    return data
  }
}

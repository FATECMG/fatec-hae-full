import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { IBank } from '../../entities/interfaces.entity'
import * as functions from 'firebase-functions'
import axios from 'axios'
import { DomainError } from '../../../../shared/errors/domain.error'

@injectable()
export class ListBankExternal implements IExternal<string, Array<IBank>> {
  async call(authToken: string): Promise<Array<IBank>> {
    const resourceServerURL = functions.config().juno.resource_server_url
    try {
      const { data } = await axios({
        url: `${resourceServerURL}/data/banks`,
        headers: {
          Authorization: `Bearer ${authToken}`,
          'X-Api-Version': 2,
        },
      })
      const {
        _embedded: { banks },
      } = data
      return banks
    } catch (err) {
      throw new DomainError({
        errorCode: 'business-001',
        message: 'Conexão com API de bancos perdida.',
      })
    }
  }
}

import axios from 'axios'
import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { BASE_URL } from '../../../../shared/config/params'
import { DomainError } from '../../../../shared/errors/domain.error'
import { IAddress } from '../../../address/entities/interfaces.entity'

@injectable()
export class ComposeAddressByPlaceIdExternal
  implements IExternal<string, IAddress> {
  async call(placeId: string): Promise<IAddress> {
    const url = `${BASE_URL}/address/composebyplaceid/${placeId}`
    try {
      const { data } = await axios({ url })
      return data
    } catch (error) {
      console.error(error.response.data)
      throw new DomainError({
        errorCode: '',
        message: 'Problema no serviço de composição de endereço.',
      })
    }
  }
}

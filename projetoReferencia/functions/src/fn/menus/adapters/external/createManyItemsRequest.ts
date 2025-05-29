import axios from 'axios'
import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { BASE_URL } from '../../../../shared/config/params'
import { DomainError } from '../../../../shared/errors/domain.error'
import { IItemEntity } from '../../../items/entities/item.entity'

@injectable()
export class createManyItemsRequest
  implements IExternal<IItemEntity[], IItemEntity[]> {
  async call(items: IItemEntity[]): Promise<IItemEntity[]> {
    let data: IItemEntity[]
    try {
      const { data: dataResponse } = await axios.post(`${BASE_URL}/items`, {
        items,
      })
      data = dataResponse
    } catch (err) {
      console.log(err.message || err)
      throw new DomainError({
        errorCode: '001 - menu items',
        message: 'Não foi possível criar os items',
      })
    }

    return data
  }
}

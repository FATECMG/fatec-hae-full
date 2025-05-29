import { inject, injectable } from 'inversify'
import { ItemRepository } from '../adapters/repositories/mongo.repository'
import { IItemEntity } from '../entities/item.entity'
import { Locator } from '../shared/di.enums'

export interface IListItems {
  list: (body: ListItemsBody) => Promise<ListItemsResponse>
}

export interface ListItemsResponse {
  list: IItemEntity[]
  hasMore: boolean
  search: string | null
}

export interface ListItemsBody {
  pagination?: {
    limit: number
    offset: number
  }
  search: string
  business: string
}

@injectable()
export class ListItemsUseCase implements IListItems {
  constructor(
    @inject(Locator.ItemRepository) readonly repository: ItemRepository,
  ) {}

  async list(body: ListItemsBody): Promise<ListItemsResponse> {
    const { pagination, search, business } = body

    const { offset = 0 } = pagination || {}
    let { limit = 10 } = pagination || {}

    if (search) limit = 999

    const filters = { business, name: new RegExp(search, 'gi') }
    const [menus, count] = await Promise.all([
      this.repository.find({ filters, limit, offset }),
      this.repository.count({ filters }),
    ])

    const result: ListItemsResponse = {
      list: menus,
      hasMore: Boolean(count > menus.length + offset),
      search: search || null,
    }

    return result
  }
}

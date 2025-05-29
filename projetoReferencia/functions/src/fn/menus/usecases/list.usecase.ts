import { inject, injectable } from 'inversify'
import { IMenuRepository } from '../adapters/repositories/types'
import { IMenuEntity } from '../entities/menu.entity'
import { Locator } from '../shared/di.enums'

export interface IListMenus {
  list: (body: ListMenusBody) => Promise<ListMenusResponse>
}

export interface ListMenusResponse {
  list: IMenuEntity[]
  hasMore: boolean
  search: string | null
}

export interface ListMenusBody {
  pagination?: {
    limit: number
    offset: number
  }
  search: string
  business: string
  filters?: any
}

@injectable()
export class ListMenus implements IListMenus {
  constructor(
    @inject(Locator.MenuRepository) readonly repository: IMenuRepository,
  ) {}

  async list(body: ListMenusBody): Promise<ListMenusResponse> {
    const { pagination, search, business, filters } = body

    const { offset = 0 } = pagination || {}
    let { limit = 10 } = pagination || {}

    if (search) limit = 999

    const filtersToApply = {
      active: true,
      business,
      name: new RegExp(search, 'gi'),
      ...filters,
    }
    const [menus, count] = await Promise.all([
      this.repository.find({ filters: filtersToApply, limit, offset }),
      this.repository.count({ filters: filtersToApply }),
    ])

    const result: ListMenusResponse = {
      list: menus,
      hasMore: Boolean(count > menus.length + offset),
      search: search || null,
    }

    return result
  }
}

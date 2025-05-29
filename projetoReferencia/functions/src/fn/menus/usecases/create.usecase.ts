/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { inject, injectable } from 'inversify'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { IItemEntity } from '../../items/entities/item.entity'
import { IMenuRepository } from '../adapters/repositories/types'
import { IMenuEntity, ItemsPrice } from '../entities/menu.entity'
import { Locator } from '../shared/di.enums'

export interface ICreateMenu {
  createMenu: (menu: CreateMenuBody) => Promise<IMenuEntity>
}

export interface CreateMenuBody {
  name: string
  items: IItemEntity[]
  business: string
}

@injectable()
export class CreateMenu implements ICreateMenu {
  readonly _repository: IMenuRepository
  readonly _createManyItems: IExternal<IItemEntity[], IItemEntity[]>

  constructor(
    @inject(Locator.MenuRepository) repository: IMenuRepository,
    @inject(Locator.CreateManyItemsRequest)
    createManyItems: IExternal<IItemEntity[], IItemEntity[]>,
  ) {
    this._repository = repository
    this._createManyItems = createManyItems
  }

  async createMenu(body: CreateMenuBody): Promise<IMenuEntity> {
    const { name, items, business } = body

    let itemsPrice: ItemsPrice[] = []

    if (items.length) {
      const itemsWithHasNew = items.filter(item => item.hasNew)
      const itemsToCreate = itemsWithHasNew.map(item => {
        const _item = { ...item, business }
        delete _item.hasNew
        delete _item._id
        delete _item.price
        return _item
      })

      const itemsToAdd = items.filter(item => !item.hasNew)

      // add exists items in menu
      const _itemsPrice: ItemsPrice[] = itemsToAdd.map((item, index) => ({
        order: index++,
        price: item.price,
        item: item?._id,
      }))

      const itemsCreated: IItemEntity[] = await this._createManyItems.call(
        itemsToCreate,
      )

      const _itemsPricesOfItemsCreated = itemsWithHasNew.map(
        (item: IItemEntity, index: number) => {
          const currentItem: IItemEntity = itemsCreated[index]
          return {
            order: _itemsPrice.length + index,
            price: item.price,
            item: currentItem?._id,
          }
        },
      )

      itemsPrice = _itemsPrice.concat(_itemsPricesOfItemsCreated)
    }

    const menuToCreated: IMenuEntity = {
      name,
      business,
      itemsPrice,
    }

    const created: IMenuEntity = await this._repository.create(menuToCreated)
    return created
  }
}

import { IItemEntity, SubItem } from '../entities/item.entity'
import { IItemRepository } from '../adapters/repositories/types'
import { inject, injectable } from 'inversify'
import { Locator } from '../shared/di.enums'

import _ from 'lodash'
import { IMenuRepository } from '../../menus/adapters/repositories/types'

export interface ICreateCompleteItem {
  createCompleteItem: (item: CreateItemBody) => Promise<IItemEntity>
}

export type CreateItemBody = {
  name: string
  type: string
  prepareEnv: string
  complements: IItemEntity[]
  subItems: any[]
  menusIds: string[]
  price: number
  business: string
}

@injectable()
export class CreateCompleteItem implements ICreateCompleteItem {
  constructor(
    @inject(Locator.ItemRepository) readonly ItemRepository: IItemRepository,
    @inject(Locator.MenuRepository) readonly MenuRepository: IMenuRepository,
  ) {}
  async createCompleteItem(body: CreateItemBody): Promise<any> {
    const {
      name,
      type,
      prepareEnv,
      complements = [],
      subItems = [],
      menusIds,
      price,
      business,
    } = body

    const itemsToCreate: IItemEntity[] = this.getItemsToCreate(
      complements,
      subItems,
    )

    const items = await this.ItemRepository.createMany(
      itemsToCreate.map(item => ({ ...item, business })),
    )

    const itemsRelativeId = itemsToCreate.map((item, index) => ({
      key: item.key,
      _id: items[index]._id.toString(),
    }))

    const { _complements, _subItems } = await this.replaceItemsCreate({
      subItems,
      complements,
      itemsRelativeId,
    })

    const _item = await this.ItemRepository.create({
      name,
      type,
      prepareEnv,
      business,
      complements: _complements,
      subItems: _subItems,
    })

    if (menusIds && menusIds.length) {
      await this.MenuRepository.updateMany(
        { _id: { $in: menusIds } },
        {
          $push: {
            itemsPrice: {
              item: _item._id.toString(),
              price,
              typesOfConsumption: ['Consumo Local', 'Retirada', 'Delivery'],
            },
          },
        },
      )
    }

    return _item
  }

  getItemsToCreate(complements: IItemEntity[], subItems: any[]): IItemEntity[] {
    const complementsToCreate = complements
      .filter(comp => comp.hasNew)
      .map(i => {
        const item = _.cloneDeep(i)
        delete item._id
        return item
      })
    const optionsToCreate: any[] = []

    subItems.forEach(subItem => {
      subItem.options.forEach((opt: any) => {
        if (opt.hasNew) {
          delete opt._id
          optionsToCreate.push(opt)
        }
      })
    })

    return complementsToCreate.concat(optionsToCreate)
  }

  async replaceItemsCreate({
    subItems,
    complements,
    itemsRelativeId,
  }: {
    subItems: SubItem[]
    complements: any[]
    itemsRelativeId: any
  }) {
    const replaceId = (opt: any) => {
      let itemId = opt.key
      const hasRelativeId = itemsRelativeId.find(
        (item: any) => item.key === itemId,
      )
      if (hasRelativeId) itemId = hasRelativeId._id
      return {
        item: itemId,
        price: opt.price,
      }
    }

    const [_complements, _subItems] = await Promise.all([
      (async () => {
        return complements.map((comp: any) => replaceId(comp))
      })(),
      (async () => {
        return subItems.map((subItem: SubItem) => ({
          ...subItem,
          options: subItem.options.map((opt: any) => replaceId(opt)),
        }))
      })(),
    ])

    return {
      _subItems,
      _complements,
    }
  }
}

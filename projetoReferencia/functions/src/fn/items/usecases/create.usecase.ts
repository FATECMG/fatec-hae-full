import { IItemEntity } from '../entities/item.entity'
import { IItemRepository } from '../adapters/repositories/types'

export interface ICreateItem {
  createItem: (item: CreateItemBody) => Promise<IItemEntity>
}

export type CreateItemBody = IItemEntity

export class CreateItem implements ICreateItem {
  constructor(readonly repository: IItemRepository) {}

  async createItem(item: CreateItemBody): Promise<IItemEntity> {
    return await this.repository.create(item)
  }
}

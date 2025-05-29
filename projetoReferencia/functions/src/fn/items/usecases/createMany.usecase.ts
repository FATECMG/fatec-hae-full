import { IItemEntity } from '../entities/item.entity'
import { IItemRepository } from '../adapters/repositories/types'
import { inject, injectable } from 'inversify'
import { Locator } from '../shared/di.enums'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
export interface ICreateManyItems {
  createManyItems: (items: IItemEntity[]) => Promise<IItemEntity[]>
}

@injectable()
export class CreateManyItems implements ICreateManyItems {
  readonly _repository: IItemRepository
  readonly _sendImagesToAfterUpload: IExternal<IItemEntity[], IItemEntity[]>

  constructor(@inject(Locator.ItemRepository) ItemRepository: IItemRepository) {
    this._repository = ItemRepository
  }

  async createManyItems(_items: IItemEntity[]): Promise<IItemEntity[]> {
    const items = await this._repository.createMany(_items)
    return items
  }
}

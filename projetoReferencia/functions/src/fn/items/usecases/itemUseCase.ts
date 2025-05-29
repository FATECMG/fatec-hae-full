import { inject, injectable } from 'inversify'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { IItemRepository } from '../adapters/repositories/types'
import { IItemEntity } from '../entities/item.entity'
import { Locator } from '../shared/di.enums'
import { IItemUseCase } from './interfaces'

@injectable()
export class ItemUseCase implements IItemUseCase {
  constructor(
    @inject(Locator.ItemRepository) private itemRepository: IItemRepository,
    @inject(Locator.PublishEpisodeUpdate)
    private publish: IExternal<string, string>,
  ) {}
  async updateItem(item: IItemEntity): Promise<IItemEntity> {
    if ((item as any).stockQuantityToRemove) {
      item.stock.quantity = -(item as any).stockQuantityToRemove
    }

    if ((item as any).stockQuantityToAdd) {
      item.stock.quantity = (item as any).stockQuantityToAdd
    }

    const updatedItem = await this.itemRepository.patch(item)

    if ((item as any).shouldPublishUpdates && (item as any).episodeId) {
      await this.publish.call((item as any).episodeId)
    }

    return updatedItem
  }

  async getItem(id: string): Promise<IItemEntity> {
    return await this.itemRepository.findOne({ _id: id }, undefined, [
      {
        path: 'subItems',
        populate: {
          path: 'options',
          populate: {
            path: 'item',
          },
        },
      },
      {
        path: 'complements',
        populate: {
          path: 'item',
        },
      },
    ])
  }
}

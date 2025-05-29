import { IItemEntity } from '../entities/item.entity'
import { IItemRepository } from '../adapters/repositories/types'
import { removeFile, upload } from '../../../shared/firebase/storage'
import { inject, injectable } from 'inversify'
import { Locator } from '../shared/di.enums'

export interface IUploadPhotos {
  exec: (body: ItemPhotos) => Promise<IItemEntity>
}

export type ItemPhotos = {
  itemId: string
  photos: string[]
}

@injectable()
export class UploadPhotos implements IUploadPhotos {
  readonly _repository: IItemRepository

  constructor(@inject(Locator.ItemRepository) ItemRepository: IItemRepository) {
    this._repository = ItemRepository
  }

  async exec({ itemId, photos }: ItemPhotos): Promise<IItemEntity> {
    const _item = await this._repository.findOne({ _id: itemId }, 'photos')
    const lasPhotos = _item.photos || []
    const urls = await Promise.all(
      photos.map(async (photo, index) => {
        const file = {
          name: `${itemId}-${index}-${+new Date()}.png`,
          content: photo,
          contentType: 'image/png',
        }

        if (photo.startsWith('https://')) {
          return photo
        }

        const existsPhoto = lasPhotos[index]

        if (existsPhoto) {
          const parts = existsPhoto.split('/')
          const url = parts[parts.length - 1]
          await removeFile({ path: 'items', url })
        }

        const url = await upload({ path: 'items', file })
        return url
      }),
    )

    const item = await this._repository.update(
      { _id: itemId },
      {
        $set: {
          photos: urls,
          hasPhotos: true,
        },
      },
    )

    return item
  }
}

import { inject, injectable } from 'inversify'
import { IEpisodeRepository } from '../../episodes/adapters/repositories/interfaces.repository'
import { IMenuRepository } from '../adapters/repositories/types'
import { IMenuEntity } from '../entities/menu.entity'
import { Locator } from '../shared/di.enums'
import mongoose from 'mongoose'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'

const ObjectId = mongoose.Types.ObjectId

export interface IUpdateMenuUseCase {
  update: (body: IUpdateMenuBody) => Promise<IUpdateMenuResponse>
}

export interface IUpdateMenuResponse {
  menu: IMenuEntity
}

export interface IUpdateMenuBody {
  id: string
  business: string
  menu: any
}

@injectable()
export class UpdateMenuUseCase implements IUpdateMenuUseCase {
  constructor(
    @inject(Locator.MenuRepository) readonly repository: IMenuRepository,
    @inject(Locator.EpisodeRepository)
    readonly episodeRepository: IEpisodeRepository,
    @inject(Locator.PublishEpisodeUpdate)
    private publishEpisodeUpdate: IExternal<string, string>,
  ) {}

  async update(body: IUpdateMenuBody): Promise<IUpdateMenuResponse> {
    const { id, business, menu } = body

    const updated = await this.repository.update(
      { _id: id, business: new ObjectId(business) },
      { $set: menu },
      { new: true },
    )

    const episode = await this.episodeRepository.findOne(
      { business: new ObjectId(business) },
      'menus',
    )

    this.publishEpisodeUpdate.call(episode._id.toString())
    return { menu: updated } as IUpdateMenuResponse
  }
}

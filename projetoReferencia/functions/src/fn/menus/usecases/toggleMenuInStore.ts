import { inject, injectable } from 'inversify'
import { IEpisodeRepository } from '../../episodes/adapters/repositories/interfaces.repository'
import { IMenuRepository } from '../adapters/repositories/types'
import { Locator } from '../shared/di.enums'
import mongoose from 'mongoose'
import _ from 'lodash'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'

const ObjectId = mongoose.Types.ObjectId

export interface IToggleMenuInStore {
  toggle: (body: ITogleMenuInStoreBody) => Promise<ITogleMenuInStoreReponse>
}

export interface ITogleMenuInStoreReponse {
  toggle: boolean
}

export interface ITogleMenuInStoreBody {
  menu: string
  business: string
}

@injectable()
export class ToggleMenuInStore implements IToggleMenuInStore {
  constructor(
    @inject(Locator.MenuRepository) readonly repository: IMenuRepository,
    @inject(Locator.EpisodeRepository)
    readonly episodeRepository: IEpisodeRepository,
    @inject(Locator.PublishEpisodeUpdate)
    readonly publishEpisodeUpdate: IExternal<string, string>,
  ) {}

  async toggle(body: ITogleMenuInStoreBody): Promise<ITogleMenuInStoreReponse> {
    const { menu, business } = body

    const episode = await this.episodeRepository.findOne(
      { business: new ObjectId(business) },
      'menus',
    )

    const menus = _.xor(
      episode.menus.map(m => m.toString()),
      [menu],
    )

    await this.episodeRepository.updateById(episode._id.toString(), {
      menus,
    })

    this.publishEpisodeUpdate.call(episode._id.toString())

    return { toggle: true } as ITogleMenuInStoreReponse
  }
}

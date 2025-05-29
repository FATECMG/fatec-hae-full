import { inject, injectable } from 'inversify'
import { IEpisodeRepository } from '../../episodes/adapters/repositories/interfaces.repository'
import { IMenuRepository } from '../adapters/repositories/types'
import { IMenuEntity } from '../entities/menu.entity'
import { Locator } from '../shared/di.enums'
import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId

export interface IDetailsMenu {
  details: (body: IDetailsMenuBody) => Promise<IDetailsMenuResponse>
}

export interface IDetailsMenuResponse {
  menu: IMenuEntity
  activeInStore: boolean
}

export interface IDetailsMenuBody {
  id: string
  business: string
}

@injectable()
export class DetailsMenuUseCase implements IDetailsMenu {
  constructor(
    @inject(Locator.MenuRepository) readonly repository: IMenuRepository,
    @inject(Locator.EpisodeRepository)
    readonly episodeRepository: IEpisodeRepository,
  ) {}

  async details(body: IDetailsMenuBody): Promise<IDetailsMenuResponse> {
    const { id, business } = body

    const menu = await this.repository.findOne(
      { _id: id, business: new ObjectId(business) },
      null,
      'itemsPrice.item',
    )

    const episode = await this.episodeRepository.findOne(
      { business: new ObjectId(business) },
      'menus',
    )

    const menus = episode.menus.map(m => m.toString())
    const activeInStore = menus.includes(id)

    return { menu, activeInStore } as IDetailsMenuResponse
  }
}

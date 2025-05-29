import { inject, injectable } from 'inversify'
import { IBusiness } from '../../business/entities/interfaces.entity'
import { IEpisodeRepository } from '../adapters/repositories/interfaces.repository'
import { IEpisode } from '../entities/interfaces'
import { Locator } from '../shared/di.enums'

interface GetEpisodeForPwaBody {
  episode: string
  business: IBusiness
}

export interface IEpisodePWAUseCase {
  getEpisodeForPwa({
    episode,
    business,
  }: GetEpisodeForPwaBody): Promise<IEpisode>
}

@injectable()
export class EpisodePWAUseCase implements IEpisodePWAUseCase {
  constructor(
    @inject(Locator.EpisodeRepository)
    private episodeRepository: IEpisodeRepository,
  ) {}

  async getEpisodeForPwa({
    episode,
    business,
  }: GetEpisodeForPwaBody): Promise<IEpisode> {
    const ep = await this.episodeRepository.findOne(
      {
        _id: episode,
        business: business._id,
      },
      undefined,
      {
        path: 'business',
        select: 'contract',
        populate: {
          path: 'contract',
          select: 'features extraFeatures',
        },
      },
    )

    const allFeatures = [
      ...ep.business.contract?.features,
      ...ep.business.contract?.extraFeatures,
    ]

    const episodeToReturn = {
      ...ep,
      features: allFeatures,
    }

    return episodeToReturn
  }
}

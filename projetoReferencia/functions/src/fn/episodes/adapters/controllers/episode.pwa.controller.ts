import { Request } from 'express'
import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { validate } from '../../../../shared/decorators/validate'
import { IBusiness } from '../../../business/entities/interfaces.entity'
import { Locator } from '../../shared/di.enums'
import { IEpisodePWAUseCase } from '../../usecases/episode.pwa.usecase'
import { ValidateEpisodePWA } from '../validations/episode.pwa.validation.controller'

@injectable()
export class EpisodePWAController implements Handler {
  constructor(
    @inject(Locator.EpisodePWAUseCase) private usecase: IEpisodePWAUseCase,
  ) {}

  @validate(new ValidateEpisodePWA())
  async handle(req: Request): Promise<ResponseReturn> {
    const { episode, business } = req.query
    const buss = { _id: business } as IBusiness

    const episodeForStore = await this.usecase.getEpisodeForPwa({
      episode: episode as string,
      business: buss,
    })

    return {
      statusCode: 201,
      body: episodeForStore,
    }
  }
}

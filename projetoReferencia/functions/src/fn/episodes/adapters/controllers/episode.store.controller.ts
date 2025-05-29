import { Request } from 'express'
import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { validate } from '../../../../shared/decorators/validate'
import { Locator } from '../../shared/di.enums'
import { IEpisodeStoreUseCase } from '../../usecases/episode.store.usecase'
import { ValidateEpisodeForStore } from '../validations/episode.store.validation.controller'

@injectable()
export class EpisodeStoreController implements Handler {
  constructor(
    @inject(Locator.EpisodeStoreUsecase) private usecase: IEpisodeStoreUseCase,
  ) {}

  @validate(new ValidateEpisodeForStore())
  async handle(req: Request): Promise<ResponseReturn> {
    const { episode, typesOfConsumption } = req.query

    const episodeForStore = await this.usecase.getEpisodeForStore({
      episode: episode as string,
      typesOfConsumption: typesOfConsumption as any,
    })
    return {
      statusCode: 201,
      body: episodeForStore,
    }
  }
}

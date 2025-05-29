import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/di.enums'
import { Request } from 'express'
import { IEpisodeUseCase } from '../../usecases/interface.usecase'

@injectable()
export class GetEpisodeForPrepHttp implements Handler {
  constructor(
    @inject(Locator.EpisodeUseCase)
    private usecase: IEpisodeUseCase,
  ) {}

  async handle(request: Request): Promise<ResponseReturn> {
    const { episodeId } = request.query
    const episode = { _id: episodeId }
    const loadedEpisode = await this.usecase.getForPrep(episode)
    return {
      statusCode: 200,
      body: loadedEpisode,
    }
  }
}

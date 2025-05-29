import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/di.enums'
import { IEpisodeUseCase } from '../../usecases/interface.usecase'
import { IEpisode } from '../../entities/interfaces'
@injectable()
export class UpdateEpisodeHttp implements Handler {
  constructor(
    @inject(Locator.EpisodeUseCase) private usecase: IEpisodeUseCase,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const episodeBody = req.body
    const { episode } = req.params
    const episodeToUpdate: IEpisode = {
      _id: episode,
      ...episodeBody,
    }

    const updatedEpisode = await this.usecase.update(episodeToUpdate)

    return { statusCode: 200, body: updatedEpisode }
  }
}

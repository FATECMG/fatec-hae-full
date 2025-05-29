import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/di.enums'
import { IEpisodeUseCase } from '../../usecases/interface.usecase'
import { validate } from '../../../../shared/decorators/validate'
import { GetEpisodeIdByShortLinkHttpValidation } from './validation/getEpisodeIdByShortLinkHttpValidation'

@injectable()
export class GetEpisodeIdByShortLinkHttp implements Handler {
  constructor(
    @inject(Locator.EpisodeUseCase) private usecase: IEpisodeUseCase,
  ) {}

  @validate(new GetEpisodeIdByShortLinkHttpValidation())
  async handle(request: Request): Promise<ResponseReturn> {
    const { shortlink, projection } = request.query
    const episode = await this.usecase.getEpisodeByShortLink(
      shortlink as string,
      {
        projection,
      },
    )

    const episodeId = episode?._id
    return {
      statusCode: 200,
      body: episodeId,
    }
  }
}

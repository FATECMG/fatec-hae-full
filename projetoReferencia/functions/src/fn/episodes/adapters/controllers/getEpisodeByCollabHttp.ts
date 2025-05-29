import { inject, injectable } from 'inversify'
import { Handler } from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/di.enums'
import { IEpisodeUseCase } from '../../usecases/interface.usecase'
import { IEpisode } from '../../entities/interfaces'
import { validate } from '../../../../shared/decorators/validate'
import { GetEpisodeByCollabHttpValidation } from '../validations/getEpisodeByCollabHttpValidation'

@injectable()
export class GetEpisodeByCollabHttp implements Handler {
  constructor(
    @inject(Locator.EpisodeUseCase) private usecase: IEpisodeUseCase,
  ) {}

  @validate(new GetEpisodeByCollabHttpValidation())
  async handle(req: Request) {
    const { episode } = req.query

    const loadedEpisode = await this.usecase.getEpisodeForCollab(
      episode as IEpisode,
    )

    return {
      statusCode: 200,
      body: loadedEpisode,
    }
  }
}

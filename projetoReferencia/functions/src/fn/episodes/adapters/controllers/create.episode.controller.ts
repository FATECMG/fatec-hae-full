import { Request } from 'express'
import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { validate } from '../../../../shared/decorators/validate'
import { Locator } from '../../shared/di.enums'
import { IEpisodeUseCase } from '../../usecases/interface.usecase'
import { ValidateCreateEpisodeController } from '../validations/create.episode.validation.controller'

@injectable()
export class CreateEpisodeController implements Handler {
  constructor(
    @inject(Locator.EpisodeUseCase) private usecase: IEpisodeUseCase,
  ) {}

  @validate(new ValidateCreateEpisodeController())
  async handle(req: Request): Promise<ResponseReturn> {
    const { episode } = req.body
    const createdEpisode = await this.usecase.create(episode)
    return {
      statusCode: 201,
      body: createdEpisode,
    }
  }
}

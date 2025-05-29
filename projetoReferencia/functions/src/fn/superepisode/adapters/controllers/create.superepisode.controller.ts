import { Request } from 'express'
import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { validate } from '../../../../shared/decorators/validate'
import { Locator } from '../../shared/di.enums'
import { CreateSuperEpisodeUseCase } from '../../usecases/create.superepisode.usecase'
import { CreateSuperEpisodeControllerValidation } from './validations/create.superepisode.controller.validation'
@injectable()
export class CreateSuperEpisodeController implements Handler {
  constructor(
    @inject(Locator.CreateSuperEpisodeUseCase)
    private createSuperEpisodeUseCase: CreateSuperEpisodeUseCase,
  ) {}
  @validate(new CreateSuperEpisodeControllerValidation())
  async handle(req: Request): Promise<ResponseReturn> {
    const createdSuperEpisode = await this.createSuperEpisodeUseCase.create(
      req.body.superEpisode,
    )
    return {
      statusCode: 201,
      body: {
        superEpisode: createdSuperEpisode,
      },
    }
  }
}

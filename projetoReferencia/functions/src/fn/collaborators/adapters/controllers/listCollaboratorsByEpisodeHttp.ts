import { inject, injectable } from 'inversify'
import {
  Handle,
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/di.enums'
import { ICollaboratorUseCase } from '../../usecases/interfaces'
import { validate } from '../../../../shared/decorators/validate'
import { ListCollaboratorsByEpisodeHttpValidation } from './validations/listCollaboratorsByEpisodeHttpValidation'
@injectable()
export class ListCollaboratorsByEpisodeHttp implements Handler {
  constructor(
    @inject(Locator.CollaboratorsUseCase) private usecase: ICollaboratorUseCase,
  ) {}

  @validate(new ListCollaboratorsByEpisodeHttpValidation())
  async handle(req: Request): Promise<ResponseReturn> {
    const { episode, filters, populate } = req.query

    const collaborators = await this.usecase.list(
      episode as string,
      filters,
      populate,
    )
    return {
      statusCode: 200,
      body: collaborators,
    }
  }
}

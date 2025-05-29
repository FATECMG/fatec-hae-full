import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { Locator } from '../../shared/di.enums'
import { ICollaboratorUseCase } from '../../usecases/interfaces'
import { validate } from '../../../../shared/decorators/validate'
import { CollaboratorFindOneHttpValidation } from './validations/collaboratorFindOneHttpValidation'
import { IEpisode } from '../../../episodes/entities/interfaces'
@injectable()
export class CollaboratorFindOneHttp implements Handler {
  constructor(
    @inject(Locator.CollaboratorsUseCase) private usecase: ICollaboratorUseCase,
  ) {}

  @validate(new CollaboratorFindOneHttpValidation())
  async handle(req: Request): Promise<ResponseReturn> {
    const { name } = req.params
    const { projection, populate, episode } = req.query

    const loadedCollaborator = await this.usecase.findOne(
      { name, episode: episode as IEpisode },
      projection as string,
      populate,
    )
    return {
      statusCode: loadedCollaborator ? 200 : 204,
      body: loadedCollaborator,
    }
  }
}

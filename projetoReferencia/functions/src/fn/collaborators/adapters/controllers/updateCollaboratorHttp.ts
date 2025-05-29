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
import { UpdateCollaboratorHttpValidation } from './validations/updateCollaboratorHttpValidation'
import { ICollaborator } from '../../entities/interfaces'

@injectable()
export class UpdateCollaboratorHttp implements Handler {
  constructor(
    @inject(Locator.CollaboratorsUseCase) private usecase: ICollaboratorUseCase,
  ) {}

  @validate(new UpdateCollaboratorHttpValidation())
  async handle(req: Request): Promise<ResponseReturn> {
    const { collaborator: id } = req.params || {}
    const collaborator: ICollaborator = req.body || {}
    collaborator._id = id
    const updatedCollaborator = await this.usecase.update(collaborator)
    return {
      statusCode: 200,
      body: updatedCollaborator,
    }
  }
}

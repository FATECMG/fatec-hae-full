import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/di.enums'
import { ICollaboratorUseCase } from '../../usecases/interfaces'
import { Request } from 'express'

@injectable()
export class DeleteCollaboratorHttp implements Handler {
  constructor(
    @inject(Locator.CollaboratorsUseCase) private usecase: ICollaboratorUseCase,
  ) {}
  async handle(req: Request): Promise<ResponseReturn> {
    const { collaborator } = req.params
    const deletedCollaborator = await this.usecase.delete({ _id: collaborator })
    return {
      statusCode: 200,
      body: deletedCollaborator,
    }
  }
}

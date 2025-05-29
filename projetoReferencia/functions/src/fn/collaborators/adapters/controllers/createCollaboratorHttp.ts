import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/di.enums'
import { ICollaboratorUseCase } from '../../usecases/interfaces'
import { Request } from 'express'
import { ICollaborator } from '../../entities/interfaces'
@injectable()
export class CreateCollaboratorHttp implements Handler {
  constructor(
    @inject(Locator.CollaboratorsUseCase)
    private usecase: ICollaboratorUseCase,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const { collaborator } = req.body

    const collaboratorToAdd: ICollaborator = {
      episode: { _id: collaborator.episodeId },
      name: collaborator.name,
      type: collaborator.type,
    }

    const createdCollaborator = await this.usecase.create(collaboratorToAdd)

    return { statusCode: 200, body: createdCollaborator }
  }
}

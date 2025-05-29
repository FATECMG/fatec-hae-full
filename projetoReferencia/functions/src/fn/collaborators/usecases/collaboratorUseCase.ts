import { inject, injectable } from 'inversify'
import { validate } from '../../../shared/decorators/validate'
import { ICollaboratorRepository } from '../adapters/repositories/interfaces'
import { ICollaborator } from '../entities/interfaces'
import { Locator } from '../shared/di.enums'
import { ICollaboratorUseCase } from './interfaces'
import { CollaboratorFindOneValidation } from './validations/collaboratorFindOneValidation'

@injectable()
export class CollaboratorUseCase implements ICollaboratorUseCase {
  constructor(
    @inject(Locator.CollaboratorRepository)
    private repo: ICollaboratorRepository,
  ) {}

  @validate(new CollaboratorFindOneValidation())
  async findOne(
    collaborator: ICollaborator,
    projection: string,
    populate?: any,
  ): Promise<ICollaborator> {
    const loadedCollaborator = await this.repo.findOne(
      {
        $or: [
          {
            episode: collaborator.episode._id,
            name: collaborator.name,
          },
          { _id: collaborator._id },
        ],
      },
      projection,
      populate,
    )

    return loadedCollaborator
  }

  async create(collaborator: ICollaborator): Promise<ICollaborator> {
    const createdCollaborator = await this.repo.create(collaborator)
    return createdCollaborator
  }

  async update(collaborator: ICollaborator): Promise<ICollaborator> {
    const updatedCollaborator = await this.repo.update(collaborator)
    return updatedCollaborator
  }

  async list(
    episodeId: string,
    filters?: any,
    populate?: any,
  ): Promise<ICollaborator[]> {
    return await this.repo.find(
      { episode: episodeId, active: true },
      filters?.projection,
      populate,
    )
  }

  async delete(collaborator: ICollaborator): Promise<ICollaborator> {
    collaborator.active = false
    collaborator.name = `${collaborator.name}-(deleted)`
    return await this.repo.update(collaborator)
  }
}

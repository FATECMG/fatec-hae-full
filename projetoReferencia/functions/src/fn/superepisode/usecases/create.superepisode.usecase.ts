import { inject, injectable } from 'inversify'
import { validate } from '../../../shared/decorators/validate'
import { ISuperEpisodeRepository } from '../adapters/repositories/interfaces.repositories'
import { ISuperEpisode } from '../entities/interfaces'
import { Locator } from '../shared/di.enums'
import { ICreateSuperEpisodeUseCase } from './interfaces.superepisode.usecase'
import { CreateSuperEpisodeUseCaseValidation } from './validations/create.superepisode.usecase.validation'

@injectable()
export class CreateSuperEpisodeUseCase implements ICreateSuperEpisodeUseCase {
  constructor(
    @inject(Locator.CreateSuperEpisodeMongo)
    private superEpisodeRepository: ISuperEpisodeRepository,
  ) {}

  @validate(new CreateSuperEpisodeUseCaseValidation())
  async create(superEpisode: ISuperEpisode): Promise<ISuperEpisode> {
    const createdSuperEpisode = await this.superEpisodeRepository.create(
      superEpisode,
    )
    return createdSuperEpisode
  }
}

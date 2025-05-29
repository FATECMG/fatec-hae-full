import { Container } from 'inversify'
import { Handler } from '../../../shared/adapters/controllers/interfaces'
import { CreateSuperEpisodeController } from '../adapters/controllers/create.superepisode.controller'
import { CreateSuperEpisodeMongo } from '../adapters/repositories/create.superepisode.repository'
import { ISuperEpisodeRepository } from '../adapters/repositories/interfaces.repositories'
import { CreateSuperEpisodeUseCase } from '../usecases/create.superepisode.usecase'
import { ICreateSuperEpisodeUseCase } from '../usecases/interfaces.superepisode.usecase'
import { Locator } from './di.enums'
const container = new Container()
container
  .bind<Handler>(Locator.CreateSuperEpisodeController)
  .to(CreateSuperEpisodeController)
container
  .bind<ICreateSuperEpisodeUseCase>(Locator.CreateSuperEpisodeUseCase)
  .to(CreateSuperEpisodeUseCase)
container
  .bind<ISuperEpisodeRepository>(Locator.CreateSuperEpisodeMongo)
  .to(CreateSuperEpisodeMongo)

export { container }

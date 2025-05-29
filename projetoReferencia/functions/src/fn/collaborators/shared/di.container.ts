import { Container } from 'inversify'
import { Handler } from '../../../shared/adapters/controllers/interfaces'
import { CollaboratorFindOneHttp } from '../adapters/controllers/collaboratorFindOneHttp'
import { CreateCollaboratorHttp } from '../adapters/controllers/createCollaboratorHttp'
import { DeleteCollaboratorHttp } from '../adapters/controllers/deleteCollaboratorHttp'
import { ListCollaboratorsByEpisodeHttp } from '../adapters/controllers/listCollaboratorsByEpisodeHttp'
import { UpdateCollaboratorHttp } from '../adapters/controllers/updateCollaboratorHttp'
import { CollaboratorMongo } from '../adapters/repositories/collaboratorMongo'
import { ICollaboratorRepository } from '../adapters/repositories/interfaces'
import { CollaboratorUseCase } from '../usecases/collaboratorUseCase'
import { ICollaboratorUseCase } from '../usecases/interfaces'
import { Locator } from './di.enums'

export const container = new Container()

container
  .bind<ICollaboratorRepository>(Locator.CollaboratorRepository)
  .to(CollaboratorMongo)
container
  .bind<ICollaboratorUseCase>(Locator.CollaboratorsUseCase)
  .to(CollaboratorUseCase)
container
  .bind<Handler>(Locator.CollaboratorFindOneHttp)
  .to(CollaboratorFindOneHttp)
container
  .bind<Handler>(Locator.CreateCollaboratorHttp)
  .to(CreateCollaboratorHttp)
container
  .bind<Handler>(Locator.UpdateCollaboratorHttp)
  .to(UpdateCollaboratorHttp)

container
  .bind<Handler>(Locator.ListCollaboratorsByEpisodeHttp)
  .to(ListCollaboratorsByEpisodeHttp)

container
  .bind<Handler>(Locator.DeleteCollaboratorHttp)
  .to(DeleteCollaboratorHttp)

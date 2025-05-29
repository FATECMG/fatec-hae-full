import { Container } from 'inversify'
import { Handler } from '../../../shared/adapters/controllers/interfaces'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { BusinessRepository } from '../../business/adapters/repositories/business.repository'
import { IBusinessRepository } from '../../business/adapters/repositories/interfaces.repository'
import { ICollaborator } from '../../collaborators/entities/interfaces'
import { EpisodeRepository } from '../../episodes/adapters/repositories/episode.repository'
import { IEpisodeRepository } from '../../episodes/adapters/repositories/interfaces.repository'
import { LoginHttp } from '../adapters/controllers/login.http'
import { LoginCollaboratorHttp } from '../adapters/controllers/loginCollaboratorHttp'
import { LoginPrepHttp } from '../adapters/controllers/loginPrepHttp'
import { FindOneCollaboratorExternal } from '../adapters/external/findOneCollaborator.external'
import {
  Auth,
  LoginFirebaseExternal,
} from '../adapters/external/login.firebase.external'
import { ILogin } from '../entities/interfaces'
import { ILoginUseCase } from '../usecases/interfaces'
import { LoginUseCase } from '../usecases/login.usecase'
import { Locator } from './di.enums'

export const container = new Container()

container.bind<ILoginUseCase>(Locator.LoginUseCase).to(LoginUseCase)
container
  .bind<IExternal<ILogin, Auth>>(Locator.LoginFirebaseExternal)
  .to(LoginFirebaseExternal)
container
  .bind<IExternal<ICollaborator, ICollaborator>>(
    Locator.FindOneCollaboratorExternal,
  )
  .to(FindOneCollaboratorExternal)
container
  .bind<IBusinessRepository>(Locator.BusinessRepository)
  .to(BusinessRepository)
container.bind<Handler>(Locator.LoginHttp).to(LoginHttp)
container.bind<Handler>(Locator.LoginCollaboratorHttp).to(LoginCollaboratorHttp)
container
  .bind<IEpisodeRepository>(Locator.EpisodeRepository)
  .to(EpisodeRepository)
container.bind<Handler>(Locator.LoginPrepHttp).to(LoginPrepHttp)

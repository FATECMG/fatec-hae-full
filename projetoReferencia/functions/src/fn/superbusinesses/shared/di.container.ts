import { Container } from 'inversify'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import {
  Auth,
  LoginFirebaseSuperBusinessExternal,
} from '../adapters/externals/login.firebase.superbusiness.external'
import { SuperBusinessSetCookiesExternal } from '../adapters/externals/superbusiness.cookies.external'
import { ISuperBusinessRepository } from '../adapters/repositories/interfaces.repositories'
import { SuperBusinessRepository } from '../adapters/repositories/superbusiness.repositories'
import { ISuperBusiness } from '../entities/interfaces.entities'
import { ISuperBusinessUseCase } from '../usecases/interfaces.usecases'
import { SuperBusinessUseCase } from '../usecases/superbusiness.usecase'
import { Locator } from './di.enums'

export const container = new Container()
container
  .bind<ISuperBusinessRepository>(Locator.SuperBusinessRepository)
  .to(SuperBusinessRepository)
container
  .bind<IExternal<ISuperBusiness, Auth>>(
    Locator.SuperBusinessLoginFirebaseExternal,
  )
  .to(LoginFirebaseSuperBusinessExternal)
container
  .bind<IExternal<{ jwt: string; res: any }, void>>(
    Locator.SuperBusinessSetCookieExternal,
  )
  .to(SuperBusinessSetCookiesExternal)
container
  .bind<ISuperBusinessUseCase>(Locator.SuperBusinessUseCase)
  .to(SuperBusinessUseCase)

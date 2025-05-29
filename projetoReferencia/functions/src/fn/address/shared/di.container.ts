import { Container } from 'inversify'
import { Handler } from '../../../shared/adapters/controllers/interfaces'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { GetAddressByPlaceIdExternal } from '../adapters/external/getaddressbyplaceid.external'
import { ComposeByPlaceIdController } from '../adapters/controllers/composebyplaceid.controller'
import { Locator } from './di.enums'
import { ComposeByPlaceIdUseCase } from '../usecases/composebyplaceid.usecase'
import { IComposeByPlaceIdUseCase } from '../usecases/interfaces.usecases'
import { IAddress } from '../entities/interfaces.entity'

export const container = new Container()

container
  .bind<IExternal<string, IAddress>>(Locator.GetAddressByPlaceIdExternal)
  .to(GetAddressByPlaceIdExternal)
container
  .bind<Handler>(Locator.ComposeByPlaceIdController)
  .to(ComposeByPlaceIdController)
container
  .bind<IComposeByPlaceIdUseCase>(Locator.ComposeByPlaceIdUseCase)
  .to(ComposeByPlaceIdUseCase)

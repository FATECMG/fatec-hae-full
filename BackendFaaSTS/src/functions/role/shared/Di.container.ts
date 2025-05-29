import 'reflect-metadata'
import { Container } from 'inversify'

import { RoleLocator } from '@functions/role/shared/Di.enums'
import { type IRoleRepository } from '@functions/role/adapter/repositories/RoleRepository'
import { RoleRepository } from '@functions/role/adapter/repositories/RoleMongoRepository'
import { type IRoleUseCases } from '@functions/role/useCases/RoleUseCases.interface'
import { RoleUseCases } from '@functions/role/useCases/RoleUseCases'
import { RoleController } from '@functions/role/controller/RoleController'

export const RoleContainer = new Container()

RoleContainer.bind<IRoleRepository>(RoleLocator.RoleRepository)
  .to(RoleRepository)

RoleContainer.bind<IRoleUseCases>(RoleLocator.RoleUseCases)
  .to(RoleUseCases)

RoleContainer.bind<RoleController>(RoleLocator.RoleController)
  .to(RoleController)

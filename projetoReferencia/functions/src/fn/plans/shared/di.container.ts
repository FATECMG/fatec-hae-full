import { Container } from 'inversify'
import { Handler } from '../../../shared/adapters/controllers/interfaces'
import { Locator } from './di.enums'
import { IPlanRepository } from '../adapters/repositories/types'
import { PlanRepository } from '../adapters/repositories/mongo.repository'
import { IListPlans, ListPlans } from '../usecases/list.usecase'
import { ListPlansController } from '../adapters/controllers/list.controller'

const container = new Container()
container.bind<Handler>(Locator.ListPlansController).to(ListPlansController)
container.bind<IPlanRepository>(Locator.PlanRepository).to(PlanRepository)
container.bind<IListPlans>(Locator.ListPlansUseCase).to(ListPlans)

export { container }

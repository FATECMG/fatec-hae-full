import { Container } from 'inversify'
import { PlanRepository } from '../../plans/adapters/repositories/mongo.repository'
import { IPlanRepository } from '../../plans/adapters/repositories/types'
import {
  Handler,
  IPubSubTrigger,
} from '../../../shared/adapters/controllers/interfaces'
import { ContractDetailsHttp } from '../adapters/controllers/contract.details.http'
import { CreateContractTrigger } from '../adapters/controllers/create.contract.trigger'
import { DeactivateContractTrigger } from '../adapters/controllers/deactivateContractTrigger'
import { EndTrialTrigger } from '../adapters/controllers/endTrialTrigger'
import { ContractRepository } from '../adapters/repositories/contract.repository'
import { IContractRepository } from '../adapters/repositories/interfaces'
import { ContractDetails } from '../usecases/contract.details.usecase'
import { ContractUseCase } from '../usecases/contract.usecase'
import { IContractDetails, IContractUseCases } from '../usecases/interfaces'
import { Locator } from './di.enums'
import { CancelContractHttp } from '../adapters/controllers/contract.cancel.http'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { ManageContractsJob } from '../adapters/controllers/manageContracstJob'
import { DisableContractExternal } from '../adapters/externals/disableContractExternal'

export const container = new Container()

container
  .bind<IContractRepository>(Locator.ContractRepository)
  .to(ContractRepository)
container.bind<IContractUseCases>(Locator.ContractUseCase).to(ContractUseCase)
container
  .bind<IPubSubTrigger>(Locator.CreateContractTrigger)
  .to(CreateContractTrigger)
container.bind<Handler>(Locator.ContractDetailsHttp).to(ContractDetailsHttp)
container
  .bind<IContractDetails>(Locator.ContractDetailsUseCase)
  .to(ContractDetails)
container.bind<IPubSubTrigger>(Locator.EndTrialTrigger).to(EndTrialTrigger)
container.bind<IPlanRepository>(Locator.PlansRepository).to(PlanRepository)
container
  .bind<IPubSubTrigger>(Locator.DeactivateContractTrigger)
  .to(DeactivateContractTrigger)
container.bind<Handler>(Locator.CancelContractHttp).to(CancelContractHttp)
container
  .bind<IExternal<string, void>>(Locator.DisableContractExternal)
  .to(DisableContractExternal)
container
  .bind<IPubSubTrigger>(Locator.ManageContractsJob)
  .to(ManageContractsJob)

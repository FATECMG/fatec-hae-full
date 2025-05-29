import { Container } from 'inversify'
import { Handler } from '../../../shared/adapters/controllers/interfaces'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { BusinessRepository } from '../../business/adapters/repositories/business.repository'
import { IBusinessRepository } from '../../business/adapters/repositories/interfaces.repository'
import { ContractRepository } from '../../contracts/adapters/repositories/contract.repository'
import { IContractRepository } from '../../contracts/adapters/repositories/interfaces'
import { PlanRepository } from '../../plans/adapters/repositories/mongo.repository'
import { IPlanRepository } from '../../plans/adapters/repositories/types'
import { ChangeSubscriptionCardHttp } from '../adapters/controllers/changeSubscriptionCardHttp'
import { CreateSubscriptionHttp } from '../adapters/controllers/createSubscriptionHttp'
import { GetSubscriptionCardHttp } from '../adapters/controllers/getSubscriptionCardHttp'
import { ListSubscriptionCharges } from '../adapters/controllers/listSubscriptionChargesHttp'
import { ManageSubscriptionPaymentHttp } from '../adapters/controllers/manageSubscriptionPaymentHttp'
import { upgradeSubscriptionHttp } from '../adapters/controllers/updateSubscriptionHttp'
import { CancelSubscriptionExternal } from '../adapters/externals/cancelSubscriptionExternal'
import { ChangeSubscriptionCardExternal } from '../adapters/externals/changeSubscriptionCardExternal'
import { CreateSubscriptionExternal } from '../adapters/externals/createSubscriptionExternal'
import { DisableContractExternal } from '../adapters/externals/disableContractExternal'
import { GetSubscriptionExternal } from '../adapters/externals/getSubscriptionExternal'
import { ListChargesExternal } from '../adapters/externals/listChargesExternal'
import { ISubscriptionUseCase } from '../usecases/interfaces'
import { SubscriptionUseCase } from '../usecases/subscriptionUseCase'
import { Locator } from './diEnums'

export const container = new Container()

container
  .bind<ISubscriptionUseCase>(Locator.SubscriptionUseCase)
  .to(SubscriptionUseCase)
container
  .bind<IExternal<any, any>>(Locator.CreateSubscriptionExternal)
  .to(CreateSubscriptionExternal)
container
  .bind<Handler>(Locator.CreateSubscriptionHttp)
  .to(CreateSubscriptionHttp)
container
  .bind<IBusinessRepository>(Locator.BusinessRepository)
  .to(BusinessRepository)
container.bind<IPlanRepository>(Locator.PlanRepository).to(PlanRepository)
container
  .bind<IExternal<string, any>>(Locator.DisableContractExternal)
  .to(DisableContractExternal)
container
  .bind<Handler>(Locator.ManageSubscriptionPaymentHttp)
  .to(ManageSubscriptionPaymentHttp)
container
  .bind<IContractRepository>(Locator.ContractRepository)
  .to(ContractRepository)
container
  .bind<IExternal<string, any>>(Locator.GetSubscriptionExternal)
  .to(GetSubscriptionExternal)
container
  .bind<Handler>(Locator.UpgradeSubscriptionHttp)
  .to(upgradeSubscriptionHttp)
container
  .bind<IExternal<string, void>>(Locator.CancelSubscriptionExternal)
  .to(CancelSubscriptionExternal)
container
  .bind<IExternal<string, any>>(Locator.ListChargesExternal)
  .to(ListChargesExternal)
container
  .bind<Handler>(Locator.ListSubscriptionChargesHttp)
  .to(ListSubscriptionCharges)
container
  .bind<IExternal<any, any>>(Locator.ChangeSubscriptionCardExternal)
  .to(ChangeSubscriptionCardExternal)
container
  .bind<Handler>(Locator.ChangeSubscriptionCardHttp)
  .to(ChangeSubscriptionCardHttp)
container.bind<Handler>(Locator.GetSubscriptionHttp).to(GetSubscriptionCardHttp)

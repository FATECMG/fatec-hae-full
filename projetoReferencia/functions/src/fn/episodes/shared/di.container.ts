import { Container } from 'inversify'
import {
  Handler,
  IPubSubTrigger,
} from '../../../shared/adapters/controllers/interfaces'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { ContractRepository } from '../../contracts/adapters/repositories/contract.repository'
import { IContractRepository } from '../../contracts/adapters/repositories/interfaces'
import { MenuRepository } from '../../menus/adapters/repositories/mongo.repository'
import { IMenuRepository } from '../../menus/adapters/repositories/types'
import { IOrdersRepository } from '../../orders/adapters/repositories/interfaces'
import { OrdersMongo } from '../../orders/adapters/repositories/orders.mongo'
import { CreateEpisodeController } from '../adapters/controllers/create.episode.controller'
import { CreateEpisodeControllerTrigger } from '../adapters/controllers/create.episode.trigger'
import { EpisodePWAController } from '../adapters/controllers/episode.pwa.controller'
import { EpisodeStoreController } from '../adapters/controllers/episode.store.controller'
import { GetEpisodeByCollabHttp } from '../adapters/controllers/getEpisodeByCollabHttp'
import { GetEpisodeDeliveryTypesHttp } from '../adapters/controllers/getEpisodeDeliveryTypesHttp'
import { GetEpisodeForPrepHttp } from '../adapters/controllers/getEpisodeForPrepHttp'
import { GetEpisodeIdByShortLinkHttp } from '../adapters/controllers/getEpisodeIdByShortLinkHttp'
import { GetEpisodeMenusHttp } from '../adapters/controllers/getEpisodeMenusHttp'
import { GetEpisodePaymentTypesHttp } from '../adapters/controllers/GetEpisodePaymentTypesHttp'
import { GetEpisodePodiumHttp } from '../adapters/controllers/getEpisodePodiumHttp'
import { GetEpisodeRevenuesHttp } from '../adapters/controllers/getEpisodeRevenuesHttp'
import { GetEpisodeStockViewHttp } from '../adapters/controllers/getEpisodeStockViewHttp'
import { GetEpisodeTaxAndDiscountsHttp } from '../adapters/controllers/GetEpisodeTaxAndDiscountsHttp'
import { isShortLinkAvailableController } from '../adapters/controllers/isShortLinkAvailableController'
import { UpdateEpisodeHttp } from '../adapters/controllers/updateEpisodeHttp'
import { UpdateEpisodeLogoHttp } from '../adapters/controllers/updateEpisodeLogo.http'
import { EpisodeRepository } from '../adapters/repositories/episode.repository'
import { IEpisodeRepository } from '../adapters/repositories/interfaces.repository'
import {
  EpisodePWAUseCase,
  IEpisodePWAUseCase,
} from '../usecases/episode.pwa.usecase'
import {
  EpisodeStoreUsecase,
  IEpisodeStoreUseCase,
} from '../usecases/episode.store.usecase'
import { EpisodeUseCase } from '../usecases/episode.usecase'
import { File } from '../usecases/external/interfaces'
import { PublishEpisodeUpdate } from '../usecases/external/publishEpisodeUpdate'
import { UploadEpisodeLogo } from '../usecases/external/uploadEpisodeLogo'
import { IEpisodeUseCase } from '../usecases/interface.usecase'
import { Locator } from './di.enums'

export const container = new Container()

container
  .bind<IEpisodeRepository>(Locator.EpisodeRepository)
  .to(EpisodeRepository)
container.bind<IEpisodeUseCase>(Locator.EpisodeUseCase).to(EpisodeUseCase)
container
  .bind<Handler>(Locator.CreateEpisodeController)
  .to(CreateEpisodeController)
container
  .bind<Handler>(Locator.GetEpisodeByCollabHttp)
  .to(GetEpisodeByCollabHttp)
container
  .bind<IPubSubTrigger>(Locator.CreateEpisodeControllerTrigger)
  .to(CreateEpisodeControllerTrigger)
container
  .bind<IEpisodeStoreUseCase>(Locator.EpisodeStoreUsecase)
  .to(EpisodeStoreUsecase)
container
  .bind<Handler>(Locator.EpisodeStoreController)
  .to(EpisodeStoreController)
container
  .bind<IContractRepository>(Locator.ContractRepository)
  .to(ContractRepository)
container.bind<IMenuRepository>(Locator.MenuRepository).to(MenuRepository)
container
  .bind<IEpisodePWAUseCase>(Locator.EpisodePWAUseCase)
  .to(EpisodePWAUseCase)
container.bind<Handler>(Locator.EpisodePWAController).to(EpisodePWAController)
container
  .bind<IExternal<File, string>>(Locator.UploadEpisodeLogo)
  .to(UploadEpisodeLogo)
container.bind<Handler>(Locator.UpdateEpisodeLogoHttp).to(UpdateEpisodeLogoHttp)
container.bind<Handler>(Locator.UpdateEpisodeHttp).to(UpdateEpisodeHttp)

container
  .bind<IExternal<string, string>>(Locator.PublishEpisodeUpdate)
  .to(PublishEpisodeUpdate)

container
  .bind<Handler>(Locator.IsShortLinkAvailable)
  .to(isShortLinkAvailableController)
container.bind<IOrdersRepository>(Locator.OrderRepository).to(OrdersMongo)
container
  .bind<Handler>(Locator.GetEpisodeIdByShortLinkHttp)
  .to(GetEpisodeIdByShortLinkHttp)
container
  .bind<Handler>(Locator.GetEpisodeRevenuesHttp)
  .to(GetEpisodeRevenuesHttp)
container
  .bind<Handler>(Locator.GetEpisodeDeliveryTypesHttp)
  .to(GetEpisodeDeliveryTypesHttp)
container
  .bind<Handler>(Locator.GetEpisodePaymentTypesHttp)
  .to(GetEpisodePaymentTypesHttp)
container
  .bind<Handler>(Locator.GetEpisodeTaxAndDiscountsHttp)
  .to(GetEpisodeTaxAndDiscountsHttp)
container.bind<Handler>(Locator.GetEpisodePodiumHttp).to(GetEpisodePodiumHttp)
container
  .bind<Handler>(Locator.GetEpisodeStockViewHttp)
  .to(GetEpisodeStockViewHttp)

container.bind<Handler>(Locator.GetEpisodeMenusHttp).to(GetEpisodeMenusHttp)
container.bind<Handler>(Locator.GetEpisodeForPrepHttp).to(GetEpisodeForPrepHttp)

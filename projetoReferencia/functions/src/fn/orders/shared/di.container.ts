import { Container } from 'inversify'
import { Handler } from '../../../shared/adapters/controllers/interfaces'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { CancelExpiredOrderHttp } from '../adapters/controllers/cancelExpiredOrder.http'
import { GetOneOrderHttp } from '../adapters/controllers/getone.order.http'
import { ListForCollabHttp } from '../adapters/controllers/listForCollabHttp'
import { UpdateOrderElevateHttp } from '../adapters/controllers/updateOrderElevateHttp'
import { PublishOrderUpdatesExternal } from '../adapters/externals/publishOrderUpdates.external'
import { OrderUpdateNotificationExternal } from '../adapters/externals/orderUpdateNotificationExternal'
import { IOrdersRepository } from '../adapters/repositories/interfaces'
import { OrdersMongo } from '../adapters/repositories/orders.mongo'
import { IOrder, OrderItem } from '../entities/interfaces'
import { IOrdersUseCase } from '../usecases/interfaces'
import { OrdersUseCase } from '../usecases/orders.usecase'
import { Locator } from './di.enums'
import { IMenuRepository } from '../../menus/adapters/repositories/types'
import { MenuRepository } from '../../menus/adapters/repositories/mongo.repository'
import { IContractRepository } from '../../contracts/adapters/repositories/interfaces'
import { ContractRepository } from '../../contracts/adapters/repositories/contract.repository'
import { IItemRepository } from '../../items/adapters/repositories/types'
import { ItemRepository } from '../../items/adapters/repositories/mongo.repository'
import { ListForBusinessHttp } from '../adapters/controllers/listForBusinessHttp'
import { ICollaboratorRepository } from '../../collaborators/adapters/repositories/interfaces'
import { CollaboratorMongo } from '../../collaborators/adapters/repositories/collaboratorMongo'
import {
  CollaboratorUpdateNotificationExternal,
  ICollaboratorUpdateNotificationArgs,
} from '../adapters/externals/collaboratorUpdateNotificationExternal'
import { IEpisodeRepository } from '../../episodes/adapters/repositories/interfaces.repository'
import { CreateOrderHttp } from '../adapters/controllers/createOrderHttp'
import { EpisodeRepository } from '../../episodes/adapters/repositories/episode.repository'
import { PublishOrderCreationExternal } from '../adapters/externals/publishOrderCreationExternal'
import { ChangeOrderItemStatusHttp } from '../adapters/controllers/changeOrderItemStatusHttp'
import { ChangeOrderItemsStatusHttp } from '../adapters/controllers/changeOrderItemsStatusHttp'

export const container = new Container()

container.bind<IOrdersRepository>(Locator.OrdersRepository).to(OrdersMongo)
container.bind<IMenuRepository>(Locator.MenusRepository).to(MenuRepository)
container.bind<IOrdersUseCase>(Locator.OrdersUseCase).to(OrdersUseCase)
container.bind<Handler>(Locator.GetOneOrderHttp).to(GetOneOrderHttp)
container.bind<Handler>(Locator.ListOrdersForBusiness).to(ListForBusinessHttp)
container
  .bind<Handler>(Locator.UpdateOrderElevateHttp)
  .to(UpdateOrderElevateHttp)
container
  .bind<Handler>(Locator.CancelExpiredOrderHttp)
  .to(CancelExpiredOrderHttp)
container.bind<Handler>(Locator.ListOrdersForCollabHttp).to(ListForCollabHttp)
container
  .bind<IExternal<IOrder, void>>(Locator.PublishOrderExternal)
  .to(PublishOrderUpdatesExternal)
container
  .bind<IExternal<{ order: IOrder; orderItem?: OrderItem }, void>>(
    Locator.OrderUpdateNotificationExternal,
  )
  .to(OrderUpdateNotificationExternal)
container
  .bind<IExternal<ICollaboratorUpdateNotificationArgs, void>>(
    Locator.CollaboratorUpdateNotificationExternal,
  )
  .to(CollaboratorUpdateNotificationExternal)
container
  .bind<IContractRepository>(Locator.ContractRepository)
  .to(ContractRepository)
container.bind<IItemRepository>(Locator.ItemRepository).to(ItemRepository)
container
  .bind<ICollaboratorRepository>(Locator.CollaboratorsRepository)
  .to(CollaboratorMongo)
container
  .bind<IEpisodeRepository>(Locator.EpisodeRepository)
  .to(EpisodeRepository)
container.bind<Handler>(Locator.CreateOrderHttp).to(CreateOrderHttp)
container
  .bind<IExternal<IOrder, void>>(Locator.PublishOrderCreationExternal)
  .to(PublishOrderCreationExternal)
container
  .bind<Handler>(Locator.ChangeOrderItemStatusHttp)
  .to(ChangeOrderItemStatusHttp)
container
  .bind<Handler>(Locator.ChangeOrderItemsStatusHttp)
  .to(ChangeOrderItemsStatusHttp)

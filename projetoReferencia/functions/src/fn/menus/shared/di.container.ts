import { Container } from 'inversify'
import { Handler } from '../../../shared/adapters/controllers/interfaces'
import { Locator } from './di.enums'
import { CreateMenuController } from '../adapters/controllers/create.controller'
import { IMenuRepository } from '../adapters/repositories/types'
import { MenuRepository } from '../adapters/repositories/mongo.repository'
import { CreateMenu, ICreateMenu } from '../usecases/create.usecase'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { createManyItemsRequest } from '../adapters/external/createManyItemsRequest'
import { IItemEntity } from '../../items/entities/item.entity'
import { IListMenus, ListMenus } from '../usecases/list.usecase'
import { ListMenusController } from '../adapters/controllers/list.controller'
import { DetailsMenuController } from '../adapters/controllers/details.controller'
import { DetailsMenuUseCase, IDetailsMenu } from '../usecases/details.usecase'
import { IEpisodeRepository } from '../../episodes/adapters/repositories/interfaces.repository'
import { EpisodeRepository } from '../../episodes/adapters/repositories/episode.repository'
import {
  IToggleMenuInStore,
  ToggleMenuInStore,
} from '../usecases/toggleMenuInStore'
import {
  IUpdateMenuUseCase,
  UpdateMenuUseCase,
} from '../usecases/update.usecase'
import { UpdateMenuController } from '../adapters/controllers/update.controller'
import { PublishEpisodeUpdate } from '../adapters/external/publishEpisodeUpdate'
import { ToggleMenuInStoreController } from '../adapters/controllers/toggleMenuInStore.controller'
import {
  GetItemPriceUseCase,
  IGetItemPriceUseCase,
} from '../usecases/getItemPriceUseCase'
import { GetItemPriceHttp } from '../adapters/controllers/getItemPriceHttp'
import {
  IUpdateItemPriceUseCase,
  UpdateItemPriceUseCase,
} from '../usecases/updateItemPriceUseCase'
import { UpdateItemPriceHttp } from '../adapters/controllers/updateItemPriceHttp'
import {
  IRemoveMenuUseCase,
  RemoveMenuUseCase,
} from '../usecases/removeMenuUseCase'
import { RemoveMenuHttp } from '../adapters/controllers/removeMenuHttp'

const container = new Container()
container.bind<Handler>(Locator.CreateMenuController).to(CreateMenuController)
container.bind<IMenuRepository>(Locator.MenuRepository).to(MenuRepository)
container.bind<ICreateMenu>(Locator.CreateMenuUseCase).to(CreateMenu)
container
  .bind<IExternal<IItemEntity[], IItemEntity[]>>(Locator.CreateManyItemsRequest)
  .to(createManyItemsRequest)
container.bind<IListMenus>(Locator.ListMenuUseCase).to(ListMenus)
container.bind<Handler>(Locator.ListMenusController).to(ListMenusController)
container.bind<Handler>(Locator.DetailsMenuController).to(DetailsMenuController)
container.bind<IDetailsMenu>(Locator.DetailsMenuUseCase).to(DetailsMenuUseCase)
container
  .bind<IEpisodeRepository>(Locator.EpisodeRepository)
  .to(EpisodeRepository)
container
  .bind<IToggleMenuInStore>(Locator.ToggleMenuInStoreUseCase)
  .to(ToggleMenuInStore)
container
  .bind<Handler>(Locator.ToggleMenuInStoreController)
  .to(ToggleMenuInStoreController)
container
  .bind<IUpdateMenuUseCase>(Locator.UpdateMenuUseCase)
  .to(UpdateMenuUseCase)
container.bind<Handler>(Locator.UpdateMenuController).to(UpdateMenuController)
container
  .bind<IExternal<string, string>>(Locator.PublishEpisodeUpdate)
  .to(PublishEpisodeUpdate)
container
  .bind<IGetItemPriceUseCase>(Locator.GetItemPriceUseCase)
  .to(GetItemPriceUseCase)
container.bind<Handler>(Locator.GetItemPriceHttp).to(GetItemPriceHttp)
container
  .bind<IUpdateItemPriceUseCase>(Locator.UpdateItemPriceUseCase)
  .to(UpdateItemPriceUseCase)
container.bind<Handler>(Locator.UpdateItemPriceHttp).to(UpdateItemPriceHttp)
container
  .bind<IRemoveMenuUseCase>(Locator.RemoveMenuUseCase)
  .to(RemoveMenuUseCase)

container.bind<Handler>(Locator.RemoveMenuHttp).to(RemoveMenuHttp)
export { container }

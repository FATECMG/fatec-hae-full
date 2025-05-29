import { Container } from 'inversify'
import { Handler } from '../../../shared/adapters/controllers/interfaces'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { PublishEpisodeUpdate } from '../../episodes/usecases/external/publishEpisodeUpdate'
import { MenuRepository } from '../../menus/adapters/repositories/mongo.repository'
import { IMenuRepository } from '../../menus/adapters/repositories/types'
import { CreateCompleteItemController } from '../adapters/controllers/create.controller'
import { CreateManyController } from '../adapters/controllers/createMany.controller'
import { GetItemHttp } from '../adapters/controllers/getItemHttp'
import { ListItemsController } from '../adapters/controllers/list.controller'
import { UpdateItemHttp } from '../adapters/controllers/updateItemHttp'
import { UploadItemImage } from '../adapters/controllers/uploadItemImage.controller'
import { ItemRepository } from '../adapters/repositories/mongo.repository'
import { IItemRepository } from '../adapters/repositories/types'
import {
  CreateCompleteItem,
  ICreateCompleteItem,
} from '../usecases/createCompleteItem.usecase'
import {
  CreateManyItems,
  ICreateManyItems,
} from '../usecases/createMany.usecase'
import { IItemUseCase } from '../usecases/interfaces'
import { ItemUseCase } from '../usecases/itemUseCase'
import { ListItemsUseCase } from '../usecases/list.usecase'
import { IUploadPhotos, UploadPhotos } from '../usecases/uploadPhotos.usecase'
import { Locator } from './di.enums'

const container = new Container()
container.bind<Handler>(Locator.CreateManyController).to(CreateManyController)
container.bind<ICreateManyItems>(Locator.CreateManyUseCase).to(CreateManyItems)
container.bind<IItemRepository>(Locator.ItemRepository).to(ItemRepository)
container.bind<IUploadPhotos>(Locator.UploadPhotos).to(UploadPhotos)
container.bind<Handler>(Locator.UploadItemImageController).to(UploadItemImage)
container.bind<ListItemsUseCase>(Locator.ListItemsUseCase).to(ListItemsUseCase)
container.bind<Handler>(Locator.ListItemsController).to(ListItemsController)
container.bind<IItemUseCase>(Locator.ItemUseCase).to(ItemUseCase)
container.bind<Handler>(Locator.UpdateItemHttp).to(UpdateItemHttp)
container.bind<Handler>(Locator.GetItemHttp).to(GetItemHttp)
container
  .bind<IExternal<string, string>>(Locator.PublishEpisodeUpdate)
  .to(PublishEpisodeUpdate)
container
  .bind<ICreateCompleteItem>(Locator.CreateCompleteItemUseCase)
  .to(CreateCompleteItem)
container
  .bind<Handler>(Locator.CreateCompleteItemController)
  .to(CreateCompleteItemController)
container.bind<IMenuRepository>(Locator.MenuRepository).to(MenuRepository)
export { container }

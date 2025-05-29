import { Handler } from '../../../../shared/adapters/controllers/interfaces'
import main from '../../../../shared/adapters/controllers/main'
import { container } from '../../shared/di.container'
import { Locator } from '../../shared/di.enums'
import { getExpress } from '../../../../shared/utils/express'

const createMenuContainer = container.get<Handler>(Locator.CreateMenuController)
const listMenusContainer = container.get<Handler>(Locator.ListMenusController)
const detailsMenuContainer = container.get<Handler>(
  Locator.DetailsMenuController,
)
const toggleMenuInStoreContainer = container.get<Handler>(
  Locator.ToggleMenuInStoreController,
)
const updateMenuContainer = container.get<Handler>(Locator.UpdateMenuController)
const updateItemPrice = container.get<Handler>(Locator.UpdateItemPriceHttp)

const getItemPrice = container.get<Handler>(Locator.GetItemPriceHttp)
const removeMenuHttp = container.get<Handler>(Locator.RemoveMenuHttp)

const menus = getExpress()
menus.post('', main(createMenuContainer))
menus.get('', main(listMenusContainer))
menus.get('/:id', main(detailsMenuContainer))
menus.post('/toggleInStore', main(toggleMenuInStoreContainer))
menus.put('/:id', main(updateMenuContainer))
menus.get('/itemsprice/:itemPriceId', main(getItemPrice))
menus.patch('/:menu/itemsprice/:itemPrice', main(updateItemPrice))
menus.delete('/:menu', main(removeMenuHttp))

export default menus

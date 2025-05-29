import { Handler } from '../../../../shared/adapters/controllers/interfaces'
import main from '../../../../shared/adapters/controllers/main'
import { getExpress } from '../../../../shared/utils/express'
import { container } from '../../shared/di.container'
import { Locator } from '../../shared/di.enums'

const createManyItemsController = container.get<Handler>(
  Locator.CreateManyController,
)

const createCompleteItemController = container.get<Handler>(
  Locator.CreateCompleteItemController,
)

const UploadItemImageController = container.get<Handler>(
  Locator.UploadItemImageController,
)

const listItemsContainer = container.get<Handler>(Locator.ListItemsController)

const updateItemHttp = container.get<Handler>(Locator.UpdateItemHttp)

const getItemHttp = container.get<Handler>(Locator.GetItemHttp)

const items = getExpress()
items.post('', main(createManyItemsController))
items.post('/complete', main(createCompleteItemController))
items.post('/upload', main(UploadItemImageController))
items.get('/', main(listItemsContainer))
items.patch('/:item', main(updateItemHttp))
items.get('/:item', main(getItemHttp))

export default items

import { Handler } from '../../../../shared/adapters/controllers/interfaces'
import main from '../../../../shared/adapters/controllers/main'
import { getExpress } from '../../../../shared/utils/express'
import { container } from '../../shared/di.container'
import { Locator } from '../../shared/di.enums'
import cors from 'cors'

const getOneOrderHttp = container.get<Handler>(Locator.GetOneOrderHttp)
const cancelExpiredOrderHttp = container.get<Handler>(
  Locator.CancelExpiredOrderHttp,
)
const listForCollabHttp = container.get<Handler>(
  Locator.ListOrdersForCollabHttp,
)
const listForBusiness = container.get<Handler>(Locator.ListOrdersForBusiness)
const updateOrderElevateHttp = container.get<Handler>(
  Locator.UpdateOrderElevateHttp,
)

const createOrderHttp = container.get<Handler>(Locator.CreateOrderHttp)

const changeOrderItemStatusHttp = container.get<Handler>(
  Locator.ChangeOrderItemStatusHttp,
)

const changeOrderItemsStatusHttp = container.get<Handler>(
  Locator.ChangeOrderItemsStatusHttp,
)

export const orders = getExpress({
  cookieParser: false,
  corsCredentials: false,
  corsOrigin: '*',
})

orders.get('', main(listForCollabHttp))
orders.post('', main(createOrderHttp))
orders.get('/business', main(listForBusiness))
orders.get('/:order', main(getOneOrderHttp))
orders.put('/:order/deny', cors(), main(cancelExpiredOrderHttp))
orders.put('/:order/elevate', main(updateOrderElevateHttp))
orders.patch('/:order/orderitems/:orderItem', main(changeOrderItemStatusHttp))
orders.patch('/:order/orderitems/bulk/op', main(changeOrderItemsStatusHttp))

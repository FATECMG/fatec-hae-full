import { Handler } from '../../../../shared/adapters/controllers/interfaces'
import main from '../../../../shared/adapters/controllers/main'
import { getExpress } from '../../../../shared/utils/express'
import { container } from '../../shared/diContainer'
import { Locator } from '../../shared/diEnums'

const createSubscriptionHttp = container.get<Handler>(
  Locator.CreateSubscriptionHttp,
)

const manageSubscriptionChargeHttp = container.get<Handler>(
  Locator.ManageSubscriptionPaymentHttp,
)

const upgradeSubscriptionHttp = container.get<Handler>(
  Locator.UpgradeSubscriptionHttp,
)

const listSubscriptionChargesHttp = container.get<Handler>(
  Locator.ListSubscriptionChargesHttp,
)

const changeSubscriptionCardHttp = container.get<Handler>(
  Locator.ChangeSubscriptionCardHttp,
)

const getSubscriptionHttp = container.get<Handler>(Locator.GetSubscriptionHttp)

export const subscriptions = getExpress()

subscriptions.post('/', main(createSubscriptionHttp))
subscriptions.post('/manage/webhook', main(manageSubscriptionChargeHttp))
subscriptions.post('/upgrade', main(upgradeSubscriptionHttp))
subscriptions.get('/charges', main(listSubscriptionChargesHttp))
subscriptions.patch('/card', main(changeSubscriptionCardHttp))
subscriptions.get('/card', main(getSubscriptionHttp))

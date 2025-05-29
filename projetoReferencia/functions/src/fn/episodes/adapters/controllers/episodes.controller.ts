import { Handler } from '../../../../shared/adapters/controllers/interfaces'
import main from '../../../../shared/adapters/controllers/main'
import { getExpress } from '../../../../shared/utils/express'
import { container } from '../../shared/di.container'
import { Locator } from '../../shared/di.enums'
import cors from 'cors'

const createEpisodeController = container.get<Handler>(
  Locator.CreateEpisodeController,
)

const getEpisodeForStoreController = container.get<Handler>(
  Locator.EpisodeStoreController,
)

const getEpisodeForPWAController = container.get<Handler>(
  Locator.EpisodePWAController,
)

const updateEpisodeLogoHttp = container.get<Handler>(
  Locator.UpdateEpisodeLogoHttp,
)

const getEpisodeByCollabHttp = container.get<Handler>(
  Locator.GetEpisodeByCollabHttp,
)

const updateEpisodeHttp = container.get<Handler>(Locator.UpdateEpisodeHttp)

const isShortLinkAvailable = container.get<Handler>(
  Locator.IsShortLinkAvailable,
)

const getEpisodeIdByShortLinkHttp = container.get<Handler>(
  Locator.GetEpisodeIdByShortLinkHttp,
)

const getEpisodeRevenuesHttp = container.get<Handler>(
  Locator.GetEpisodeRevenuesHttp,
)

const getEpisodeDeliveryTypesHttp = container.get<Handler>(
  Locator.GetEpisodeDeliveryTypesHttp,
)

const getEpisodePaymentTypessHttp = container.get<Handler>(
  Locator.GetEpisodePaymentTypesHttp,
)

const getEpisodeTaxAndDiscountsHttp = container.get<Handler>(
  Locator.GetEpisodeTaxAndDiscountsHttp,
)

const getEpisodePodiumHttp = container.get<Handler>(
  Locator.GetEpisodePodiumHttp,
)

const getEpisodeStockViewHttp = container.get<Handler>(
  Locator.GetEpisodeStockViewHttp,
)

const getEpisodeMenusHttp = container.get<Handler>(Locator.GetEpisodeMenusHttp)

const getEpisodeForPrepHttp = container.get<Handler>(
  Locator.GetEpisodeForPrepHttp,
)

const episodes = getExpress()

episodes.post('', main(createEpisodeController))
episodes.get(
  '/store',
  cors({ credentials: false }),
  main(getEpisodeForStoreController),
)
episodes.get('/pwa', main(getEpisodeForPWAController))
episodes.put('/logo', main(updateEpisodeLogoHttp))
episodes.get('/collab', main(getEpisodeByCollabHttp))
episodes.put('/:episode', main(updateEpisodeHttp))
episodes.get('/shortlink', main(isShortLinkAvailable))
episodes.get('/by/shortlink', main(getEpisodeIdByShortLinkHttp))
episodes.get('/revenues', main(getEpisodeRevenuesHttp))
episodes.get('/:episode/deliverytypes', main(getEpisodeDeliveryTypesHttp))
episodes.get('/:episode/paymenttypes', main(getEpisodePaymentTypessHttp))
episodes.get('/:episode/taxanddiscounts', main(getEpisodeTaxAndDiscountsHttp))
episodes.get('/:episode/podium', main(getEpisodePodiumHttp))
episodes.get('/:episode/stockview', main(getEpisodeStockViewHttp))
episodes.get('/:episode/menus', main(getEpisodeMenusHttp))
episodes.get('/prep', main(getEpisodeForPrepHttp))

export default episodes

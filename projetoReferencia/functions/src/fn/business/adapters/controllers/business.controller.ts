import { Handler } from '../../../../shared/adapters/controllers/interfaces'
import main from '../../../../shared/adapters/controllers/main'
import { getExpress } from '../../../../shared/utils/express'
import { container } from '../../shared/di.container'
import { Locator } from '../../shared/di.enums'
import cors from 'cors'

const createController = container.get<Handler>(Locator.CreateController)
const listBankController = container.get<Handler>(Locator.ListBankController)
const listBusinessessHttp = container.get<Handler>(Locator.ListBusinessesHttp)
const getBusinessHttps = container.get<Handler>(Locator.GetBusinessHttps)
const checkBusinessCPFHttp = container.get<Handler>(
  Locator.CheckBusinessCPFHttp,
)
const checkBusinessEmailHttp = container.get<Handler>(
  Locator.CheckBusinessEmailHttp,
)

const creditCardHttp = container.get<Handler>(Locator.CreditCardController)
const listFeaturesHttp = container.get<Handler>(Locator.ListFeaturesHttp)
const business = getExpress()
business.post('', cors({ credentials: false }), main(createController))
business.get('', main(listBusinessessHttp))
business.get('/banks', main(listBankController))
business.get('/:id', main(getBusinessHttps))
business.get('/validate/cpf/:cpf', main(checkBusinessCPFHttp))
business.get('/validate/email/:email', main(checkBusinessEmailHttp))
business.post('/creditcard', main(creditCardHttp))
business.get('/:business/features', main(listFeaturesHttp))

export default business

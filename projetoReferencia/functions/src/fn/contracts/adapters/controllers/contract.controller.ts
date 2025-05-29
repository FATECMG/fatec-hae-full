import main from '../../../../shared/adapters/controllers/main'
import { getExpress } from '../../../../shared/utils/express'
import { container } from '../../shared/di.container'
import { Locator } from '../../shared/di.enums'
import { Handler } from '../../../../shared/adapters/controllers/interfaces'

const contractDetails = container.get<Handler>(Locator.ContractDetailsHttp)
const cancelContract = container.get<Handler>(Locator.CancelContractHttp)
const contracts = getExpress()

contracts.get('/details', main(contractDetails))
contracts.post('/cancel', main(cancelContract))
export default contracts

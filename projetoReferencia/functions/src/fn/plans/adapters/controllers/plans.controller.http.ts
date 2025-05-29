import { Handler } from '../../../../shared/adapters/controllers/interfaces'
import main from '../../../../shared/adapters/controllers/main'
import { container } from '../../shared/di.container'
import { Locator } from '../../shared/di.enums'
import { getExpress } from '../../../../shared/utils/express'
import cors from 'cors'

const listPlansContainer = container.get<Handler>(Locator.ListPlansController)
const plans = getExpress()
plans.get('', cors({ credentials: false }), main(listPlansContainer))

export default plans

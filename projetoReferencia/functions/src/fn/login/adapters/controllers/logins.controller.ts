import { Handler } from '../../../../shared/adapters/controllers/interfaces'
import main from '../../../../shared/adapters/controllers/main'
import { getExpress } from '../../../../shared/utils/express'
import { container } from '../../shared/di.container'
import { Locator } from '../../shared/di.enums'

const loginHttp = container.get<Handler>(Locator.LoginHttp)
const loginCollaborator = container.get<Handler>(Locator.LoginCollaboratorHttp)
const loginPrep = container.get<Handler>(Locator.LoginPrepHttp)

export const login = getExpress({ cookieParser: false })

login.post('', main(loginHttp))
login.post('/collab', main(loginCollaborator))
login.post('/prep', main(loginPrep))

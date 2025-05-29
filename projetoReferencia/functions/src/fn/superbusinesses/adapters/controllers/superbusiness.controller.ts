// import main from '../../../../shared/adapters/controllers/main'
// import { Handler } from '../../../../shared/adapters/controllers/interfaces'
// import { container } from '../../shared/di.container'
// import { Locator } from '../../shared/di.enums'
import { getExpress } from '../../../../shared/utils/express'

// const login = container.get<Handler>(Locator.SuperBusinessLoginController)

const superbusiness = getExpress({ cookieParser: false })
// superbusiness.post('/login', main(login))

export default superbusiness

import { Handler } from '../../../../shared/adapters/controllers/interfaces'
import main from '../../../../shared/adapters/controllers/main'
import { getExpress } from '../../../../shared/utils/express'
import { container } from '../../shared/di.container'
import { Locator } from '../../shared/di.enums'

const createSuperEpisodeController = container.get<Handler>(
  Locator.CreateSuperEpisodeController,
)

const superepisode = getExpress()
superepisode.post('', main(createSuperEpisodeController))

export default superepisode

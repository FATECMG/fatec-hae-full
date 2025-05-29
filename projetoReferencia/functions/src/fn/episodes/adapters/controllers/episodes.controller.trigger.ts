import { IPubSubTrigger } from '../../../../shared/adapters/controllers/interfaces'
import { container } from '../../shared/di.container'
import { Locator } from '../../shared/di.enums'

const createEpisodeControllerTrigger = container.get<IPubSubTrigger>(
  Locator.CreateEpisodeControllerTrigger,
)

export const create = async (message: any, context: any) => {
  await createEpisodeControllerTrigger.handle(message, context)
}

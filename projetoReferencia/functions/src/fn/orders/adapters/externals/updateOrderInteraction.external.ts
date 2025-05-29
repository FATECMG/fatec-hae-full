import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { getPubSub } from '../../../../shared/utils/pubsub'
import { UpdateContainer } from '../../usecases/interfaces'

@injectable()
export class UpdateOrderInteractionExternal
  implements IExternal<UpdateContainer, void> {
  async call(container: UpdateContainer): Promise<void> {}
}

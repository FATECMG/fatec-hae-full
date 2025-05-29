import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { IEpisode } from '../../../episodes/entities/interfaces'
import { getPubSub } from '../../../../shared/utils/pubsub'
import { injectable } from 'inversify'

@injectable()
export class CreateEpisodeExternal implements IExternal<IEpisode, void> {
  async call(episode: IEpisode): Promise<void> {
    const pubsub = getPubSub()
    await pubsub.topic('create-episode').publishJSON({ episode })
  }
}

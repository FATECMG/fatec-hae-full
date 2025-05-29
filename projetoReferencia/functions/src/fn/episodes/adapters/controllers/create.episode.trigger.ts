import { Message } from 'firebase-functions/lib/providers/pubsub'
import { inject, injectable } from 'inversify'
import { IPubSubTrigger } from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/di.enums'
import { IEpisodeUseCase } from '../../usecases/interface.usecase'

@injectable()
export class CreateEpisodeControllerTrigger implements IPubSubTrigger {
  constructor(
    @inject(Locator.EpisodeUseCase) private usecase: IEpisodeUseCase,
  ) {}

  async handle(message: Message, context: any): Promise<any> {
    const { episode } = message.json
    try {
      await this.usecase.create(episode)
    } catch (err) {
      console.error(err)
      console.log(`eventId ${context?.eventId}`)
      throw err
    }
  }
}

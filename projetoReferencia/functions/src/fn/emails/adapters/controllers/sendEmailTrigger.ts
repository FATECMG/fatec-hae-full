import { Message } from 'firebase-functions/lib/providers/pubsub'
import { inject, injectable } from 'inversify'
import { IPubSubTrigger } from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/enums.di'
import { IEmailsUseCase } from '../../usecases/interfaces'

@injectable()
export class SendEmailTrigger implements IPubSubTrigger {
  constructor(@inject(Locator.EmailsUseCase) private usecase: IEmailsUseCase) {}

  async handle(message: Message): Promise<void> {
    const { email } = message.json
    await this.usecase.send(email)
  }
}

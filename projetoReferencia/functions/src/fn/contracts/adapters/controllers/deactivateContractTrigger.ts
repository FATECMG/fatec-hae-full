import { Message } from 'firebase-functions/lib/providers/pubsub'
import { inject, injectable } from 'inversify'
import { IPubSubTrigger } from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/di.enums'
import { IContractUseCases } from '../../usecases/interfaces'

@injectable()
export class DeactivateContractTrigger implements IPubSubTrigger {
  constructor(
    @inject(Locator.ContractUseCase) private usecase: IContractUseCases,
  ) {}
  async handle(message: Message): Promise<void> {
    const { contract } = message.json
    await this.usecase.deactivateContract(contract)
  }
}

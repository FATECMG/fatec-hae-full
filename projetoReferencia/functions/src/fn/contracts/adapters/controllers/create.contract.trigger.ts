import { Message } from 'firebase-functions/lib/providers/pubsub'
import { inject, injectable } from 'inversify'
import { IPubSubTrigger } from '../../../../shared/adapters/controllers/interfaces'
import { validate } from '../../../../shared/decorators/validate'
import { Locator } from '../../shared/di.enums'
import { IContractUseCases } from '../../usecases/interfaces'
import { CreateContractTriggerValidation } from './validations/create.contract.trigger.validation'

@injectable()
export class CreateContractTrigger implements IPubSubTrigger {
  constructor(
    @inject(Locator.ContractUseCase) private usecase: IContractUseCases,
  ) {}
  @validate(new CreateContractTriggerValidation())
  async handle(message: Message): Promise<void> {
    const { contract } = message.json
    await this.usecase.create(contract)
  }
}

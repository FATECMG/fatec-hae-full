import { inject, injectable } from 'inversify'
import { IPubSubTrigger } from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/di.enums'
import { IContractUseCases } from '../../usecases/interfaces'

@injectable()
export class ManageContractsJob implements IPubSubTrigger {
  constructor(
    @inject(Locator.ContractUseCase) private usecase: IContractUseCases,
  ) {}
  async handle() {
    await this.usecase.manageContracts()
  }
}

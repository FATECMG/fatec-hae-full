import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { inject, injectable } from 'inversify'
import { Locator } from '../../shared/di.enums'
import { IContractUseCases } from '../../usecases/interfaces'

@injectable()
export class CancelContractHttp implements Handler {
  constructor(
    @inject(Locator.ContractUseCase) private usecase: IContractUseCases,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const { contractId } = req.body
    const contract = await this.usecase.cancelContract({ _id: contractId })

    return { statusCode: 200, body: contract }
  }
}

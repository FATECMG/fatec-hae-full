import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Request } from 'express'
import { inject, injectable } from 'inversify'
import { Locator } from '../../shared/di.enums'
import { IContractDetails } from '../../usecases/interfaces'

@injectable()
export class ContractDetailsHttp implements Handler {
  constructor(
    @inject(Locator.ContractDetailsUseCase) private usecase: IContractDetails,
  ) {}

  async handle(req: Request): Promise<ResponseReturn> {
    const { business } = req.query
    const contract = await this.usecase.exec({ business: business as string })

    return { statusCode: 200, body: contract }
  }
}

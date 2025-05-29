import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/di.enums'
import { IBankUseCase } from '../../usecases/interfaces.usecases'
@injectable()
export class ListBankController implements Handler {
  constructor(@inject(Locator.ListBankUseCase) private usecase: IBankUseCase) {}
  async handle(): Promise<ResponseReturn> {
    const banks = await this.usecase.list()
    return {
      body: banks,
      statusCode: 200,
    }
  }
}

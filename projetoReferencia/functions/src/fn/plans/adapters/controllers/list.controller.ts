import { inject, injectable } from 'inversify'
import {
  Handler,
  ResponseReturn,
} from '../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../shared/di.enums'
import { IListPlans } from '../../usecases/list.usecase'

@injectable()
export class ListPlansController implements Handler {
  constructor(@inject(Locator.ListPlansUseCase) private usecase: IListPlans) {}
  async handle(): Promise<ResponseReturn> {
    const data = await this.usecase.list()
    return {
      statusCode: 200,
      body: data,
    }
  }
}
